// Package injector installs and removes the patch: the original app.asar is
// renamed to _app.asar and replaced by a folder whose index.js runs first.
// Electron only loads app.asar as an archive when it is a file.
package injector

import (
	"encoding/json"
	"os"
	"path/filepath"

	"hugin/internal/discordinstall"
	"hugin/internal/paths"
)

type State string

const (
	StateClean   State = "clean"
	StateOurs    State = "ours"
	StateForeign State = "foreign"
	StateBroken  State = "broken"
	StateMissing State = "missing"
)

type MarkerData struct {
	Tool           string `json:"tool"`
	Version        string `json:"version"`
	PayloadHash    string `json:"payloadHash"`
	Branch         string `json:"branch"`
	DiscordVersion string `json:"discordVersion"`
	InstalledAt    string `json:"installedAt"`
}

type Paths struct {
	Resources          string
	Asar               string
	Backup             string
	LegacyAppDirectory string
	Marker             string
}

type Status struct {
	Paths
	State       State
	Reason      string
	MarkerData  *MarkerData
	StaleBackup bool
}

// PatchPaths derives every path involved in patching install, without
// touching the filesystem.
func PatchPaths(install discordinstall.Install) Paths {
	resources := install.Resources
	return Paths{
		Resources:          resources,
		Asar:               filepath.Join(resources, "app.asar"),
		Backup:             filepath.Join(resources, "_app.asar"),
		LegacyAppDirectory: filepath.Join(resources, "app"),
		Marker:             filepath.Join(resources, "app.asar", paths.MarkerFile),
	}
}

func readMarker(path string) *MarkerData {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var marker MarkerData
	if json.Unmarshal(data, &marker) != nil {
		return nil
	}
	return &marker
}

// Inspect reports the current patch state of install.
func Inspect(install discordinstall.Install) Status {
	p := PatchPaths(install)

	asarInfo, asarErr := os.Stat(p.Asar)
	backupInfo, backupErr := os.Stat(p.Backup)
	asarExists := asarErr == nil
	backupExists := backupErr == nil

	if !asarExists && !backupExists {
		return Status{Paths: p, State: StateMissing}
	}

	if asarExists && asarInfo.IsDir() {
		if !backupExists || backupInfo.IsDir() {
			return Status{Paths: p, State: StateBroken, Reason: "app.asar is a folder but _app.asar is gone"}
		}

		marker := readMarker(p.Marker)

		for _, legacy := range paths.LegacyMarkerFiles {
			if marker != nil {
				break
			}
			marker = readMarker(filepath.Join(p.Resources, "app.asar", legacy))
		}

		if marker != nil {
			return Status{Paths: p, State: StateOurs, MarkerData: marker}
		}
		return Status{Paths: p, State: StateForeign}
	}

	if asarExists && !asarInfo.IsDir() {
		return Status{Paths: p, State: StateClean, StaleBackup: backupExists}
	}

	if backupExists && !backupInfo.IsDir() {
		return Status{Paths: p, State: StateBroken, Reason: "only _app.asar exists; app.asar is gone"}
	}

	return Status{Paths: p, State: StateBroken, Reason: "app.asar is neither a file nor a folder"}
}
