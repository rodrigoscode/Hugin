package cli

import (
	"os"
	"path/filepath"
	"strings"

	"hugin/internal/cliui"
	"hugin/internal/discordinstall"
	"hugin/internal/paths"
)

var trackedFiles = []string{paths.RendererFile, paths.ConfigFile, paths.LogFile, "debug"}

func RunStatus() int {
	installs := discordinstall.FindInstalls()

	cliui.Title("Discord")
	if len(installs) == 0 {
		cliui.Fail("no installation found")
	}

	for _, install := range installs {
		entry := describe(install)
		cliui.Plain(entry.Line)
		cliui.Info(entry.Status.Resources)

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

	for _, file := range trackedFiles {
		_, err := os.Stat(filepath.Join(dataDir, file))
		exists := err == nil
		label := cliui.Paint("90", "absent ")
		if exists {
			label = cliui.Paint("32", "present")
		}
		cliui.Plain(label + "  " + file)
	}

	return 0
}
