// Command bundle joins the payload's source modules into the files the
// installer embeds: dist/payload/renderer.js and dist/payload/main.js.
//
// Each source tree lists its modules, in load order, in modules.txt. The
// modules share one scope, so the order matters for anything that runs at
// load time.
//
// Run from the repo root: go run ./tools/bundle
package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type target struct {
	manifest string
	output   string
	header   string
	footer   string
}

var targets = []target{
	{
		manifest: "src/renderer/modules.txt",
		output:   "dist/payload/renderer.js",
		header: "(() => {\n" +
			"\"use strict\";\n\n" +
			"const native = globalThis.HuginNative;\n" +
			"if (!native) return;\n" +
			"if (globalThis.__HUGIN__) return;\n\n",
		footer: "})();\n",
	},
	{
		manifest: "src/main/modules.txt",
		output:   "dist/payload/main.js",
	},
}

func modules(manifest string) ([]string, error) {
	file, err := os.Open(manifest)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var paths []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line != "" {
			paths = append(paths, filepath.Join(filepath.Dir(manifest), filepath.FromSlash(line)))
		}
	}
	return paths, scanner.Err()
}

func build(t target) error {
	paths, err := modules(t.manifest)
	if err != nil {
		return err
	}

	parts := make([]string, 0, len(paths))
	for _, path := range paths {
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		parts = append(parts, string(data))
	}

	bundle := t.header + strings.Join(parts, "\n") + t.footer
	if err := os.MkdirAll(filepath.Dir(t.output), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(t.output, []byte(bundle), 0o644); err != nil {
		return err
	}
	fmt.Printf("  %s  (%d modules, %d bytes)\n", t.output, len(paths), len(bundle))
	return nil
}

func main() {
	for _, t := range targets {
		if err := build(t); err != nil {
			fmt.Fprintln(os.Stderr, "bundle:", err)
			os.Exit(1)
		}
	}
}
