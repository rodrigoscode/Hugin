//go:build windows

// Package timer keeps Windows honouring the 1 ms timer resolution Chromium
// requests in Discord's main process while a screen is captured. Windows 11
// ignores it once every window of the process is covered, which holds
// capture at about 32 fps.
package timer

import (
	"fmt"
	"syscall"
	"unsafe"
)

const (
	processSetInformation = 0x0200

	// PROCESS_INFORMATION_CLASS value for PROCESS_POWER_THROTTLING_STATE.
	processPowerThrottling = 4

	powerThrottlingCurrentVersion        = 1
	powerThrottlingIgnoreTimerResolution = 0x4
)

type powerThrottlingState struct {
	Version     uint32
	ControlMask uint32
	StateMask   uint32
}

var setProcessInformation = syscall.NewLazyDLL("kernel32.dll").NewProc("SetProcessInformation")

// SetHonored makes Windows always honour pid's timer resolution requests
// (honored) or hands that decision back to the system (not honored).
func SetHonored(pid uint32, honored bool) error {
	handle, err := syscall.OpenProcess(processSetInformation, false, pid)
	if err != nil {
		return fmt.Errorf("OpenProcess(%d): %w", pid, err)
	}
	defer syscall.CloseHandle(handle)

	state := powerThrottlingState{Version: powerThrottlingCurrentVersion}
	if honored {
		state.ControlMask = powerThrottlingIgnoreTimerResolution
	}

	ret, _, callErr := setProcessInformation.Call(
		uintptr(handle),
		processPowerThrottling,
		uintptr(unsafe.Pointer(&state)),
		unsafe.Sizeof(state))
	if ret == 0 {
		return fmt.Errorf("SetProcessInformation(%d): %w", pid, callErr)
	}
	return nil
}
