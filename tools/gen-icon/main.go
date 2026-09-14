// Command gen-icon draws assets/icon.ico, Hugin's raven, with signed distance
// fields, 4x supersampling and a hand-written ICO container.
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
	"math"
	"os"
	"path/filepath"
	"runtime"
)

const supersample = 4

var sizes = []int{16, 24, 32, 48, 64, 128, 256}

type rgb struct{ r, g, b float64 }

var (
	blurpleTop    = rgb{0x5B, 0x68, 0xF4}
	blurpleBottom = rgb{0x3D, 0x46, 0xC0}
	white         = rgb{0xFF, 0xFF, 0xFF}
)

func mix(a, b rgb, t float64) rgb {
	return rgb{a.r + (b.r-a.r)*t, a.g + (b.g-a.g)*t, a.b + (b.b-a.b)*t}
}

// roundedBox is the signed distance to a rounded rectangle (negative inside).
func roundedBox(px, py, cx, cy, halfW, halfH, radius float64) float64 {
	dx := math.Abs(px-cx) - (halfW - radius)
	dy := math.Abs(py-cy) - (halfH - radius)
	outside := math.Hypot(math.Max(dx, 0), math.Max(dy, 0))
	inside := math.Min(math.Max(dx, dy), 0)
	return outside + inside - radius
}

// coverage turns a signed distance into alpha; softness is one fine-grid
// pixel wide.
func coverage(distance, softness float64) float64 {
	return math.Min(1, math.Max(0, 0.5-distance/softness))
}

// segmentDistance is the distance from a point to the nearest point on the
// line segment (ax,ay)-(bx,by) -- unsigned, since a line has no inside.
func segmentDistance(px, py, ax, ay, bx, by float64) float64 {
	dx, dy := bx-ax, by-ay
	lengthSq := dx*dx + dy*dy

	t := 0.0
	if lengthSq > 0 {
		t = ((px-ax)*dx + (py-ay)*dy) / lengthSq
		t = math.Max(0, math.Min(1, t))
	}

	nearX, nearY := ax+t*dx, ay+t*dy
	return math.Hypot(px-nearX, py-nearY)
}

// ellipseDistance approximates the signed distance to an ellipse whose major
// axis points along angle (radians, y down). Exact enough for a one-pixel
// antialiasing band.
func ellipseDistance(px, py, cx, cy, rx, ry, angle float64) float64 {
	dx, dy := px-cx, py-cy
	c, s := math.Cos(angle), math.Sin(angle)
	x := dx*c + dy*s
	y := -dx*s + dy*c
	return (math.Hypot(x/rx, y/ry) - 1) * math.Min(rx, ry)
}

// polygonDistance is the signed distance to a simple polygon (negative inside).
func polygonDistance(px, py float64, points [][2]float64) float64 {
	distance := math.Inf(1)
	inside := false
	for i, j := 0, len(points)-1; i < len(points); j, i = i, i+1 {
		ax, ay := points[j][0], points[j][1]
		bx, by := points[i][0], points[i][1]
		distance = math.Min(distance, segmentDistance(px, py, ax, ay, bx, by))
		if (ay > py) != (by > py) && px < (bx-ax)*(py-ay)/(by-ay)+ax {
			inside = !inside
		}
	}
	if inside {
		return -distance
	}
	return distance
}

// The raven's polygons on a 256px canvas: perched in profile, with the heavy
// beak, shaggy throat and wedge tail that set a raven apart from other birds.
var (
	beak    = [][2]float64{{178, 68}, {236, 96}, {238, 103}, {186, 116}}
	hackles = [][2]float64{{150, 104}, {188, 112}, {176, 124}, {183, 135}, {165, 130}, {160, 145}, {144, 128}}
	tail    = [][2]float64{{80, 154}, {20, 194}, {28, 214}, {104, 180}}
)

const (
	// ravenLift moves the whole drawing up so it sits centered in the square.
	ravenLift        = 12.0
	eyeX, eyeY, eyeR = 174.0, 86.0, 6.0
)

// ravenDistance is the signed distance to the whole silhouette, in canvas units.
func ravenDistance(x, y float64) float64 {
	head := ellipseDistance(x, y, 168, 92, 32, 26, -10*math.Pi/180)
	neck := segmentDistance(x, y, 140, 126, 164, 100) - 26
	body := ellipseDistance(x, y, 116, 146, 76, 44, -20*math.Pi/180)
	legs := math.Min(
		segmentDistance(x, y, 116, 180, 108, 212)-7,
		segmentDistance(x, y, 138, 176, 134, 212)-7,
	)
	feet := math.Min(
		segmentDistance(x, y, 98, 213, 120, 213)-5,
		segmentDistance(x, y, 124, 213, 148, 213)-5,
	)

	d := math.Min(head, neck)
	d = math.Min(d, body)
	d = math.Min(d, polygonDistance(x, y, beak))
	d = math.Min(d, polygonDistance(x, y, hackles))
	d = math.Min(d, polygonDistance(x, y, tail))
	d = math.Min(d, legs)
	return math.Min(d, feet)
}

type pixel struct{ r, g, b, a float64 }

// over composites color c at alpha on top of base (straight, not premultiplied).
func over(base pixel, c rgb, alpha float64) pixel {
	na := alpha + base.a*(1-alpha)
	if na <= 0 {
		return pixel{}
	}
	return pixel{
		r: (c.r*alpha + base.r*base.a*(1-alpha)) / na,
		g: (c.g*alpha + base.g*base.a*(1-alpha)) / na,
		b: (c.b*alpha + base.b*base.a*(1-alpha)) / na,
		a: na,
	}
}

// draw renders one side x side icon (before downsampling) at supersample x
// the resolution: the same rounded blurple square as before, with the white
// raven on it and the eye cut back to the background.
func draw(side int) [][]pixel {
	n := side * supersample
	u := float64(n) / 256.0
	soft := 1.0
	center := float64(n) / 2.0

	grid := make([][]pixel, n)
	for y := 0; y < n; y++ {
		row := make([]pixel, n)
		py := float64(y) + 0.5
		background := mix(blurpleTop, blurpleBottom, float64(y)/math.Max(1, float64(n-1)))
		for x := 0; x < n; x++ {
			px := float64(x) + 0.5
			p := pixel{}

			dBg := roundedBox(px, py, center, center, float64(n)/2, float64(n)/2, 56*u)
			if aBg := coverage(dBg, soft); aBg > 0 {
				p = over(p, background, aBg)
			}

			ux, uy := px/u, py/u+ravenLift
			if aRaven := coverage(ravenDistance(ux, uy)*u, soft); aRaven > 0 {
				p = over(p, white, aRaven)
			}
			if aEye := coverage((math.Hypot(ux-eyeX, uy-eyeY)-eyeR)*u, soft); aEye > 0 {
				p = over(p, background, aEye)
			}

			row[x] = p
		}
		grid[y] = row
	}
	return grid
}

// downsample averages each supersample x supersample block; this is where
// the antialiasing comes from.
func downsample(grid [][]pixel, side int) *image.NRGBA {
	img := image.NewNRGBA(image.Rect(0, 0, side, side))
	total := float64(supersample * supersample)

	for y := 0; y < side; y++ {
		for x := 0; x < side; x++ {
			var r, g, b, a float64
			for sy := 0; sy < supersample; sy++ {
				for sx := 0; sx < supersample; sx++ {
					p := grid[y*supersample+sy][x*supersample+sx]
					r += p.r * p.a
					g += p.g * p.a
					b += p.b * p.a
					a += p.a
				}
			}

			var out color.NRGBA
			if a > 0 {
				out = color.NRGBA{
					R: uint8(math.Round(r / a)),
					G: uint8(math.Round(g / a)),
					B: uint8(math.Round(b / a)),
					A: uint8(math.Round(255 * a / total)),
				}
			}
			img.SetNRGBA(x, y, out)
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

// preview writes the drawing at a few sizes (plus the small ones enlarged,
// pixel for pixel) into dir, without touching assets/icon.ico.
func preview(dir string) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		panic(err)
	}
	for _, side := range []int{256, 64, 32, 24, 16} {
		img := downsample(draw(side), side)
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
		images[side] = encodePNG(downsample(draw(side), side))
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
