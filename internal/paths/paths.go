// Package paths centralizes every filesystem location the tool touches, so
// a change to the layout happens in one place.
package paths

import (
	"os"
	"path/filepath"
)

const (
	MarkerFile string = ".hugin.json"

	RendererFile    = "renderer.js"
	ConfigFile      = "config.json"
	SoundsDirectory = "sounds"
	FontsDirectory  = "fonts"
	LogFile         = "log.txt"
	InstallLogFile  = "install.log"
	// HelperFile is the copy of Hugin.exe the patched main process runs.
	HelperFile = "Hugin.exe"
)

// LegacyMarkerFiles are the marker names written under the tool's previous
// names (GoPeer, and before it GoLive P2P). Recognizing them means an existing
// patched install upgrades cleanly on the next run instead of reading as
// "patched by another mod".
var LegacyMarkerFiles = []string{".gopeer.json", ".golive-p2p.json"}

// DataDirectory returns %APPDATA%\Hugin (Roaming, not Local): it is where
// the injected payload's own code looks for its bundle and config.
func DataDirectory() string {
	return filepath.Join(roaming(), "Hugin")
}

// LegacyDataDirectory is where the previous name (GoPeer) kept its data. The
// install carries the settings over and removes it once Discord is closed.
func LegacyDataDirectory() string {
	return filepath.Join(roaming(), "GoPeer")
}

func roaming() string {
	base := os.Getenv("APPDATA")
	if base == "" {
		base = filepath.Join(os.Getenv("USERPROFILE"), "AppData", "Roaming")
	}
	return base
}
