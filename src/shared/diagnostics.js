/**
 * Diagnostic DTOs shared by both bundles. Never serialize application state, URLs, free-form errors
 * or configuration here: only these explicitly allowed scalar fields can leave the collector.
 */
const DIAGNOSTIC_ROLES = ["broadcast", "watch", "identify", "announce", "lobby", "peek"];
const DIAGNOSTIC_SURFACES = ["stage", "grid", "pip", "parking", "disconnected", "unknown"];
const DIAGNOSTIC_REASONS = [
    "requested", "replaced", "navigation", "closed", "cancelled", "missing_source", "capture_failed",
    "load_failed", "process_gone", "move_failed", "timeout", "connection_ended", "loading_stuck",
    "helper_missing", "helper_failed", "source_ended", "quality_failed", "audio_failed",
    "unhandled_error", "unhandled_rejection", "unavailable", "collected"
];
const DIAGNOSTIC_EVENTS = {
    "playback.open": ["operation", "count"],
    "playback.cancel": ["operation", "reason"],
    "playback.mounted": ["operation", "surface", "count"],
    "playback.failed": ["operation", "reason"],
    "playback.closed": ["surface", "reason"],
    "player.created": ["player", "mine", "surface"],
    "player.reused": ["player", "surface"],
    "player.parked": ["player", "reason"],
    "player.move_failed": ["player", "reason"],
    "player.video": ["player"],
    "player.connection_ended": ["player", "reason"],
    "player.reload": ["player", "reason"],
    "player.releasing": ["player"],
    "player.released": ["player", "reason"],
    "broadcast.requested": ["operation", "source", "height", "fps", "audioRequested"],
    "broadcast.started": ["operation"],
    "broadcast.failed": ["operation", "reason", "errorType"],
    "broadcast.stopped": ["reason"],
    "capture.resolved": ["operation", "source", "audioMode"],
    "capture.failed": ["operation", "reason", "errorType"],
    "capture.ended": ["operation", "reason"],
    "audio.started": ["operation"],
    "audio.stopped": ["operation"],
    "audio.failed": ["operation", "reason"],
    "audio.exited": ["operation", "exitCode"],
    "audio.changed": ["operation", "audioRequested", "count"],
    "quality.changed": ["operation", "height", "fps", "bitrate"],
    "quality.failed": ["operation", "reason"],
    "view.created": ["role"],
    "view.loaded": ["role"],
    "view.closing": ["role", "reason"],
    "view.closed": ["role", "reason"],
    "view.failed": ["role", "reason", "code", "processReason"],
    "runtime.error": ["reason", "errorType", "line", "column"]
};

function diagnosticEnum(value, options, fallback = "unknown") {
    return options.includes(value) ? value : fallback;
}

function diagnosticNumber(value, max, fallback = null, min = 0) {
    return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : fallback;
}

function diagnosticAlias(value, prefix) {
    return typeof value === "string" && new RegExp(`^${prefix}-[a-z0-9]{1,12}$`).test(value) ? value : null;
}

function diagnosticVersion(value) {
    return typeof value === "string" && /^\d+(?:\.\d+){1,3}(?:[-+][a-z0-9.-]{1,24})?$/i.test(value) ? value : "unknown";
}

function sanitizeDiagnosticEvent(name, fields = {}) {
    if (typeof name !== "string" || name.length > 48 || !Object.hasOwn(DIAGNOSTIC_EVENTS, name) ||
        !fields || typeof fields !== "object" || Array.isArray(fields)) return null;
    const clean = {};
    for (const key of ["run", ...DIAGNOSTIC_EVENTS[name]]) {
        const value = fields[key];
        let accepted = null;
        if (["run", "player", "operation"].includes(key)) accepted = diagnosticAlias(value, key);
        else if (key === "role") accepted = diagnosticEnum(value, DIAGNOSTIC_ROLES, null);
        else if (key === "surface") accepted = diagnosticEnum(value, DIAGNOSTIC_SURFACES, null);
        else if (key === "reason") accepted = diagnosticEnum(value, DIAGNOSTIC_REASONS, null);
        else if (key === "source") accepted = diagnosticEnum(value, ["screen", "window", "camera", "none"], null);
        else if (key === "audioMode") accepted = diagnosticEnum(value, ["none", "application", "system_excluding_discord", "system_mix"], null);
        else if (key === "errorType") accepted = diagnosticEnum(value, ["Error", "TypeError", "ReferenceError", "RangeError", "SyntaxError",
            "NotAllowedError", "NotFoundError", "NotReadableError", "AbortError", "OverconstrainedError", "InvalidStateError"], null);
        else if (key === "processReason") accepted = diagnosticEnum(value, ["clean-exit", "abnormal-exit", "killed", "crashed", "oom", "launch-failed", "integrity-failure"], null);
        else if (["mine", "audioRequested"].includes(key)) accepted = typeof value === "boolean" ? value : null;
        else accepted = diagnosticNumber(value, key === "exitCode" ? 4294967295 : 1000000, null,
            key === "exitCode" ? -1 : key === "code" ? -10000 : 0);
        if (accepted !== null) clean[key] = accepted;
    }
    return { name, fields: clean };
}

/** Bounded, local history. Sequence numbers represent receipt order, not cross-process causality. */
function createDiagnosticStore({ now = Date.now, limit = 300, maxAge = 30 * 60 * 1000, rate = 60 } = {}) {
    const events = [];
    const discarded = { expired: 0, capacity: 0, rate: 0, repeated: 0, invalid: 0 };
    let sequence = 0, windowStart = 0, windowCount = 0;
    const prune = time => {
        while (events.length && events[0].receivedAt < time - maxAge) {
            events.shift();
            discarded.expired++;
        }
    };
    return {
        record(source, name, fields, capturedAt) {
            const time = now();
            prune(time);
            const clean = sanitizeDiagnosticEvent(name, fields);
            if (!["main", "renderer"].includes(source) || !clean) { discarded.invalid++; return false; }
            if (time - windowStart >= 1000) { windowStart = time; windowCount = 0; }
            if (++windowCount > rate) { discarded.rate++; return false; }
            const last = events[events.length - 1];
            if (last && last.source === source && last.name === name && time - last.receivedAt < 1000 &&
                JSON.stringify(last.fields) === JSON.stringify(clean.fields)) {
                discarded.repeated++;
                return false;
            }
            if (events.length >= limit) { events.shift(); discarded.capacity++; }
            events.push({
                sequence: ++sequence, source, receivedAt: time,
                capturedAt: diagnosticNumber(capturedAt, time + 60000, time), ...clean
            });
            return true;
        },
        snapshot() {
            prune(now());
            return { events: events.map(event => ({ ...event, fields: { ...event.fields } })), discarded: { ...discarded } };
        }
    };
}

function sanitizeDiagnosticPlayback(snapshot) {
    if (!snapshot || typeof snapshot !== "object") return null;
    const players = Array.isArray(snapshot.players) ? snapshot.players : [];
    const playerCount = Math.max(players.length, diagnosticNumber(snapshot.playerCount, 1000000, 0));
    return {
        version: diagnosticVersion(snapshot.version), run: diagnosticAlias(snapshot.run, "run"),
        capturedAt: diagnosticNumber(snapshot.capturedAt, Date.now() + 60000),
        eventsDropped: diagnosticNumber(snapshot.eventsDropped, Number.MAX_SAFE_INTEGER, 0),
        inCall: snapshot.inCall === true, broadcastingRequested: snapshot.broadcastingRequested === true,
        audioRequested: snapshot.audioRequested === true,
        heightRequested: diagnosticNumber(snapshot.heightRequested, 16384),
        fpsRequested: diagnosticNumber(snapshot.fpsRequested, 240),
        playerCount, playersTruncated: playerCount > 16,
        players: players.slice(0, 16).map(player => ({
            player: diagnosticAlias(player?.player, "player"),
            surface: diagnosticEnum(player?.surface, DIAGNOSTIC_SURFACES),
            connected: player?.connected === true, videoObserved: player?.videoObserved === true,
            releasing: player?.releasing === true, mine: player?.mine === true,
            volumeRequested: diagnosticNumber(player?.volumeRequested, 2), mutedRequested: player?.mutedRequested === true
        }))
    };
}

function sanitizeDiagnosticTracks(value) {
    if (!value || typeof value !== "object") return null;
    return {
        videoTracks: diagnosticNumber(value.videoTracks, 32), liveVideoTracks: diagnosticNumber(value.liveVideoTracks, 32),
        audioTracks: diagnosticNumber(value.audioTracks, 32), enabledAudioTracks: diagnosticNumber(value.enabledAudioTracks, 32),
        width: diagnosticNumber(value.width, 16384), height: diagnosticNumber(value.height, 16384),
        fps: diagnosticNumber(value.fps, 240)
    };
}
