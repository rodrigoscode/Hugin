/**
 * Stage zoom (magnifier) with its minimap.
 */

const STAGE_ZOOM = {
    min: 1,
    max: 5,
    step: 0.25
};

function clampNumber(value, from, until) {
    return Math.min(until, Math.max(from, value));
}

/**
 * Discord's stream zoom on the stage: magnifier panel, slider, wheel and drag, and a minimap.
 * Returns the cleanup, or null when the stage has no zoom controls.
 */
function bindStageZoom(node, item) {
    const controls = node.querySelector('[class*="controls__07fe9"]');
    const optionRow = controls?.querySelector('[class*="controlsRow__07fe9"]');
    const zoomInButton = optionRow?.querySelector('button[aria-label="Aproximar"]');
    const wrapper = node.querySelector('[class*="wrapper__1505a"]');
    const box = wrapper?.querySelector('[class*="videoContainer__1505a"]');
    if (!controls || !optionRow || !zoomInButton || !wrapper || !box) return null;

    const zoom = {
        node,
        item,
        controls,
        optionRow,
        zoomInButton,
        zoomOutButton: createZoomOutButton(zoomInButton),
        slider: createZoomSlider(),
        minimap: createZoomMinimap(),
        wrapper,
        box,
        streamId: item.mine || item.simulated ? state.pushId : item.key,
        level: STAGE_ZOOM.min,
        offset: {
            x: 0,
            y: 0
        },
        dragging: false,
        draggingMinimap: false,
        flags: {
            changing: false,
            wheeling: false,
            sliding: false,
            resizing: false
        },
        timers: {},
        isOpen: false,
        minimapIframe: null
    };

    bindZoomButtons(zoom);
    bindZoomSlider(zoom);
    bindZoomMinimap(zoom);
    bindZoomPan(zoom);
    const observer = observeZoomResize(zoom);
    drawZoom(zoom);

    return () => {
        for (const time of Object.values(zoom.timers)) clearTimeout(time);
        observer?.disconnect();
        zoom.minimapIframe?.remove();
        zoom.minimapIframe = null;
    };
}

/**
 * Raises a flag for ms (transitions are disabled while it is up) and redraws when it drops.
 */
function pulseZoomFlag(zoom, key, ms) {
    zoom.flags[key] = true;
    clearTimeout(zoom.timers[key]);

    zoom.timers[key] = setTimeout(() => {
        zoom.flags[key] = false;
        drawZoom(zoom);
    }, ms);
}

/**
 * Keeps the pan inside the zoomed image at level z.
 */
function clampZoomOffset(zoom, point, z = zoom.level) {
    const rx = (zoom.wrapper.clientWidth * (z - 1)) / 2;
    const ry = (zoom.wrapper.clientHeight * (z - 1)) / 2;

    return {
        x: clampNumber(point.x, -rx, rx),
        y: clampNumber(point.y, -ry, ry)
    };
}

/**
 * Changes the zoom level keeping focusPoint (relative to the stage center) still on screen.
 */
function applyZoomLevel(zoom, target, focusPoint) {
    const next = clampNumber(target, STAGE_ZOOM.min, STAGE_ZOOM.max);
    if (focusPoint == null || next === zoom.level) return;
    pulseZoomFlag(zoom, "changing", 2000);
    const ratio = next / zoom.level;

    zoom.offset = clampZoomOffset(
        zoom,
        {
            x: (zoom.offset.x - focusPoint.x) * ratio + focusPoint.x,
            y: (zoom.offset.y - focusPoint.y) * ratio + focusPoint.y
        },
        next
    );

    zoom.level = next;
    drawZoom(zoom);
}

/**
 * The pointer position relative to the stage center.
 */
function zoomPointerFocus(zoom, event) {
    const r = zoom.wrapper.getBoundingClientRect();

    return {
        x: event.clientX - r.left - r.width / 2,
        y: event.clientY - r.top - r.height / 2
    };
}

function stopZoomEvent(event) {
    event.preventDefault();
    event.stopPropagation();
}

function showZoomPanel(zoom) {
    if (zoom.isOpen) return;
    zoom.isOpen = true;
    zoom.controls.classList.add("controlsWithChildren__07fe9");
    zoom.controls.insertBefore(zoom.minimap.block, zoom.controls.firstChild);
    zoom.optionRow.insertBefore(zoom.slider.root, zoom.zoomInButton);
    zoom.optionRow.insertBefore(zoom.zoomOutButton, zoom.slider.root);
    if (!zoom.streamId) return;

    const iframe = document.createElement("iframe");
    iframe.allow = "autoplay";
    iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;background:#000;";

    iframe.src = soloUrl(zoom.streamId, true, itemQuality(zoom.item), {
        scale: 15,
        videobitrate: 400
    });

    zoom.minimapIframe = iframe;
    zoom.minimap.video.appendChild(iframe);
}

function closeZoomPanel(zoom) {
    if (!zoom.isOpen) return;
    zoom.isOpen = false;
    zoom.controls.classList.remove("controlsWithChildren__07fe9");
    zoom.minimapIframe?.remove();
    zoom.minimapIframe = null;
    zoom.minimap.block.remove();
    zoom.slider.root.remove();
    zoom.zoomOutButton.remove();
    zoom.draggingMinimap = false;
}

function drawZoom(zoom) {
    const { box, wrapper, flags } = zoom;
    if (!box.isConnected) return;
    const zoomed = zoom.level > STAGE_ZOOM.min;
    const pan = clampZoomOffset(zoom, zoom.offset);
    box.classList.add("zoomed__1505a");
    box.style.setProperty("--custom-zoom-scale", String(zoom.level));
    box.style.setProperty("--custom-pan-x", pan.x + "px");
    box.style.setProperty("--custom-pan-y", pan.y + "px");

    box.style.setProperty(
        "--custom-zoom-transition",
        zoom.dragging || flags.resizing || flags.wheeling || flags.sliding ? "none" : "transform 0.15s ease-out"
    );

    wrapper.classList.toggle("zoomEnabled__1505a", zoomed);
    wrapper.classList.toggle("zoomDragging__1505a", zoom.dragging);

    if (flags.changing || zoomed) showZoomPanel(zoom);
    else closeZoomPanel(zoom);

    if (zoom.isOpen) drawZoomPanel(zoom);
}

/**
 * Syncs the open panel: button states, slider position and the minimap's view rectangle.
 */
function drawZoomPanel(zoom) {
    const { min, max } = STAGE_ZOOM;
    const { level, offset, slider, minimap } = zoom;
    zoom.zoomOutButton.disabled = level <= min;
    zoom.zoomInButton.disabled = level >= max;
    const fraction = (level - min) / (max - min);
    slider.handle.setAttribute("aria-valuenow", String(level));
    slider.fill.style.width = fraction * 100 + "%";
    slider.grabber.style.left = fraction * 100 + "%";
    slider.levelText.textContent = Math.round(level * 100) + "%";
    const width = zoom.wrapper.clientWidth || 1;
    const height = zoom.wrapper.clientHeight || 1;
    const aspect = parseFloat(zoom.node.dataset.huginAspect || "") || width / height;
    minimap.map.style.setProperty("--custom-zoom-minimap-width", 120 * Math.min(aspect, 32 / 9) + "px");
    minimap.map.style.setProperty("--custom-zoom-minimap-height", "120px");
    const side = 1 / level;
    const centerX = 0.5 - offset.x / (width * level);
    const centerY = 0.5 - offset.y / (height * level);
    const indicator = minimap.indicator.style;
    indicator.setProperty("--custom-zoom-indicator-left", 100 * clampNumber(centerX - side / 2, 0, 1 - side) + "%");
    indicator.setProperty("--custom-zoom-indicator-top", 100 * clampNumber(centerY - side / 2, 0, 1 - side) + "%");
    indicator.setProperty("--custom-zoom-indicator-width", 100 * side + "%");
    indicator.setProperty("--custom-zoom-indicator-height", 100 * side + "%");

    indicator.setProperty(
        "--custom-zoom-indicator-transition",
        zoom.dragging || zoom.draggingMinimap || zoom.flags.wheeling || zoom.flags.sliding
            ? "none"
            : "top 0.1s ease-out, left 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out"
    );
}

/**
 * Hover on the controls keeps the stage awake; the +/- buttons zoom around the center.
 */
function bindZoomButtons(zoom) {
    const { controls, zoomInButton, zoomOutButton } = zoom;

    controls.addEventListener("mouseenter", () => {
        if (watchScreen) watchScreen.holdIdle = true;
        watchScreen?.wake?.();
    });

    controls.addEventListener("mouseleave", () => {
        zoom.draggingMinimap = false;
        if (watchScreen) watchScreen.holdIdle = false;
        watchScreen?.wake?.();
    });

    controls.addEventListener("click", stopZoomEvent);

    zoomOutButton.addEventListener("click", event => {
        stopZoomEvent(event);

        applyZoomLevel(zoom, zoom.level - STAGE_ZOOM.step, {
            x: 0,
            y: 0
        });
    });

    zoomInButton.addEventListener("click", event => {
        stopZoomEvent(event);

        applyZoomLevel(zoom, zoom.level + STAGE_ZOOM.step, {
            x: 0,
            y: 0
        });
    });

    createStageTooltip(zoomOutButton);
    createStageTooltip(zoomInButton);
}

function bindZoomSlider(zoom) {
    const { min, max } = STAGE_ZOOM;

    const valueAtPoint = event => {
        const r = zoom.slider.track.getBoundingClientRect();
        return min + (r.width > 0 ? clampNumber((event.clientX - r.left) / r.width, 0, 1) : 0) * (max - min);
    };

    const slideTo = value => {
        pulseZoomFlag(zoom, "sliding", 100);

        applyZoomLevel(zoom, value, {
            x: 0,
            y: 0
        });

        watchScreen?.wake?.();
        drawZoom(zoom);
    };

    zoom.slider.handle.addEventListener("mousedown", event => {
        if (event.button !== 0) return;
        stopZoomEvent(event);
        slideTo(valueAtPoint(event));
        const move = ev => slideTo(valueAtPoint(ev));

        const release = () => {
            removeEventListener("mousemove", move, true);
            removeEventListener("mouseup", release, true);
        };

        addEventListener("mousemove", move, true);
        addEventListener("mouseup", release, true);
    });
}

/**
 * Clicking or dragging on the minimap centers the view there.
 */
function bindZoomMinimap(zoom) {
    const { map, block } = zoom.minimap;

    const panFromMinimap = event => {
        const r = map.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;

        zoom.offset = clampZoomOffset(zoom, {
            x: (0.5 - (event.clientX - r.left) / r.width) * zoom.wrapper.clientWidth * zoom.level,
            y: (0.5 - (event.clientY - r.top) / r.height) * zoom.wrapper.clientHeight * zoom.level
        });

        drawZoom(zoom);
    };

    map.addEventListener("pointerdown", event => {
        if ((event.buttons & 1) === 1) map.setPointerCapture(event.pointerId);
    });

    map.addEventListener("mousedown", event => {
        if ((event.buttons & 1) !== 1) return;
        stopZoomEvent(event);
        zoom.draggingMinimap = true;
        panFromMinimap(event);
    });

    map.addEventListener("mousemove", event => {
        if (!zoom.draggingMinimap) return;
        stopZoomEvent(event);
        panFromMinimap(event);
    });

    map.addEventListener("mouseup", event => {
        if (!zoom.draggingMinimap || (event.buttons & 1) === 1) return;
        stopZoomEvent(event);
        zoom.draggingMinimap = false;
        drawZoom(zoom);
    });

    block.addEventListener("click", stopZoomEvent);
}

/**
 * Dragging pans the zoomed stream and the wheel zooms around the pointer. A click that ends a drag
 * is swallowed so it doesn't reach the stage.
 */
function bindZoomPan(zoom) {
    const { wrapper } = zoom;
    const { min } = STAGE_ZOOM;
    let start = null;
    let offsetAtStart = null;
    let last = null;
    let startTime = 0;

    wrapper.addEventListener("mousedown", event => {
        if (zoom.level <= min || (event.buttons & 1) !== 1) return;
        stopZoomEvent(event);
        start = last = zoomPointerFocus(zoom, event);
        offsetAtStart = zoom.offset;
        startTime = Date.now();
        zoom.dragging = true;
        drawZoom(zoom);
    });

    wrapper.addEventListener("mousemove", event => {
        watchScreen?.wake?.();
        if (!zoom.dragging || zoom.level <= min || !start) return;
        stopZoomEvent(event);
        const point = zoomPointerFocus(zoom, event);

        zoom.offset = clampZoomOffset(zoom, {
            x: offsetAtStart.x + point.x - start.x,
            y: offsetAtStart.y + point.y - start.y
        });

        last = point;
        drawZoom(zoom);
    });

    const endDrag = () => {
        if (!zoom.dragging) return;
        zoom.dragging = false;
        offsetAtStart = null;
        drawZoom(zoom);
    };

    wrapper.addEventListener("mouseup", event => {
        if (!zoom.dragging || (event.buttons & 1) === 1) return;
        stopZoomEvent(event);
        endDrag();
    });

    wrapper.addEventListener("mouseleave", endDrag);

    wrapper.addEventListener("click", event => {
        if (zoom.level <= min || !start || !last) return;
        const moved = Math.hypot(last.x - start.x, last.y - start.y);
        if (moved > 0.01 || Date.now() - startTime >= 500) stopZoomEvent(event);
    });

    wrapper.addEventListener(
        "wheel",
        event => {
            pulseZoomFlag(zoom, "wheeling", 100);
            applyZoomLevel(zoom, zoom.level - event.deltaY / 100, zoomPointerFocus(zoom, event));
            watchScreen?.wake?.();
            drawZoom(zoom);
        },
        {
            passive: true
        }
    );
}

/**
 * Keeps the same part of the stream in view when the stage resizes while zoomed.
 */
function observeZoomResize(zoom) {
    if (typeof ResizeObserver !== "function") return null;
    const { wrapper } = zoom;
    let lastSize = null;

    const observer = new ResizeObserver(() => {
        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;
        const level = zoom.level;
        if (level <= STAGE_ZOOM.min || !width || !height) return;

        if (!lastSize) {
            lastSize = {
                width,
                height
            };
            return;
        }

        if (Math.abs(width - lastSize.width) < 1 && Math.abs(height - lastSize.height) < 1) return;
        pulseZoomFlag(zoom, "resizing", 100);
        const beforeX = (lastSize.width * (level - 1)) / 2;
        const beforeY = (lastSize.height * (level - 1)) / 2;

        zoom.offset = clampZoomOffset(zoom, {
            x: ((beforeX !== 0 ? zoom.offset.x / beforeX : 0) * width * (level - 1)) / 2,
            y: ((beforeY !== 0 ? zoom.offset.y / beforeY : 0) * height * (level - 1)) / 2
        });

        lastSize = {
            width,
            height
        };

        drawZoom(zoom);
    });

    observer.observe(wrapper);
    return observer;
}
