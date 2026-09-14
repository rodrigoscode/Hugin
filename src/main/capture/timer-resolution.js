/**
 * Lets Discord keep 1 ms timers while a screen is captured, so capture is not held at ~32 fps.
 */

let timerResolutionHonored = false;

/**
 * Asks Hugin.exe to make Windows honor Discord's 1 ms timer requests while a screen is captured;
 * otherwise capture of a covered window runs at about 32 fps.
 */
function honorTimerResolution(enable) {
    if (enable === timerResolutionHonored) return;
    timerResolutionHonored = enable;

    if (!existsSync(HELPER_EXE)) {
        log("timer: Hugin.exe missing in", DATA_DIR, "-- capture with Discord covered stays at ~32 fps");
        return;
    }

    execFile(
        HELPER_EXE,
        ["timer-resolution", String(process.pid), enable ? "on" : "off"],
        {
            windowsHide: true,
            timeout: 10000
        },
        (err, _stdout, stderr) =>
            log(
                "timer:",
                enable ? "honor 1 ms" : "decision returned to Windows",
                err ? "failed: " + String(stderr || err).trim() : "ok"
            )
    );
}
