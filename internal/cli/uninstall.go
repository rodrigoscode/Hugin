package cli

import (
	"hugin/internal/cliui"
	"hugin/internal/injector"
)

func RunUninstall(opts cliui.Options) int {
	installs, err := selectInstalls(opts)
	if err != nil {
		cliui.Fail(err.Error())
		return 1
	}
	if !ensureClosed(installs, opts, true) {
		return 1
	}

	cliui.Title("Removing")
	failures := 0

	for _, install := range installs {
		result, err := injector.RemovePatch(install, injector.UninstallOptions{
			Force:     opts.Has("force"),
			PurgeData: opts.Has("purge"),
		})
		if err != nil {
			failures++
			cliui.Fail(install.Branch.Label + ": " + err.Error())
			continue
		}

		if result.Changed {
			cliui.OK(install.Branch.Label + " " + install.VersionText + " restored")
		} else {
			cliui.Info(install.Branch.Label + ": " + result.Reason)
		}
	}

	if failures > 0 {
		return 1
	}
	return 0
}
