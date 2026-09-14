/**
 * Creating role windows, probing them and taking frames for previews.
 */

electron.ipcMain.handle("hugin:attachView", async (_e, request) => {
    const { role, url, bounds, visible, sourceId, audio } = request ?? {};
    if (!role || !url) throw new Error("role and url are required");
    if (!mainWindow || mainWindow.isDestroyed()) throw new Error("main window unavailable");

    if (role === "broadcast") {
        pending = sourceId
            ? {
                  sourceId,
                  audio: Boolean(audio),
                  systemAudio: Boolean(audio) && String(sourceId).startsWith("screen:") && processLoopbackSupported()
              }
            : null;
        honorTimerResolution(Boolean(sourceId));
        stopWindowWatcher();
        stopSystemAudio();
        if (!pencilShortcutRegistered) {
            pencilShortcutRegistered = electron.globalShortcut.register(PENCIL_SHORTCUT, () => {
                toggleAnnotate().catch(err => log("pencil:", String(err)));
            });
            log("pencil shortcut registered:", pencilShortcutRegistered);
        }
    }

    prepareSession();
    destroyView(role);

    const win = new OriginalBrowserWindow({
        parent: mainWindow,
        show: false,
        frame: false,
        transparent: false,
        backgroundColor: "#000000",
        resizable: false,
        movable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        hasShadow: false,
        roundedCorners: false,
        focusable: true,
        acceptFirstMouse: false,
        webPreferences: {
            partition: PARTITION,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            backgroundThrottling: false,
            preload: join(__dirname, "viewPreload.js"),
            additionalArguments: [
                `--hugin-role=${role}`,
                ...(role === "broadcast" && pending?.systemAudio ? ["--hugin-system-audio"] : [])
            ]
        }
    });

    views.set(role, win);
    win.setMenuBarVisibility(false);
    allowClose(win);
    win.webContents.setAudioMuted(true);

    win.on("closed", () => {
        if (views.get(role) === win) views.delete(role);
    });

    if (visible !== false && bounds) applyViewBounds(role, bounds, true);

    await win.loadURL(url, {
        userAgent: CHROME_UA
    });

    log(`window "${role}" loaded`, visible === false ? "(hidden)" : "(in panel)");
    if (DEBUG_MODE) setTimeout(() => probeView(role), 6000);
    return true;
});

const PROBE = `(() => {
    const videos = [...document.querySelectorAll("video")].map(v => {
        const r = v.getBoundingClientRect();
        return {
            vw: v.videoWidth, vh: v.videoHeight, ready: v.readyState,
            paused: v.paused, muted: v.muted,
            box: Math.round(r.width) + "x" + Math.round(r.height),
            visible: r.width > 0 && r.height > 0
        };
    });
    let mirror = "no canvas";
    const target = document.getElementById("hugin-mirror");
    if (target) mirror = target.width + "x" + target.height;
    return JSON.stringify({
        title: document.title,
        videos,
        mirror,
        text: (document.body?.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 120)
    });
})()`;

async function probeView(role) {
    const win = views.get(role);
    if (!win || win.isDestroyed()) return;

    try {
        const result = await win.webContents.executeJavaScript(PROBE, true);
        log(`probe "${role}":`, String(result).slice(0, 500));
    } catch (err) {
        log(`probe "${role}" failed:`, String(err));
    }
}

/**
 * Script returning one JPEG frame from a stream's <video>, or from the first one.
 */
const snapshotScript = streamId => `(() => {
    const target = ${JSON.stringify(streamId ?? null)};
    const videos = [...document.querySelectorAll("video")];
    const v = target
        ? videos.find(x => (x.dataset.sid || x.parentElement?.dataset?.sid) === target)
        : videos[0];
    if (!v || !v.videoWidth || v.readyState < 2) return null;
    const w = 480;
    const h = Math.max(1, Math.round(w * v.videoHeight / v.videoWidth));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    try {
        c.getContext("2d").drawImage(v, 0, 0, w, h);
        return c.toDataURL("image/jpeg", 0.7);
    } catch { return null; }
})()`;

electron.ipcMain.handle("hugin:snapshotView", async (_e, request) => {
    const win = views.get(request?.role);
    if (!win || win.isDestroyed()) return null;

    try {
        return await win.webContents.executeJavaScript(snapshotScript(request?.streamId), true);
    } catch {
        return null;
    }
});
