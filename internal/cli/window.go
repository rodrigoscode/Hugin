package cli

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"

	"hugin/internal/winproc"
)

// WindowPIDCommand is run by the patched Discord main process, never by a
// person: `Hugin.exe window-pid <hwnd>` prints the id (and executable name)
// of the process that owns that window. Sharing a window, the stream captures only that
// application's audio ("applicationLoopback:<pid>") instead of the whole
// system's. main dispatches it before anything prints or shows a message box.
const WindowPIDCommand = "window-pid"

// WatchWindowCommand is also run by the patched Discord, while a window is
// being broadcast: `Hugin.exe watch-window <hwnd>` prints the window's state
// (visible, minimized, hidden, gone) each time it changes. It exits once the
// window is gone, or when Discord closes its stdin.
const WatchWindowCommand = "watch-window"

// RunWatchWindow polls every half second and reports a state only after two
// equal readings in a row, so a window that flickers while redrawing doesn't
// end a broadcast.
func RunWatchWindow(args []string) int {
	if len(args) != 1 {
		fmt.Fprintln(os.Stderr, "usage: watch-window <hwnd>")
		return 2
	}

	hwnd, err := strconv.ParseUint(args[0], 10, 64)
	if err != nil || hwnd == 0 {
		fmt.Fprintln(os.Stderr, "invalid hwnd:", args[0])
		return 2
	}

	owner, _ := winproc.WindowProcessID(uintptr(hwnd))

	go func() {
		_, _ = io.Copy(io.Discard, os.Stdin)
		os.Exit(0)
	}()

	reported, previous := "", ""
	for {
		state := winproc.WindowState(uintptr(hwnd))
		if state != "gone" && owner != 0 {
			if pid, err := winproc.WindowProcessID(uintptr(hwnd)); err != nil || pid != owner {
				state = "gone"
			}
		}

		if state == previous && state != reported {
			fmt.Println(state)
			reported = state
			if state == "gone" {
				return 0
			}
		}
		previous = state
		time.Sleep(500 * time.Millisecond)
	}
}

// RunWindowPID prints the owning process id on stdout; errors go to stderr,
// which the caller logs.
func RunWindowPID(args []string) int {
	if len(args) != 1 {
		fmt.Fprintln(os.Stderr, "usage: window-pid <hwnd>")
		return 2
	}

	hwnd, err := strconv.ParseUint(args[0], 10, 64)
	if err != nil || hwnd == 0 {
		fmt.Fprintln(os.Stderr, "invalid hwnd:", args[0])
		return 2
	}

	pid, err := winproc.WindowProcessID(uintptr(hwnd))
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}

	if name, err := winproc.ProcessImageName(pid); err == nil && strings.EqualFold(name, "ApplicationFrameHost.exe") {
		if app, err := winproc.ChildWindowProcessID(uintptr(hwnd), pid); err == nil {
			pid = app
		}
	}

	if name, err := winproc.ProcessImageName(pid); err == nil {
		fmt.Println(pid, name)
	} else {
		fmt.Println(pid)
	}
	return 0
}
