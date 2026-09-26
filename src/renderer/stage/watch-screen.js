/**
 * The in-call stage: video iframe, volume, sizing and placeholder cards.
 */

const WATCH_SCREEN_MARK = "data-hugin-watch-screen";
let watchScreen = null;

function chatPage() {
    return document.querySelector('[class*="page__5e434"]');
}

const WATCH_STYLE_ID = "hugin-watch-style";

/**
 * Keeps a copy of the stage CSS on the page; Discord unloads that chunk while its call view is not
 * mounted.
 */
function ensureWatchStyle() {
    if (document.getElementById(WATCH_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = WATCH_STYLE_ID;

    const secondaryRules = CAPTURED_STAGE_STATES_CSS.split(/(?<=\})\s*/)
        .filter(rule => /^\.secondary_a22cb0[\s:{]/.test(rule))
        .join("\n");

    style.textContent =
        scopeWatchCss(CAPTURED_STAGE_STATES_CSS) +
        scopeWatchCss(CAPTURED_VOLUME_CSS) +
        CAPTURED_WATCH_CSS +
        scopeWatchCss(secondaryRules) +
        scopeWatchCss(CAPTURED_ZOOM_CSS) +
        ".full-motion [data-hugin-watch-screen] .minimapIndicator__07fe9::after { transition: var(--custom-zoom-indicator-transition); }" +
        ".full-motion [data-hugin-watch-screen] .videoContainer__1505a.zoomed__1505a { transition: var(--custom-zoom-transition); }" +
        "[data-hugin-host] > :not([data-hugin-watch-screen]) { display: none !important; }" +
        "html [data-hugin-watch-screen] .root_bfe55a.idle_bfe55a:not(:focus-within) .topControls_bfe55a { opacity: 0; transform: translate3d(0px, -8px, 0px); }" +
        "html [data-hugin-watch-screen] .root_bfe55a.idle_bfe55a:not(:focus-within) .bottomControls_bfe55a { opacity: 0; transform: translate3d(0px, 8px, 0px); }" +
        "html [data-hugin-watch-screen] .root_bfe55a.idle_bfe55a:not(:focus-within) .gradientContainer_bfe55a { opacity: 0; }" +
        "html [data-hugin-watch-screen] .root_bfe55a.idle_bfe55a:not(:focus-within) { cursor: none; }" +
        ".full-motion [data-hugin-watch-screen] .controlSection_bfe55a { transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out; }" +
        "[data-hugin-watch-screen] .callContainer_cb9592 { border-top-width: 0 !important; border-inline-end-width: 0 !important; }" +
        "[data-hugin-watch-grid] { position:absolute; inset:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; background:#000; padding:8px; box-sizing:border-box; z-index:1; }" +
        "[data-hugin-watch-slot] { position:relative; min-width:0; min-height:0; overflow:hidden; border-radius:8px; background:#000; }" +
        "[data-hugin-watch-grid][data-hugin-focused] { display:block; }" +
        "[data-hugin-watch-grid][data-hugin-focused] > [data-hugin-watch-slot] { display:none; position:absolute; inset:0; border-radius:8px; }" +
        "[data-hugin-watch-grid][data-hugin-focused] > [data-hugin-slot-focused] { display:block; }" +
        "[data-hugin-watch-slot-label] { position:absolute; left:10px; bottom:8px; right:10px; z-index:2; color:#fff; font:600 13px/18px var(--font-primary); text-shadow:0 1px 3px #000; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; pointer-events:none; }";

    document.head.appendChild(style);
}

/**
 * Prefixes every selector with our stage marker.
 */
function scopeWatchCss(css) {
    return css.replace(/(^|\})\s*([^{}@]+)\{/g, (match, closing, selectors) => {
        const scoped = selectors
            .split(",")
            .map(part => part.trim())
            .filter(Boolean)
            .map(part => `[${WATCH_SCREEN_MARK}] ${part}`)
            .join(", ");

        return `${closing} ${scoped} {`;
    });
}

function wireWatchControls(node) {
    const stop = node.querySelector('[aria-label="Parar de transmitir"]');

    stop?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        stopBroadcast().catch(err => log("stopBroadcast:", err));
    });

    const caret =
        node.querySelector('[class*="contextMenuNub_"][class*="greenGlow"]') ??
        node.querySelector('[class*="attachedCaret_"]');

    caret?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openStreamMenu(caret);
    });
}

/**
 * Replaces the stage's disconnect button with "Parar de assistir", which only closes the stage.
 */
function swapDisconnectForStopWatching(node) {
    const disconnectButton = node.querySelector('button[aria-label="Desconectar"]');
    const frameElement = disconnectButton?.closest('[class*="attachedCaretButtonContainer_"]')?.parentElement;
    if (!frameElement) return;
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_STOP_WATCHING_HTML;
    const next = shell.firstElementChild;
    if (!next) return;
    frameElement.replaceWith(next);

    next.querySelector('button[aria-label="Parar de assistir"]')?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeWatchScreen();
    });
}

/**
 * Removes the green broadcast button from someone else's stage: like Discord, it only shows on your own
 * stream, even while you broadcast.
 */
function dropBroadcastButton(node) {
    const stop = node.querySelector('button[aria-label="Parar de transmitir"]');
    const broadcastBlock = stop?.closest('[class*="attachedCaretButtonContainer_"]')?.parentElement?.parentElement;
    if (!broadcastBlock) return;
    const section = broadcastBlock.closest('[class*="buttonSection__"]');
    broadcastBlock.remove();
    if (section) section.style.display = section.querySelector("button, [role='button']") ? "" : "none";
}

/**
 * Keeps each viewer iframe's requested bitrate in line with the broadcaster's current quality.
 */
function syncIframeBitrates() {
    const list = streamers();
    const targets = [];

    for (const item of watchItemsOf(watchScreen?.item)) {
        const frame = (watchScreen?.frames ?? []).find(entry => entry.dataset.huginStream === streamIdOf(item));
        targets.push([item, frame ?? watchScreen?.frame]);
    }

    targets.push([pip?.item, pip?.frame]);

    for (const [item, frame] of targets) {
        if (!item || !frame?.contentWindow || !frame.isConnected) continue;
        const current = item.mine || item.simulated ? item : (list.find(entry => entry.key === item.key) ?? item);
        applyFrameBitrate(frame, current);
    }
}

function postFrameBitrate(frame) {
    const bitrate = Number(frame?.dataset.bitrate);
    if (!frame?.contentWindow || !Number.isFinite(bitrate) || bitrate <= 0) return;
    frame.contentWindow.postMessage(
        {
            bitrate
        },
        "*"
    );
}

function applyFrameBitrate(frame, item, options = {}) {
    if (!frame?.contentWindow || !frame.isConnected || !item) return;
    const bitrate = String(requestedBitrate(itemQuality(item)));
    if (!options.force && frame.dataset.bitrate === bitrate) return;
    frame.dataset.bitrate = bitrate;
    postFrameBitrate(frame);
    log("bitrate requested from the broadcaster:", bitrate, "kbps", item.mine ? "(own)" : item.label);
}

function primeFrameBitrate(frame, item) {
    applyFrameBitrate(frame, item, {
        force: true
    });

    for (const delay of [500, 1500, 3500]) {
        setTimeout(() => applyFrameBitrate(frame, item, { force: true }), delay);
    }
}

function streamVolume(streamId) {
    return streamId && state.streamVolumes.has(streamId) ? state.streamVolumes.get(streamId) : (state.volume ?? 1);
}

function streamMuted(streamId) {
    return streamId && state.streamMuted.has(streamId) ? state.streamMuted.get(streamId) : Boolean(state.muted);
}

function setStreamVolume(streamId, value) {
    const volume = Math.max(0, Math.min(2, value));
    if (streamId) state.streamVolumes.set(streamId, volume);
    else state.volume = volume;
}

function setStreamMuted(streamId, muted) {
    if (streamId) state.streamMuted.set(streamId, Boolean(muted));
    else state.muted = Boolean(muted);
}

function frameForStream(streamId) {
    if (!streamId) return watchScreen?.frame ?? null;
    return (watchScreen?.frames ?? []).find(frame => frame.dataset.huginStream === streamId) ?? null;
}

/**
 * Sends the stage volume (0 to 200%) to the stage iframe: VDO.Ninja's own volume up to 100%, a gain
 * node above it. The gain node plays the stream through Web Audio, which can cut the sound, so it only
 * comes in once the volume passes 100%, and then keeps the level for that frame.
 */
function sendVolumeToStage(frame = null, streamId = null) {
    const target = frame ?? frameForStream(streamId);
    if (!target?.contentWindow) return;
    const id = streamId || target.dataset.huginStream || null;
    const level = streamMuted(id) ? 0 : Math.max(0, Math.min(2, streamVolume(id)));

    target.contentWindow.postMessage(
        {
            volume: Math.min(1, level)
        },
        "*"
    );

    if (level > 1) target.dataset.huginGain = "on";

    if (id && target.dataset.huginGain === "on" && native.setStreamGain) {
        native
            .setStreamGain({
                streamId: id,
                gain: level
            })
            .catch(err => log("setStreamGain:", String(err)));
    }
}

function mountWatchVolume(node, item) {
    if (item?.mine) return;
    const streamId = streamIdOf(item);
    const corner = node.querySelector('[class*="edgeControlsEnd_bfe55a"]');
    if (!corner) return;
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_VOLUME_HTML;
    const control = shell.firstElementChild;
    if (!control) return;
    corner.insertBefore(control, corner.firstChild);
    const bar = control.querySelector('[class*="mediaBarProgress_"]');
    const button = control.querySelector('[class*="volumeButton__"]');
    let icon = button?.querySelector("svg");
    let currentShape = null;

    const draw = () => {
        const v = streamMuted(streamId) ? 0 : Math.max(0, Math.min(1, streamVolume(streamId)));
        if (bar) {
            bar.style.width = `${Math.round(v * 100)}%`;
            bar.classList.toggle("fakeEdges_b26b79", v > 0);
        }
        if (!icon) return;
        const shape = v === 0 ? "muted" : v <= 0.5 ? "half" : "full";
        if (shape === currentShape) return;
        const template = document.createElement("div");
        template.innerHTML = CAPTURED_VOLUME_ICONS[shape];
        const next = template.firstElementChild;
        if (!next) return;
        icon.replaceWith(next);
        icon = next;
        currentShape = shape;
    };

    const apply = value => {
        setStreamVolume(streamId, value);
        draw();
        syncViewBounds();
        sendVolumeToStage(null, streamId);
    };

    const track = control.querySelector('[class*="mediaBarWrapper_"]');
    const interaction = control.querySelector('[class*="mediaBarInteraction_"]');
    const DRAGGING_CLASS = "mediaBarInteractionDragging_b26b79";

    const levelAtPoint = event => {
        const box = track.getBoundingClientRect();
        return box.height > 0 ? (box.bottom - event.clientY) / box.height : streamVolume(streamId);
    };

    interaction?.addEventListener("mousedown", event => {
        if (event.button !== 0 || !track) return;
        event.preventDefault();
        event.stopPropagation();
        interaction.classList.add(DRAGGING_CLASS);
        apply(levelAtPoint(event));
        const move = ev => apply(levelAtPoint(ev));

        const drop = () => {
            removeEventListener("mousemove", move, true);
            removeEventListener("mouseup", drop, true);
            interaction.classList.remove(DRAGGING_CLASS);
            if (slider && !control.matches(":hover")) slider.classList.remove(VISIBLE_CLASS);
        };

        addEventListener("mousemove", move, true);
        addEventListener("mouseup", drop, true);
    });

    interaction?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
    });

    const slider = control.querySelector('[class*="volumeButtonSlider__"]');
    const VISIBLE_CLASS = "sliderVisible__2d263";

    if (slider) {
        let hide = 0;
        control.addEventListener("mouseenter", () => {
            clearTimeout(hide);
            slider.classList.add(VISIBLE_CLASS);
        });
        control.addEventListener("mouseleave", () => {
            clearTimeout(hide);

            hide = setTimeout(() => {
                if (interaction?.classList.contains(DRAGGING_CLASS)) return;
                slider.classList.remove(VISIBLE_CLASS);
            }, 300);
        });
    }

    let previous = 1;

    button?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        if (streamMuted(streamId)) {
            setStreamMuted(streamId, false);
            draw();
            sendVolumeToStage(null, streamId);
            return;
        }

        if (streamVolume(streamId) > 0) {
            previous = streamVolume(streamId);
            apply(0);
        } else apply(previous || 1);
    });

    draw();

    return {
        redraw: draw,
        apply: apply
    };
}

const seenAspects = new Map();

function knownAspect(item) {
    const streamId = item.mine || item.simulated ? state.pushId : item.key;
    const fromScene = item.mine || item.simulated ? 0 : streamers().find(entry => entry.key === item.key)?.aspect || 0;
    const value = fromScene || seenAspects.get(streamId) || 0;
    return value > 0.2 && value < 10 ? value : 0;
}

/**
 * How long the loading card may show, with the stream still live, before the stage reloads its iframe.
 */
const STAGE_RELOAD_MS = 6000;

const STAGE_EVENTS = new Set(["end-view-connection", "new-video-track-added", "video-element-created", "aspect-ratio"]);

/**
 * Reloads a stage iframe for real: assigning the same src does not always navigate again.
 */
function reloadStageFrame(frame) {
    const url = frame.src;
    frame.huginUuid = null;
    frame.src = "about:blank";

    setTimeout(() => {
        if (frame.isConnected) frame.src = url;
    }, 50);
}

/**
 * Reloads the stage when the loading card has shown for a while and the stream is still live: after the
 * broadcaster switches source, the iframe does not always pick the new stream up by itself.
 */
function reloadStuckStage(frame, streamId) {
    if (!watchScreen || watchScreen.placeholderKind !== "loading") return;
    if (Date.now() - (watchScreen.placeholderSince ?? 0) < STAGE_RELOAD_MS) return;
    if (!streamers().some(entry => entry.key === watchScreen.item.key)) return;
    log("stage: still loading, reloading", String(streamId).slice(0, 12));
    watchScreen.placeholderSince = Date.now();
    reloadStageFrame(frame);
}

function vdoVideoStarted(data, streamId) {
    return Boolean(data) && data.action === "aspect-ratio" && (!data.streamID || data.streamID === streamId);
}

/**
 * Mounts the stream's VDO.Ninja iframe in the stage and follows its messages: first frame, aspect
 * ratio and connection end.
 */
function mountWatchVideo(node, item, options = {}) {
    const sizer = node.querySelector('[class*="videoSizer_a21736"]');
    if (!sizer) return null;
    const zoomBox = sizer.querySelector('[class*="videoContainer__1505a"]');
    const overlay = sizer.querySelector('[class*="overlayContainer__2f4f7"]');
    let slot;

    if (zoomBox) {
        slot = {
            parent: zoomBox,
            ref: null
        };
    } else if (overlay && overlay.parentElement) {
        slot = {
            parent: overlay.parentElement,
            ref: overlay
        };
    } else {
        sizer.style.position ||= "relative";
        slot = {
            parent: sizer,
            ref: null
        };
    }

    const taken = takeStreamFrame(slot.parent, slot.ref, item, STAGE_FRAME_STYLE, options);

    if (!taken) {
        log("no stream id for the iframe:", item.key);
        return null;
    }

    const { frame } = taken;
    const streamId = frame.dataset.huginStream;
    const tileVideo = frame.closest('[class*="tile__2f4f7"]');

    if (tileVideo) {
        tileVideo.style.backgroundColor = "#000";
        tileVideo.style.overflow = "hidden";
        for (const background of tileVideo.querySelectorAll('[class*="wrapper__1505a"]')) {
            background.style.backgroundColor = "#000";
        }
    }

    const onMessage = event => {
        if (event.source !== frame.contentWindow) return;
        const data = event.data;

        if (native.debug && STAGE_EVENTS.has(data?.action)) {
            log("stage iframe:", data.action, String(data.UUID ?? "-").slice(0, 8), String(data.value ?? "").slice(0, 12));
        }

        if (
            data &&
            data.streamID === streamId &&
            data.UUID &&
            (data.action === "video-element-created" || data.action === "new-video-track-added")
        ) {
            frame.huginUuid = data.UUID;
        }

        if (!item.mine && data && (data.action === "new-video-track-added" || vdoVideoStarted(data, streamId))) {
            sendVolumeToStage(frame, streamId);
        }

            if (
                data &&
                frame.dataset.bitrate &&
                (data.action === "new-video-track-added" || vdoVideoStarted(data, streamId))
            ) {
                postFrameBitrate(frame);
            }

        if (vdoVideoStarted(data, streamId)) {
            const aspect = parseFloat(data.value);
            const fromCurrentVideo = !frame.huginUuid || !data.UUID || data.UUID === frame.huginUuid;
            const accepted = fromCurrentVideo && aspect > 0.2 && aspect < 10;
            (frame.huginAspects ||= []).push({
                t: Math.round(performance.now()),
                value: String(data.value).slice(0, 12),
                uuid: String(data.UUID || "-").slice(0, 8),
                current: String(frame.huginUuid || "-").slice(0, 8),
                accepted: accepted
            });
            if (frame.huginAspects.length > 20) frame.huginAspects.shift();
            if (accepted) {
                node.dataset.huginAspect = String(aspect);
                seenAspects.set(streamId, aspect);
                fitWatchStage(node);
            }
            if (watchScreen?.placeholderKind === "loading") hideStagePlaceholder();
            return;
        }

        if (data && data.action === "end-view-connection" && watchScreen && !watchScreen.placeholderKind) {
            showStagePlaceholder("loading");
        }
    };

    addEventListener("message", onMessage);
    frame.huginListener = onMessage;
    frame.huginWatchdog = setInterval(() => reloadStuckStage(frame, streamId), 2000);
    primeFrameBitrate(frame, item);
    sendVolumeToStage(frame, streamId);
    if (taken.playing && !item.mine) sendVolumeToStage(frame, streamId);

    log(
        "iframe video:",
        item.mine ? "own" : item.label,
        "| id:",
        String(streamId).slice(0, 12),
        taken.playing ? "| kept playing" : ""
    );

    return {
        frame,
        playing: taken.playing,
        slot
    };
}

function mountWatchVideoGrid(node, items) {
    const sizer = node.querySelector('[class*="videoSizer_a21736"]');
    if (!sizer) return null;
    const parent = sizer.querySelector('[class*="videoContainer__1505a"]') ?? sizer;
    parent.style.position ||= "relative";
    const grid = document.createElement("div");
    grid.setAttribute("data-hugin-watch-grid", "");
    parent.insertBefore(grid, parent.firstChild);

    const frames = [];
    let anyPlaying = false;

    for (const item of items.slice(0, 2)) {
        const slot = document.createElement("div");
        slot.setAttribute("data-hugin-watch-slot", streamIdOf(item));
        slot.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            toggleWatchFocus(streamIdOf(item));
        });
        grid.appendChild(slot);

        const taken = takeStreamFrame(slot, null, item, "position:absolute;inset:0;width:100%;height:100%;border:0;background:#000;pointer-events:none;");
        if (!taken) continue;

        const { frame } = taken;
        const streamId = frame.dataset.huginStream;
        const label = document.createElement("div");
        label.setAttribute("data-hugin-watch-slot-label", "");
        label.textContent = broadcasterName(item);
        slot.appendChild(label);

        const onMessage = event => {
            if (event.source !== frame.contentWindow) return;
            const data = event.data;

            if (!item.mine && data && (data.action === "new-video-track-added" || vdoVideoStarted(data, streamId))) {
                sendVolumeToStage(frame, streamId);
            }

            if (
                data &&
                frame.dataset.bitrate &&
                (data.action === "new-video-track-added" || vdoVideoStarted(data, streamId))
            ) {
                postFrameBitrate(frame);
            }

            if (vdoVideoStarted(data, streamId)) {
                const aspect = parseFloat(data.value);
                if (aspect > 0.2 && aspect < 10) seenAspects.set(streamId, aspect);
            }
        };

        addEventListener("message", onMessage);
        frame.huginListener = onMessage;
        primeFrameBitrate(frame, item);
        sendVolumeToStage(frame, streamId);
        frames.push(frame);
        anyPlaying ||= taken.playing;

        if (taken.playing && !item.mine) sendVolumeToStage(frame, streamId);
    }

    if (!frames.length) return null;
    log("iframe grid:", frames.length, "streams");

    return {
        frame: frames[0],
        frames,
        playing: anyPlaying,
        slot: null,
        grid
    };
}

function gridAspectFor(items) {
    return items.length > 1 ? (16 / 9) * Math.min(2, items.length) : 16 / 9;
}

function applyWatchFocus(streamId = null) {
    if (!watchScreen?.node) return;
    const items = watchedItems();
    const grid = watchScreen.node.querySelector("[data-hugin-watch-grid]");
    if (!grid || items.length <= 1) return;

    const focusedItem = streamId ? itemForStreamId(streamId, items) : null;
    watchScreen.focusedStreamId = focusedItem ? streamId : null;

    if (focusedItem) grid.setAttribute("data-hugin-focused", streamId);
    else grid.removeAttribute("data-hugin-focused");

    for (const slot of grid.querySelectorAll("[data-hugin-watch-slot]")) {
        const focused = focusedItem && slot.getAttribute("data-hugin-watch-slot") === streamId;
        if (focused) slot.setAttribute("data-hugin-slot-focused", "");
        else slot.removeAttribute("data-hugin-slot-focused");
    }

    const aspect = focusedItem ? knownAspect(focusedItem) || 16 / 9 : gridAspectFor(items);
    watchScreen.node.dataset.huginAspect = String(aspect);
    fitWatchStage(watchScreen.node);

    const frame = (watchScreen.frames ?? []).find(entry => entry.dataset.huginStream === streamId);
    if (focusedItem && frame) primeFrameBitrate(frame, focusedItem);
}

function toggleWatchFocus(streamId) {
    if (!streamId || watchedItems().length <= 1) return;
    applyWatchFocus(watchScreen?.focusedStreamId === streamId ? null : streamId);
}

/**
 * Sizes the stage tile, and any placeholder card, to the stream's aspect ratio within the stage.
 */
function fitWatchStage(node) {
    const stageRoot = node.querySelector('[class*="root__6981d"]') || node;
    const area = stageRoot.getBoundingClientRect();
    if (area.height < 90 || area.width < 160) return;
    const fromSource = parseFloat(node.dataset.huginAspect || "");
    const aspect = fromSource > 0.2 && fromSource < 10 ? fromSource : area.width / area.height;
    let width = Math.max(1, Math.round(Math.min(area.width, area.height * aspect)));
    let height = Math.max(1, Math.round(width / aspect));
    if ((Math.round(area.width) - width) % 2) width -= 1;
    if ((Math.round(area.height) - height) % 2) height -= 1;

    for (const videoFrame of node.querySelectorAll('[class*="videoFrame__6981d"]')) {
        const wrapper = videoFrame.querySelector('[class*="videoWrapper__6981d"]');
        const sizer = videoFrame.querySelector('[class*="videoSizer_a21736"]');
        if (!wrapper || !sizer) continue;
        wrapper.style.width = `${width}px`;
        sizer.style.aspectRatio = `${width} / ${height}`;
    }
}

function broadcasterName(item) {
    return item.mine || item.simulated ? state.userName || item.label || "" : item.label || "";
}

/**
 * Keeps the stage in step with the stream list: the ended card when the stream leaves, a reload when
 * it returns.
 */
function syncWatchPresence() {
    if (!watchScreen) return;

    if (!watchScreen.node.isConnected) {
        leftStage();
        return;
    }

    const watched = watchItemsOf(watchScreen.item);
    const liveWatched = liveWatchedItems(watched);
    const anyLive = liveWatched.length > 0;

    if (watched.length > 1 && liveWatched.length < watched.length) {
        if (liveWatched.length === 1) openWatchScreen(liveWatched[0]);
        else closeWatchScreen();
        return;
    }

    if (anyLive) {
        if (watchScreen.placeholderKind === "ended") {
            if (watchScreen.frame) reloadStageFrame(watchScreen.frame);
            showStagePlaceholder("loading");
        }
        return;
    }

    if (watched.some(entry => entry.mine)) {
        closeWatchScreen();
        return;
    }

    if (watchScreen.placeholderKind !== "ended") showStagePlaceholder("ended");
}

/**
 * Shows one of Discord's stage cards: "loading" over the video, or "ended" and "error" in its place.
 */
function showStagePlaceholder(kind) {
    if (!watchScreen) return;
    const frame = watchScreen.node.querySelector('[class*="videoFrame__6981d"]');
    if (!frame) return;
    const shell = document.createElement("div");

    const markup = {
        ended: CAPTURED_STAGE_ENDED_HTML,
        error: CAPTURED_STAGE_ERROR_HTML,
        loading: CAPTURED_STAGE_LOADING_HTML
    };

    shell.innerHTML = markup[kind] ?? CAPTURED_STAGE_ERROR_HTML;
    const next = shell.firstElementChild;
    if (!next) return;
    const broadcaster = broadcasterName(watchScreen.item);
    const tileTitle = next.querySelector('[class*="overlayTitleText__"]');
    if (tileTitle) tileTitle.textContent = broadcaster;
    const focusPoint = next.querySelector('[class*="focusTarget__"]');
    if (focusPoint) focusPoint.setAttribute("aria-label", "Janela de chamada, transmissão, " + broadcaster);

    dropWatchControls(next, {
        viewer: !watchScreen.item.mine,
        placeholder: true
    });

    if (watchScreen.placeholder) {
        watchScreen.placeholder.remove();
        watchScreen.placeholder = null;
        frame.style.display = "";
    }

    watchScreen.placeholderKind = kind;
    watchScreen.placeholderSince = Date.now();
    if (native.debug) log("stage placeholder:", kind);
    showStageControls(kind !== "ended");

    if (kind === "loading") {
        next.style.position = "absolute";
        next.style.inset = "0";
        next.style.zIndex = "2";
        next.style.background = "#000";
        frame.insertAdjacentElement("afterend", next);
        watchScreen.placeholder = next;
        fitWatchStage(watchScreen.node);
        return;
    }

    frame.style.display = "none";
    frame.insertAdjacentElement("afterend", next);
    watchScreen.placeholder = next;
    fitWatchStage(watchScreen.node);
    stageView = null;
    syncViewBounds();

    for (const button of next.querySelectorAll("button, [role='button']")) {
        if (!/fechar/i.test(button.textContent || "")) continue;
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeWatchScreen();
        });
    }
}

function showStageControls(visible) {
    const layer = watchScreen?.node.querySelector('[class*="videoControls_bfe55a"]');
    if (layer) layer.style.visibility = visible ? "" : "hidden";
}

/**
 * Removes the placeholder card and brings the video back.
 */
function hideStagePlaceholder() {
    if (!watchScreen?.placeholder) return;
    watchScreen.placeholder.remove();
    watchScreen.placeholder = null;
    watchScreen.placeholderKind = null;
    if (native.debug) log("stage placeholder: hidden");
    showStageControls(true);
    const frame = watchScreen.node.querySelector('[class*="videoFrame__6981d"]');
    if (frame) frame.style.display = "";
    syncViewBounds();
    fitWatchStage(watchScreen.node);
}
