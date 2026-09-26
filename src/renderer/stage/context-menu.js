/**
 * Right-click menu on the stage.
 */

let stageMenu = null;

function closeStageMenu() {
    if (!stageMenu) return;
    document.removeEventListener("mousedown", stageMenu.onClickOutside, true);
    stageMenu.host.remove();
    stageMenu = null;
}

/**
 * Places a context menu at the pointer, flipping it when it does not fit.
 */
function placeAtPoint(element, point) {
    const MARGIN = 8;
    element.style.position = "fixed";
    element.style.transform = "none";
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.left = point.x + "px";
    element.style.top = point.y + "px";
    const box = element.getBoundingClientRect();
    let x = point.x;
    let y = point.y;
    if (x + box.width > innerWidth - MARGIN) x = point.x - box.width;
    if (y + box.height > innerHeight - MARGIN) y = point.y - box.height;
    x = Math.min(Math.max(x, MARGIN), Math.max(MARGIN, innerWidth - MARGIN - box.width));
    y = Math.min(Math.max(y, MARGIN), Math.max(MARGIN, innerHeight - MARGIN - box.height));
    element.style.left = Math.round(x) + "px";
    element.style.top = Math.round(y) + "px";
}

/**
 * Drops focus after a mouse click on a stage control; Discord only hides idle controls when nothing
 * inside has focus.
 */
function releaseFocusAfterClick(node) {
    node.addEventListener(
        "mousedown",
        event => {
            if (event.button !== 0) return;
            const control = event.target.closest?.("button, [role='button'], [role='slider'], [tabindex]");
            if (!control || !node.contains(control)) return;

            addEventListener(
                "mouseup",
                () => {
                    requestAnimationFrame(() => {
                        const active = document.activeElement;
                        if (active && (active === control || control.contains(active))) active.blur();
                    });
                },
                {
                    once: true,
                    capture: true
                }
            );
        },
        true
    );
}

function bindStageMenu(node) {
    node.addEventListener("contextmenu", event => {
        if (!watchScreen || !event.target.closest?.('[class*="root__6981d"]')) return;
        event.preventDefault();
        event.stopPropagation();

        const point = {
            x: event.clientX,
            y: event.clientY
        };
        const slot = event.target.closest?.("[data-hugin-watch-slot]");
        const streamId = slot?.getAttribute("data-hugin-watch-slot") || watchScreen.focusedStreamId || streamIdOf(watchScreen.item);

        if (watchScreen.item.mine)
            openStreamMenu(null, {
                point: point
            });
        else openViewerMenu(point, streamId);
    });
}

/**
 * The viewer's stage context menu: stop watching, mute, and volume up to 200%.
 */
function openViewerMenu(point, streamId = null) {
    closeStageMenu();
    if (streamMenu) closeStreamMenu();

    const { host, root } = mountShadow(
        BASE_CSS +
            CAPTURED_STREAM_MENU_CSS +
            CAPTURED_MENU_SLIDER_CSS +
            `
            [class*="menu_c1e9c4"] { pointer-events: auto; }
            [class*="item_c1e9c4"]:not([class*="hideInteraction_c1e9c4"]):hover { background: var(--background-mod-subtle); }
        `
    );

    host.setAttribute("data-hugin-stage-menu", "");
    const template = document.createElement("div");
    template.innerHTML = CAPTURED_VIEWER_MENU_HTML;
    const menu = template.firstElementChild;
    root.appendChild(menu);
    menu.addEventListener("contextmenu", event => event.preventDefault());

    menu.querySelector("#stream-context-watch")?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closeStageMenu();
        stopWatchingStream(streamId);
    });

    const muteItem = menu.querySelector("#stream-context-mute");
    const checkbox = muteItem?.querySelector('[class*="checkboxOption__714a9"]');

    const reflectMute = () => {
        const muted = streamMuted(streamId);
        muteItem?.setAttribute("aria-checked", String(muted));

        if (muted) checkbox?.setAttribute("data-selected", "true");
        else checkbox?.removeAttribute("data-selected");
    };

    muteItem?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        setStreamMuted(streamId, !streamMuted(streamId));
        reflectMute();
        sendVolumeToStage(null, streamId);
        if (!streamId) watchScreen?.volume?.redraw();
    });

    reflectMute();
    const volume = menu.querySelector('#stream-context-user-volume [role="slider"]');
    const track = volume?.querySelector('[class*="track_a562c8"]');
    const fillElement = volume?.querySelector('[class*="barFill_a562c8"]');
    const grabber = volume?.querySelector('[class*="grabber_a562c8"]');
    const text = volume?.querySelector('[class*="hiddenVisually_"]');

    const drawVolume = () => {
        const percent = Math.round(Math.max(0, Math.min(2, streamVolume(streamId))) * 100);
        volume?.setAttribute("aria-valuenow", String(percent));
        if (fillElement) fillElement.style.width = percent / 2 + "%";
        if (grabber) grabber.style.left = percent / 2 + "%";
        if (text) text.textContent = percent + "%";
    };

    const volumeAtPoint = event => {
        const r = track.getBoundingClientRect();
        return r.width > 0 ? Math.min(2, Math.max(0, (event.clientX - r.left) / r.width) * 2) : streamVolume(streamId);
    };

    const setVolume = value => {
        if (!streamId && watchScreen?.volume) {
            watchScreen.volume.apply(value);
        } else {
            setStreamVolume(streamId, value);
            sendVolumeToStage(null, streamId);
        }

        drawVolume();
    };

    volume?.addEventListener("mousedown", event => {
        if (event.button !== 0 || !track) return;
        event.preventDefault();
        event.stopPropagation();
        setVolume(volumeAtPoint(event));
        const move = ev => setVolume(volumeAtPoint(ev));

        const release = () => {
            removeEventListener("mousemove", move, true);
            removeEventListener("mouseup", release, true);
        };

        addEventListener("mousemove", move, true);
        addEventListener("mouseup", release, true);
    });

    drawVolume();
    placeAtPoint(menu, point);

    const onClickOutside = event => {
        if (!event.composedPath().includes(host)) closeStageMenu();
    };

    document.addEventListener("mousedown", onClickOutside, true);

    stageMenu = {
        host,
        onClickOutside: onClickOutside
    };

    watchScreen?.wake?.();
}
