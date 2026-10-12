package injector

import (
	"os"
	"path/filepath"
	"testing"

	"hugin/internal/config"
	"hugin/internal/paths"
)

func testPayload() Payload {
	return Payload{
		MainJS:        []byte("main"),
		PreloadJS:     []byte("preload"),
		ViewPreloadJS: []byte("view-preload"),
		RendererJS:    []byte("renderer"),
	}
}

func tempDataDir(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	t.Setenv("APPDATA", root)
	return filepath.Join(root, "Hugin")
}

func readText(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func TestApplyPatchCleanInstall(t *testing.T) {
	dataDir := tempDataDir(t)
	install := testInstall(t)
	p := PatchPaths(install)
	writeFile(t, p.Asar, "original-asar")
	cfg := config.Default()
	cfg.VdoBase = "https://vdo.example"

	result, err := ApplyPatch(install, testPayload(), InstallOptions{
		Version: "9.9.9",
		Config:  &cfg,
		Sounds: Sounds{
			"start.mp3": []byte("sound"),
		},
		Fonts: Fonts{
			"font.woff2": []byte("font"),
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	if result.Reinstalled {
		t.Fatal("clean install should not be reported as reinstalled")
	}
	if result.Resources != p.Resources || result.DataDirectory != dataDir {
		t.Fatalf("result = %+v", result)
	}

	status := Inspect(install)
	if status.State != StateOurs {
		t.Fatalf("State = %s, want %s", status.State, StateOurs)
	}
	if status.MarkerData == nil || status.MarkerData.Version != "9.9.9" || status.MarkerData.PayloadHash != HashPayload(testPayload()) {
		t.Fatalf("MarkerData = %+v", status.MarkerData)
	}
	if readText(t, p.Backup) != "original-asar" {
		t.Fatal("original app.asar was not moved to _app.asar")
	}
	if readText(t, filepath.Join(p.Asar, "index.js")) != "main" {
		t.Fatal("main payload was not written")
	}
	if readText(t, filepath.Join(p.Asar, "preload.js")) != "preload" {
		t.Fatal("preload payload was not written")
	}
	if readText(t, filepath.Join(p.Asar, "viewPreload.js")) != "view-preload" {
		t.Fatal("view preload payload was not written")
	}
	if readText(t, filepath.Join(dataDir, paths.RendererFile)) != "renderer" {
		t.Fatal("renderer payload was not written")
	}
	if readText(t, filepath.Join(dataDir, paths.SoundsDirectory, "start.mp3")) != "sound" {
		t.Fatal("sound asset was not written")
	}
	if readText(t, filepath.Join(dataDir, paths.FontsDirectory, "font.woff2")) != "font" {
		t.Fatal("font asset was not written")
	}
	if got := config.Read().VdoBase; got != "https://vdo.example" {
		t.Fatalf("persisted config VdoBase = %q", got)
	}
}

func TestApplyPatchReinstallsOurs(t *testing.T) {
	tempDataDir(t)
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "original-asar")
	writeFile(t, p.Marker, `{"tool":"hugin","version":"1.0.0"}`)

	result, err := ApplyPatch(install, testPayload(), InstallOptions{Version: "2.0.0"})
	if err != nil {
		t.Fatal(err)
	}
	if !result.Reinstalled {
		t.Fatal("patching an existing Hugin install should report reinstalled")
	}
	if readText(t, p.Backup) != "original-asar" {
		t.Fatal("backup should be preserved during reinstall")
	}
	if got := Inspect(install).MarkerData.Version; got != "2.0.0" {
		t.Fatalf("marker version = %q, want 2.0.0", got)
	}
}

func TestApplyPatchRefusesForeignWithoutForce(t *testing.T) {
	tempDataDir(t)
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "backup")

	_, err := ApplyPatch(install, testPayload(), InstallOptions{Version: "1.0.0"})
	if err == nil {
		t.Fatal("ApplyPatch should refuse a foreign app.asar without Force")
	}
	if readText(t, p.Backup) != "backup" {
		t.Fatal("foreign backup should not be modified on refusal")
	}
}

func TestRemovePatchRestoresBackup(t *testing.T) {
	tempDataDir(t)
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "original-asar")
	writeFile(t, p.Marker, `{"tool":"hugin","version":"1.0.0"}`)

	result, err := RemovePatch(install, UninstallOptions{})
	if err != nil {
		t.Fatal(err)
	}
	if !result.Changed {
		t.Fatal("RemovePatch should report a restored install")
	}
	info, err := os.Stat(p.Asar)
	if err != nil {
		t.Fatal(err)
	}
	if info.IsDir() {
		t.Fatal("restored app.asar should be a file")
	}
	if readText(t, p.Asar) != "original-asar" {
		t.Fatal("app.asar was not restored from backup")
	}
	if _, err := os.Stat(p.Backup); !os.IsNotExist(err) {
		t.Fatalf("backup should be gone after restore, stat err = %v", err)
	}
}

func TestRemovePatchPurgesData(t *testing.T) {
	dataDir := tempDataDir(t)
	install := testInstall(t)
	p := PatchPaths(install)
	mkdirAll(t, p.Asar)
	writeFile(t, p.Backup, "original-asar")
	writeFile(t, p.Marker, `{"tool":"hugin","version":"1.0.0"}`)
	writeFile(t, filepath.Join(dataDir, paths.LogFile), "log")

	if _, err := RemovePatch(install, UninstallOptions{PurgeData: true}); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(dataDir); !os.IsNotExist(err) {
		t.Fatalf("data directory should be purged, stat err = %v", err)
	}
}
