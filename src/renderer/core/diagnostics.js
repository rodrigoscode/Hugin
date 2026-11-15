/** Structured events use local aliases, never stream, room or user identifiers. */
const diagnosticRun = "run-" + Math.random().toString(36).slice(2, 10);
let diagnosticPlayerSequence = 0, diagnosticOperationSequence = 0;
let diagnosticEventWindow = 0, diagnosticEventCount = 0, diagnosticEventsDropped = 0;

function diagnosticOperation() {
    return "operation-" + (++diagnosticOperationSequence).toString(36);
}

function recordDiagnostic(name, fields = {}) {
    try {
        const time = Date.now();
        if (time - diagnosticEventWindow >= 1000) { diagnosticEventWindow = time; diagnosticEventCount = 0; }
        if (++diagnosticEventCount > 60) { diagnosticEventsDropped++; return; }
        const event = sanitizeDiagnosticEvent(name, { ...fields, run: diagnosticRun });
        if (event) native.diagnosticEvent?.({ ...event, capturedAt: time });
    } catch {}
}

function diagnosticPlayerSurface(frame) {
    if (!frame?.isConnected) return "disconnected";
    if (frame.parentElement === frameParking) return "parking";
    if (pip?.frame === frame) return "pip";
    if (watchScreen?.node.contains(frame)) return watchScreen.frames.length > 1 ? "grid" : "stage";
    return "unknown";
}

function diagnosticPlaybackSnapshot() {
    const entries = [...new Set([...streamFrames.values(), ...releasingStreamFrames])];
    return sanitizeDiagnosticPlayback({
        version: VERSION, run: diagnosticRun, capturedAt: Date.now(), inCall: Boolean(state.channelId),
        eventsDropped: diagnosticEventsDropped,
        broadcastingRequested: state.broadcasting, audioRequested: state.broadcastAudio,
        heightRequested: state.resolution, fpsRequested: state.fps,
        playerCount: entries.length,
        players: entries.slice(0, 16).map(entry => ({
            player: entry.diagnosticId, surface: diagnosticPlayerSurface(entry.frame),
            connected: entry.frame.isConnected, videoObserved: entry.playing,
            releasing: entry.frame.dataset.huginDropping === "1", mine: entry.mine,
            volumeRequested: streamVolume(entry.streamId), mutedRequested: streamMuted(entry.streamId)
        }))
    });
}
