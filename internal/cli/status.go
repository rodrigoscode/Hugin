package cli

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"hugin/internal/cliui"
	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/version"
)

var trackedFiles = []string{paths.RendererFile, paths.ConfigFile, paths.LogFile, paths.InstallLogFile, "debug", paths.HelperFile}

func yesNo(v bool) string {
	if v {
		return "yes"
	}
	return "no"
}

func printMarker(status injector.Status) {
	marker := status.MarkerData
	if marker == nil {
		return
	}

	cliui.Info("marker version: " + marker.Version)
	if marker.PayloadHash != "" {
		cliui.Info("marker payload: " + marker.PayloadHash)
	}
	if marker.DiscordVersion != "" {
		cliui.Info("marker Discord: " + marker.DiscordVersion)
	}
	if marker.InstalledAt != "" {
		cliui.Info("marker installed: " + marker.InstalledAt)
	}
}

func printDataFiles(dataDir string) {
	for _, file := range trackedFiles {
		info, err := os.Stat(filepath.Join(dataDir, file))
		label := cliui.Paint("90", "absent ")
		detail := ""
		if err == nil {
			label = cliui.Paint("32", "present")
			if !info.IsDir() {
				detail = fmt.Sprintf(" (%d bytes)", info.Size())
			}
		}
		cliui.Plain(label + "  " + file + detail)
	}
}

func printConfigSummary() {
	cfg := config.Read()
	cliui.Title("Configuration")
	cliui.Plain("vdoBase: " + cfg.VdoBase)
	cliui.Plain("quality: " + valueOrDefault(cfg.Quality, "default"))
	cliui.Plain("framerate: " + valueOrDefault(cfg.Framerate, "default"))
	cliui.Plain("bitrate: " + valueOrDefault(cfg.Bitrate, "default"))
	cliui.Plain("captureAudio: " + yesNo(cfg.CaptureAudio))
	cliui.Plain("autoWatch: " + yesNo(cfg.AutoWatch))
	cliui.Plain("replaceShareButton: " + yesNo(cfg.ReplaceShareButton))
	cliui.Plain("hijackShareButton: " + yesNo(cfg.HijackShareButton))
	cliui.Plain("fetchOwnProfile: " + yesNo(cfg.FetchOwnProfile))
	cliui.Plain("fetchProfiles: " + yesNo(cfg.FetchProfiles))
	cliui.Plain("playSounds: " + yesNo(cfg.PlaySounds))
	cliui.Plain(fmt.Sprintf("configVersion: %d", cfg.ConfigVersion))
}

func valueOrDefault(value, fallback string) string {
	if value == "" {
		return fallback
	}
	return value
}

func RunStatus() int {
	installs := discordinstall.FindInstalls()
	cliui.Title("Hugin")
	cliui.Plain("version: " + version.Version)

	cliui.Title("Discord")
	if len(installs) == 0 {
		cliui.Fail("no installation found")
	}

	for _, install := range installs {
		entry := describe(install)
		cliui.Plain(entry.Line)
		cliui.Info(entry.Status.Resources)
		if entry.Status.StaleBackup {
			cliui.Warn("stale _app.asar backup present next to clean app.asar")
		}
		if _, err := os.Stat(entry.Status.Backup); err == nil {
			cliui.Info("backup: present")
		} else {
			cliui.Info("backup: absent")
		}
		printMarker(entry.Status)

		if len(install.OlderVersions) > 0 {
			var texts []string
			for _, older := range install.OlderVersions {
				texts = append(texts, older.VersionText)
			}
			cliui.Info("older versions present: " + strings.Join(texts, ", "))
		}
		if discordinstall.IsRunning(install.Branch.Executable) {
			cliui.Info("running")
		}
	}

	dataDir := paths.DataDirectory()
	cliui.Title("Data")
	cliui.Plain(dataDir)
	cliui.Plain("debug: " + yesNo(fileExists(filepath.Join(dataDir, "debug"))))
	printDataFiles(dataDir)

	printConfigSummary()

	return 0
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
