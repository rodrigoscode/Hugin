package cli

import (
	"os"
	"path/filepath"
	"testing"

	"hugin/internal/branches"
	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/version"
)

func TestUpdateBatchRestoresPayloadAndConfigurationOnFailure(t *testing.T) {
	for _, failure := range []bool{false, true} {
		t.Run(map[bool]string{false: "success", true: "rollback"}[failure], func(t *testing.T) {
			root := t.TempDir()
			t.Setenv("APPDATA", root)
			var installs []discordinstall.Install
			old := injector.Payload{MainJS: []byte("old-main"), PreloadJS: []byte("old-preload"), ViewPreloadJS: []byte("old-view"), RendererJS: []byte("old-renderer")}
			cfg := config.Default()
			cfg.Room = "my-room"
			cfg.RoomSecret = "keep-me"
			for _, branch := range branches.All[:2] {
				resources := filepath.Join(root, branch.Dir, "resources")
				if err := os.MkdirAll(resources, 0700); err != nil {
					t.Fatal(err)
				}
				if err := os.WriteFile(filepath.Join(resources, "app.asar"), []byte("original Discord"), 0600); err != nil {
					t.Fatal(err)
				}
				install := discordinstall.Install{Branch: branch, Resources: resources}
				if _, err := injector.ApplyPatch(install, old, injector.InstallOptions{Version: "0.9.0", Config: &cfg}); err != nil {
					t.Fatal(err)
				}
				installs = append(installs, install)
			}
			fresh := injector.Payload{MainJS: []byte("new-main"), PreloadJS: []byte("new-preload"), ViewPreloadJS: []byte("new-view"), RendererJS: []byte("new-renderer")}
			err := applyPreparedUpdate(filepath.Join(paths.DataDirectory(), "updates"), installs, func() injector.Payload { return fresh }, func() injector.Sounds { return nil }, func() injector.Fonts {
				if failure {
					return injector.Fonts{"missing/font.woff2": []byte("failure after payload mutation")}
				}
				return nil
			})
			if (err != nil) != failure {
				t.Fatal("unexpected update result", err)
			}
			wantVersion, wantRenderer, wantMain := version.Version, "new-renderer", "new-main"
			if failure {
				wantVersion, wantRenderer, wantMain = "0.9.0", "old-renderer", "old-main"
			}
			for _, install := range installs {
				status := injector.Inspect(install)
				if status.MarkerData == nil || status.MarkerData.Version != wantVersion {
					t.Fatal("mixed versions after update", status)
				}
				data, err := os.ReadFile(filepath.Join(injector.PatchPaths(install).Asar, "index.js"))
				if err != nil || string(data) != wantMain {
					t.Fatal("main payload", string(data), err)
				}
			}
			data, err := os.ReadFile(filepath.Join(paths.DataDirectory(), paths.RendererFile))
			if err != nil || string(data) != wantRenderer {
				t.Fatal("shared renderer", string(data), err)
			}
			got := config.Read()
			if got.Room != "my-room" || got.RoomSecret != "keep-me" {
				t.Fatal("configuration lost")
			}
		})
	}
}
