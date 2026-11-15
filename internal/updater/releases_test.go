package updater

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

type transport func(*http.Request) (*http.Response, error)

func (f transport) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
func response(code int, body string) *http.Response {
	return &http.Response{StatusCode: code, Header: make(http.Header), Body: io.NopCloser(strings.NewReader(body))}
}
func releaseFixture() *Release {
	return &Release{Tag: "v1.0.11", Name: "New release", URL: "https://github.com/" + Repository + "/releases/tag/v1.0.11", Assets: []Asset{
		{Name: "Hugin.exe", URL: "https://github.com/" + Repository + "/releases/download/v1.0.11/Hugin.exe", Size: 4},
		{Name: "checksums.txt", URL: "https://github.com/" + Repository + "/releases/download/v1.0.11/checksums.txt", Size: 76},
	}}
}

func TestStableVersionOrdering(t *testing.T) {
	for _, pair := range [][2]string{{"1.0.10", "1.0.9"}, {"v2.0.0", "1.99.99"}, {"1.1.0", "1.0.99"}} {
		if cmp, err := Compare(pair[0], pair[1]); err != nil || cmp != 1 {
			t.Fatalf("compare %v: %d %v", pair, cmp, err)
		}
	}
	for _, invalid := range []string{"1.0.11-beta.1", "1.0", "1.01.2", "1.0.999999999999999999999999", "https://example.com"} {
		if _, err := Compare(invalid, "1.0.10"); err == nil {
			t.Fatalf("accepted %q", invalid)
		}
	}
}

func TestCheckCacheETagAndPreferences(t *testing.T) {
	s := New(t.TempDir(), "1.0.10")
	now := time.Now()
	s.Now = func() time.Time { return now }
	calls := 0
	s.Client.Transport = transport(func(r *http.Request) (*http.Response, error) {
		calls++
		if r.URL.Host != "api.github.com" || r.Header.Get("Authorization") != "" {
			t.Fatal("unexpected request")
		}
		if calls == 1 {
			data, _ := json.Marshal(releaseFixture())
			resp := response(200, string(data))
			resp.Header.Set("ETag", `"release-1"`)
			return resp, nil
		}
		if r.Header.Get("If-None-Match") != `"release-1"` {
			t.Fatal("missing ETag")
		}
		return response(304, ""), nil
	})
	first, err := s.Check(context.Background(), false)
	if err != nil || !first.Available || !first.Notify {
		t.Fatalf("%+v %v", first, err)
	}
	if _, err := s.Check(context.Background(), false); err != nil || calls != 1 {
		t.Fatal("cache not used", err, calls)
	}
	if err := s.Preference("later"); err != nil {
		t.Fatal(err)
	}
	now = now.Add(7 * time.Hour)
	second, err := s.Check(context.Background(), false)
	if err != nil || second.Notify || !second.Available || calls != 2 {
		t.Fatalf("%+v %v %d", second, err, calls)
	}
	if err := s.Preference("ignore"); err != nil {
		t.Fatal(err)
	}
	now = now.Add(48 * time.Hour)
	third, err := s.Check(context.Background(), false)
	if err != nil || third.Notify {
		t.Fatal("ignored release notified", err)
	}
}

func TestRateLimitAlsoBlocksManualChecks(t *testing.T) {
	s := New(t.TempDir(), "1.0.10")
	calls := 0
	s.Client.Transport = transport(func(*http.Request) (*http.Response, error) {
		calls++
		r := response(429, "")
		r.Header.Set("Retry-After", "3600")
		return r, nil
	})
	if _, err := s.Check(context.Background(), true); err == nil {
		t.Fatal("rate limit accepted")
	}
	if _, err := s.Check(context.Background(), true); err == nil || calls != 1 {
		t.Fatal("manual check ignored backoff")
	}
}

func TestUnsafeOrIncompleteReleasesCannotBeInstalled(t *testing.T) {
	for _, mutate := range []func(*Release){
		func(r *Release) { r.Prerelease = true }, func(r *Release) { r.Draft = true }, func(r *Release) { r.Assets = r.Assets[:1] },
		func(r *Release) { r.Assets[0].URL = "https://example.com/Hugin.exe" }, func(r *Release) {
			r.Assets[0].URL = "https://github.com/other/repo/releases/download/v1.0.11/Hugin.exe"
		},
		func(r *Release) { r.Tag = "v1.0.11-beta" }, func(r *Release) { r.URL = "https://example.com" },
	} {
		r := releaseFixture()
		mutate(r)
		if _, _, err := Assets(r); err == nil {
			t.Fatal("accepted unsafe release", r)
		}
	}
}

func TestDownloadVerificationAndTampering(t *testing.T) {
	for _, corrupt := range []bool{false, true} {
		t.Run(map[bool]string{false: "verified", true: "corrupted"}[corrupt], func(t *testing.T) {
			s := New(t.TempDir(), "1.0.10")
			r := releaseFixture()
			h := sha256.Sum256([]byte("good"))
			checksum := hex.EncodeToString(h[:]) + "  Hugin.exe\n"
			r.Assets[1].Size = int64(len(checksum))
			if err := s.SaveState(State{Release: r, NextCheck: time.Now().Add(Interval)}); err != nil {
				t.Fatal(err)
			}
			s.Client.Transport = transport(func(req *http.Request) (*http.Response, error) {
				if strings.HasSuffix(req.URL.Path, "checksums.txt") {
					return response(200, checksum), nil
				}
				body := "good"
				if corrupt {
					body = "evil"
				}
				return response(200, body), nil
			})
			progress := int64(0)
			_, err := s.Prepare(context.Background(), func(done, total int64) {
				progress = done
				if total != 4 {
					t.Fatal("wrong progress total")
				}
			})
			if corrupt {
				if err == nil {
					t.Fatal("checksum mismatch accepted")
				}
				if _, err := s.VerifyPrepared(); err == nil {
					t.Fatal("failed download authorized")
				}
				return
			}
			if err != nil || progress != 4 {
				t.Fatal(err, progress)
			}
			if p, err := s.VerifyPrepared(); err != nil || p.Version != "1.0.11" {
				t.Fatal(p, err)
			}
			resumed, err := New(s.Dir, "1.0.10").Check(context.Background(), false)
			if err != nil || resumed.Prepared == nil || resumed.Prepared.Version != "1.0.11" {
				t.Fatal("verified preparation was not resumed after restart", resumed, err)
			}
			if err := os.WriteFile(filepath.Join(s.Dir, "prepared", "Hugin.exe"), []byte("evil"), 0600); err != nil {
				t.Fatal(err)
			}
			if _, err := s.VerifyPrepared(); err == nil {
				t.Fatal("tampered staged executable accepted")
			}
		})
	}
}

func TestChecksumParserRejectsAmbiguity(t *testing.T) {
	h := strings.Repeat("a", 64)
	for _, bad := range []string{"", h + "  other.exe", "not-a-hash  Hugin.exe", h + "  Hugin.exe\n" + h + "  Hugin.exe"} {
		if _, err := Checksum([]byte(bad)); err == nil {
			t.Fatal("accepted bad checksum")
		}
	}
}
