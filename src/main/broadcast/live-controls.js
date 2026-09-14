/**
 * Changes applied to a running broadcast or player: quality, playback gain and broadcast audio.
 */

/**
 * Script run in the broadcast page: applies new capture constraints, outbound bitrate and label to the
 * live stream.
 */
const APPLY_QUALITY_SCRIPT = `async ({ height, fps, bitrate, label }) => {
    const s = window.session;
    const track = s?.streamSrc?.getVideoTracks?.()[0];
    if (!s || !track) return { error: "no video track" };

    const result = {};
    const request = {};
    if (fps) request.frameRate = { ideal: fps, max: fps };
    if (height) request.height = height;
    try {
        await track.applyConstraints(request);
    } catch (err) {
        result.captureError = String(err?.name || err) + ": " + String(err?.message || "");
    }
    const cfg = track.getSettings();
    result.capture = cfg.width + "x" + cfg.height + "@" + cfg.frameRate;

    if (bitrate) {
        s.outboundVideoBitrate = bitrate;
        result.connections = 0;
        for (const [uuid, pc] of Object.entries(s.pcs ?? {})) {
            if (pc.savedBitrate !== false) continue;
            try { s.limitBitrate(uuid, -1); result.connections++; } catch (err) { }
        }
    }

    if (label && label !== s.label) {
        s.label = typeof sanitizeLabel === "function" ? sanitizeLabel(label) : label;
        try { s.sendMessage({ changeLabel: true, value: s.label }); } catch (err) { result.labelError = String(err); }
        result.label = s.label;
    }
    return result;
}`;

electron.ipcMain.handle("hugin:setBroadcastQuality", async (_e, request) => {
    const win = views.get("broadcast");
    if (!win || win.isDestroyed()) return null;

    const qualityArgs = {
        height: Number(request?.height) || null,
        fps: Number(request?.fps) || null,
        bitrate: Number(request?.bitrate) || null,
        label: typeof request?.label === "string" ? request.label : null
    };

    try {
        const result = await win.webContents.executeJavaScript(
            `(${APPLY_QUALITY_SCRIPT})(${JSON.stringify(qualityArgs)})`,
            true
        );
        log("live quality:", JSON.stringify(qualityArgs), "->", JSON.stringify(result));
        return result;
    } catch (err) {
        log("live quality failed:", String(err));
        return null;
    }
});

/**
 * Script run in a stage iframe: routes the stream's audio through a GainNode (0 to 2) and keeps the
 * element muted, since VDO.Ninja caps volume at 1.
 */
const IFRAME_GAIN_SCRIPT = `(level) => {
    const g = window.__huginGain ??= { ctx: null, linked: new Map(), level: 1, timer: 0 };
    g.level = level;
    const mutedProperty = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "muted");

    const link = () => {
        for (const media of document.querySelectorAll("video, audio")) {
            const stream = media.srcObject;
            const track = stream instanceof MediaStream ? stream.getAudioTracks()[0] : null;
            if (!track) continue;

            let entry = g.linked.get(media);
            if (entry && entry.track !== track) {
                try { entry.source.disconnect(); entry.gain.disconnect(); } catch (e) {}
                entry = null;
            }
            if (!entry) {
                g.ctx ??= new AudioContext();
                const source = g.ctx.createMediaStreamSource(new MediaStream([track]));
                const gain = g.ctx.createGain();
                source.connect(gain).connect(g.ctx.destination);
                entry = { source, gain, track };
                g.linked.set(media, entry);
                mutedProperty.set.call(media, true);
                Object.defineProperty(media, "muted", { configurable: true, get: () => false, set: () => {} });
            }
            entry.gain.gain.value = g.level;
        }
        for (const [media, entry] of g.linked) {
            if (media.isConnected) continue;
            try { entry.source.disconnect(); entry.gain.disconnect(); } catch (e) {}
            g.linked.delete(media);
        }
        if (g.ctx && g.ctx.state === "suspended") g.ctx.resume().catch(() => {});
    };

    link();
    g.timer ||= setInterval(link, 1000);
    return g.linked.size;
}`;

electron.ipcMain.handle("hugin:setStreamGain", async (event, request) => {
    const streamId = typeof request?.streamId === "string" ? request.streamId : "";
    const level = Math.max(0, Math.min(2, Number(request?.gain)));
    if (!streamId || !Number.isFinite(level)) return 0;
    let appliedCount = 0;

    for (const frame of event.sender.mainFrame.framesInSubtree) {
        let url;
        try {
            url = new URL(frame.url);
        } catch {
            continue;
        }
        if (url.searchParams.get("view") !== streamId || url.searchParams.has("noaudio")) continue;
        try {
            await frame.executeJavaScript(`(${IFRAME_GAIN_SCRIPT})(${JSON.stringify(level)})`, true);
            appliedCount++;
        } catch (err) {
            log("iframe volume failed:", String(err));
        }
    }

    return appliedCount;
});

/**
 * Script run in the broadcast page: enables or disables every outgoing audio track, including for
 * viewers who join later.
 */
const BROADCAST_AUDIO_SCRIPT = `(enabled) => {
    const s = window.session;
    window.__huginAudioEnabled = enabled;
    const apply = () => {
        const tracks = new Set(s?.streamSrc?.getAudioTracks?.() ?? []);
        for (const pc of Object.values(s?.pcs ?? {})) {
            for (const sender of pc?.getSenders?.() ?? []) {
                if (sender.track && sender.track.kind === "audio") tracks.add(sender.track);
            }
        }
        for (const track of tracks) track.enabled = window.__huginAudioEnabled;
        return tracks.size;
    };
    window.__huginAudioTimer ||= setInterval(apply, 1000);
    return apply();
}`;

electron.ipcMain.handle("hugin:setBroadcastAudio", async (_e, request) => {
    const win = views.get("broadcast");
    if (!win || win.isDestroyed()) return null;
    const enable = Boolean(request?.enabled);

    try {
        const trackCount = await win.webContents.executeJavaScript(`(${BROADCAST_AUDIO_SCRIPT})(${enable})`, true);
        log("live broadcast audio:", enable ? "on" : "off", "tracks:", trackCount);
        return trackCount;
    } catch (err) {
        log("broadcast audio failed:", String(err));
        return null;
    }
});
