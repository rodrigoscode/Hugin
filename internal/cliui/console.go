//go:build windows

// Package cliui is the installer's text output: colored console lines
// mirrored to install.log, plus a native message box for the no-console
// case (this binary targets the GUI subsystem, so a double click has no
// console attached at all).
package cliui

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"syscall"
	"time"
	"unsafe"

	"hugin/internal/paths"
)

const esc = "\x1b"

var ansiPattern = regexp.MustCompile(esc + `\[[0-9;]*m`)

var installLogPath = filepath.Join(paths.DataDirectory(), paths.InstallLogFile)

// InstallLogPath is exposed so the top-level error handler can point the
// user at it.
func InstallLogPath() string { return installLogPath }

var useColor = consoleAttached() && os.Getenv("NO_COLOR") == ""

var (
	kernel32       = syscall.NewLazyDLL("kernel32.dll")
	getConsoleMode = kernel32.NewProc("GetConsoleMode")
)

// consoleAttached reports whether stdout is a real console, via
// GetConsoleMode -- the GUI subsystem means there usually is none.
func consoleAttached() bool {
	var mode uint32
	ret, _, _ := getConsoleMode.Call(os.Stdout.Fd(), uintptr(unsafe.Pointer(&mode)))
	return ret != 0
}

func paint(code, text string) string {
	if !useColor {
		return text
	}
	return esc + "[" + code + "m" + text + esc + "[0m"
}

func appendToLog(line string) {
	dir := filepath.Dir(installLogPath)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return
	}

	f, err := os.OpenFile(installLogPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()

	fmt.Fprintf(f, "%s %s\n", time.Now().UTC().Format(time.RFC3339), line)
}

// emit prints text and mirrors a colorless copy to install.log, the only trace
// left when the GUI-subsystem binary runs without a console.
func emit(text string) {
	fmt.Println(text)
	appendToLog(ansiPattern.ReplaceAllString(text, ""))
}

func Title(text string)              { emit(paint("1;36", "\n  "+text)) }
func OK(text string)                 { emit("  " + paint("32", "OK") + "   " + text) }
func Warn(text string)               { emit("  " + paint("33", "!") + "    " + text) }
func Fail(text string)               { recordFailure(text) }
func Info(text string)               { emit("       " + paint("90", text)) }
func Plain(text string)              { emit("  " + text) }
func Paint(code, text string) string { return paint(code, text) }

// lastFailure keeps the most recent Fail line, so a double-click run -- no
// console attached -- can still say what went wrong instead of just exiting.
var lastFailure string

func recordFailure(text string) {
	lastFailure = text
	emit("  " + paint("31", "X") + "    " + text)
}

// LastFailure is the text of the most recent Fail call, or "" if none.
func LastFailure() string { return lastFailure }

// ShowMessageBox raises a native Win32 message box via user32.dll, with no
// external process spawned -- unlike the previous PowerShell-based
// approach, this has no dependency on PowerShell being reachable, which
// this same session watched get blocked by Smart App Control.
func ShowMessageBox(title, message string) {
	if consoleAttached() {
		return
	}

	user32 := syscall.NewLazyDLL("user32.dll")
	messageBoxW := user32.NewProc("MessageBoxW")

	titlePtr, err1 := syscall.UTF16PtrFromString(title)
	messagePtr, err2 := syscall.UTF16PtrFromString(message)
	if err1 != nil || err2 != nil {
		return
	}

	const mbOk = 0x00000000
	const mbIconError = 0x00000010
	messageBoxW.Call(0, uintptr(unsafe.Pointer(messagePtr)), uintptr(unsafe.Pointer(titlePtr)), mbOk|mbIconError)
}
