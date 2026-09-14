package discordinstall

import (
	"os"
	"path/filepath"
	"testing"
)

// stableInstall runs FindInstalls against a fake %LOCALAPPDATA% and returns
// the entry for the stable Discord branch.
func stableInstall(t *testing.T, root string) Install {
	t.Helper()
	t.Setenv("LOCALAPPDATA", root)
	t.Setenv("ProgramFiles", "")
	t.Setenv("ProgramFiles(x86)", "")

	for _, install := range FindInstalls() {
		if filepath.Base(install.Base) == "Discord" {
			return install
		}
	}
	t.Fatal("stable Discord not found")
	return Install{}
}

func mkdir(t *testing.T, parts ...string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Join(parts...), 0o755); err != nil {
		t.Fatal(err)
	}
}

func touch(t *testing.T, parts ...string) {
	t.Helper()
	if err := os.WriteFile(filepath.Join(parts...), nil, 0o644); err != nil {
		t.Fatal(err)
	}
}

// The layout from a second machine's install.log: an abandoned 1.0.9257 with a
// resources folder but no app.asar, while Discord kept running 1.0.9256.
func TestFindInstallsSkipsVersionWithoutApp(t *testing.T) {
	root := t.TempDir()
	base := filepath.Join(root, "Discord")
	mkdir(t, base, "app-1.0.9256", "resources", "app.asar")
	touch(t, base, "app-1.0.9256", "resources", "_app.asar")
	mkdir(t, base, "app-1.0.9257", "resources")

	got := stableInstall(t, root)
	if got.VersionText != "1.0.9256" {
		t.Fatalf("picked %s, want the runnable 1.0.9256", got.VersionText)
	}
	if len(got.OlderVersions) != 1 || got.OlderVersions[0].VersionText != "1.0.9257" {
		t.Fatalf("other versions = %v, want only 1.0.9257", got.OlderVersions)
	}
}

func TestFindInstallsSkipsDeadVersion(t *testing.T) {
	root := t.TempDir()
	base := filepath.Join(root, "Discord")
	mkdir(t, base, "app-1.0.9256", "resources")
	touch(t, base, "app-1.0.9256", "resources", "app.asar")
	mkdir(t, base, "app-1.0.9257", "resources")
	touch(t, base, "app-1.0.9257", "resources", "app.asar")
	touch(t, base, "app-1.0.9257", ".dead")

	if got := stableInstall(t, root); got.VersionText != "1.0.9256" {
		t.Fatalf("picked %s, want 1.0.9256 (1.0.9257 is marked .dead)", got.VersionText)
	}
}

// With no runnable version at all, the newest one stays, so the installer
// still reports an incomplete Discord instead of silently patching nothing.
func TestFindInstallsKeepsNewestWhenNoneHasApp(t *testing.T) {
	root := t.TempDir()
	base := filepath.Join(root, "Discord")
	mkdir(t, base, "app-1.0.9256", "resources")
	mkdir(t, base, "app-1.0.9257", "resources")

	if got := stableInstall(t, root); got.VersionText != "1.0.9257" {
		t.Fatalf("picked %s, want the newest 1.0.9257", got.VersionText)
	}
}
