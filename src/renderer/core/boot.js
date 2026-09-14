/**
 * Startup, the load marker and, with --debug, the console handle on globalThis.
 */

/**
 * Diagnostic: logs when our layers pile up or cover a large part of the window.
 */
function watchLayers() {
    setInterval(() => {
        try {
            const hosts = document.querySelectorAll("[data-hugin]");
            const oversized = [];
            for (const host of hosts) {
                const shadowRoot = host.shadowRoot;
                if (!shadowRoot) continue;
                for (const el of shadowRoot.querySelectorAll(".backdrop, .pop, .menu")) {
                    const r = el.getBoundingClientRect();
                    const area = r.width * r.height;
                    if (area > innerWidth * innerHeight * 0.25) {
                        oversized.push(`${el.className}=${Math.round(r.width)}x${Math.round(r.height)}`);
                    }
                }
            }
            if (hosts.length > 3 || oversized.length) {
                log("layers:", hosts.length, "host(s)", oversized.length ? "| covering: " + oversized.join(", ") : "");
            }
        } catch {}
    }, 5000);
}

function watchShareButton() {
    setInterval(() => {
        try {
            scanShareButton();
        } catch (err) {
            log("scanShareButton threw:", err);
        }
    }, 1500);
}

/**
 * Starts the share button scan, badges, the server lobby, label polling and the voice channel watch.
 */
function boot() {
    ensureFonts().catch(err => log("ensureFonts threw:", err));
    render();
    watchProbing();
    scanShareButton();
    watchShareButton();
    watchLiveBadges();
    watchLobby();
    watchLabels();
    watchVoiceChannel();
    watchStreamFrames();
    watchCallTiles();
    addEventListener("resize", syncViewBounds);

    if (native.debug) {
        watchLayers();

        try {
            const nativeWindow = globalThis.DiscordNative?.window;
            log("DiscordNative.window:", nativeWindow ? Object.keys(nativeWindow).join(",") : "MISSING");
        } catch (err) {
            log("DiscordNative unreachable:", err);
        }
    }

    log("ready. version", VERSION);
}

if (document.body) boot();
else
    document.addEventListener("DOMContentLoaded", boot, {
        once: true
    });

native
    .overlay?.({
        action: "destroy"
    })
    .catch(() => {});

/**
 * The console handle for debugging: internals plus a few test hooks.
 */
function debugHandle() {
    return {
        version: VERSION,
        state,
        stores,
        get config() {
            return config;
        },
        get require() {
            return webpackRequire;
        },
        findByProps,
        acquireWebpackRequire,
        playSound,
        loadSounds,
        voiceChannelId,
        roomForChannel,
        beginBroadcast,
        stopBroadcast,
        joinRoom,
        leaveRoom,
        openShareModal,
        openWatchScreen,
        closeWatchScreen,
        syncLiveBadges,
        syncActivityPanel,
        streamerForUser,
        openLivePreview,
        closeLivePreview,
        simulateViewer(enable = true) {
            state.simulateViewer = Boolean(enable);
            syncActivityPanel();
            return state.simulateViewer ? "viewer simulation ON" : "viewer simulation off";
        },
        testWindow(action = "minimize") {
            const nativeWindow = globalThis.DiscordNative?.window;
            if (!nativeWindow?.[action]) return `DiscordNative.window.${action} doesn't exist`;

            try {
                nativeWindow[action]();
                return `called ${action}()`;
            } catch (err) {
                return `${action}() threw: ${err}`;
            }
        },
        search(needle) {
            if (!webpackRequire?.m) return [];
            const test = needle instanceof RegExp ? s => needle.test(s) : s => s.includes(needle);
            const hits = [];

            for (const id in webpackRequire.m) {
                try {
                    if (test(webpackRequire.m[id].toString())) hits.push(id);
                } catch {}
            }

            return hits;
        },
        dump(id) {
            const source = webpackRequire?.m?.[id]?.toString() ?? null;
            if (source) native.copy(source);
            return source;
        }
    };
}

/**
 * Marks the payload as loaded, so a second injection bails out; with --debug it is also the console
 * handle.
 */
globalThis.__HUGIN__ = native.debug
    ? debugHandle()
    : {
          version: VERSION
      };
