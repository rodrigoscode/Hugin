// Package discordinstall finds installed Discord clients and controls the
// running process (start/stop). Patching lives in internal/injector.
package discordinstall

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"hugin/internal/branches"
)

// Install is one discovered Discord installation: a branch, at a specific
// version, with the paths that matter for patching.
type Install struct {
	Branch           branches.Branch
	Base             string
	Version          []int
	VersionText      string
	AppDirectory     string
	Resources        string
	UpdateExecutable string
	OlderVersions    []Install
}

var versionDirPattern = regexp.MustCompile(`^app-(\d+(?:\.\d+)*)$`)

// CompareVersions returns <0, 0 or >0 the way sort expects, comparing
// dotted version numbers component by component.
func CompareVersions(a, b []int) int {
	max := len(a)
	if len(b) > max {
		max = len(b)
	}
	for i := 0; i < max; i++ {
		var av, bv int
		if i < len(a) {
			av = a[i]
		}
		if i < len(b) {
			bv = b[i]
		}
		if av != bv {
			return av - bv
		}
	}
	return 0
}

func searchRoots() []string {
	var roots []string
	for _, env := range []string{"LOCALAPPDATA", "ProgramFiles", "ProgramFiles(x86)"} {
		if v := os.Getenv(env); v != "" {
			roots = append(roots, v)
		}
	}
	return roots
}

func parseVersion(name string) []int {
	m := versionDirPattern.FindStringSubmatch(name)
	if m == nil {
		return nil
	}
	parts := strings.Split(m[1], ".")
	version := make([]int, len(parts))
	for i, p := range parts {
		n, err := strconv.Atoi(p)
		if err != nil {
			return nil
		}
		version[i] = n
	}
	return version
}

func versionText(v []int) string {
	parts := make([]string, len(v))
	for i, n := range v {
		parts[i] = strconv.Itoa(n)
	}
	return strings.Join(parts, ".")
}

// versionsIn lists installed versions of a branch under base, newest first.
// A folder without a `resources` subdirectory is skipped: the updater leaves
// skeletons behind after an upgrade.
func versionsIn(base string, branch branches.Branch) []Install {
	entries, err := os.ReadDir(base)
	if err != nil {
		return nil
	}

	var installs []Install
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		version := parseVersion(entry.Name())
		if version == nil {
			continue
		}

		appDir := filepath.Join(base, entry.Name())
		resources := filepath.Join(appDir, "resources")
		if _, err := os.Stat(resources); err != nil {
			continue
		}

		if _, err := os.Stat(filepath.Join(appDir, ".dead")); err == nil {
			continue
		}

		installs = append(installs, Install{
			Branch:           branch,
			Base:             base,
			Version:          version,
			VersionText:      versionText(version),
			AppDirectory:     appDir,
			Resources:        resources,
			UpdateExecutable: filepath.Join(base, "Update.exe"),
		})
	}

	sort.Slice(installs, func(i, j int) bool {
		return CompareVersions(installs[i].Version, installs[j].Version) > 0
	})
	return installs
}

// hasApp reports whether resources holds Discord's app: the original
// app.asar, or our patch folder with the _app.asar backup beside it.
func hasApp(resources string) bool {
	for _, name := range []string{"app.asar", "_app.asar"} {
		if _, err := os.Stat(filepath.Join(resources, name)); err == nil {
			return true
		}
	}
	return false
}

// FindInstalls returns one entry per branch found: the newest version, with
// any older versions attached for informational display.
//
// Only one entry per branch: an auto-update creates a brand new
// app-<version> folder, so a previous patch never survives one -- it just
// sits in a folder nobody launches any more.
func FindInstalls() []Install {
	var found []Install

	for _, branch := range branches.All {
		for _, root := range searchRoots() {
			base := filepath.Join(root, branch.Dir)
			if _, err := os.Stat(base); err != nil {
				continue
			}

			versions := versionsIn(base, branch)
			if len(versions) == 0 {
				continue
			}

			chosen := 0
			for i, v := range versions {
				if hasApp(v.Resources) {
					chosen = i
					break
				}
			}

			newest := versions[chosen]
			for i, v := range versions {
				if i != chosen {
					newest.OlderVersions = append(newest.OlderVersions, v)
				}
			}
			found = append(found, newest)
			break
		}
	}

	return found
}
