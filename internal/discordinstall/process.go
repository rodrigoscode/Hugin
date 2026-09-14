//go:build windows

package discordinstall

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

// createNoWindow keeps tasklist/taskkill/the launched app from flashing a
// console window behind our own GUI-subsystem binary.
const createNoWindow = 0x08000000

func hiddenCmd(name string, args ...string) *exec.Cmd {
	cmd := exec.Command(name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: createNoWindow, HideWindow: true}
	return cmd
}

// IsRunning reports whether executable (e.g. "Discord.exe") has a running
// process.
func IsRunning(executable string) bool {
	out, err := hiddenCmd("tasklist", "/FI", "IMAGENAME eq "+executable, "/NH").Output()
	if err != nil {
		return false
	}
	return strings.Contains(strings.ToLower(string(out)), strings.ToLower(executable))
}

// Kill force-stops executable and its child processes ("/T"), or the file
// lock on app.asar stays held.
func Kill(executable string) bool {
	err := hiddenCmd("taskkill", "/F", "/T", "/IM", executable).Run()
	return err == nil
}

// Launch starts install, preferring Update.exe over the versioned
// Discord.exe: the stub is what decides which app-<version> is current.
func Launch(install Install) {
	var cmd *exec.Cmd
	if _, err := os.Stat(install.UpdateExecutable); err == nil {
		cmd = exec.Command(install.UpdateExecutable, "--processStart", install.Branch.Executable)
	} else {
		cmd = exec.Command(filepath.Join(install.AppDirectory, install.Branch.Executable))
	}
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: createNoWindow, HideWindow: true}
	_ = cmd.Start()
}

// WaitUntilStopped polls IsRunning(executable) until it returns false or the
// deadline passes. Windows releases the file handle a moment after the
// process dies, so callers give this a few seconds before renaming app.asar.
func WaitUntilStopped(executable string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for IsRunning(executable) {
		if time.Now().After(deadline) {
			return false
		}
		time.Sleep(150 * time.Millisecond)
	}
	return true
}
