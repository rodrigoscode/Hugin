package cliui

import (
	"bufio"
	"fmt"
	"os"
)

// WaitForEnter pauses on a real console so a double-clicked run's window
// does not vanish before its output can be read. It is a no-op when there
// is no console attached at all.
func WaitForEnter() {
	if !consoleAttached() {
		return
	}
	fmt.Print("\n  Press Enter to exit...")
	_, _ = bufio.NewReader(os.Stdin).ReadString('\n')
}
