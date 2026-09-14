/**
 * Access to Discord's webpack modules and stores, only after the app has mounted.
 */

const stores = {
    selectedChannel: null,
    currentUser: null,
    users: null,
    voiceStates: null,
    mediaEngine: null
};

const REQUIRED_STORES = ["selectedChannel", "currentUser", "users", "voiceStates"];

function acquireWebpackRequire() {
    if (webpackRequire) return webpackRequire;
    const chunks = globalThis[CHUNK_KEY];
    if (!Array.isArray(chunks) || typeof chunks.push !== "function") return null;

    try {
        chunks.push([
            [Symbol("hugin")],
            {},
            r => {
                webpackRequire = r;
            }
        ]);
        chunks.pop();
    } catch (err) {
        log("couldn't get __webpack_require__:", err);
    }

    return webpackRequire;
}

/**
 * Looks up whichever Discord stores are still missing. Returns true once none are left.
 */
function acquireStores() {
    const req = config.enableWebpackHook ? acquireWebpackRequire() : null;

    if (!req?.c) {
        log("webpack: not obtained");
        return true;
    }

    const previous = REQUIRED_STORES.filter(name => stores[name]).length;
    stores.selectedChannel ??= findByProps("getVoiceChannelId");
    stores.currentUser ??= findByProps("getCurrentUser");
    stores.users ??= findByProps("getUser", "getUsers");
    stores.voiceStates ??= findByProps("getVoiceStatesForChannel");
    stores.mediaEngine ??= findByProps("getInputDeviceId", "getInputDevices");
    const current = REQUIRED_STORES.filter(name => stores[name]).length;

    if (native.debug && (current !== previous || previous === 0)) {
        log(
            "stores:",
            current + "/" + REQUIRED_STORES.length,
            "| cache:",
            Object.keys(req.c).length,
            "| factories:",
            req.m ? Object.keys(req.m).length : "-",
            "| channel=" + Boolean(stores.selectedChannel),
            "user=" + Boolean(stores.currentUser),
            "users=" + Boolean(stores.users),
            "voice=" + Boolean(stores.voiceStates)
        );
    }

    return current === REQUIRED_STORES.length;
}

/**
 * The microphone Discord is using, as its picker summary writes it; empty when the store is
 * unavailable.
 */
function inputDeviceName() {
    const engine = stores.mediaEngine;
    if (!engine) return "";

    try {
        const id = engine.getInputDeviceId?.();
        const devices = engine.getInputDevices?.() ?? {};
        return devices[id]?.name ?? "";
    } catch (err) {
        log("microphone name:", err);
        return "";
    }
}

function findByProps(...props) {
    if (!webpackRequire?.c) return null;

    for (const id in webpackRequire.c) {
        let exports;
        try {
            exports = webpackRequire.c[id]?.exports;
        } catch {
            continue;
        }
        if (!exports) continue;
        for (const candidate of [exports, exports.default, exports.Z, exports.ZP, exports.A]) {
            try {
                if (!candidate || (typeof candidate !== "object" && typeof candidate !== "function")) continue;
                if (props.every(prop => candidate[prop] !== undefined)) return candidate;
            } catch {}
        }
    }

    return null;
}
