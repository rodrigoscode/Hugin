package main

import (
	_ "embed"

	"hugin/internal/injector"
)

//go:embed dist/payload/main.js
var payloadMainJS []byte

//go:embed src/preload/preload.js
var payloadPreloadJS []byte

//go:embed src/preload/view-preload.js
var payloadViewPreloadJS []byte

//go:embed dist/payload/renderer.js
var payloadRendererJS []byte

//go:embed assets/sounds/stream-started.mp3
var soundStreamStarted []byte

//go:embed assets/sounds/stream-ended.mp3
var soundStreamEnded []byte

//go:embed assets/sounds/stream-user-joined.mp3
var soundUserJoined []byte

//go:embed assets/sounds/stream-user-lefted.mp3
var soundUserLefted []byte

//go:embed assets/fonts/ggsans-Normal.woff2
var fontGgSansNormal []byte

//go:embed assets/fonts/ggsans-Medium.woff2
var fontGgSansMedium []byte

//go:embed assets/fonts/ggsans-SemiBold.woff2
var fontGgSansSemiBold []byte

//go:embed assets/fonts/ggsans-Bold.woff2
var fontGgSansBold []byte

//go:embed assets/fonts/ggsansmono-Normal.woff2
var fontGgSansMonoNormal []byte

//go:embed assets/fonts/ggsansmono-Bold.woff2
var fontGgSansMonoBold []byte

// loadPayload returns the JavaScript injected into Discord. dist/payload is
// generated from src/main and src/renderer by tools/bundle, which build.ps1
// runs before compiling.
func loadPayload() injector.Payload {
	return injector.Payload{
		MainJS:        payloadMainJS,
		PreloadJS:     payloadPreloadJS,
		ViewPreloadJS: payloadViewPreloadJS,
		RendererJS:    payloadRendererJS,
	}
}

func loadSounds() injector.Sounds {
	return injector.Sounds{
		"stream-started.mp3":     soundStreamStarted,
		"stream-ended.mp3":       soundStreamEnded,
		"stream-user-joined.mp3": soundUserJoined,
		"stream-user-lefted.mp3": soundUserLefted,
	}
}

func loadFonts() injector.Fonts {
	return injector.Fonts{
		"ggsans-Normal.woff2":     fontGgSansNormal,
		"ggsans-Medium.woff2":     fontGgSansMedium,
		"ggsans-SemiBold.woff2":   fontGgSansSemiBold,
		"ggsans-Bold.woff2":       fontGgSansBold,
		"ggsansmono-Normal.woff2": fontGgSansMonoNormal,
		"ggsansmono-Bold.woff2":   fontGgSansMonoBold,
	}
}
