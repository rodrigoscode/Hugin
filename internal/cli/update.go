package cli

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"hugin/internal/cliui"
	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/updater"
	"hugin/internal/version"
)

func updateMessage(value any) { _ = json.NewEncoder(os.Stdout).Encode(value) }

func patchedInstalls() []discordinstall.Install {
	var result []discordinstall.Install
	for _, install := range discordinstall.FindInstalls() {
		if injector.Inspect(install).State == injector.StateOurs {
			result = append(result, install)
		}
	}
	return result
}

func updatePreflight(branch string, allowCurrent bool) ([]discordinstall.Install, discordinstall.Install, error) {
	installs := patchedInstalls()
	var current discordinstall.Install
	for _, install := range installs {
		if install.Branch.Key == branch {
			current = install
		}
		running, err := discordinstall.RunningChecked(install.Branch.Executable)
		if err != nil {
			return nil, current, err
		}
		if running && !(allowCurrent && install.Branch.Key == branch) {
			return nil, current, fmt.Errorf("close %s before updating Hugin", install.Branch.Label)
		}
	}
	if current.Resources == "" {
		return nil, current, errors.New("current patched Discord installation was not found")
	}
	return installs, current, nil
}

// RunUpdate uses a bounded JSON-lines protocol, without interactive installer prompts.
func RunUpdate(args []string, loadPayload PayloadLoader, loadSounds SoundsLoader, loadFonts FontsLoader) int {
	handedOff := false
	fail := func(err error) int {
		updateMessage(map[string]any{"type": "error", "message": err.Error()})
		if handedOff {
			cliui.ShowMessageBox("Hugin — atualização", "Não foi possível concluir a atualização.\n\n"+err.Error()+"\n\nFeche os clientes Discord e execute um Hugin.exe baixado da release para recuperar ou reinstalar.")
		}
		return 1
	}
	if len(args) == 0 {
		return fail(errors.New("missing update operation"))
	}
	dir := filepath.Join(paths.DataDirectory(), "updates")
	unlock, err := updater.Lock(dir)
	if err != nil {
		return fail(err)
	}
	defer unlock()
	s := updater.New(dir, version.Version)
	switch args[0] {
	case "check":
		force := len(args) == 2 && args[1] == "manual"
		result, err := s.Check(context.Background(), force)
		if err != nil {
			return fail(err)
		}
		updateMessage(map[string]any{"type": "result", "result": result})
		return 0
	case "later", "ignore":
		if err := s.Preference(args[0]); err != nil {
			return fail(err)
		}
		updateMessage(map[string]any{"type": "result", "result": map[string]bool{"ok": true}})
		return 0
	case "download":
		prepared, err := s.Prepare(context.Background(), func(done, total int64) {
			updateMessage(map[string]any{"type": "progress", "done": done, "total": total})
		})
		if err != nil {
			return fail(err)
		}
		updateMessage(map[string]any{"type": "result", "result": prepared})
		return 0
	case "preflight":
		if len(args) != 2 {
			return fail(errors.New("missing Discord branch"))
		}
		if _, err := s.VerifyPrepared(); err != nil {
			return fail(err)
		}
		if _, _, err := updatePreflight(args[1], true); err != nil {
			return fail(err)
		}
		updateMessage(map[string]any{"type": "result", "result": map[string]bool{"ok": true}})
		return 0
	case "apply":
		if len(args) != 5 {
			return fail(errors.New("missing Discord branch or PID"))
		}
		pid, err := strconv.ParseUint(args[2], 10, 32)
		if err != nil || pid == 0 {
			return fail(errors.New("invalid Discord PID"))
		}
		p, err := s.VerifyPrepared()
		if err != nil {
			return fail(err)
		}
		if p.Version != args[3] || p.SHA256 != args[4] {
			return fail(errors.New("prepared update changed after approval"))
		}
		self, err := os.Executable()
		if err != nil {
			return fail(err)
		}
		selfInfo, err := os.Stat(self)
		if err != nil {
			return fail(err)
		}
		stagedInfo, err := os.Stat(filepath.Join(dir, "prepared", "Hugin.exe"))
		if err != nil || !os.SameFile(selfInfo, stagedInfo) || p.Version != version.Version {
			return fail(errors.New("update must run from its verified installer"))
		}
		if _, _, err := updatePreflight(args[1], true); err != nil {
			return fail(err)
		}
		// Open the parent process handle before readiness; PID reuse or a fast exit cannot race this handoff.
		if err := updater.WaitProcess(uint32(pid), 30*time.Second, func() { handedOff = true; updateMessage(map[string]string{"type": "ready"}) }); err != nil {
			return fail(err)
		}
		var installs []discordinstall.Install
		var current discordinstall.Install
		deadline := time.Now().Add(10 * time.Second)
		for {
			installs, current, err = updatePreflight(args[1], false)
			if err == nil || time.Now().After(deadline) {
				break
			}
			time.Sleep(250 * time.Millisecond)
		}
		if err == nil {
			for _, install := range installs {
				marker := injector.Inspect(install).MarkerData
				if marker == nil {
					err = errors.New("installation changed before update")
					break
				}
				cmp, compareErr := updater.Compare(p.Version, marker.Version)
				if compareErr != nil || cmp < 0 {
					err = errors.New("refusing to downgrade an installed Hugin version")
					break
				}
			}
		}
		if err == nil {
			err = applyPreparedUpdate(dir, installs, loadPayload, loadSounds, loadFonts)
		}
		if err != nil {
			return fail(err)
		}
		discordinstall.Launch(current)
		updateMessage(map[string]any{"type": "result", "result": map[string]bool{"ok": true}})
		return 0
	default:
		return fail(errors.New("unknown update operation"))
	}
}

func applyPreparedUpdate(dir string, installs []discordinstall.Install, loadPayload PayloadLoader, loadSounds SoundsLoader, loadFonts FontsLoader) (err error) {
	backup := filepath.Join(dir, "recovery")
	if err := updater.Recover(backup); err != nil {
		return err
	}
	var targets []string
	for _, install := range installs {
		targets = append(targets, injector.PatchPaths(install).Asar)
	}
	for _, name := range []string{paths.RendererFile, paths.ConfigFile, paths.SoundsDirectory, paths.FontsDirectory, paths.HelperFile} {
		targets = append(targets, filepath.Join(paths.DataDirectory(), name))
	}
	transaction, err := updater.Begin(backup, targets)
	if err != nil {
		return err
	}
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("update failed: %v", r)
		}
		if err != nil {
			err = errors.Join(err, transaction.Rollback())
		}
	}()
	payload, sounds, fonts := loadPayload(), loadSounds(), loadFonts()
	cfg := config.Read()
	for _, install := range installs {
		_, err = injector.ApplyPatch(install, payload, injector.InstallOptions{Version: version.Version, Config: &cfg, Sounds: sounds, Fonts: fonts})
		if err != nil {
			return err
		}
	}
	if err = injector.InstallHelper(paths.DataDirectory()); err != nil {
		return err
	}
	for _, install := range installs {
		status := injector.Inspect(install)
		if status.State != injector.StateOurs || status.MarkerData.Version != version.Version || status.MarkerData.PayloadHash != injector.HashPayload(payload) {
			return errors.New("updated installation did not pass verification")
		}
		for name, expected := range map[string][]byte{"index.js": payload.MainJS, "preload.js": payload.PreloadJS, "viewPreload.js": payload.ViewPreloadJS} {
			actual, readErr := os.ReadFile(filepath.Join(status.Asar, name))
			if readErr != nil || !bytes.Equal(actual, expected) {
				return errors.New("installed payload differs from the verified release")
			}
		}
	}
	actual, readErr := os.ReadFile(filepath.Join(paths.DataDirectory(), paths.RendererFile))
	if readErr != nil || !bytes.Equal(actual, payload.RendererJS) {
		return errors.New("installed renderer differs from the verified release")
	}
	return transaction.Commit()
}
