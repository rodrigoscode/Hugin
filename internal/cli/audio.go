package cli

import (
	"fmt"
	"io"
	"os"
	"strconv"

	"hugin/internal/audiocap"
)

// CaptureAudioCommand is run by the patched Discord main process while a whole
// screen is broadcast: `Hugin.exe capture-audio <pid>` writes what Windows
// plays, minus what the process tree of pid (Discord) plays, to stdout as
// 48 kHz 16-bit stereo PCM. It exits when Discord closes its stdin.
const CaptureAudioCommand = "capture-audio"

// RunCaptureAudio streams the capture until stdin closes or stdout breaks;
// errors go to stderr, which the caller logs.
func RunCaptureAudio(args []string) int {
	if len(args) != 1 {
		fmt.Fprintln(os.Stderr, "usage: capture-audio <pid>")
		return 2
	}

	pid, err := strconv.ParseUint(args[0], 10, 32)
	if err != nil || pid == 0 {
		fmt.Fprintln(os.Stderr, "invalid pid:", args[0])
		return 2
	}

	go func() {
		_, _ = io.Copy(io.Discard, os.Stdin)
		os.Exit(0)
	}()

	if err := audiocap.CaptureExcluding(uint32(pid), os.Stdout); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 1
	}
	return 0
}
