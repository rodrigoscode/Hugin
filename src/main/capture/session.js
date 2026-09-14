/**
 * The VDO.Ninja session: permissions and display-media handling.
 */

/**
 * Takes the viewer beacon off the screen before a broadcast captures it. Chromium shares one capture
 * device per source, sized by whoever opened it first, and the beacon captures at 2 px.
 */
async function pauseBeacon() {
    const win = views.get("identify");
    if (!win || win.isDestroyed()) return null;
    const url = win.webContents.getURL();
    if (!/^https?:/.test(url)) return null;

    try {
        await win.webContents.loadURL("about:blank");
    } catch (err) {
        log("beacon: could not pause:", String(err));
        return null;
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    log("beacon: paused so the broadcast opens the screen first");

    return () =>
        setTimeout(() => {
            if (win.isDestroyed() || views.get("identify") !== win) return;

            win.webContents
                .loadURL(url, {
                    userAgent: CHROME_UA
                })
                .then(() => log("beacon: resumed after the screen"))
                .catch(err => log("beacon: could not resume:", String(err)));
        }, 2500);
}

/**
 * The shared VDO.Ninja session. Display capture goes to the broadcast's chosen source and the viewer
 * beacon's screen; the lobby announcement fakes its own video and is refused a real source. A shared
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
        if (role === "announce") return callback({});

        if (role === "identify") {
            try {
                const sources = await electron.desktopCapturer.getSources({
                    types: ["screen"]
                });
                if (!sources[0]) return callback({});
                return callback({
                    video: sources[0]
                });
            } catch (err) {
                log("beacon: failed to resolve source:", String(err));
                return callback({});
            }
        }

        if (!pending?.sourceId) return callback({});
        let resumeBeacon = null;

        try {
            const sources = await electron.desktopCapturer.getSources({
                types: ["screen", "window"]
            });
            const source = sources.find(s => s.id === pending.sourceId) ?? sources[0];
            if (!source) return callback({});
            log("handing source to getDisplayMedia:", source.name);
            watchSharedWindow(source.id);
            if (source.id.startsWith("screen:")) resumeBeacon = await pauseBeacon();
            const deliver = response => {
                callback(response);
                resumeBeacon?.();
            };
            if (!pending.audio)
                return deliver({
                    video: source
                });
            const owner = await windowOwner(source.id);
            if (owner && owner.name.toLowerCase() === "explorer.exe") {
                log("broadcast audio: none (explorer.exe window)");
                return deliver({
                    video: source
                });
            }
            if (!owner && pending.systemAudio) {
                const started = startSystemAudio(electron.webContents.fromFrame(request.frame));
                log("broadcast audio:", started ? "system audio without Discord (Hugin.exe)" : "none (Hugin.exe missing)");
                return deliver({
                    video: source
                });
            }

            const windowAudio = processLoopbackSupported() ? `applicationLoopback:${owner?.pid}` : "loopback";
            const audio = owner ? windowAudio : "loopback";
            log("broadcast audio:", audio, owner?.name ? "(" + owner.name + ")" : "");
            deliver({
                video: source,
                audio
            });
        } catch (err) {
            log("failed to resolve source:", String(err));
            callback({});
            resumeBeacon?.();
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
