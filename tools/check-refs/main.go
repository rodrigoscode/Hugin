// Command check-refs flags calls to functions declared nowhere in the same
// JavaScript file. The payload has no compiler, so a deleted function would
// otherwise only fail at runtime. It is a heuristic: declarations are read
// from the raw source, calls from a copy without comments and strings.
//
// Usage: go run ./tools/check-refs <file.js> [...]
package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

// globals covers browser/Node/language identifiers that legitimately appear
// as `name(` without being declared in the file.
var globals = map[string]bool{
	"require": true, "setTimeout": true, "setInterval": true, "clearTimeout": true, "clearInterval": true,
	"fetch": true, "atob": true, "btoa": true, "parseInt": true, "parseFloat": true, "isNaN": true, "isFinite": true,
	"encodeURIComponent": true, "decodeURIComponent": true, "encodeURI": true, "decodeURI": true,
	"structuredClone": true, "queueMicrotask": true, "requestAnimationFrame": true, "cancelAnimationFrame": true,
	"addEventListener": true, "removeEventListener": true, "getComputedStyle": true, "matchMedia": true,
	"eval": true, "alert": true, "confirm": true, "prompt": true,
	"if": true, "for": true, "while": true, "switch": true, "catch": true, "return": true, "typeof": true,
	"function": true, "async": true, "await": true, "yield": true, "of": true, "in": true, "do": true, "else": true,
	"new": true, "delete": true, "void": true, "constructor": true, "super": true, "this": true,
	"get": true, "set": true, "then": true,
}

// regexOpeners reports whether a `/` right after prev starts a regex literal;
// a division only ever follows a value.
func regexOpeners(prev byte) bool {
	switch prev {
	case 0, '(', '[', '{', ',', ';', ':', '=', '!', '&', '|', '?', '+', '-', '~', '^', '%', '<', '>', '*', '\n':
		return true
	}
	return false
}

// stripToCode removes comments, regex literals, and string contents,
// keeping only the interpolated ${...} portions of template literals --
// which are real code. Line breaks are preserved everywhere so reported
// line numbers stay correct.
func stripToCode(src string) string {
	var out strings.Builder
	i, n := 0, len(src)
	var lastSignificant byte

	isBlank := func(b byte) bool { return b == ' ' || b == '\n' || b == '\t' || b == '\r' }

	write := func(s string) {
		out.WriteString(s)
		for j := len(s) - 1; j >= 0; j-- {
			if !isBlank(s[j]) {
				lastSignificant = s[j]
				return
			}
		}
	}

	for i < n {
		c := src[i]

		if c == '/' && i+1 < n && src[i+1] == '/' {
			for i < n && src[i] != '\n' {
				i++
			}
			continue
		}

		if c == '/' && i+1 < n && src[i+1] == '*' {
			i += 2
			for i+1 < n && !(src[i] == '*' && src[i+1] == '/') {

				if src[i] == '\n' {
					out.WriteByte('\n')
				} else {
					out.WriteByte(' ')
				}
				i++
			}
			i += 2
			continue
		}

		if c == '/' && regexOpeners(lastSignificant) {
			j := i + 1
			closed := false
			for j < n && src[j] != '\n' {
				if src[j] == '\\' {
					j += 2
					continue
				}
				if src[j] == '[' {
					for j < n && src[j] != ']' && src[j] != '\n' {
						j++
					}
				}
				if src[j] == '/' {
					closed = true
					j++
					break
				}
				j++
			}
			if closed {
				for j < n && (src[j] >= 'a' && src[j] <= 'z') {
					j++
				}
				i = j
				write(" ")
				continue
			}

		}

		if c == '"' || c == '\'' {
			quote := c
			i++
			for i < n && src[i] != quote {
				if src[i] == '\\' {
					i++
				}
				i++
			}
			i++
			write(`""`)
			continue
		}

		if c == '`' {
			i++
			for i < n {
				if src[i] == '\\' {
					i += 2
					continue
				}
				if src[i] == '`' {
					i++
					break
				}
				if src[i] == '\n' {
					out.WriteByte('\n')
					i++
					continue
				}
				if src[i] == '$' && i+1 < n && src[i+1] == '{' {
					i += 2
					depth := 1
					start := i
					for i < n {
						if src[i] == '{' {
							depth++
						} else if src[i] == '}' {
							depth--
							if depth == 0 {
								break
							}
						}
						i++
					}
					write(" " + stripToCode(src[start:i]) + " ")
					i++
					continue
				}

				out.WriteByte(' ')
				i++
			}
			continue
		}

		out.WriteByte(c)
		if !isBlank(c) {
			lastSignificant = c
		}
		i++
	}

	return out.String()
}

var declarationPatterns = []*regexp.Regexp{
	regexp.MustCompile(`\bfunction\s*\*?\s*([A-Za-z_$][\w$]*)`),
	regexp.MustCompile(`\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)`),
	regexp.MustCompile(`\bclass\s+([A-Za-z_$][\w$]*)`),
	regexp.MustCompile(`\b(?:const|let|var)\s*\{([^}]*)\}`),
	regexp.MustCompile(`\(([^)]*)\)\s*=>`),
	regexp.MustCompile(`\bfunction\s*[A-Za-z_$\w]*\s*\(([^)]*)\)`),
	regexp.MustCompile(`\bcatch\s*\(([^)]*)\)`),
	regexp.MustCompile(`\bfor\s*\(\s*(?:const|let|var)\s+([^;)]*)`),
	regexp.MustCompile(`(?m)^\s*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{`),
}

var splitPattern = regexp.MustCompile(`[,\s:={}\[\]().]+`)

func declaredNames(src string) map[string]bool {
	names := map[string]bool{}
	for _, pattern := range declarationPatterns {
		for _, match := range pattern.FindAllStringSubmatch(src, -1) {
			for _, part := range splitPattern.Split(match[1], -1) {
				name := strings.TrimPrefix(strings.TrimSpace(part), "...")
				if name != "" {
					names[name] = true
				}
			}
		}
	}
	return names
}

var callPattern = regexp.MustCompile(`(^|[^.?\w$])([a-z][\w$]*)\s*\(`)

type call struct {
	name string
	line int
}

func calls(codeOnly string) []call {
	var found []call
	seen := map[string]bool{}

	for i, line := range strings.Split(codeOnly, "\n") {
		for _, match := range callPattern.FindAllStringSubmatch(line, -1) {
			name := match[2]
			if seen[name] {
				continue
			}
			seen[name] = true
			found = append(found, call{name: name, line: i + 1})
		}
	}
	return found
}

func checkFile(path string) []string {
	raw, err := os.ReadFile(path)
	if err != nil {
		return []string{fmt.Sprintf("%s: %v", path, err)}
	}

	source := string(raw)
	declared := declaredNames(source)
	code := stripToCode(source)
	rawLines := strings.Split(source, "\n")

	var problems []string
	for _, c := range calls(code) {
		if declared[c.name] || globals[c.name] {
			continue
		}

		snippet := ""
		if c.line-1 < len(rawLines) {
			snippet = strings.TrimSpace(rawLines[c.line-1])
		}
		if len(snippet) > 80 {
			snippet = snippet[:80] + "..."
		}
		problems = append(problems, fmt.Sprintf("  %s:%d  call to %q with no declaration -- %s", path, c.line, c.name, snippet))
	}
	return problems
}

func main() {
	files := os.Args[1:]
	if len(files) == 0 {
		fmt.Fprintln(os.Stderr, "usage: go run ./tools/check-refs <file.js> [...]")
		os.Exit(1)
	}

	var problems []string
	for _, path := range files {
		problems = append(problems, checkFile(path)...)
	}

	if len(problems) > 0 {
		for _, p := range problems {
			fmt.Fprintln(os.Stderr, p)
		}
		fmt.Fprintf(os.Stderr, "\n%d suspicious reference(s).\n", len(problems))
		os.Exit(1)
	}

	fmt.Println("references ok")
}
