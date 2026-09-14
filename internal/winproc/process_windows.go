//go:build windows

// Package winproc answers questions about other processes' windows that the
// patched Discord main process cannot ask from JavaScript.
package winproc

import (
	"fmt"
	"path/filepath"
	"syscall"
	"unsafe"
)

var (
	user32                    = syscall.NewLazyDLL("user32.dll")
	getWindowThreadProcessID  = user32.NewProc("GetWindowThreadProcessId")
	enumChildWindows          = user32.NewProc("EnumChildWindows")
	isWindow                  = user32.NewProc("IsWindow")
	isWindowVisible           = user32.NewProc("IsWindowVisible")
	isIconic                  = user32.NewProc("IsIconic")
	queryFullProcessImageName = syscall.NewLazyDLL("kernel32.dll").NewProc("QueryFullProcessImageNameW")
)

// WindowState reports what became of a shared window: "gone" once it no longer
// exists, "hidden" (closed to the tray, for instance), "minimized" or "visible".
//
// Hidden is checked before minimized: a window minimized and then hidden is
// still iconic, but it has left the taskbar -- to whoever shared it, it closed.
func WindowState(hwnd uintptr) string {
	if ret, _, _ := isWindow.Call(hwnd); ret == 0 {
		return "gone"
	}
	if ret, _, _ := isWindowVisible.Call(hwnd); ret == 0 {
		return "hidden"
	}
	if ret, _, _ := isIconic.Call(hwnd); ret != 0 {
		return "minimized"
	}
	return "visible"
}

// ChildWindowProcessID returns the first process other than exclude that owns
// a child window of hwnd. A Store (UWP) app's top-level window belongs to
// ApplicationFrameHost.exe; the app itself owns the CoreWindow inside it.
func ChildWindowProcessID(hwnd uintptr, exclude uint32) (uint32, error) {
	var found uint32
	callback := syscall.NewCallback(func(child uintptr, _ uintptr) uintptr {
		var pid uint32
		getWindowThreadProcessID.Call(child, uintptr(unsafe.Pointer(&pid)))
		if pid != 0 && pid != exclude {
			found = pid
			return 0
		}
		return 1
	})
	enumChildWindows.Call(hwnd, callback, 0)
	if found == 0 {
		return 0, fmt.Errorf("no child window of %d belongs to another process", hwnd)
	}
	return found, nil
}

const processQueryLimitedInformation = 0x1000

// ProcessImageName returns the executable's file name (e.g. "explorer.exe")
// for pid.
func ProcessImageName(pid uint32) (string, error) {
	handle, err := syscall.OpenProcess(processQueryLimitedInformation, false, pid)
	if err != nil {
		return "", fmt.Errorf("OpenProcess(%d): %w", pid, err)
	}
	defer syscall.CloseHandle(handle)

	buffer := make([]uint16, 1024)
	size := uint32(len(buffer))
	ret, _, callErr := queryFullProcessImageName.Call(
		uintptr(handle), 0, uintptr(unsafe.Pointer(&buffer[0])), uintptr(unsafe.Pointer(&size)))
	if ret == 0 {
		return "", fmt.Errorf("QueryFullProcessImageName(%d): %v", pid, callErr)
	}
	return filepath.Base(syscall.UTF16ToString(buffer[:size])), nil
}

// WindowProcessID returns the id of the process that owns the window hwnd.
func WindowProcessID(hwnd uintptr) (uint32, error) {
	var pid uint32
	thread, _, callErr := getWindowThreadProcessID.Call(hwnd, uintptr(unsafe.Pointer(&pid)))
	if thread == 0 || pid == 0 {
		return 0, fmt.Errorf("GetWindowThreadProcessId(%d): %v", hwnd, callErr)
	}
	return pid, nil
}
