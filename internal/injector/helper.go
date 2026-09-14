package injector

import (
	"bytes"
	"os"
	"path/filepath"

	"hugin/internal/paths"
)

// InstallHelper copies the running executable into dataDir. The patched
// Discord main process can't call the Windows API from JavaScript, so it runs
// that copy to find and watch shared windows, keep capture timers precise and
// capture system audio without Discord.
//
// Nothing is written when the copy is already identical, or when this is the
// copy itself running.
func InstallHelper(dataDir string) error {
	self, err := os.Executable()
	if err != nil {
		return err
	}
	target := filepath.Join(dataDir, paths.HelperFile)

	if selfInfo, err := os.Stat(self); err == nil {
		if targetInfo, err := os.Stat(target); err == nil && os.SameFile(selfInfo, targetInfo) {
			return nil
		}
	}

	data, err := os.ReadFile(self)
	if err != nil {
		return err
	}
	if existing, err := os.ReadFile(target); err == nil && bytes.Equal(existing, data) {
		return nil
	}

	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}

	temporary := target + ".tmp"
	if err := os.WriteFile(temporary, data, 0o755); err != nil {
		return err
	}
	return os.Rename(temporary, target)
}
