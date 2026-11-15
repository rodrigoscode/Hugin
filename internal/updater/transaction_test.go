package updater

import (
	"os"
	"path/filepath"
	"testing"
)

func put(t *testing.T, path, text string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(text), 0600); err != nil {
		t.Fatal(err)
	}
}
func text(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func TestInterruptedUpdateRecoversAllTargets(t *testing.T) {
	dir := t.TempDir()
	patch := filepath.Join(dir, "app.asar")
	shared := filepath.Join(dir, "renderer.js")
	created := filepath.Join(dir, "new-file")
	put(t, filepath.Join(patch, "index.js"), "old main")
	put(t, shared, "old renderer")
	backup := filepath.Join(dir, "recovery")
	if _, err := Begin(backup, []string{patch, shared, created}); err != nil {
		t.Fatal(err)
	}
	if err := os.RemoveAll(patch); err != nil {
		t.Fatal(err)
	}
	put(t, shared, "new renderer")
	put(t, created, "new data")
	if err := Recover(backup); err != nil {
		t.Fatal(err)
	}
	if text(t, filepath.Join(patch, "index.js")) != "old main" || text(t, shared) != "old renderer" {
		t.Fatal("old payload not restored")
	}
	if _, err := os.Stat(created); !os.IsNotExist(err) {
		t.Fatal("new target was not removed")
	}
}

func TestCommitPreservesUpdatedFiles(t *testing.T) {
	dir := t.TempDir()
	target := filepath.Join(dir, "payload")
	put(t, target, "old")
	backup := filepath.Join(dir, "recovery")
	tx, err := Begin(backup, []string{target})
	if err != nil {
		t.Fatal(err)
	}
	put(t, target, "new")
	if err := tx.Commit(); err != nil {
		t.Fatal(err)
	}
	if err := Recover(backup); err != nil {
		t.Fatal(err)
	}
	if text(t, target) != "new" {
		t.Fatal("committed update rolled back")
	}
}

func TestMissingBackupDoesNotDestroyTarget(t *testing.T) {
	dir := t.TempDir()
	target := filepath.Join(dir, "payload")
	put(t, target, "old")
	tx, err := Begin(filepath.Join(dir, "recovery"), []string{target})
	if err != nil {
		t.Fatal(err)
	}
	put(t, target, "new")
	if err := os.Remove(filepath.Join(tx.Dir, "0")); err != nil {
		t.Fatal(err)
	}
	if err := tx.Rollback(); err == nil {
		t.Fatal("missing backup accepted")
	}
	if text(t, target) != "new" {
		t.Fatal("target removed without backup")
	}
}

func TestOperationLockIsExclusiveAndReusable(t *testing.T) {
	dir := t.TempDir()
	unlock, err := Lock(dir)
	if err != nil {
		t.Fatal(err)
	}
	if second, err := Lock(dir); err == nil {
		second()
		t.Fatal("two operations own the lock")
	}
	unlock()
	next, err := Lock(dir)
	if err != nil {
		t.Fatal(err)
	}
	next()
}
