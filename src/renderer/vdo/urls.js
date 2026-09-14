/**
 * VDO.Ninja URLs for publishing, the room scene and single-stream viewers.
 */

function query(params) {
    return Object.entries(params)
        .filter(([, v]) => v !== "" && v !== null && v !== undefined && v !== false)
        .map(([k, v]) => (v === true ? k : `${k}=${encodeURIComponent(v)}`))
        .join("&");
}

const vdoBase = () => String(config.vdoBase || DEFAULTS.vdoBase).replace(/\/+$/, "");

function targetBitrate(height, fps, mode) {
    const base = height >= 1080 ? 6000 : height >= 720 ? 3000 : 1200;
    const fpsFactor = fps >= 60 ? 1.4 : 1;
    const sourceFactor = mode === "camera" ? 0.7 : 1;
    return Math.round(base * fpsFactor * sourceFactor);
}

/**
 * The VDO.Ninja publish URL. Screen capture uses screensharequality=-1 so the requested height scales
 * the native resolution instead of forcing 1280x720. Screen video is marked as motion, so it keeps its
 * frame rate and lowers the resolution when a moving picture outgrows the bitrate. VDO.Ninja applies these
 * hints only to video tracks it swaps in later; the broadcast preload marks the first capture.
 */
function pushUrl(room, streamId, label, quality, mode, deviceLabel) {
    const sharingScreen = mode !== "camera";

    return `${vdoBase()}/?${query({
        room,
        push: streamId,
        screenshare: sharingScreen,
        webcam: mode === "camera",
        contenthint: sharingScreen ? "motion" : undefined,
        screensharecontenthint: sharingScreen ? "motion" : undefined,
        videodevice: mode === "camera" && deviceLabel ? deviceLabel : undefined,
        autostart: true,
        nomic: true,
        label: label || undefined,
        password: state.roomPassword || undefined,
        screensharequality: mode !== "camera" ? -1 : undefined,
        height: (quality?.height ?? config.quality) || undefined,
        fps: quality?.fps ?? config.framerate ?? undefined,
        screensharefps: mode !== "camera" ? (quality?.fps ?? config.framerate ?? undefined) : undefined,
        quality: config.quality || undefined,
        outboundvideobitrate: config.bitrate || targetBitrate(quality?.height || 1440, quality?.fps ?? 60, mode)
    })}${config.extraPushParams ? "&" + config.extraPushParams : ""}`;
}

/**
 * CSS injected into the stage's VDO.Ninja page (base64css) so the video fills the frame with no border
 * or background. VDO.Ninja sizes each video's container in pixels from a throttled resize handler, so
 * when the frame moves between the PiP and the stage the video would keep its old size for a moment;
 * filling the frame in CSS makes it follow at once, and its layout transitions are switched off.
 */
function vdoStageCss() {
    const css =
        "*,*::before,*::after{transition:none!important;animation:none!important}" +
        "#gridlayout>div{left:0!important;top:0!important;width:100%!important;height:100%!important}" +
        "#gridlayout .holder{width:100%!important;height:100%!important}" +
        "#gridlayout video{left:0!important;top:0!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important}" +
        ".holder{border-width:0!important;border-color:transparent!important;margin:0!important;outline:0!important;box-shadow:none!important}" +
        "#gridlayout,#gridlayout>div{border:0!important;outline:0!important;box-shadow:none!important}" +
        "video{border:0!important;outline:0!important;box-shadow:none!important}";

    return encodeURIComponent(btoa(encodeURIComponent(css)));
}

function itemQuality(item) {
    if (item?.mine || item?.simulated)
        return {
            height: state.resolution,
            fps: state.fps,
            mode: state.mode
        };

    return item?.quality ?? null;
}

/**
 * The bitrate (kbps) a viewer requests for an announced quality.
 */
function requestedBitrate(quality) {
    return config.bitrate || targetBitrate(quality?.height || 1440, quality?.fps ?? 60, quality?.mode ?? "screen");
}

/**
 * The highest bitrate offered. Viewers open with it because a publisher never exceeds the videobitrate
 * a connection was opened with; the real bitrate is posted afterwards.
 */
function bitrateCeiling() {
    return config.bitrate || targetBitrate(1440, 60, "screen");
}

/**
 * The URL of a single stream for the stage and PiP iframes (room, scene and view).
 */
function soloUrl(streamId, muted, quality = null, extra = null) {
    return `${vdoBase()}/?${query({
        room: extra?.room ?? (state.room || undefined),
        scene: true,
        view: streamId,
        transparent: true,
        noaudio: muted || undefined,
        scale: extra?.scale ?? 100,
        videobitrate: extra?.videobitrate ?? bitrateCeiling(),
        cleanoutput: true,
        autostart: true,
        password: extra?.password ?? (state.roomPassword || undefined)
    })}${config.extraViewParams ? "&" + config.extraViewParams : ""}&base64css=${vdoStageCss()}`;
}

function sceneUrl(room, excludeId) {
    return `${vdoBase()}/?${query({
        room,
        scene: true,
        cleanoutput: true,
        exclude: excludeId || undefined,
        password: state.roomPassword || undefined
    })}${config.extraViewParams ? "&" + config.extraViewParams : ""}`;
}

/**
 * Our announcement in a server lobby: a 4x2 synthetic video (the announce window replaces display
 * capture with a canvas) that only carries the label.
 */
function announceUrl(room, password, streamId, label) {
    return `${vdoBase()}/?${query({
        room,
        push: streamId,
        screenshare: true,
        autostart: true,
        nomic: true,
        label,
        password,
        height: 2,
        fps: 1
    })}`;
}

/**
 * A server lobby without media: it only learns who announces there.
 */
function lobbyUrl(room, password) {
    return `${vdoBase()}/?${query({
        room,
        scene: true,
        novideo: true,
        noaudio: true,
        cleanoutput: true,
        password
    })}`;
}
