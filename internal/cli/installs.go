// Package cli implements the four commands (install, uninstall, status,
// help) on top of internal/discordinstall and internal/injector.
package cli

import (
	"fmt"
	"strings"
	"time"

	"hugin/internal/cliui"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
)

type describedInstall struct {
	Install discordinstall.Install
	Status  injector.Status
	Line    string
}

func selectInstalls(opts cliui.Options) ([]discordinstall.Install, error) {
	installs := discordinstall.FindInstalls()

	if len(installs) == 0 {
		return nil, fmt.Errorf(
			"Discord not found.\n" +
				"       Looked in %%LOCALAPPDATA%%, %%ProgramFiles%% and %%ProgramFiles(x86)%%\n" +
				"       under Discord, DiscordPTB, DiscordCanary and DiscordDevelopment.")
	}

	if branch, ok := opts.Get("branch"); ok {
		var wanted []discordinstall.Install
		for _, install := range installs {
			if install.Branch.Key == branch {
				wanted = append(wanted, install)
			}
		}
		if len(wanted) == 0 {
			return nil, fmt.Errorf("branch %q is not installed", branch)
		}
		return wanted, nil
	}

	if opts.Has("all") {
		return installs, nil
	}
	return installs[:1], nil
}

func describe(install discordinstall.Install) describedInstall {
	status := injector.Inspect(install)
	label := fmt.Sprintf("%s %s", install.Branch.Label, install.VersionText)

	var wording string
	switch status.State {
	case injector.StateClean:
		wording = "clean (not patched)"
	case injector.StateOurs:
		v := "?"
		if status.MarkerData != nil {
			v = status.MarkerData.Version
		}
		wording = fmt.Sprintf("patched by us, v%s", v)
	case injector.StateForeign:
		wording = "patched by ANOTHER mod"
	case injector.StateBroken:
		wording = fmt.Sprintf("broken: %s", status.Reason)
	case injector.StateMissing:
		wording = "no app.asar"
	}

	return describedInstall{Install: install, Status: status, Line: fmt.Sprintf("%s -- %s", label, wording)}
}

// ensureClosed closes Discord before writing: Electron keeps _app.asar
// memory-mapped while it runs, and the payload is only read at startup.
func ensureClosed(installs []discordinstall.Install, opts cliui.Options, needsRename bool) bool {
	seen := map[string]bool{}
	var running []string
	for _, install := range installs {
		exe := install.Branch.Executable
		if seen[exe] || !discordinstall.IsRunning(exe) {
			continue
		}
		seen[exe] = true
		running = append(running, exe)
	}
	if len(running) == 0 {
		return true
	}

	if opts.Has("no-kill") {
		if needsRename {
			cliui.Fail("--no-kill was passed; close Discord manually and run again.")
			return false
		}
		cliui.Warn(fmt.Sprintf("%s running and --no-kill was passed.", strings.Join(running, ", ")))
		cliui.Info("Files will be rewritten, but only take effect on the next Discord start.")
		return true
	}

	cliui.Warn(fmt.Sprintf("%s running.", strings.Join(running, ", ")))
	if needsRename {
		cliui.Info("Closing Discord so app.asar can be renamed...")
	} else {
		cliui.Info("Closing Discord so the new version applies to this session...")
	}

	for _, exe := range running {
		discordinstall.Kill(exe)
		cliui.OK(exe + " closed")
	}

	for _, exe := range running {
		discordinstall.WaitUntilStopped(exe, 5*time.Second)
	}

	return true
}
