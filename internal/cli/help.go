package cli

import (
	"fmt"

	"hugin/internal/version"
)

const helpBody = `
  Hugin v%s
  Peer-to-peer screen sharing (VDO.Ninja) driven from the Discord client.

  Usage:
    Hugin.exe [command] [options]

  Commands:
    install      inject the patch (default)
    uninstall    restore the original app.asar
    status       report state without changing anything

  General options:
    --branch=stable|ptb|canary|development   pick a branch
    --all                                    apply to every branch found
    --no-kill                                do not close Discord
    --no-launch                              do not reopen Discord at the end
    --force                                  overwrite another mod's patch
    --debug                                  open DevTools alongside Discord
    --purge                                  (uninstall) also delete %%APPDATA%%\Hugin

  Share button:
    --hijack       the existing screen button opens the P2P flow
    --no-hijack    floating panel only

  Broadcast:
    --vdo=URL           VDO.Ninja instance (default https://vdo.ninja)
    --secret=SECRET     feeds the room hash; use the SAME value among friends
    --room=NAME         fixed room (disables the channel-derived room)
    --password=PASS     VDO.Ninja room password
    --quality=1080      target resolution
    --bitrate=6000      kbps
    --framerate=60      fps
    --no-audio          no system audio
    --no-auto-watch     do not join the room scene automatically

  The room is derived from the voice channel id, so nobody has to share a link:
  joining the channel already puts you in the right room.

  This tool does NOT re-enable Discord's own screen share. Video travels over
  WebRTC via VDO.Ninja and never touches Discord's servers.
`

func RunHelp() int {
	fmt.Printf(helpBody, version.Version)
	return 0
}
