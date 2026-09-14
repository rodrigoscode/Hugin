/**
 * Build constants, runtime configuration (defaults merged with config.json) and logging.
 */

const VERSION = "1.0.3";
const CHUNK_KEY = "webpackChunkdiscord_app";

/**
 * Defaults merged under config.json. fetchOwnProfile and fetchProfiles make requests with the user's
 * own token, which Discord's terms treat as a self-bot; set them to false to turn that off.
 */
const DEFAULTS = {
    vdoBase: "https://vdo.ninja",
    room: "",
    roomSecret: "",
    password: "",
    quality: "",
    bitrate: "",
    framerate: "",
    captureAudio: true,
    extraPushParams: "",
    extraViewParams: "",
    autoWatch: true,
    keepShareModalOpen: false,
    useNativePicker: false,
    replaceShareButton: true,
    hijackShareButton: true,
    enableWebpackHook: true,
    observeNetwork: true,
    fetchOwnProfile: true,
    fetchProfiles: true,
    playSounds: true
};

let config = {
    ...DEFAULTS,
    ...(native.config ?? {})
};

native
    .getConfig?.()
    .then(freshConfig => {
        if (!freshConfig || typeof freshConfig !== "object") return;

        config = {
            ...DEFAULTS,
            ...freshConfig
        };

        if (!config.replaceShareButton) restoreOriginalButton();
    })
    .catch(() => {});

let webpackRequire = null;

const log = (...args) => {
    console.log("%c[Hugin]", "color:#3ba55d;font-weight:bold", ...args);
    native.log(...args.map(a => (typeof a === "string" ? a : String(a))));
};

addEventListener(
    "error",
    event => {
        native.log(
            "[main world error]",
            String(event.message),
            `${event.filename}:${event.lineno}:${event.colno}`,
            String(event.error?.stack ?? "").slice(0, 2000)
        );
    },
    true
);

addEventListener(
    "unhandledrejection",
    event => {
        native.log("[unhandled rejection]", String(event.reason?.stack ?? event.reason).slice(0, 2000));
    },
    true
);
