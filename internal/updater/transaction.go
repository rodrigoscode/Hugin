package updater

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
)

type backupEntry struct {
	Target string `json:"target"`
	Exists bool   `json:"exists"`
}
type Transaction struct {
	Dir       string        `json:"-"`
	Entries   []backupEntry `json:"entries"`
	Committed bool          `json:"committed"`
}

func copyTree(source, target string) error {
	info, err := os.Lstat(source)
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 {
		return errors.New("refusing to copy a linked installation file")
	}
	if info.IsDir() {
		if err := os.MkdirAll(target, info.Mode().Perm()); err != nil {
			return err
		}
		entries, err := os.ReadDir(source)
		if err != nil {
			return err
		}
		for _, entry := range entries {
			if err := copyTree(filepath.Join(source, entry.Name()), filepath.Join(target, entry.Name())); err != nil {
				return err
			}
		}
		return nil
	}
	if !info.Mode().IsRegular() {
		return errors.New("not a regular installation file")
	}
	in, err := os.Open(source)
	if err != nil {
		return err
	}
	defer in.Close()
	if err := os.MkdirAll(filepath.Dir(target), 0700); err != nil {
		return err
	}
	out, err := os.OpenFile(target, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, info.Mode().Perm())
	if err != nil {
		return err
	}
	_, err = io.Copy(out, in)
	if err == nil {
		err = out.Sync()
	}
	closeErr := out.Close()
	if err != nil {
		return err
	}
	return closeErr
}

// Begin saves every target before publishing the journal. No caller may mutate targets before it returns.
func Begin(dir string, targets []string) (*Transaction, error) {
	if _, err := os.Stat(dir); err == nil {
		return nil, errors.New("an update backup already exists")
	} else if !os.IsNotExist(err) {
		return nil, err
	}
	if err := os.MkdirAll(dir, 0700); err != nil {
		return nil, err
	}
	t := &Transaction{Dir: dir}
	ok := false
	defer func() {
		if !ok {
			_ = os.RemoveAll(dir)
		}
	}()
	for i, target := range targets {
		_, err := os.Lstat(target)
		entry := backupEntry{Target: target, Exists: err == nil}
		if err != nil && !os.IsNotExist(err) {
			return nil, err
		}
		if entry.Exists {
			if err := copyTree(target, filepath.Join(dir, strconv.Itoa(i))); err != nil {
				return nil, err
			}
		}
		t.Entries = append(t.Entries, entry)
	}
	if err := writeJSON(filepath.Join(dir, "journal.json"), t); err != nil {
		return nil, err
	}
	ok = true
	return t, nil
}

func (t *Transaction) Rollback() error {
	// Backups remain intact until every restoration succeeds, allowing recovery to retry.
	var failures []error
	for i, entry := range t.Entries {
		if entry.Exists {
			if _, err := os.Stat(filepath.Join(t.Dir, strconv.Itoa(i))); err != nil {
				failures = append(failures, err)
				continue
			}
		}
		if err := os.RemoveAll(entry.Target); err != nil {
			failures = append(failures, err)
			continue
		}
		if entry.Exists {
			if err := copyTree(filepath.Join(t.Dir, strconv.Itoa(i)), entry.Target); err != nil {
				failures = append(failures, err)
			}
		}
	}
	if len(failures) != 0 {
		return fmt.Errorf("update recovery incomplete: %w", errors.Join(failures...))
	}
	return os.RemoveAll(t.Dir)
}

func (t *Transaction) Commit() error {
	t.Committed = true
	if err := writeJSON(filepath.Join(t.Dir, "journal.json"), t); err != nil {
		t.Committed = false
		return err
	}
	// Cleanup can be retried on the next run after the durable commit.
	_ = os.RemoveAll(t.Dir)
	return nil
}

func Recover(dir string) error {
	data, err := os.ReadFile(filepath.Join(dir, "journal.json"))
	if os.IsNotExist(err) {
		return os.RemoveAll(dir)
	}
	if err != nil {
		return err
	}
	t := &Transaction{Dir: dir}
	if len(data) > 1<<20 || json.Unmarshal(data, t) != nil {
		return errors.New("invalid update recovery journal")
	}
	if t.Committed {
		return os.RemoveAll(dir)
	}
	return t.Rollback()
}
