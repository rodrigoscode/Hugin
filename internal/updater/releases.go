// Package updater prepares verified GitHub releases without modifying a running installation.
package updater

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const Repository = "rodrigoscode/Hugin"
const Interval = 6 * time.Hour
const maxExecutable = 64 << 20

var stableVersion = regexp.MustCompile(`^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$`)

func Compare(a, b string) (int, error) {
	x, y := stableVersion.FindStringSubmatch(a), stableVersion.FindStringSubmatch(b)
	if x == nil || y == nil {
		return 0, errors.New("invalid stable version")
	}
	for i := 1; i <= 3; i++ {
		av, ae := strconv.ParseUint(x[i], 10, 32)
		bv, be := strconv.ParseUint(y[i], 10, 32)
		if ae != nil || be != nil {
			return 0, errors.New("version component too large")
		}
		if av > bv {
			return 1, nil
		}
		if av < bv {
			return -1, nil
		}
	}
	return 0, nil
}

type Asset struct {
	Name string `json:"name"`
	URL  string `json:"browser_download_url"`
	Size int64  `json:"size"`
}

type Release struct {
	Tag        string  `json:"tag_name"`
	Name       string  `json:"name"`
	Body       string  `json:"body"`
	URL        string  `json:"html_url"`
	Published  string  `json:"published_at"`
	Draft      bool    `json:"draft"`
	Prerelease bool    `json:"prerelease"`
	Assets     []Asset `json:"assets"`
}

type State struct {
	CheckedAt    time.Time `json:"checkedAt"`
	NextCheck    time.Time `json:"nextCheck"`
	BlockedUntil time.Time `json:"blockedUntil"`
	ETag         string    `json:"etag,omitempty"`
	Release      *Release  `json:"release,omitempty"`
	Ignored      string    `json:"ignored,omitempty"`
	SnoozeUntil  time.Time `json:"snoozeUntil"`
}

type Result struct {
	Current   string    `json:"current"`
	Available bool      `json:"available"`
	Notify    bool      `json:"notify"`
	Release   *Release  `json:"release,omitempty"`
	Error     string    `json:"error,omitempty"`
	Prepared  *Prepared `json:"prepared,omitempty"`
}

type Service struct {
	Dir     string
	Current string
	Client  *http.Client
	Now     func() time.Time
}

func New(dir, current string) *Service {
	return &Service{Dir: dir, Current: current, Now: time.Now, Client: &http.Client{
		Timeout: 3 * time.Minute,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= 5 || req.URL.Scheme != "https" {
				return errors.New("invalid download redirect")
			}
			switch req.URL.Host {
			case "github.com", "api.github.com", "release-assets.githubusercontent.com", "objects.githubusercontent.com":
				return nil
			}
			return errors.New("untrusted download redirect")
		},
	}}
}

func (s *Service) ReadState() State {
	var state State
	data, err := os.ReadFile(filepath.Join(s.Dir, "state.json"))
	if err == nil && len(data) <= 2<<20 {
		_ = json.Unmarshal(data, &state)
	}
	return state
}

func writeJSON(path string, value any) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	f, err := os.CreateTemp(filepath.Dir(path), ".state-*")
	if err != nil {
		return err
	}
	temp := f.Name()
	defer os.Remove(temp)
	if _, err = f.Write(data); err == nil {
		err = f.Sync()
	}
	closeErr := f.Close()
	if err != nil {
		return err
	}
	if closeErr != nil {
		return closeErr
	}
	return os.Rename(temp, path)
}

func (s *Service) SaveState(state State) error {
	return writeJSON(filepath.Join(s.Dir, "state.json"), state)
}

func validAsset(asset Asset, tag string) bool {
	u, err := url.Parse(asset.URL)
	return err == nil && u.Scheme == "https" && u.Host == "github.com" && u.User == nil && u.RawQuery == "" && u.Fragment == "" &&
		u.Path == "/"+Repository+"/releases/download/"+tag+"/"+asset.Name &&
		(asset.Name == "Hugin.exe" || asset.Name == "checksums.txt") && asset.Size > 0 && asset.Size <= maxExecutable
}

func Assets(release *Release) (Asset, Asset, error) {
	if release == nil || release.Draft || release.Prerelease {
		return Asset{}, Asset{}, errors.New("no stable release")
	}
	if _, err := Compare(release.Tag, release.Tag); err != nil {
		return Asset{}, Asset{}, err
	}
	if release.URL != "https://github.com/"+Repository+"/releases/tag/"+release.Tag {
		return Asset{}, Asset{}, errors.New("invalid release URL")
	}
	var exe, sum Asset
	for _, asset := range release.Assets {
		if !validAsset(asset, release.Tag) {
			continue
		}
		if asset.Name == "Hugin.exe" {
			if exe.Name != "" {
				return exe, sum, errors.New("duplicate asset")
			}
			exe = asset
		}
		if asset.Name == "checksums.txt" {
			if sum.Name != "" {
				return exe, sum, errors.New("duplicate checksum")
			}
			sum = asset
		}
	}
	if exe.Name == "" || sum.Name == "" || sum.Size > 16384 {
		return exe, sum, errors.New("release has no verified Windows installer")
	}
	return exe, sum, nil
}

func (s *Service) result(state State) Result {
	r := Result{Current: s.Current}
	if state.Release == nil {
		return r
	}
	cmp, err := Compare(state.Release.Tag, s.Current)
	if err != nil || cmp <= 0 {
		return r
	}
	if _, _, err := Assets(state.Release); err != nil {
		r.Error = "release_unavailable"
		return r
	}
	r.Available, r.Release = true, state.Release
	if prepared, err := s.VerifyPrepared(); err == nil && prepared.Version == strings.TrimPrefix(state.Release.Tag, "v") {
		r.Prepared = &prepared
	}
	r.Notify = state.Ignored != r.Release.Tag && !s.Now().Before(state.SnoozeUntil)
	return r
}

func (s *Service) Check(ctx context.Context, force bool) (Result, error) {
	state := s.ReadState()
	if s.Now().Before(state.BlockedUntil) {
		return Result{}, errors.New("github_rate_limited")
	}
	if !force && s.Now().Before(state.NextCheck) {
		return s.result(state), nil
	}
	ctx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/repos/"+Repository+"/releases/latest", nil)
	if err != nil {
		return Result{}, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "Hugin/"+s.Current)
	if state.ETag != "" {
		req.Header.Set("If-None-Match", state.ETag)
	}
	resp, err := s.Client.Do(req)
	state.CheckedAt = s.Now()
	state.NextCheck = s.Now().Add(Interval)
	if err != nil {
		_ = s.SaveState(state)
		return Result{}, errors.New("network_unavailable")
	}
	defer resp.Body.Close()
	switch resp.StatusCode {
	case http.StatusNotModified:
	case http.StatusNotFound:
		state.Release, state.ETag = nil, ""
	case http.StatusOK:
		data, err := io.ReadAll(io.LimitReader(resp.Body, (2<<20)+1))
		if err != nil || len(data) > 2<<20 {
			_ = s.SaveState(state)
			return Result{}, errors.New("invalid_release")
		}
		var release Release
		if json.Unmarshal(data, &release) != nil || release.Draft || release.Prerelease {
			_ = s.SaveState(state)
			return Result{}, errors.New("invalid_release")
		}
		if _, err := Compare(release.Tag, release.Tag); err != nil {
			_ = s.SaveState(state)
			return Result{}, errors.New("invalid_release")
		}
		if len(release.Body) > 32000 {
			release.Body = release.Body[:32000]
		}
		if len(release.Name) > 200 {
			release.Name = release.Name[:200]
		}
		if exe, sum, err := Assets(&release); err == nil {
			release.Assets = []Asset{exe, sum}
		} else {
			release.Assets = nil
		}
		state.Release, state.ETag = &release, resp.Header.Get("ETag")
	default:
		if resp.StatusCode == http.StatusForbidden || resp.StatusCode == http.StatusTooManyRequests {
			state.BlockedUntil = s.Now().Add(time.Hour)
			if reset, err := strconv.ParseInt(resp.Header.Get("X-RateLimit-Reset"), 10, 64); err == nil && time.Unix(reset, 0).After(s.Now()) {
				state.BlockedUntil = time.Unix(reset, 0)
			}
			if seconds, err := strconv.Atoi(resp.Header.Get("Retry-After")); err == nil && seconds > 0 {
				state.BlockedUntil = s.Now().Add(time.Duration(seconds) * time.Second)
			}
		}
		if reset, err := strconv.ParseInt(resp.Header.Get("X-RateLimit-Reset"), 10, 64); err == nil && time.Unix(reset, 0).After(state.NextCheck) {
			state.NextCheck = time.Unix(reset, 0)
		}
		_ = s.SaveState(state)
		return Result{}, errors.New("github_unavailable")
	}
	if err := s.SaveState(state); err != nil {
		return Result{}, err
	}
	return s.result(state), nil
}

func (s *Service) Preference(action string) error {
	state := s.ReadState()
	switch action {
	case "later":
		state.SnoozeUntil = s.Now().Add(24 * time.Hour)
	case "ignore":
		if state.Release != nil {
			state.Ignored = state.Release.Tag
		}
	default:
		return errors.New("invalid preference")
	}
	return s.SaveState(state)
}

func Checksum(data []byte) (string, error) {
	var found string
	for _, line := range strings.Split(string(data), "\n") {
		fields := strings.Fields(line)
		if len(fields) != 2 || strings.TrimPrefix(fields[1], "*") != "Hugin.exe" {
			continue
		}
		decoded, err := hex.DecodeString(fields[0])
		if err != nil || len(decoded) != sha256.Size || found != "" {
			return "", errors.New("invalid checksum")
		}
		found = strings.ToLower(fields[0])
	}
	if found == "" {
		return "", errors.New("missing checksum")
	}
	return found, nil
}

func (s *Service) fetch(ctx context.Context, asset Asset, limit int64, dst io.Writer) error {
	req, err := http.NewRequestWithContext(ctx, "GET", asset.URL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "Hugin/"+s.Current)
	resp, err := s.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download HTTP %d", resp.StatusCode)
	}
	n, err := io.Copy(dst, io.LimitReader(resp.Body, limit+1))
	if err != nil {
		return err
	}
	if n != asset.Size || n > limit {
		return errors.New("download size mismatch")
	}
	return nil
}

type Prepared struct {
	Version string `json:"version"`
	SHA256  string `json:"sha256"`
}

type progressWriter struct {
	dst         io.Writer
	done, total int64
	last        time.Time
	notify      func(int64, int64)
}

func (w *progressWriter) Write(p []byte) (int, error) {
	n, err := w.dst.Write(p)
	w.done += int64(n)
	if w.notify != nil && (time.Since(w.last) > 200*time.Millisecond || w.done == w.total) {
		w.last = time.Now()
		w.notify(w.done, w.total)
	}
	return n, err
}

func (s *Service) Prepare(ctx context.Context, notify func(int64, int64)) (Prepared, error) {
	release := s.ReadState().Release
	exe, sum, err := Assets(release)
	if err != nil {
		return Prepared{}, err
	}
	cmp, err := Compare(release.Tag, s.Current)
	if err != nil || cmp <= 0 {
		return Prepared{}, errors.New("no newer release")
	}
	var checksum strings.Builder
	if err := s.fetch(ctx, sum, 16384, &checksum); err != nil {
		return Prepared{}, err
	}
	hash, err := Checksum([]byte(checksum.String()))
	if err != nil {
		return Prepared{}, err
	}
	dir := filepath.Join(s.Dir, "prepared")
	if err := os.MkdirAll(dir, 0700); err != nil {
		return Prepared{}, err
	}
	// Remove incomplete downloads left by a terminated process; the operation lock excludes active writers.
	entries, err := os.ReadDir(dir)
	if err != nil {
		return Prepared{}, err
	}
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasPrefix(entry.Name(), ".download-") {
			if err := os.Remove(filepath.Join(dir, entry.Name())); err != nil {
				return Prepared{}, err
			}
		}
	}
	// A failed new download must never leave a previous manifest authorizing an executable.
	if err := os.Remove(filepath.Join(dir, "manifest.json")); err != nil && !os.IsNotExist(err) {
		return Prepared{}, err
	}
	f, err := os.CreateTemp(dir, ".download-*")
	if err != nil {
		return Prepared{}, err
	}
	temp := f.Name()
	defer os.Remove(temp)
	h := sha256.New()
	w := &progressWriter{dst: io.MultiWriter(f, h), total: exe.Size, notify: notify}
	err = s.fetch(ctx, exe, maxExecutable, w)
	if err == nil {
		err = f.Sync()
	}
	closeErr := f.Close()
	if err != nil {
		return Prepared{}, err
	}
	if closeErr != nil {
		return Prepared{}, closeErr
	}
	if hex.EncodeToString(h.Sum(nil)) != hash {
		return Prepared{}, errors.New("checksum mismatch")
	}
	if err := os.Rename(temp, filepath.Join(dir, "Hugin.exe")); err != nil {
		return Prepared{}, err
	}
	prepared := Prepared{Version: strings.TrimPrefix(release.Tag, "v"), SHA256: hash}
	if err := writeJSON(filepath.Join(dir, "manifest.json"), prepared); err != nil {
		return Prepared{}, err
	}
	return prepared, nil
}

func (s *Service) VerifyPrepared() (Prepared, error) {
	var p Prepared
	data, err := os.ReadFile(filepath.Join(s.Dir, "prepared", "manifest.json"))
	if err != nil {
		return p, err
	}
	if len(data) > 1024 || json.Unmarshal(data, &p) != nil {
		return p, errors.New("invalid prepared manifest")
	}
	if _, err := Compare(p.Version, p.Version); err != nil {
		return p, err
	}
	f, err := os.Open(filepath.Join(s.Dir, "prepared", "Hugin.exe"))
	if err != nil {
		return p, err
	}
	defer f.Close()
	h := sha256.New()
	n, err := io.Copy(h, io.LimitReader(f, maxExecutable+1))
	if err != nil || n == 0 || n > maxExecutable || hex.EncodeToString(h.Sum(nil)) != p.SHA256 {
		return p, errors.New("prepared installer changed")
	}
	return p, nil
}
