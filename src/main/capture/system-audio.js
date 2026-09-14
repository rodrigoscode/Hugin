/**
 * System audio for full-screen broadcasts without Discord's own sound (the call's voices, its sound
 * effects, streams being watched). Chromium's loopback modes can't leave Discord out, so Hugin.exe
 * captures through the Windows process loopback API, excluding Discord's process tree, and the
 * broadcast window plays that PCM into its stream.
 */

/**
 * Windows 10 20348 (and Windows 11) added the process loopback API.
 */
const PROCESS_LOOPBACK_MIN_BUILD = 20348;

let systemAudio = null;

function processLoopbackSupported() {
    const build = Number(require("os").release().split(".")[2]);
    return Number.isFinite(build) && build >= PROCESS_LOOPBACK_MIN_BUILD;
}

function stopSystemAudio() {
    if (!systemAudio) return;
    const child = systemAudio;
    systemAudio = null;

    try {
        child.kill();
    } catch {}
}

/**
 * Runs Hugin.exe capture-audio and forwards its 48 kHz 16-bit stereo PCM to the broadcast window, in
 * whole frames. Returns false when the helper is missing.
 */
function startSystemAudio(target) {
    stopSystemAudio();
    if (!target || target.isDestroyed() || !existsSync(HELPER_EXE)) return false;

    const child = spawn(HELPER_EXE, ["capture-audio", String(process.pid)], {
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"]
    });

    systemAudio = child;
    let carry = Buffer.alloc(0);

    child.stdout.on("data", chunk => {
        if (systemAudio !== child || target.isDestroyed()) return;
        const data = carry.length ? Buffer.concat([carry, chunk]) : chunk;
        const whole = data.length - (data.length % 4);
        carry = Buffer.from(data.subarray(whole));
        if (whole > 0) target.send("hugin:systemAudio", data.subarray(0, whole));
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", text => log("system audio:", String(text).trim()));
    child.on("error", err => log("system audio failed:", String(err)));

    child.on("exit", code => {
        if (systemAudio === child) systemAudio = null;
        if (DEBUG_MODE) log("system audio helper exited:", code);
    });

    target.once("destroyed", () => {
        if (systemAudio === child) stopSystemAudio();
    });

    return true;
}
