package cli

import (
	"os"
	"path/filepath"

	"hugin/internal/cliui"
	"hugin/internal/config"
	"hugin/internal/discordinstall"
	"hugin/internal/injector"
	"hugin/internal/paths"
	"hugin/internal/version"
)

// valueFlags maps a --flag=value CLI argument to the Config field it fills.
var valueFlags = []struct {
	flag string
	set  func(cfg *config.Config, value string)
}{
	{"vdo", func(cfg *config.Config, v string) { cfg.VdoBase = v }},
	{"room", func(cfg *config.Config, v string) { cfg.Room = v }},
	{"secret", func(cfg *config.Config, v string) { cfg.RoomSecret = v }},
	{"password", func(cfg *config.Config, v string) { cfg.Password = v }},
	{"quality", func(cfg *config.Config, v string) { cfg.Quality = v }},
	{"bitrate", func(cfg *config.Config, v string) { cfg.Bitrate = v }},
	{"framerate", func(cfg *config.Config, v string) { cfg.Framerate = v }},
}

func configFromOptions(opts cliui.Options) config.Config {
	cfg := config.Read()

	for _, vf := range valueFlags {
		if value, ok := opts.Get(vf.flag); ok {
			vf.set(&cfg, value)
		}
	}

	if opts.Has("hijack") {
		cfg.HijackShareButton = true
	}
	if opts.Has("no-hijack") {
		cfg.HijackShareButton = false
	}
	if opts.Has("no-audio") {
		cfg.CaptureAudio = false
	}
	if opts.Has("no-auto-watch") {
		cfg.AutoWatch = false
	}

	return cfg
}

// PayloadLoader, SoundsLoader and FontsLoader are supplied by main (which
// owns the go:embed directives) so this package stays free of any embed
// path details.
type PayloadLoader func() injector.Payload
type SoundsLoader func() injector.Sounds
type FontsLoader func() injector.Fonts

// applyDebugMarker records whether the next Discord launch should open the
// remote debugging port. It is a file rather than a flag because the one that
// reads it is the patched main process, started by Discord itself.
func applyDebugMarker(opts cliui.Options) {
	marker := filepath.Join(paths.DataDirectory(), "debug")
	if opts.Has("debug") {
		_ = os.WriteFile(marker, nil, 0o644)
		return
	}
	_ = os.Remove(marker)
}

func RunInstall(opts cliui.Options, loadPayload PayloadLoader, loadSounds SoundsLoader, loadFonts FontsLoader) int {
	installs, err := selectInstalls(opts)
	if err != nil {
		cliui.Fail(err.Error())
		return 1
	}

	migrateLegacyData()

	payload := loadPayload()
	sounds := loadSounds()
	fonts := loadFonts()
	cfg := configFromOptions(opts)

	cliui.Title("Installations found")
	described := make([]describedInstall, len(installs))
	for i, install := range installs {
		described[i] = describe(install)
		cliui.Plain(described[i].Line)
	}

	for _, entry := range described {
		if entry.Status.State != injector.StateMissing {
			continue
		}
		name := entry.Install.Branch.Label + " " + entry.Install.VersionText
		if len(entry.Install.OlderVersions) > 0 {
			cliui.Fail(name + " is not ready (no app.asar): Discord is probably still installing this update. " +
				"Let Discord finish updating, then run Hugin again. " +
				"If Discord no longer opens, reinstall it (your login is kept).")
		} else {
			cliui.Fail(name + ": app.asar is missing -- the Discord installation is incomplete. " +
				"Reinstall Discord (your login is kept) and run Hugin again.")
		}
		return 1
	}

	signature := injector.HashPayload(payload)
	upToDate := true
	for _, entry := range described {
		if entry.Status.State != injector.StateOurs ||
			entry.Status.MarkerData == nil ||
			entry.Status.MarkerData.Version != version.Version ||
			entry.Status.MarkerData.PayloadHash != signature {
			upToDate = false
			break
		}
	}

	if upToDate && !opts.Has("force") {
		cliui.Title("Already installed")
		for _, entry := range described {
			cliui.OK(entry.Install.Branch.Label + " " + entry.Install.VersionText)
		}
		cliui.Info("Nothing to do: same version, same content.")

		installHelper()

		applyDebugMarker(opts)

		if !opts.Has("no-launch") {
			first := installs[0]
			if discordinstall.IsRunning(first.Branch.Executable) {
				cliui.Info("Discord is already open.")
			} else {
				discordinstall.Launch(first)
				cliui.OK("Discord started")
			}
		}
		return 0
	}

	needsRename := false
	for _, entry := range described {
		if entry.Status.State == injector.StateClean {
			needsRename = true
			break
		}
	}
	if !ensureClosed(installs, opts, needsRename) {
		return 1
	}

	cliui.Title("Injecting")
	failures := 0

	for _, entry := range described {
		result, err := injector.ApplyPatch(entry.Install, payload, injector.InstallOptions{
			Version:   version.Version,
			Config:    &cfg,
			Sounds:    sounds,
			Fonts:     fonts,
			Force:     opts.Has("force"),
			OnWarning: cliui.Warn,
		})
		if err != nil {
			failures++
			cliui.Fail(entry.Install.Branch.Label + ": " + err.Error())
			continue
		}

		verb := "injected"
		if result.Reinstalled {
			verb = "updated"
		}
		cliui.OK(entry.Install.Branch.Label + " " + entry.Install.VersionText + " " + verb)
		cliui.Info(result.Resources)
	}

	if failures == len(installs) {
		return 1
	}

	applyDebugMarker(opts)
	installHelper()
	removeLegacyData(installs)

	dataDir := paths.DataDirectory()
	cliui.Title("Configuration")
	cliui.Info(filepath.Join(dataDir, paths.ConfigFile))
	room := cfg.Room
	if room == "" {
		room = "derived from the voice channel"
	}
	cliui.Plain("room: " + room)
	cliui.Info("Zero configuration: whoever joins the same voice channel lands in the same room.")

	cliui.Title("Done")
	cliui.Info("Video goes straight from your machine to the viewer (VDO.Ninja).")
	cliui.Info("Discord's own screen share stays blocked -- it is not the path being used.")
	cliui.Info("Log at " + filepath.Join(dataDir, paths.LogFile))

	if !opts.Has("no-launch") {
		discordinstall.Launch(installs[0])
		cliui.OK("Discord started")
	}

	return 0
}
