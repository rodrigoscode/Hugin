// Package config defines the on-disk configuration shared with the injected
// payload (config.json, read by main.js and forwarded to the renderer).
package config

import (
	"encoding/json"
	"os"
	"path/filepath"

	"hugin/internal/paths"
)

type Config struct {
	VdoBase string `json:"vdoBase"`
	Room    string `json:"room"`
	// RoomSecret must match between friends: it is what stops someone who
	// learns the channel id from guessing the room.
	RoomSecret string `json:"roomSecret"`
	Password   string `json:"password"`
	Quality    string `json:"quality"`
	Bitrate    string `json:"bitrate"`
	Framerate  string `json:"framerate"`

	CaptureAudio    bool   `json:"captureAudio"`
	ExtraPushParams string `json:"extraPushParams"`
	ExtraViewParams string `json:"extraViewParams"`

	AutoWatch          bool `json:"autoWatch"`
	ReplaceShareButton bool `json:"replaceShareButton"`
	HijackShareButton  bool `json:"hijackShareButton"`
	// KeepShareModalOpen holds the picker open when a source is clicked, for
	// working on the modal itself instead of broadcasting.
	KeepShareModalOpen bool `json:"keepShareModalOpen"`
	// UseNativePicker sends the screen button to Discord's own picker instead
	// of ours; the P2P flow is what our picker feeds.
	UseNativePicker   bool `json:"useNativePicker"`
	EnableWebpackHook bool `json:"enableWebpackHook"`
	ObserveNetwork    bool `json:"observeNetwork"`

	// FetchOwnProfile and FetchProfiles are requests the mod makes to
	// Discord's API using the account's own token, which Discord's terms
	// classify as self-botting. Off by choice would mean falling back to
	// weaker, DOM-derived identity.
	FetchOwnProfile bool `json:"fetchOwnProfile"`
	FetchProfiles   bool `json:"fetchProfiles"`

	PlaySounds bool    `json:"playSounds"`
	SoundStart string  `json:"soundStart"`
	SoundStop  string  `json:"soundStop"`
	UIScale    float64 `json:"uiScale"`

	// ConfigVersion marks which default migrations a config.json has been
	// through; see Read.
	ConfigVersion int `json:"configVersion"`
}

// currentConfigVersion is bumped whenever an existing config.json must pick
// up a changed default on the next install.
//
//	2: replaceShareButton defaults to true -- installs written with the old
//	   false default showed Discord's own share button instead of ours.
const currentConfigVersion = 2

// Default returns the config the payload falls back to when config.json is
// absent or missing a field. Keep field-for-field in sync with the defaults
// renderer.js assumes when a key is undefined.
func Default() Config {
	return Config{
		VdoBase:            "https://vdo.ninja",
		CaptureAudio:       true,
		AutoWatch:          true,
		ReplaceShareButton: true,
		HijackShareButton:  true,
		EnableWebpackHook:  true,
		ObserveNetwork:     true,
		FetchOwnProfile:    true,
		FetchProfiles:      true,
		PlaySounds:         true,
		UIScale:            1.1,
		ConfigVersion:      currentConfigVersion,
	}
}

// Read loads config.json, merging it on top of Default() so a config file
// missing newer keys still yields sane values -- the same semantics as
// {...DEFAULT_CONFIG, ...partial} in the TypeScript version.
func Read() Config {
	cfg := Default()

	data, err := os.ReadFile(filepath.Join(paths.DataDirectory(), paths.ConfigFile))
	if err != nil {
		return cfg
	}

	cfg.ConfigVersion = 0
	_ = json.Unmarshal(data, &cfg)

	if cfg.ConfigVersion < 2 {
		cfg.ReplaceShareButton = true
	}
	cfg.ConfigVersion = currentConfigVersion
	return cfg
}

// Write persists cfg to config.json, creating the data directory if needed.
func Write(cfg Config) error {
	dir := paths.DataDirectory()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dir, paths.ConfigFile), data, 0o644)
}
