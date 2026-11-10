/**
 * The VDO.Ninja session: permissions and display-media handling.
 */

/**
 * The shared VDO.Ninja session. Only the broadcast opens a real capture device; identity publishers
 * supply synthetic video in their preload. A shared
 * window brings its application's audio; a whole screen brings Hugin.exe's system audio without
 * Discord, or the full system mix where Windows lacks process loopback.
 */
function prepareSession() {
    if (sessionReady) return electron.session.fromPartition(PARTITION);
    const ses = electron.session.fromPartition(PARTITION);
    ses.setUserAgent(CHROME_UA);
    if (DEBUG_MODE) log("P2P session user agent:", CHROME_UA);

    ses.setPermissionRequestHandler((_wc, permission, callback) => {
        const allowed = ["media", "display-capture", "clipboard-read", "clipboard-sanitized-write", "fullscreen"];
        callback(allowed.includes(permission));
    });

    ses.setPermissionCheckHandler(() => true);

    const handler = async (request, callback) => {
        const role = roleForWebContents(request.frame);
        if (role !== "broadcast") return callback({});
        if (!pending?.sourceId) return callback({});

        try {
            const sources = await electron.desktopCapturer.getSources({
                types: [pending.sourceId.startsWith("screen:") ? "screen" : "window"],
                thumbnailSize: { width: 0, height: 0 },
                fetchWindowIcons: false
            });
            const source = sources.find(s => s.id === pending.sourceId);
            if (!source) return callback({});
            log("handing source to getDisplayMedia:", source.name);
            watchSharedWindow(source.id);
            if (!pending.audio)
                return callback({
                    video: source
                });
            const owner = await windowOwner(source.id);
            if (owner && owner.name.toLowerCase() === "explorer.exe") {
                log("broadcast audio: none (explorer.exe window)");
                return callback({
                    video: source
                });
            }
            if (!owner && pending.systemAudio) {
                const started = startSystemAudio(electron.webContents.fromFrame(request.frame));
                log("broadcast audio:", started ? "system audio without Discord (Hugin.exe)" : "none (Hugin.exe missing)");
                return callback({
                    video: source
                });
            }

            const windowAudio = processLoopbackSupported() ? `applicationLoopback:${owner?.pid}` : "loopback";
            const audio = owner ? windowAudio : "loopback";
            log("broadcast audio:", audio, owner?.name ? "(" + owner.name + ")" : "");
            callback({
                video: source,
                audio
            });
        } catch (err) {
            log("failed to resolve source:", String(err));
            callback({});
        }
    };

    try {
        ses.setDisplayMediaRequestHandler(handler, {
            useSystemPicker: false
        });
    } catch {
        ses.setDisplayMediaRequestHandler(handler);
    }

    sessionReady = true;
    return ses;
}

/**
 * Lets a VDO.Ninja window close: its beforeunload prompt would otherwise cancel Discord's quit.
 */
function allowClose(win) {
    win.webContents.on("will-prevent-unload", event => event.preventDefault());
}

function notifyEnded(reason) {
    for (const win of electron.BrowserWindow.getAllWindows()) {
        try {
            win.webContents.send("hugin:streamEnded", reason);
        } catch {}
    }
}
