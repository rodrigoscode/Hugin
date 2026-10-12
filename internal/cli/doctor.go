package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"hugin/internal/cliui"
	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/version"
)

type doctorReport struct {
	errors   int
	warnings int
}

func (r *doctorReport) ok(message string) {
	cliui.OK(message)
}

func (r *doctorReport) warn(message string) {
	r.warnings++
	cliui.Warn(message)
}

func (r *doctorReport) fail(message string) {
	r.errors++
	cliui.Fail(message)
}

func checkConfigFile(report *doctorReport, dataDir string) {
	path := filepath.Join(dataDir, paths.ConfigFile)
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		report.warn("config.json is absent; defaults will be used")
		return
	}
	if err != nil {
		report.fail("config.json cannot be read: " + err.Error())
		return
	}
	if !json.Valid(data) {
		report.fail("config.json is not valid JSON")
		return
	}

	var cfg config.Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		report.fail("config.json cannot be decoded: " + err.Error())
		return
	}
	report.ok("config.json is valid")
	if cfg.ConfigVersion < 2 {
		report.warn(fmt.Sprintf("config.json is old (version %d); install will migrate it", cfg.ConfigVersion))
	}
}

func checkDataFiles(report *doctorReport, dataDir string, needsRenderer bool) {
	if !fileExists(dataDir) {
		report.warn("data directory is absent: " + dataDir)
		return
	}
	report.ok("data directory exists")

	checkConfigFile(report, dataDir)

	rendererPath := filepath.Join(dataDir, paths.RendererFile)
	if needsRenderer && !fileExists(rendererPath) {
		report.fail("renderer.js is missing but a Hugin patch is installed")
	} else if fileExists(rendererPath) {
		report.ok("renderer.js is present")
	}

	if fileExists(filepath.Join(dataDir, "debug")) {
		report.warn("debug mode marker is enabled")
	}

	for _, name := range []string{paths.LogFile, paths.InstallLogFile} {
		path := filepath.Join(dataDir, name)
		info, err := os.Stat(path)
		if err != nil || info.IsDir() {
			continue
		}
		if info.Size() > 5*1024*1024 {
			report.warn(fmt.Sprintf("%s is large (%d bytes)", name, info.Size()))
		}
	}
}

func checkInstall(report *doctorReport, install discordinstall.Install) bool {
	entry := describe(install)
	cliui.Plain(entry.Line)
	cliui.Info(entry.Status.Resources)

	switch entry.Status.State {
	case injector.StateClean:
		report.warn(install.Branch.Label + " is not patched")
	case injector.StateOurs:
		report.ok(install.Branch.Label + " is patched by Hugin")
		marker := entry.Status.MarkerData
		if marker == nil {
			report.warn("marker is missing details")
		} else if marker.Version != version.Version {
			report.warn(fmt.Sprintf("installed Hugin is v%s; current executable is v%s", marker.Version, version.Version))
		}
	case injector.StateForeign:
		report.warn(install.Branch.Label + " is patched by another mod")
	case injector.StateBroken:
		report.fail(install.Branch.Label + " patch state is broken: " + entry.Status.Reason)
	case injector.StateMissing:
		report.fail(install.Branch.Label + " has no app.asar")
	}

	if entry.Status.StaleBackup {
		report.warn(install.Branch.Label + " has a stale _app.asar backup next to a clean app.asar")
	}
	if len(install.OlderVersions) > 0 {
		report.warn(fmt.Sprintf("%s has %d older version folder(s)", install.Branch.Label, len(install.OlderVersions)))
	}
	if discordinstall.IsRunning(install.Branch.Executable) {
		report.warn(install.Branch.Label + " is currently running; reinstall changes need a restart")
	}

	return entry.Status.State == injector.StateOurs
}

func RunDoctor() int {
	report := &doctorReport{}
	cliui.Title("Doctor")
	cliui.Plain("Hugin version: " + version.Version)

	installs := discordinstall.FindInstalls()
	cliui.Title("Discord")
	if len(installs) == 0 {
		report.fail("no Discord installation found")
	} else {
		needsRenderer := false
		for _, install := range installs {
			if checkInstall(report, install) {
				needsRenderer = true
			}
		}
		cliui.Title("Data")
		checkDataFiles(report, paths.DataDirectory(), needsRenderer)
	}

	cliui.Title("Summary")
	if report.errors > 0 {
		cliui.Fail(fmt.Sprintf("%d error(s), %d warning(s)", report.errors, report.warnings))
		return 1
	}
	if report.warnings > 0 {
		cliui.Warn(fmt.Sprintf("0 errors, %d warning(s)", report.warnings))
		return 0
	}
	cliui.OK("no problems found")
	return 0
}
