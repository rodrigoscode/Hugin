const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { EventEmitter } = require("node:events");

function app(safetyReplies = [true, true], exitAfterReady = false) {
    const handlers = new Map(), listeners = new Map(), calls = [], children = [], external = [];
    let quit = 0;
    const sender = { mainFrame: {}, send(channel, token) {
        if (channel === "hugin:updateSafetyRequest") queueMicrotask(() => listeners.get("hugin:updateSafetyReply")(
            event, token, { known: true, idle: safetyReplies.shift() ?? false }));
    } };
    const event = { sender, senderFrame: sender.mainFrame };
    const release = { tag_name: "v1.0.11", name: "New version", body: "Release notes", published_at: "2026-11-15",
        html_url: "https://github.com/rodrigoscode/Hugin/releases/tag/v1.0.11", assets: [{ browser_download_url: "PRIVATE_DOWNLOAD_URL" }] };
    const context = vm.createContext({
        HUGIN_VERSION: "1.0.10", HELPER_EXE: "helper.exe", DATA_DIR: "data", __dirname: "patch", process: { pid: 123 },
        mainWindow: { isDestroyed: () => false, webContents: sender },
        electron: { ipcMain: { handle: (name, fn) => handlers.set(name, fn), on: (name, fn) => listeners.set(name, fn) },
            shell: { openExternal: async url => external.push(url) }, app: { quit: () => quit++ } },
        pending: null, systemAudio: null, views: new Map(), diagnosticClosingViews: new Map(),
        readFileSync: () => '{"branch":"stable"}', join: path.join, require,
        setTimeout, clearTimeout, setImmediate, log() {}, stopSystemAudio() {}, stopWindowWatcher() {},
        spawn(exe, args) {
            calls.push({ exe, args: Array.from(args) });
            const child = new EventEmitter(); child.stdout = new EventEmitter(); child.stdout.setEncoding = () => {}; child.stdout.unref = () => {};
            child.unref = () => {}; child.kill = () => { child.killed = true; setImmediate(() => child.emit("close", 1)); };
            children.push(child);
            setImmediate(() => {
                if (args[1] === "apply") { child.stdout.emit("data", '{"type":"ready"}\n'); if (exitAfterReady) child.emit("close", 1); return; }
                let result = { ok: true };
                if (args[1] === "check") result = { available: true, notify: true, release };
                if (args[1] === "download") result = { version: "1.0.11", sha256: "a".repeat(64) };
                child.stdout.emit("data", JSON.stringify({ type: "result", result }) + "\n"); child.emit("close", 0);
            });
            return child;
        }
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/main/core/updates.js"), "utf8"), context);
    return { event, calls, children, external, context, get quit() { return quit; },
        action: request => handlers.get("hugin:update")(event, request),
        invoke: (event, request) => handlers.get("hugin:update")(event, request) };
}

test("update IPC rejects other windows and child frames before invoking the helper", async () => {
    const a = app();
    assert.equal((await a.invoke({ sender: {}, senderFrame: {} }, { action: "download" })).ok, false);
    assert.equal((await a.invoke({ sender: a.event.sender, senderFrame: {} }, { action: "check" })).ok, false);
    assert.equal(a.calls.length, 0);
});

test("release checking exposes descriptions and never accepts executable paths from the renderer", async () => {
    const a = app();
    const result = await a.action({ action: "check", url: "https://evil.example", path: "evil.exe" });
    assert.equal(result.release.tag, "v1.0.11");
    assert.equal(JSON.stringify(result).includes("PRIVATE_DOWNLOAD_URL"), false);
    assert.deepEqual(a.calls[0], { exe: "helper.exe", args: ["update", "check"] });
    await a.action({ action: "release", url: "https://evil.example" });
    assert.deepEqual(a.external, ["https://github.com/rodrigoscode/Hugin/releases/tag/v1.0.11"]);
});

test("downloads are single-flight and require a selected release", async () => {
    const a = app();
    assert.equal((await a.action({ action: "download" })).ok, false);
    await a.action({ action: "check" });
    const download = a.action({ action: "download" });
    assert.equal((await a.action({ action: "download" })).reason, "busy");
    assert.equal((await download).prepared, true);
    assert.equal(a.calls.filter(call => call.args[1] === "download").length, 1);
});

test("installation is blocked for active or unknown calls and native media resources", async () => {
    const a = app(); await a.action({ action: "check" }); await a.action({ action: "download" });
    for (const safety of [{ known: false, idle: true }, { known: true, idle: false }, null])
        assert.equal((await a.action({ action: "install", safety })).reason, "call_active");
    a.context.views.set("scene", {});
    assert.equal((await a.action({ action: "install", safety: { known: true, idle: true } })).reason, "call_active");
    assert.equal(a.calls.some(call => call.args[1] === "apply"), false);
    assert.equal(a.quit, 0);
});

test("joining a call during handoff cancels the installer without quitting Discord", async () => {
    const a = app([true, false]); await a.action({ action: "check" }); await a.action({ action: "download" });
    assert.equal((await a.action({ action: "install", safety: { known: true, idle: true } })).ok, false);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(a.quit, 0);
    assert.equal(a.children.at(-1).killed, true);
});

test("successful handoff starts only the prepared executable with the approved version and hash", async () => {
    const a = app(); await a.action({ action: "check" }); await a.action({ action: "download" });
    assert.equal((await a.action({ action: "install", safety: { known: true, idle: true } })).ok, true);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(a.quit, 1);
    assert.deepEqual(a.calls.at(-1), { exe: path.join("data", "updates", "prepared", "Hugin.exe"),
        args: ["update", "apply", "stable", "123", "1.0.11", "a".repeat(64)] });
});

test("an installer that exits during readiness cannot trigger a late Discord quit", async () => {
    const a = app([true, true], true); await a.action({ action: "check" }); await a.action({ action: "download" });
    assert.equal((await a.action({ action: "install", safety: { known: true, idle: true } })).ok, false);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(a.quit, 0);
});
