package injector

import (
	"crypto/sha256"
	"encoding/hex"
)

// Payload is the four files injected into Discord's app.asar folder plus
// the renderer bundle that ships alongside it in the data directory.
type Payload struct {
	MainJS        []byte
	PreloadJS     []byte
	ViewPreloadJS []byte
	RendererJS    []byte
}

type Sounds map[string][]byte

type Fonts map[string][]byte

// HashPayload fingerprints the payload so an unchanged install is skipped.
// The entry order matches the original installer's, keeping its hashes valid.
func HashPayload(p Payload) string {
	h := sha256.New()
	for _, entry := range []struct {
		name string
		data []byte
	}{
		{"main.js", p.MainJS},
		{"preload.js", p.PreloadJS},
		{"renderer.js", p.RendererJS},
		{"viewPreload.js", p.ViewPreloadJS},
	} {
		h.Write([]byte(entry.name))
		h.Write([]byte(" "))
		h.Write(entry.data)
	}
	return hex.EncodeToString(h.Sum(nil))[:16]
}
