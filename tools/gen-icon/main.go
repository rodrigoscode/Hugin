// Command gen-icon draws assets/icon.ico, Hugin's raven, from pixel art: a
// 24px sprite enlarged by whole factors, a redrawn 16px sprite for the
// smallest size, and a hand-written ICO container.
//
// Run from the repo root: go run ./tools/gen-icon
// Preview without touching the icon: go run ./tools/gen-icon -preview <dir>
//
// Then regenerate the Windows resource (keep only the amd64 file):
//
//	goversioninfo -platform-specific=true -o resource_windows_amd64.syso versioninfo.json
package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"os"
	"path/filepath"
	"runtime"
)

var sizes = []int{16, 24, 32, 48, 64, 128, 256}

// palette gives the sprite letters their colors: the outline, four grays for
// the feathers from shadow to highlight, three oranges for the beak and a
// light gray for the feet. '.' is transparent.
var palette = map[byte]color.NRGBA{
	'o': {0x0b, 0x0b, 0x0c, 0xff},
	'd': {0x2c, 0x2c, 0x2f, 0xff},
	'b': {0x40, 0x40, 0x44, 0xff},
	'm': {0x4c, 0x4c, 0x51, 0xff},
	'h': {0x5e, 0x5e, 0x64, 0xff},
	'K': {0xf3, 0xba, 0x35, 0xff},
	'k': {0xe0, 0x9a, 0x1c, 0xff},
	'j': {0xb8, 0x74, 0x16, 0xff},
	'f': {0x8b, 0x8b, 0x93, 0xff},
}

// sprite is the raven perched in profile: heavy beak, folded wing shaded down
// to the tail, and the feet in the bottom row of the belly.
var sprite = []string{
	"........................",
	"........................",
	"........................",
	"............oooo........",
	"..........oohhhhoo......",
	".........ohhbbbbbbo.....",
	".........ohbbbbobboKK...",
	".........obbbbbobboKKKK.",
	".........obbbbbbbbokkkkk",
	".........obbbbbbbdojjj..",
	"......oooobbbbbbbdo.....",
	"....oohhhhhmbbbbbbdo....",
	"...ohmmmmmmmhbbbbbdo....",
	"..ohmmmhmmmmmbbbbbdo....",
	"..ommmmmmmmmddbbbbdo....",
	"..ommmmmmmddbbbbbdo.....",
	".ommmmmdddbbbbbbddo.....",
	"ommmoddbbbbbbbdddo......",
	"obbodbbbbbbbbddddo......",
	"obdoodbbbbbbbdddo.......",
	"odo..odoodddoodo........",
	".o....offdodffo.........",
	"........................",
	"........................",
}

// sprite16 is the same raven redrawn at 16px, where shrinking the 24px
// sprite would blur the eye and the feet away.
var sprite16 = []string{
	"................",
	"................",
	"........oooo....",
	".......ohhhho...",
	"......obbboboKK.",
	"......obbbbbokkk",
	"......obbbbdojj.",
	"...ooohbbbbdo...",
	"..ohmmmmmhbbdo..",
	".ommmmmmddbbdo..",
	".ommmmdddbbbdo..",
	"ommoddbbbbbdo...",
	"obodbbbbbddo....",
	".o.ododdodo.....",
	"....ofddfo......",
	"................",
}

// render draws the icon at side x side: sprite16 below 24px, otherwise the
// 24px sprite enlarged by the largest whole factor that fits, centered.
func render(side int) *image.NRGBA {
	art := sprite
	if side < len(sprite) {
		art = sprite16
	}

	n := len(art)
	scale := side / n
	if scale < 1 {
		scale = 1
	}
	pad := (side - n*scale) / 2

	img := image.NewNRGBA(image.Rect(0, 0, side, side))
	for y, row := range art {
		if len(row) != n {
			panic(fmt.Sprintf("%dpx sprite: row %d has %d pixels", n, y, len(row)))
		}
		for x := 0; x < n; x++ {
			if row[x] == '.' {
				continue
			}
			c, ok := palette[row[x]]
			if !ok {
				panic(fmt.Sprintf("%dpx sprite: unknown color %q at %d,%d", n, row[x], x, y))
			}
			for dy := 0; dy < scale; dy++ {
				for dx := 0; dx < scale; dx++ {
					img.SetNRGBA(pad+x*scale+dx, pad+y*scale+dy, c)
				}
			}
		}
	}
	return img
}

// enlarge scales img by factor with nearest-neighbour sampling, so a 16px
// preview shows its actual pixels.
func enlarge(img *image.NRGBA, factor int) *image.NRGBA {
	bounds := img.Bounds()
	out := image.NewNRGBA(image.Rect(0, 0, bounds.Dx()*factor, bounds.Dy()*factor))
	for y := 0; y < bounds.Dy()*factor; y++ {
		for x := 0; x < bounds.Dx()*factor; x++ {
			out.SetNRGBA(x, y, img.NRGBAAt(x/factor, y/factor))
		}
	}
	return out
}

func encodePNG(img image.Image) []byte {
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		panic(err)
	}
	return buf.Bytes()
}

// writeICO wraps PNG-encoded images in a minimal ICO container: a header, one
// directory entry per image, then the raw PNG bytes back to back. Modern
// Windows accepts PNG entries at every size, so no legacy BMP/DIB path is
// needed.
func writeICO(path string, images map[int][]byte) error {
	header := new(bytes.Buffer)
	binary.Write(header, binary.LittleEndian, uint16(0))
	binary.Write(header, binary.LittleEndian, uint16(1))
	binary.Write(header, binary.LittleEndian, uint16(len(sizes)))

	entries := new(bytes.Buffer)
	body := new(bytes.Buffer)
	offset := uint32(header.Len() + 16*len(sizes))

	for _, side := range sizes {
		data := images[side]

		dim := byte(side)
		if side >= 256 {
			dim = 0
		}

		entries.WriteByte(dim)
		entries.WriteByte(dim)
		entries.WriteByte(0)
		entries.WriteByte(0)
		binary.Write(entries, binary.LittleEndian, uint16(1))
		binary.Write(entries, binary.LittleEndian, uint16(32))
		binary.Write(entries, binary.LittleEndian, uint32(len(data)))
		binary.Write(entries, binary.LittleEndian, offset)

		body.Write(data)
		offset += uint32(len(data))
	}

	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()

	for _, chunk := range [][]byte{header.Bytes(), entries.Bytes(), body.Bytes()} {
		if _, err := out.Write(chunk); err != nil {
			return err
		}
	}
	return nil
}

// repoRoot finds the repository root relative to THIS source file, so the
// tool produces the same result regardless of the working directory it is
// run from.
func repoRoot() string {
	_, file, _, _ := runtime.Caller(0)

	return filepath.Dir(filepath.Dir(filepath.Dir(file)))
}

// preview writes the icon at a few sizes (plus the small ones enlarged, pixel
// for pixel) into dir, without touching assets/icon.ico.
func preview(dir string) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		panic(err)
	}
	for _, side := range []int{256, 64, 48, 32, 24, 16} {
		img := render(side)
		name := filepath.Join(dir, fmt.Sprintf("icon-%d.png", side))
		if err := os.WriteFile(name, encodePNG(img), 0o644); err != nil {
			panic(err)
		}
		if side <= 32 {
			big := filepath.Join(dir, fmt.Sprintf("icon-%d-x8.png", side))
			if err := os.WriteFile(big, encodePNG(enlarge(img, 8)), 0o644); err != nil {
				panic(err)
			}
		}
		fmt.Println("  preview:", name)
	}
}

func main() {
	if len(os.Args) == 3 && os.Args[1] == "-preview" {
		preview(os.Args[2])
		return
	}

	dest := filepath.Join(repoRoot(), "assets", "icon.ico")
	if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
		panic(err)
	}

	images := map[int][]byte{}
	for _, side := range sizes {
		images[side] = encodePNG(render(side))
		fmt.Printf("  %dx%d ok\n", side, side)
	}

	if err := writeICO(dest, images); err != nil {
		panic(err)
	}

	info, err := os.Stat(dest)
	if err != nil {
		panic(err)
	}
	fmt.Printf("icon: %s (%d bytes)\n", dest, info.Size())
}
