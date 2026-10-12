package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"hugin/internal/paths"
)

func useTempAppData(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	t.Setenv("APPDATA", root)
	return filepath.Join(root, "Hugin")
}

func TestDefault(t *testing.T) {
	cfg := Default()

	if cfg.VdoBase != "https://vdo.ninja" {
		t.Fatalf("VdoBase = %q, want default VDO.Ninja", cfg.VdoBase)
	}
	if !cfg.CaptureAudio || !cfg.AutoWatch || !cfg.ReplaceShareButton || !cfg.HijackShareButton {
		t.Fatalf("expected enabled sharing defaults: %+v", cfg)
	}
	if !cfg.EnableWebpackHook || !cfg.ObserveNetwork || !cfg.FetchOwnProfile || !cfg.FetchProfiles || !cfg.PlaySounds {
		t.Fatalf("expected enabled integration defaults: %+v", cfg)
	}
	if cfg.ConfigVersion != currentConfigVersion {
		t.Fatalf("ConfigVersion = %d, want %d", cfg.ConfigVersion, currentConfigVersion)
	}
}

func TestReadReturnsDefaultsWhenMissing(t *testing.T) {
	useTempAppData(t)

	got := Read()
	want := Default()
	if got != want {
		t.Fatalf("Read() = %+v, want %+v", got, want)
	}
}

func TestReadMergesPartialConfigWithDefaults(t *testing.T) {
	dataDir := useTempAppData(t)
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(dataDir, paths.ConfigFile)
	if err := os.WriteFile(path, []byte(`{"vdoBase":"https://example.test","captureAudio":false,"configVersion":2}`), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg := Read()
	if cfg.VdoBase != "https://example.test" {
		t.Fatalf("VdoBase = %q", cfg.VdoBase)
	}
	if cfg.CaptureAudio {
		t.Fatal("CaptureAudio should keep explicit false")
	}
	if !cfg.AutoWatch || !cfg.ReplaceShareButton || !cfg.FetchProfiles || !cfg.PlaySounds {
		t.Fatalf("missing defaults were not preserved: %+v", cfg)
	}
	if cfg.ConfigVersion != currentConfigVersion {
		t.Fatalf("ConfigVersion = %d, want %d", cfg.ConfigVersion, currentConfigVersion)
	}
}

func TestReadMigratesReplaceShareButtonDefault(t *testing.T) {
	dataDir := useTempAppData(t)
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(dataDir, paths.ConfigFile)
	if err := os.WriteFile(path, []byte(`{"replaceShareButton":false,"configVersion":1}`), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg := Read()
	if !cfg.ReplaceShareButton {
		t.Fatal("ReplaceShareButton should migrate to true for old configs")
	}
	if cfg.ConfigVersion != currentConfigVersion {
		t.Fatalf("ConfigVersion = %d, want %d", cfg.ConfigVersion, currentConfigVersion)
	}
}

func TestWritePersistsConfig(t *testing.T) {
	dataDir := useTempAppData(t)
	cfg := Default()
	cfg.VdoBase = "https://vdo.example"
	cfg.Room = "fixed-room"
	cfg.CaptureAudio = false

	if err := Write(cfg); err != nil {
		t.Fatal(err)
	}

	data, err := os.ReadFile(filepath.Join(dataDir, paths.ConfigFile))
	if err != nil {
		t.Fatal(err)
	}
	if !json.Valid(data) {
		t.Fatalf("written config is not valid JSON: %s", data)
	}

	var decoded Config
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatal(err)
	}
	if decoded.VdoBase != cfg.VdoBase || decoded.Room != cfg.Room || decoded.CaptureAudio != cfg.CaptureAudio {
		t.Fatalf("decoded config = %+v, want persisted fields from %+v", decoded, cfg)
	}
}
