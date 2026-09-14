package injector

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/paths"
)

type InstallOptions struct {
	Version   string
	Force     bool
	Config    *config.Config
	Sounds    Sounds
	Fonts     Fonts
	OnWarning func(message string)
}

type InstallResult struct {
	Resources     string
	DataDirectory string
	Reinstalled   bool
}

// ApplyPatch installs payload into install, following the same state
// machine as the original tool: only a "clean" install is ever renamed, and
// a "foreign" one (another mod's folder) is refused unless Force is set.
func ApplyPatch(install discordinstall.Install, payload Payload, opts InstallOptions) (InstallResult, error) {
	status := Inspect(install)

	if status.State == StateMissing {
		return InstallResult{}, fmt.Errorf(
			"Discord's app.asar is missing in %s -- the Discord installation is incomplete. "+
				"Reinstall Discord (your login is kept) and run Hugin again.", status.Resources)
	}

	if status.State == StateBroken {
		reason := status.Reason
		if reason == "" {
			reason = status.Resources
		}
		return InstallResult{}, fmt.Errorf("unusable installation (%s): %s", status.State, reason)
	}

	if status.State == StateForeign && !opts.Force {
		return InstallResult{}, fmt.Errorf(
			"resources/app.asar already belongs to another mod (Vencord/BetterDiscord?).\n" +
				"  Uninstall it first, or run with --force to overwrite.")
	}

	if _, err := os.Stat(status.LegacyAppDirectory); err == nil && opts.OnWarning != nil {
		opts.OnWarning("resources/app also exists (older mod). Electron prefers app.asar, but it should be removed.")
	}

	if status.State == StateClean {
		if status.StaleBackup {
			if err := os.RemoveAll(status.Backup); err != nil {
				return InstallResult{}, err
			}
		}
		if err := os.Rename(status.Asar, status.Backup); err != nil {
			return InstallResult{}, err
		}
	}

	if err := os.RemoveAll(status.Asar); err != nil {
		return InstallResult{}, err
	}
	if err := os.MkdirAll(status.Asar, 0o755); err != nil {
		return InstallResult{}, err
	}

	manifest, _ := json.Marshal(map[string]any{
		"name":    install.Branch.AppName,
		"main":    "index.js",
		"private": true,
	})
	if err := os.WriteFile(filepath.Join(status.Asar, "package.json"), manifest, 0o644); err != nil {
		return InstallResult{}, err
	}

	writes := map[string][]byte{
		"index.js":       payload.MainJS,
		"preload.js":     payload.PreloadJS,
		"viewPreload.js": payload.ViewPreloadJS,
	}
	for name, data := range writes {
		if err := os.WriteFile(filepath.Join(status.Asar, name), data, 0o644); err != nil {
			return InstallResult{}, err
		}
	}

	marker, _ := json.MarshalIndent(MarkerData{
		Tool:           "hugin",
		Version:        opts.Version,
		PayloadHash:    HashPayload(payload),
		Branch:         install.Branch.Key,
		DiscordVersion: install.VersionText,
		InstalledAt:    time.Now().UTC().Format(time.RFC3339),
	}, "", "  ")
	if err := os.WriteFile(status.Marker, marker, 0o644); err != nil {
		return InstallResult{}, err
	}

	dataDir := paths.DataDirectory()
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return InstallResult{}, err
	}
	if err := os.WriteFile(filepath.Join(dataDir, paths.RendererFile), payload.RendererJS, 0o644); err != nil {
		return InstallResult{}, err
	}

	if opts.Config != nil {
		if err := config.Write(*opts.Config); err != nil {
			return InstallResult{}, err
		}
	}

	if len(opts.Sounds) > 0 {
		soundsDir := filepath.Join(dataDir, paths.SoundsDirectory)
		if err := os.MkdirAll(soundsDir, 0o755); err != nil {
			return InstallResult{}, err
		}
		for name, data := range opts.Sounds {
			if err := os.WriteFile(filepath.Join(soundsDir, name), data, 0o644); err != nil {
				return InstallResult{}, err
			}
		}
	}

	if len(opts.Fonts) > 0 {
		fontsDir := filepath.Join(dataDir, paths.FontsDirectory)
		if err := os.MkdirAll(fontsDir, 0o755); err != nil {
			return InstallResult{}, err
		}
		for name, data := range opts.Fonts {
			if err := os.WriteFile(filepath.Join(fontsDir, name), data, 0o644); err != nil {
				return InstallResult{}, err
			}
		}
	}

	return InstallResult{
		Resources:     status.Resources,
		DataDirectory: dataDir,
		Reinstalled:   status.State != StateClean,
	}, nil
}

type UninstallOptions struct {
	Force     bool
	PurgeData bool
}

type UninstallResult struct {
	Changed bool
	Reason  string
}

// RemovePatch restores install's original app.asar from the _app.asar
// backup.
func RemovePatch(install discordinstall.Install, opts UninstallOptions) (UninstallResult, error) {
	status := Inspect(install)

	switch status.State {
	case StateClean:
		return UninstallResult{Changed: false, Reason: "was not injected"}, nil
	case StateMissing:
		return UninstallResult{}, fmt.Errorf("neither app.asar nor _app.asar found")
	case StateForeign:
		if !opts.Force {
			return UninstallResult{}, fmt.Errorf("app.asar belongs to another mod; refusing to remove. Use --force if you are sure.")
		}
	}

	if err := os.RemoveAll(status.Asar); err != nil {
		return UninstallResult{}, err
	}

	backupInfo, err := os.Stat(status.Backup)
	if err != nil || backupInfo.IsDir() {
		return UninstallResult{}, fmt.Errorf("folder removed but there is no _app.asar to restore; reinstall Discord")
	}
	if err := os.Rename(status.Backup, status.Asar); err != nil {
		return UninstallResult{}, err
	}

	if opts.PurgeData {
		_ = os.RemoveAll(paths.DataDirectory())
		_ = os.RemoveAll(paths.LegacyDataDirectory())
	}

	return UninstallResult{Changed: true}, nil
}
