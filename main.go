// Command Hugin finds an installed Discord client and injects the Hugin
// patch: peer-to-peer screen sharing (VDO.Ninja) driven from inside the
// Discord client, without touching Discord's own screen share.
package main

import (
	"fmt"
	"os"

	"hugin/internal/cli"
	"hugin/internal/cliui"
	"hugin/internal/version"
)

func run() (code int) {

	defer func() {
		if r := recover(); r != nil {
			message := fmt.Sprintf("%v", r)
			cliui.Fail(message)
			cliui.ShowMessageBox("Hugin",
				fmt.Sprintf("Install failed:\n\n%s\n\nDetails in:\n%s", message, cliui.InstallLogPath()))
			cliui.WaitForEnter()
			code = 1
		}
	}()

	opts := cliui.ParseArguments(os.Args[1:])
	fmt.Println(cliui.Paint("1", "\n  Hugin v"+version.Version))

	switch opts.Command {
	case cliui.CommandInstall:
		code = cli.RunInstall(opts, loadPayload, loadSounds, loadFonts)
	case cliui.CommandUninstall:
		code = cli.RunUninstall(opts)
	case cliui.CommandStatus:
		code = cli.RunStatus()
	default:
		code = cli.RunHelp()
	}

	if code != 0 && (opts.Command == cliui.CommandInstall || opts.Command == cliui.CommandUninstall) {
		cliui.ShowMessageBox("Hugin",
			fmt.Sprintf("The install did not finish:\n\n%s\n\nDetails in:\n%s", cliui.LastFailure(), cliui.InstallLogPath()))
	}

	cliui.WaitForEnter()
	return code
}

func main() {

	if len(os.Args) >= 2 && os.Args[1] == cli.TimerResolutionCommand {
		os.Exit(cli.RunTimerResolution(os.Args[2:]))
	}
	if len(os.Args) >= 2 && os.Args[1] == cli.WindowPIDCommand {
		os.Exit(cli.RunWindowPID(os.Args[2:]))
	}
	if len(os.Args) >= 2 && os.Args[1] == cli.WatchWindowCommand {
		os.Exit(cli.RunWatchWindow(os.Args[2:]))
	}
	if len(os.Args) >= 2 && os.Args[1] == cli.CaptureAudioCommand {
		os.Exit(cli.RunCaptureAudio(os.Args[2:]))
	}
	os.Exit(run())
}
