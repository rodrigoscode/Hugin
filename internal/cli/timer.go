package cli

import (
	"fmt"
	"os"
	"strconv"

	"hugin/internal/cliui"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/timer"
)

// TimerResolutionCommand is run by the patched Discord main process, never by
// a person: `Hugin.exe timer-resolution <pid> on|off`. main dispatches it
// before anything prints or shows a message box.
const TimerResolutionCommand = "timer-resolution"

// RunTimerResolution applies timer.SetHonored and reports only through the
// exit code (and stderr, which the caller logs).
func RunTimerResolution(args []string) int {
	if len(args) != 2 {
		fmt.Fprintln(os.Stderr, "usage: timer-resolution <pid> on|off")
		return 2
	}

	pid, err := strconv.ParseUint(args[0], 10, 32)
	if err != nil || pid == 0 {
		fmt.Fprintln(os.Stderr, "invalid pid:", args[0])
		return 2
	}

	var honored bool
	switch args[1] {
	case "on":
		honored = true
	case "off":
		honored = false
	default:
		fmt.Fprintln(os.Stderr, "expected on or off, got:", args[1])
		return 2
	}

	if err := timer.SetHonored(uint32(pid), honored); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}
	return 0
}

// installHelper keeps the data directory's copy of this executable current.
// A failure costs what the helper does during a broadcast, never the install.
func installHelper() {
	if err := injector.InstallHelper(paths.DataDirectory()); err != nil {
		cliui.Warn("could not copy the capture helper: " + err.Error())
	}
}
