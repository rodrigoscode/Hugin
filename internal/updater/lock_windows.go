package updater

import (
	"errors"
	"os"
	"path/filepath"
	"syscall"
)

// Lock is released by Windows even if the owning process crashes.
func Lock(dir string) (func(), error) {
	if err := os.MkdirAll(dir, 0700); err != nil {
		return nil, err
	}
	p, err := syscall.UTF16PtrFromString(filepath.Join(dir, "operation.lock"))
	if err != nil {
		return nil, err
	}
	h, err := syscall.CreateFile(p, syscall.GENERIC_READ|syscall.GENERIC_WRITE, 0, nil, syscall.OPEN_ALWAYS, syscall.FILE_ATTRIBUTE_NORMAL, 0)
	if err != nil {
		return nil, errors.New("another update operation is running")
	}
	return func() { _ = syscall.CloseHandle(h) }, nil
}
