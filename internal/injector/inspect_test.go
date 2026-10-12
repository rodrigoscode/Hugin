package injector

import (
	"os"
	"path/filepath"
	"testing"

	"hugin/internal/branches"
	"hugin/internal/discordinstall"
	"hugin/internal/paths"
)

func testInstall(t *testing.T) discordinstall.Install {
	t.Helper()
	resources := filepath.Join(t.TempDir(), "Discord", "app-1.0.0", "resources")
	if err := os.MkdirAll(resources, 0o755); err != nil {
		t.Fatal(err)
	}
	return discordinstall.Install{
		Branch:      branches.All[0],
		VersionText: "1.0.0",
		Resources:   resources,
	}
}

func writeFile(t *testing.T, path string, data string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(data), 0o644); err != nil {
		t.Fatal(err)
	}
}

func mkdirAll(t *testing.T, path string) {
	t.Helper()
	if err := os.MkdirAll(path, 0o755); err != nil {
		t.Fatal(err)
	}
}

func TestInspectMissing(t *testing.T) {
	install := testInstall(t)

	status := Inspect(install)
	if status.State != StateMissing {
		t.Fatalf("State = %s, want %s", status.State, StateMissing)
	}
}

func TestInspectClean(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	writeFile(t, p.Asar, "original")

	status := Inspect(install)
	if status.State != StateClean {
		t.Fatalf("State = %s, want %s", status.State, StateClean)
	}
	if status.StaleBackup {
		t.Fatal("StaleBackup should be false without _app.asar")
	}
}

func TestInspectCleanWithStaleBackup(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	writeFile(t, p.Asar, "original")
	writeFile(t, p.Backup, "backup")

	status := Inspect(install)
	if status.State != StateClean {
		t.Fatalf("State = %s, want %s", status.State, StateClean)
	}
	if !status.StaleBackup {
		t.Fatal("StaleBackup should be true when _app.asar exists next to a clean app.asar")
	}
}

func TestInspectOurs(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "backup")
	writeFile(t, p.Marker, `{"tool":"hugin","version":"1.2.3","payloadHash":"abc"}`)

	status := Inspect(install)
	if status.State != StateOurs {
		t.Fatalf("State = %s, want %s", status.State, StateOurs)
	}
	if status.MarkerData == nil || status.MarkerData.Version != "1.2.3" {
		t.Fatalf("MarkerData = %+v, want version 1.2.3", status.MarkerData)
	}
}

func TestInspectOursWithLegacyMarker(t *testing.T) {
	for _, markerName := range paths.LegacyMarkerFiles {
		t.Run(markerName, func(t *testing.T) {
			install := testInstall(t)
			p := PatchPaths(install)
			mkdirAll(t, p.Asar)
			writeFile(t, p.Backup, "backup")
			writeFile(t, filepath.Join(p.Asar, markerName), `{"tool":"gopeer","version":"0.9.0"}`)

			status := Inspect(install)
			if status.State != StateOurs {
				t.Fatalf("State = %s, want %s", status.State, StateOurs)
			}
			if status.MarkerData == nil || status.MarkerData.Version != "0.9.0" {
				t.Fatalf("MarkerData = %+v, want legacy version", status.MarkerData)
			}
		})
	}
}

func TestInspectForeign(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "backup")

	status := Inspect(install)
	if status.State != StateForeign {
		t.Fatalf("State = %s, want %s", status.State, StateForeign)
	}
}

func TestInspectBrokenFolderWithoutBackup(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)

	status := Inspect(install)
	if status.State != StateBroken {
		t.Fatalf("State = %s, want %s", status.State, StateBroken)
	}
	if status.Reason == "" {
		t.Fatal("broken status should include a reason")
	}
}

func TestInspectBrokenOnlyBackup(t *testing.T) {
	install := testInstall(t)
	p := PatchPaths(install)
	writeFile(t, p.Backup, "backup")

	status := Inspect(install)
	if status.State != StateBroken {
		t.Fatalf("State = %s, want %s", status.State, StateBroken)
	}
	if status.Reason == "" {
		t.Fatal("broken status should include a reason")
	}
}
