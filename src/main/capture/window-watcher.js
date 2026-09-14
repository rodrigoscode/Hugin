/**
 * Which process owns a shared window, and a watcher that reports when that window closes or minimizes.
 */

const CHROME_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
    `Chrome/${process.versions.chrome} Safari/537.36`;

/**
 * Which role window (broadcast, watch or identify) a frame belongs to.
 */
function roleForWebContents(frame) {
    try {
        const wc = electron.webContents.fromFrame(frame);
        if (!wc) return null;
        for (const [role, win] of views) {
            if (!win.isDestroyed() && win.webContents.id === wc.id) return role;
        }
    } catch {}

    return null;
}

/**
 * The process and executable that own a shared window (Hugin.exe window-pid), so only that
 * application's audio is captured.
 */
function windowOwner(sourceId) {
    const hwnd = /^window:(\d+):/.exec(String(sourceId ?? ""))?.[1];
    if (!hwnd || !existsSync(HELPER_EXE)) return Promise.resolve(null);

    return new Promise(resolve => {
        execFile(
            HELPER_EXE,
            ["window-pid", hwnd],
            {
                windowsHide: true,
                timeout: 3000
            },
            (err, stdout, stderr) => {
                const parsed = /^(\d+)(?:\s+(.+))?$/.exec(String(stdout ?? "").trim());

                if (err || !parsed || parsed[1] === "0") {
                    log("window audio: PID unavailable --", String(stderr || err || stdout).trim());
                    resolve(null);
                    return;
                }

                resolve({
                    pid: parsed[1],
                    name: (parsed[2] ?? "").trim()
                });
            }
        );
    });
}

let windowWatcher = null;

function stopWindowWatcher() {
    if (!windowWatcher) return;
    const child = windowWatcher;
    windowWatcher = null;

    try {
        child.kill();
    } catch {}
}

/**
 * Runs Hugin.exe watch-window for a shared window and ends the broadcast when the window closes or
 * hides; Chromium does not end the capture track by itself.
 */
function watchSharedWindow(sourceId) {
    stopWindowWatcher();
    const hwnd = /^window:(\d+):/.exec(String(sourceId ?? ""))?.[1];
    if (!hwnd || !existsSync(HELPER_EXE)) return;

    const child = spawn(HELPER_EXE, ["watch-window", hwnd], {
        windowsHide: true,
        stdio: ["pipe", "pipe", "ignore"]
    });

    windowWatcher = child;
    let buffered = "";
    child.stdout.setEncoding("utf8");

    child.stdout.on("data", chunk => {
        buffered += chunk;
        let lineEnd;

        while ((lineEnd = buffered.indexOf("\n")) >= 0) {
            const windowState = buffered.slice(0, lineEnd).trim();
            buffered = buffered.slice(lineEnd + 1);
            if (windowWatcher !== child || !windowState) continue;
            log("shared window:", windowState);
            if (windowState === "gone" || windowState === "hidden") notifyEnded("source-ended");
        }
    });

    child.on("error", err => log("window watcher failed:", String(err)));

    child.on("exit", () => {
        if (windowWatcher === child) windowWatcher = null;
    });
}
