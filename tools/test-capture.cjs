const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = path => readFileSync(resolve(__dirname, "..", path), "utf8");

for (const role of ["identify", "announce"]) {
    test(`${role} publishes synthetic video without opening display capture`, async () => {
        let realCaptures = 0;
        const video = { getVideoTracks: () => [{}] };
        const canvas = {
            getContext: () => ({ fillRect() {} }),
            captureStream: fps => {
                assert.equal(fps, 1);
                return video;
            }
        };
        const context = vm.createContext({
            process: { argv: [`--hugin-role=${role}`] },
            require: () => ({
                ipcRenderer: { on() {} },
                contextBridge: { executeInMainWorld: ({ func }) => func() }
            }),
            navigator: { mediaDevices: { getDisplayMedia: async () => { realCaptures++; } } },
            document: { createElement: () => canvas },
            window: { addEventListener() {} },
            setInterval() {}
        });
        vm.runInContext(source("src/preload/view-preload.js"), context);
        const stream = await context.navigator.mediaDevices.getDisplayMedia({ video: true });
        assert.equal(stream, video);
        assert.equal(realCaptures, 0);
        assert.equal(canvas.width, 4);
        assert.equal(canvas.height, 2);
    });
}

function captureSession(role, sources) {
    let handler;
    const enumerations = [];
    const session = {
        setUserAgent() {},
        setPermissionRequestHandler() {},
        setPermissionCheckHandler() {},
        setDisplayMediaRequestHandler: value => { handler = value; }
    };
    const context = vm.createContext({
        sessionReady: false,
        PARTITION: "test",
        CHROME_UA: "test",
        DEBUG_MODE: false,
        pending: { sourceId: "screen:1:0", audio: false },
        electron: {
            session: { fromPartition: () => session },
            desktopCapturer: {
                getSources: async options => { enumerations.push(options); return sources; }
            }
        },
        roleForWebContents: () => role,
        watchSharedWindow() {},
        log() {}
    });
    vm.runInContext(source("src/main/capture/session.js"), context);
    context.prepareSession();
    return {
        enumerations,
        request: async () => {
            const replies = [];
            await handler({ frame: {} }, response => replies.push(response));
            assert.equal(replies.length, 1);
            return replies[0];
        }
    };
}

test("identity and viewer windows cannot open a real source even if the preload fails", async () => {
    for (const role of ["identify", "announce", "watch", null]) {
        const session = captureSession(role, [{ id: "screen:1:0" }]);
        assert.deepEqual(Object.keys(await session.request()), []);
        assert.equal(session.enumerations.length, 0);
    }
});

test("broadcast resolves only the chosen source without generating thumbnails", async () => {
    const chosen = { id: "screen:1:0", name: "Screen 1" };
    const session = captureSession("broadcast", [{ id: "screen:2:0" }, chosen]);
    assert.equal((await session.request()).video, chosen);
    assert.equal(session.enumerations.length, 1);
    const options = session.enumerations[0];
    assert.equal(Array.from(options.types).join(","), "screen");
    assert.equal(options.thumbnailSize.width, 0);
    assert.equal(options.thumbnailSize.height, 0);
    assert.equal(options.fetchWindowIcons, false);
});

test("a missing capture source does not silently select another screen", async () => {
    const session = captureSession("broadcast", [{ id: "screen:2:0" }]);
    assert.deepEqual(Object.keys(await session.request()), []);
});
