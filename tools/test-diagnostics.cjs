const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const { EventEmitter } = require("node:events");

const source = path => readFileSync(resolve(__dirname, "..", path), "utf8");
const shared = source("src/shared/diagnostics.js");
const plain = value => JSON.parse(JSON.stringify(value));
function schema() {
    const context = vm.createContext({});
    vm.runInContext(shared, context);
    return context;
}

test("event schemas accept only known events, aliases, enums and bounded scalar fields", () => {
    const context = schema();
    const secret = "PRIVATE_TOKEN_PASSWORD_URL";
    const event = context.sanitizeDiagnosticEvent("player.created", {
        player: "player-1", mine: true, run: "run-abc123", surface: "stage",
        token: secret, url: secret, streamId: secret, reason: secret, label: secret
    });
    assert.deepEqual(plain(event), { name: "player.created", fields: { run: "run-abc123", player: "player-1", mine: true, surface: "stage" } });
    assert.equal(context.sanitizeDiagnosticEvent(secret), null);
    assert.equal(context.sanitizeDiagnosticEvent("__proto__"), null);
    assert.deepEqual(plain(context.sanitizeDiagnosticEvent("quality.changed", { height: Infinity, fps: -30, bitrate: secret })).fields, {});
    assert.equal(JSON.stringify(event).includes(secret), false);
    assert.deepEqual(plain(context.sanitizeDiagnosticEvent("runtime.error", {
        reason: "unhandled_error", errorType: "TypeError", line: 42, column: 7, message: secret, stack: secret
    })).fields, { reason: "unhandled_error", errorType: "TypeError", line: 42, column: 7 });
    assert.deepEqual(plain(context.sanitizeDiagnosticEvent("runtime.error", { errorType: secret, line: secret })).fields, {});
});

test("history discards oldest events at capacity and expires old events on export", () => {
    const context = schema();
    let time = 10000;
    const store = context.createDiagnosticStore({ now: () => time, limit: 3, maxAge: 100 });
    for (let i = 1; i <= 4; i++) {
        store.record("renderer", "player.created", { player: `player-${i}` });
        time++;
    }
    let snapshot = plain(store.snapshot());
    assert.deepEqual(snapshot.events.map(event => event.sequence), [2, 3, 4]);
    assert.equal(snapshot.discarded.capacity, 1);
    snapshot.events[0].fields.player = "mutated";
    assert.equal(store.snapshot().events[0].fields.player, "player-2");
    time += 101;
    snapshot = plain(store.snapshot());
    assert.equal(snapshot.events.length, 0);
    assert.equal(snapshot.discarded.expired, 3);
});

test("history bounds event floods, suppresses consecutive duplicates and normalizes timestamps", () => {
    const context = schema();
    let time = 10000;
    const store = context.createDiagnosticStore({ now: () => time, rate: 3 });
    store.record("renderer", "player.video", { player: "player-1" }, Infinity);
    store.record("renderer", "player.video", { player: "player-1" });
    store.record("main", "audio.started", {});
    store.record("main", "audio.stopped", {});
    store.record("invalid", "audio.started", {});
    let snapshot = plain(store.snapshot());
    assert.equal(snapshot.events.length, 2);
    assert.equal(snapshot.events[0].capturedAt, 10000);
    assert.equal(snapshot.discarded.repeated, 1);
    assert.equal(snapshot.discarded.rate, 1);
    assert.equal(snapshot.discarded.invalid, 1);
    time += 1001;
    assert.equal(store.record("main", "audio.stopped", {}), true);
});

test("playback and track snapshots omit arbitrary objects and distinguish requested from observed state", () => {
    const context = schema();
    const secret = "DO_NOT_EXPORT_THIS";
    const snapshot = context.sanitizeDiagnosticPlayback({
        version: "1.0.10", run: "run-123", inCall: true, broadcastingRequested: true,
        audioRequested: true, heightRequested: 720, fpsRequested: 30, config: { password: secret },
        players: Array.from({ length: 100 }, () => ({
            player: "player-1", surface: "parking", connected: true, videoObserved: false,
            streamId: secret, url: secret, volumeRequested: 2, token: secret
        }))
    });
    assert.equal(snapshot.players.length, 16);
    assert.equal(snapshot.playerCount, 100);
    assert.equal(snapshot.playersTruncated, true);
    assert.equal(context.sanitizeDiagnosticPlayback(snapshot).playerCount, 100);
    assert.equal(snapshot.players[0].surface, "parking");
    assert.equal(snapshot.players[0].videoObserved, false);
    assert.equal(snapshot.audioRequested, true);
    assert.equal(JSON.stringify(snapshot).includes(secret), false);
    const tracks = context.sanitizeDiagnosticTracks({ videoTracks: 1, liveVideoTracks: 1, audioTracks: 0, enabledAudioTracks: 0, label: secret });
    assert.equal(tracks.audioTracks, 0);
    assert.equal(JSON.stringify(tracks).includes(secret), false);
    assert.equal(context.diagnosticVersion(secret), "unknown");
});

test("diagnostic transport failures cannot escape into playback operations", () => {
    const context = schema();
    let calls = 0;
    context.native = { diagnosticEvent: () => { calls++; throw new Error("IPC closed"); } };
    vm.runInContext(source("src/renderer/core/diagnostics.js"), context);
    assert.doesNotThrow(() => context.recordDiagnostic("player.created", { player: "player-1" }));
    assert.equal(calls, 1);
});

function mainDiagnostics({ probe = () => Promise.resolve(null), clipboardFails = false } = {}) {
    const handlers = new Map(), listeners = new Map(), copied = [];
    const mainFrame = {};
    const wc = { mainFrame };
    const event = { sender: wc, senderFrame: mainFrame };
    const views = new Map();
    const context = vm.createContext({
        mainWindow: { isDestroyed: () => false, webContents: wc }, views, systemAudio: null,
        electron: {
            ipcMain: { handle: (name, fn) => handlers.set(name, fn), on: (name, fn) => listeners.set(name, fn) },
            clipboard: { writeText: text => { if (clipboardFails) throw new Error("clipboard unavailable"); copied.push(text); } },
            app: { getVersion: () => "1.0.9999" }
        },
        process: { versions: { electron: "40.1.0", chrome: "140.0.1.0" } },
        require: name => { assert.equal(name, "os"); return { release: () => "10.0.22631" }; },
        setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 20)), clearTimeout
    });
    vm.runInContext(shared + "\n" + source("src/main/core/diagnostics.js"), context);
    const broadcast = { isDestroyed: () => false, webContents: { executeJavaScript: probe } };
    return { context, event, views, broadcast, copied,
        copy: snapshot => handlers.get("hugin:copyDiagnostics")(event, snapshot),
        invoke: (event, snapshot) => handlers.get("hugin:copyDiagnostics")(event, snapshot),
        record: (event, payload) => listeners.get("hugin:diagnosticEvent")(event, payload) };
}

test("IPC accepts only the main window top frame and tolerates a destroyed sender", async () => {
    const app = mainDiagnostics();
    const stranger = { sender: {}, senderFrame: app.event.senderFrame };
    const subframe = { sender: app.event.sender, senderFrame: {} };
    assert.equal((await app.invoke(stranger, {})).ok, false);
    assert.equal((await app.invoke(subframe, {})).ok, false);
    app.record(stranger, { name: "audio.started" });
    app.record(subframe, { name: "audio.started" });
    const destroyed = { sender: app.event.sender, get senderFrame() { throw new Error("destroyed"); } };
    assert.equal((await app.invoke(destroyed, {})).ok, false);
    assert.equal(app.copied.length, 0);
    assert.equal(vm.runInContext("diagnosticStore.snapshot().events.length", app.context), 0);
});

test("report export includes native and renderer state without exporting secrets or raw logs", async () => {
    const secret = "SECRET_PASSWORD_ROOM_TOKEN_WINDOW_PATH";
    const app = mainDiagnostics({ probe: () => Promise.resolve({ videoTracks: 1, liveVideoTracks: 1, audioTracks: 0, enabledAudioTracks: 0, label: secret }) });
    app.views.set("broadcast", app.broadcast);
    app.views.set(secret, app.broadcast);
    vm.runInContext(`diagnosticCapture.password = ${JSON.stringify(secret)}`, app.context);
    app.record(app.event, { name: "player.created", fields: { player: "player-1", token: secret, run: "run-123" } });
    const result = await app.copy({ version: "1.0.10", players: [{ player: "player-1", surface: "stage", url: secret }], config: { password: secret } });
    assert.equal(result.ok, true);
    assert.equal(result.partial, false);
    const text = app.copied[0];
    assert.match(text, /Hugin session diagnostic/);
    assert.match(text, /player.created/);
    assert.match(text, /"audioTracks": 0/);
    assert.match(text, /"discord": "1.0.9999"/);
    assert.equal(text.includes(secret), false);
});

test("an unresponsive media probe yields one partial report and rejects concurrent exports", async () => {
    let finish;
    const app = mainDiagnostics({ probe: () => new Promise(resolve => { finish = resolve; }) });
    app.views.set("broadcast", app.broadcast);
    const first = app.copy({ version: "1.0.10" });
    const second = await app.copy({});
    assert.equal(second.reason, "busy");
    const result = await first;
    assert.equal(result.ok, true);
    assert.equal(result.partial, true);
    assert.match(app.copied[0], /"media": "timeout"/);
    finish({ videoTracks: 1 });
    await Promise.resolve();
    assert.equal(app.copied.length, 1);
});

test("failed media probes and missing renderer snapshots still produce a partial report", async () => {
    const app = mainDiagnostics({ probe: () => Promise.reject(new Error("PRIVATE_ERROR")) });
    app.views.set("broadcast", app.broadcast);
    const result = await app.copy(null);
    assert.equal(result.ok, true);
    assert.equal(result.partial, true);
    assert.equal(app.copied[0].includes("PRIVATE_ERROR"), false);
});

test("repeated exports do not queue more probes inside an unresponsive media window", async () => {
    let probes = 0;
    const app = mainDiagnostics({ probe: () => { probes++; return new Promise(() => {}); } });
    app.views.set("broadcast", app.broadcast);
    assert.equal((await app.copy({ version: "1.0.10" })).partial, true);
    assert.equal((await app.copy({ version: "1.0.10" })).partial, true);
    assert.equal(probes, 1);
    assert.equal(app.copied.length, 2);
});

test("clipboard failure is reported and the next export can retry", async () => {
    const app = mainDiagnostics({ clipboardFails: true });
    assert.equal((await app.copy({})).reason, "copy_failed");
    assert.equal((await app.copy({})).reason, "copy_failed");
});

test("unavailable version metadata does not prevent a partial report", async () => {
    const app = mainDiagnostics();
    app.context.electron.app.getVersion = () => { throw new Error("PRIVATE_VERSION_ERROR"); };
    const result = await app.copy({ version: "1.0.10" });
    assert.equal(result.ok, true);
    assert.equal(result.partial, true);
    assert.match(app.copied[0], /"discord": "unknown"/);
    assert.equal(app.copied[0].includes("PRIVATE_VERSION_ERROR"), false);
});

test("native windows pending destruction remain visible in diagnostic resources", async () => {
    const app = mainDiagnostics();
    app.context.closingWindow = app.broadcast;
    vm.runInContext('diagnosticClosingViews.set(closingWindow, "broadcast")', app.context);
    const result = await app.copy({ version: "1.0.10" });
    assert.equal(result.ok, true);
    assert.match(app.copied[0], /"viewCount": 1/);
    assert.match(app.copied[0], /"closing": true/);
});

test("closing the requesting window during collection prevents a late clipboard write", async () => {
    let finish;
    const app = mainDiagnostics({ probe: () => new Promise(resolve => { finish = resolve; }) });
    app.views.set("broadcast", app.broadcast);
    const task = app.copy({});
    await Promise.resolve();
    app.context.mainWindow = null;
    finish(null);
    assert.equal((await task).ok, false);
    assert.equal(app.copied.length, 0);
});

test("audio helper events distinguish spawn from request and retain their original operation", () => {
    const events = [], children = [];
    let operation = "operation-1";
    const context = vm.createContext({
        Buffer, HELPER_EXE: "PRIVATE_HELPER_PATH", DEBUG_MODE: false, process: { pid: 999 },
        existsSync: () => true, log() {},
        diagnosticCaptureContext: () => ({ run: "run-123", operation }),
        recordDiagnostic: (name, fields) => events.push({ name, fields }),
        spawn: () => {
            const child = new EventEmitter();
            child.stdout = new EventEmitter();
            child.stderr = new EventEmitter();
            child.stderr.setEncoding = () => {};
            child.kill = () => {};
            children.push(child);
            return child;
        }
    });
    vm.runInContext(source("src/main/capture/system-audio.js"), context);
    const target = { isDestroyed: () => false, once() {}, send() {} };
    assert.equal(context.startSystemAudio(target), true);
    assert.equal(events.length, 0, "Request alone must not be reported as an observed spawn");
    children[0].emit("spawn");
    assert.equal(events[0].name, "audio.started");
    operation = "operation-2";
    context.stopSystemAudio();
    assert.equal(events[1].name, "audio.stopped");
    assert.equal(events[1].fields.operation, "operation-1");
    children[0].emit("exit", 0);
    assert.equal(events[2].fields.operation, "operation-1");
    assert.equal(context.startSystemAudio(target), true);
    children[1].emit("error", new Error("PRIVATE_ERROR"));
    assert.equal(vm.runInContext("systemAudio", context), null);
    assert.equal(events[3].name, "audio.failed");
    assert.equal(events[3].fields.operation, "operation-2");
    assert.equal(JSON.stringify(events).includes("PRIVATE_"), false);
});

test("closing role windows remain tracked until the destruction fallback finishes", async () => {
    const closing = new Map();
    const win = new EventEmitter();
    let destroyed = false;
    win.isDestroyed = () => destroyed;
    win.hide = () => {};
    win.destroy = () => { destroyed = true; win.emit("closed"); };
    win.webContents = { executeJavaScript: () => new Promise(() => {}) };
    const context = vm.createContext({
        diagnosticClosingViews: closing, lastRect: new Map(), win,
        recordDiagnostic() {}, log() {}, mainWindow: null,
        setTimeout: fn => setTimeout(fn, 10), clearTimeout
    });
    vm.runInContext(source("src/main/views/registry.js"), context);
    vm.runInContext('views.set("broadcast", win); destroyView("broadcast", { notifyViewers: true })', context);
    assert.equal(closing.size, 1);
    assert.equal(vm.runInContext("views.size", context), 0);
    assert.equal(destroyed, false);
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.equal(destroyed, true);
    assert.equal(closing.size, 0);
});
