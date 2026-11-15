package updater

import (
	"errors"
	"syscall"
	"time"
)

// WaitProcess holds a process handle, so a reused PID cannot be mistaken for Discord.
func WaitProcess(pid uint32, timeout time.Duration, ready func()) error {
	h, err := syscall.OpenProcess(syscall.SYNCHRONIZE, false, pid)
	if err != nil {
		return err
	}
	defer syscall.CloseHandle(h)
	ready()
	status, err := syscall.WaitForSingleObject(h, uint32(timeout/time.Millisecond))
	if err != nil {
		return err
	}
	if status != syscall.WAIT_OBJECT_0 {
		return errors.New("Discord did not close; update cancelled")
	}
	return nil
}
