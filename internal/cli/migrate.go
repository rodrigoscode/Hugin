package cli

import (
	"os"
	"path/filepath"

	"hugin/internal/cliui"
	"hugin/internal/discordinstall"
	"hugin/internal/paths"
)

// migrateLegacyData carries the user's settings over from the previous name's
// data directory (%APPDATA%\GoPeer). config.json is the only thing there that
// an install does not write again -- the bundle, sounds, fonts and helper are
// rewritten into the new directory anyway. It must run before the config is
// read, or the install would start from the defaults.
func migrateLegacyData() {
	current := filepath.Join(paths.DataDirectory(), paths.ConfigFile)
	if _, err := os.Stat(current); err == nil {
		return
	}

	data, err := os.ReadFile(filepath.Join(paths.LegacyDataDirectory(), paths.ConfigFile))
	if err != nil {
		return
	}

	if err := os.MkdirAll(paths.DataDirectory(), 0o755); err != nil {
		cliui.Warn("could not carry over the old settings: " + err.Error())
		return
	}
	if err := os.WriteFile(current, data, 0o644); err != nil {
		cliui.Warn("could not carry over the old settings: " + err.Error())
		return
	}
	cliui.Info("Settings carried over from " + paths.LegacyDataDirectory())
}

// removeLegacyData deletes the previous name's data directory, but only with
// every Discord closed: one still running the old patch reads its bundle and
// runs its helper from there until it restarts.
func removeLegacyData(installs []discordinstall.Install) {
	legacy := paths.LegacyDataDirectory()
	if _, err := os.Stat(legacy); err != nil {
		return
	}
	for _, install := range installs {
		if discordinstall.IsRunning(install.Branch.Executable) {
			return
		}
	}
	if err := os.RemoveAll(legacy); err != nil {
		cliui.Warn("could not remove the old data directory: " + err.Error())
		return
	}
	cliui.Info("Removed the old data directory " + legacy)
}
