/**
 * One VDO.Ninja iframe for the stream being watched, moved between the stage and the PiP instead of
 * recreated, so switching between them keeps the stream playing.
 */

let streamFrame = null;
let frameParking = null;
let navigationPath = location.pathname;

const STAGE_FRAME_STYLE =
    "position:absolute;left:-3px;top:-3px;width:calc(100% + 6px);height:calc(100% + 6px);border:0;background:#000;pointer-events:none;";

const PIP_FRAME_STYLE = "position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;background:#000;";

/**
 * How long a stage frame parked for a navigation waits for the call screen to go away before it
 * returns to the stage.
 */
const PARKED_STAGE_FRAME_MS = 600;

function streamIdOf(item) {
    return item.mine || item.simulated ? state.pushId : item.key;
}

/**
 * Element.moveBefore moves an iframe without reloading it; appendChild and insertBefore reload it.
 */
function canMoveFrames() {
    return typeof Element.prototype.moveBefore === "function";
}

/**
 * Moves the stream frame into parent, before ref when ref is still a child of it.
 */
function placeStreamFrame(parent, ref, style) {
    const frame = streamFrame?.frame;
    if (!frame?.isConnected || !parent?.isConnected || !canMoveFrames()) return false;

    try {
        parent.moveBefore(frame, ref?.parentNode === parent ? ref : null);
    } catch (err) {
        log("stream frame move failed:", String(err));
        return false;
    }

    frame.style.cssText = style;
    return true;
}

/**
 * The stream's frame for the stage or the PiP: the current one moved into place when it plays the same
 * stream, otherwise a new one. playing tells whether its video is already on screen.
 */
function takeStreamFrame(parent, ref, item, style) {
    const streamId = streamIdOf(item);

    if (!streamId) {
        dropStreamFrame();
        return null;
    }

    const mine = Boolean(item.mine);
    const current = streamFrame;

    if (current && current.streamId === streamId && current.mine === mine && placeStreamFrame(parent, ref, style)) {
        return {
            frame: current.frame,
            playing: current.playing
        };
    }

    dropStreamFrame();
    const frame = document.createElement("iframe");
    frame.setAttribute("data-hugin-video", "");
    frame.allow = "autoplay; fullscreen";
    frame.style.cssText = style;
    frame.src = soloUrl(streamId, mine, itemQuality(item));
    frame.dataset.bitrate = String(requestedBitrate(itemQuality(item)));
    frame.dataset.huginStream = streamId;
    parent.insertBefore(frame, ref?.parentNode === parent ? ref : null);

    streamFrame = {
        frame,
        streamId,
        mine,
        playing: false
    };

    return {
        frame,
        playing: false
    };
}

/**
 * Keeps the frame alive off screen between the stage and the PiP. Returns false when it could not be
 * kept, in which case it is gone.
 */
function parkStreamFrame() {
    if (!streamFrame) return false;

    if (!frameParking?.isConnected) {
        frameParking = document.createElement("div");
        frameParking.setAttribute("data-hugin-parking", "");
        frameParking.style.cssText = "position:fixed;left:-10000px;top:0;width:640px;height:360px;pointer-events:none;";
        document.body.appendChild(frameParking);
    }

    if (placeStreamFrame(frameParking, null, PIP_FRAME_STYLE)) return true;
    dropStreamFrame();
    return false;
}

function dropStreamFrame() {
    streamFrame?.frame.remove();
    streamFrame = null;
}

function trackStreamFrame(event) {
    const current = streamFrame;
    if (!current || event.source !== current.frame.contentWindow) return;
    const data = event.data;
    if (vdoVideoStarted(data, current.streamId)) current.playing = true;
    else if (data?.action === "end-view-connection") current.playing = false;
}

/**
 * Discord removes the call screen, and the stage inside it, as soon as it navigates to another page.
 * The stage's frame is parked just before, so the PiP can take it over.
 */
function beforeNavigation(path) {
    const from = navigationPath;
    navigationPath = path;
    if (path === from || !watchScreen?.frame || watchScreen.parkedAt) return;
    if (streamFrame?.frame !== watchScreen.frame) return;
    if (parkStreamFrame()) watchScreen.parkedAt = Date.now();
}

function watchStreamFrames() {
    for (const method of ["pushState", "replaceState"]) {
        const original = history[method];

        history[method] = function (data, unused, url) {
            try {
                beforeNavigation(url == null ? navigationPath : new URL(String(url), location.href).pathname);
            } catch (err) {
                log("navigation hook:", String(err));
            }

            return original.apply(this, arguments);
        };
    }

    addEventListener("popstate", () => beforeNavigation(location.pathname), true);
    addEventListener("message", trackStreamFrame);
}
