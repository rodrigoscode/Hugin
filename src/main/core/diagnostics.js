/** Local session diagnostics. Export DTOs, never the text log or application configuration. */
const diagnosticStore = createDiagnosticStore();
const diagnosticCapture = { status: "idle", source: "none", audioRequested: false, audioMode: "none" };
const diagnosticClosingViews = new Map();
const diagnosticTrackProbes = new WeakMap();

function diagnosticCaptureContext() {
    return { run: diagnosticCapture.run, operation: diagnosticCapture.operation };
}

function diagnosticEnvironmentVersion(read) {
    try { return diagnosticVersion(read()); } catch { return "unknown"; }
}

function recordDiagnostic(name, fields = {}) {
    try { diagnosticStore.record("main", name, fields, Date.now()); } catch {}
}

function diagnosticSender(event) {
    try {
        return Boolean(mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents &&
            event.senderFrame === mainWindow.webContents.mainFrame);
    } catch { return false; }
}

const DIAGNOSTIC_TRACKS_SCRIPT = `(() => {
    const stream = window.session?.streamSrc;
    if (!stream) return null;
    const video = stream.getVideoTracks(), audio = stream.getAudioTracks();
    const settings = video[0]?.getSettings() ?? {};
    return { videoTracks: video.length, liveVideoTracks: video.filter(t => t.readyState === "live").length,
        audioTracks: audio.length, enabledAudioTracks: audio.filter(t => t.readyState === "live" && t.enabled).length,
        width: settings.width, height: settings.height, fps: settings.frameRate };
})()`;

async function collectDiagnosticTracks(win) {
    if (!win || win.isDestroyed()) return { status: "inactive", tracks: null };
    // A timeout cannot cancel Electron's execution request. Do not queue more probes in a stuck page.
    if (diagnosticTrackProbes.has(win)) return { status: "timeout", tracks: null };
    diagnosticTrackProbes.set(win, true);
    const probe = Promise.resolve().then(() => win.webContents.executeJavaScript(DIAGNOSTIC_TRACKS_SCRIPT, true))
        .then(value => {
            const tracks = sanitizeDiagnosticTracks(value);
            return { status: tracks ? "collected" : "unavailable", tracks };
        })
        .catch(() => ({ status: "unavailable", tracks: null }))
        .finally(() => diagnosticTrackProbes.delete(win));
    let timer;
    try {
        return await Promise.race([
            probe,
            new Promise(resolve => { timer = setTimeout(() => resolve({ status: "timeout", tracks: null }), 1000); })
        ]);
    } finally { clearTimeout(timer); }
}

function formatDiagnosticReport(report) {
    const section = (title, value) => title + "\n" + JSON.stringify(value, null, 2);
    return [
        "Hugin session diagnostic — schema 1", "Generated: " + report.generatedAt,
        "Local history; events ordered by receipt. Requested settings do not prove media delivery.",
        section("Environment", report.environment), section("Playback", report.playback),
        section("Native capture and resources", report.native), section("Collection", report.collection),
        section("Discarded events", report.discarded),
        "Recent events\n" + report.events.map(event =>
            `#${event.sequence} ${new Date(event.receivedAt).toISOString()} [${event.source}] ${event.name} ` +
            JSON.stringify({ capturedAt: event.capturedAt, ...event.fields })).join("\n")
    ].join("\n\n");
}

let diagnosticCopyInProgress = false;
electron.ipcMain.on("hugin:diagnosticEvent", (event, payload) => {
    if (!diagnosticSender(event)) return;
    try {
        diagnosticStore.record("renderer", payload?.name, payload?.fields, payload?.capturedAt);
    } catch {}
});

electron.ipcMain.handle("hugin:copyDiagnostics", async (event, snapshot) => {
    if (!diagnosticSender(event)) return { ok: false, reason: "unavailable" };
    if (diagnosticCopyInProgress) return { ok: false, reason: "busy" };
    diagnosticCopyInProgress = true;
    try {
        const playback = sanitizeDiagnosticPlayback(snapshot);
        const nativeViews = [
            ...[...views].map(([role, win]) => ({ role, win, closing: false })),
            ...[...diagnosticClosingViews].map(([win, role]) => ({ role, win, closing: true }))
        ].filter(entry => DIAGNOSTIC_ROLES.includes(entry.role));
        // Capture resource state before awaiting the bounded, read-only media probe.
        const nativeSnapshot = {
            capturedAt: new Date().toISOString(),
            capture: {
                run: diagnosticAlias(diagnosticCapture.run, "run"), operation: diagnosticAlias(diagnosticCapture.operation, "operation"),
                status: diagnosticEnum(diagnosticCapture.status, ["idle", "requested", "resolved", "failed", "ended"]),
                source: diagnosticEnum(diagnosticCapture.source, ["screen", "window", "camera", "none"]),
                audioRequested: diagnosticCapture.audioRequested === true,
                audioMode: diagnosticEnum(diagnosticCapture.audioMode, ["none", "application", "system_excluding_discord", "system_mix"])
            }, helperRunning: Boolean(systemAudio?.pid && systemAudio.exitCode === null && !systemAudio.killed),
            viewCount: nativeViews.length, viewsTruncated: nativeViews.length > 16,
            views: nativeViews.slice(0, 16).map(({ role, win, closing }) => ({
                role, alive: !win.isDestroyed(), closing
            }))
        };
        const observed = await collectDiagnosticTracks(views.get("broadcast"));
        const history = diagnosticStore.snapshot();
        const environment = {
            hugin: playback?.version ?? "unknown", discord: diagnosticEnvironmentVersion(() => electron.app.getVersion()),
            electron: diagnosticEnvironmentVersion(() => process.versions.electron),
            chrome: diagnosticEnvironmentVersion(() => process.versions.chrome),
            windows: diagnosticEnvironmentVersion(() => require("os").release())
        };
        const environmentPartial = Object.values(environment).includes("unknown");
        const report = {
            schemaVersion: 1, generatedAt: new Date().toISOString(),
            environment,
            playback, native: { ...nativeSnapshot, observedCapture: observed.tracks },
            collection: { playback: playback ? "collected" : "unavailable", media: observed.status,
                environment: environmentPartial ? "partial" : "collected" }, ...history
        };
        const text = formatDiagnosticReport(report);
        if (text.length > 256 * 1024) return { ok: false, reason: "too_large" };
        // Do not copy after the window that requested the report has closed or navigated away.
        if (!diagnosticSender(event)) return { ok: false, reason: "unavailable" };
        electron.clipboard.writeText(text);
        return { ok: true, partial: !playback || environmentPartial || ["timeout", "unavailable"].includes(observed.status) };
    } catch {
        return { ok: false, reason: "copy_failed" };
    } finally { diagnosticCopyInProgress = false; }
});
