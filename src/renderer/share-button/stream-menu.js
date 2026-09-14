/**
 * Menu opened from the share button while live: stop, change source, quality and audio.
 */

let streamMenu = null;

function closeStreamMenu() {
    if (!streamMenu) return;
    document.removeEventListener("mousedown", onStreamMenuOutside, true);
    streamMenu.nub?.classList.remove("popoutOpen_f1ceac", "active_f1ceac");
    streamMenu.arrow?.classList.remove("open_f1ceac");
    streamMenu.host.remove();
    streamMenu = null;
}

function onStreamMenuOutside(event) {
    if (!streamMenu) return;
    const path = event.composedPath();
    if (path.includes(streamMenu.host)) return;

    if ((streamMenu.anchor && path.includes(streamMenu.anchor)) || (streamMenu.nub && path.includes(streamMenu.nub)))
        return;

    closeStreamMenu();
}

/**
 * Applies the quality picked in the stream menu to the running broadcast without dropping viewers.
 */
function applyLiveQuality() {
    if (!state.broadcasting) return;
    syncActivityPanel();

    if (!native.setBroadcastQuality) {
        log("live quality: the bridge has no setBroadcastQuality (restart Discord); applies to the next broadcast");
        return;
    }

    const quality = {
        height: state.resolution,
        fps: state.fps
    };

    native
        .setBroadcastQuality({
            height: (quality.height ?? config.quality) || null,
            fps: quality.fps ?? config.framerate ?? null,
            bitrate: Number(config.bitrate) || targetBitrate(quality.height || 1440, quality.fps ?? 60, state.mode),
            label: packIdentity(state.source?.name, {
                ...quality,
                mode: state.mode
            })
        })
        .then(result => log("live quality:", heightLabel(state.resolution), state.fps + "fps", "->", result))
        .catch(err => log("setBroadcastQuality:", String(err)));
}

/**
 * The quality submenu beside its row, built from our presets.
 */
function openQualitySubmenu(root, anchorRow) {
    root.querySelector('[class*="submenu_c1e9c4"]')?.remove();
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_QUALITY_SUBMENU_HTML;
    const panel = shell.firstElementChild;
    const groups = [...panel.querySelectorAll('[role="group"]')];
    const lines = [...panel.querySelectorAll('[role="menuitemradio"]')];
    const checkedRow = lines.find(l => l.getAttribute("aria-checked") === "true") ?? lines[0];
    const uncheckedRow = lines.find(l => l.getAttribute("aria-checked") !== "true") ?? lines[0];

    const fill = (group, list, text, current, apply) => {
        const scroller = group.parentElement;
        for (const optionRow of group.querySelectorAll('[role="menuitemradio"]')) optionRow.remove();

        for (const item of list) {
            const picked = current(item);
            const optionRow = (picked ? checkedRow : uncheckedRow).cloneNode(true);
            optionRow.setAttribute("aria-checked", String(picked));
            const label =
                optionRow.querySelector('[class*="text_a4ac84"]') ?? optionRow.querySelector('[class*="label_c1e9c4"]');
            if (label) label.textContent = text(item);
            optionRow.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                apply(item);
                openQualitySubmenu(root, anchorRow);
            });
            group.appendChild(optionRow);
        }

        return scroller;
    };

    if (groups[0]) {
        fill(
            groups[0],
            FRAMERATES,
            item => `${item.fps} FPS`,
            item => item.fps === state.fps,
            item => {
                state.fps = item.fps;
                applyLiveQuality();
            }
        );
    }

    if (groups[1]) {
        fill(
            groups[1],
            RESOLUTIONS,
            item => heightLabel(item.height),
            item => item.height === state.resolution,
            item => {
                state.resolution = item.height;
                applyLiveQuality();
            }
        );
    }

    root.appendChild(panel);
    const SIDE_PADDING = 8;
    const WINDOW_MARGIN = 48;
    const SHIFT_MARGIN = 8;
    const optionRow = anchorRow.getBoundingClientRect();
    panel.style.position = "fixed";
    panel.style.transform = "none";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    const maxHeight = Math.min(360, Math.max(0, innerHeight - 2 * WINDOW_MARGIN));
    panel.style.setProperty("--custom-floating-layer-max-height", maxHeight + "px");
    const layerWidth = panel.offsetWidth + 2 * SIDE_PADDING;
    const height = panel.offsetHeight;
    const xRight = optionRow.right - 4;
    const xLeft = optionRow.left - layerWidth + 4;
    const spaceRight = innerWidth - WINDOW_MARGIN - (xRight + layerWidth);
    const spaceLeft = xLeft - WINDOW_MARGIN;
    const x = spaceRight >= 0 || spaceRight >= spaceLeft ? xRight : xLeft;
    let y = optionRow.top - 9;
    y = Math.min(Math.max(y, SHIFT_MARGIN), innerHeight - SHIFT_MARGIN - height);
    y = Math.min(Math.max(y, optionRow.top - height), optionRow.bottom);
    panel.style.left = Math.round(x + SIDE_PADDING) + "px";
    panel.style.top = Math.round(y) + "px";
}

/**
 * The live share button's menu, or the stage right-click menu at a point: stop, change source, quality
 * and audio.
 */
function openStreamMenu(anchor, options = {}) {
    const point = options.point ?? null;

    if (streamMenu) {
        closeStreamMenu();
        if (!point) return;
    }

    closeStageMenu();

    const { host, root } = mountShadow(
        BASE_CSS +
            CAPTURED_STREAM_MENU_CSS +
            `
            [class*="menu_c1e9c4"], [class*="layer_"] { pointer-events: auto; }
            [class*="item_c1e9c4"]:hover { background: var(--background-mod-subtle); }
        `
    );

    host.setAttribute("data-hugin-stream-menu", "");
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_STREAM_MENU_HTML;
    const node = shell.firstElementChild;
    root.appendChild(node);
    const rows = [...node.querySelectorAll('[class*="item_c1e9c4"]')];
    const byText = text => rows.find(row => (row.textContent || "").trim().startsWith(text));

    const actions = [
        ["Parar de transmitir", () => stopBroadcast().catch(err => log("stopBroadcast:", err))],
        ["Alterar a Transmissão", () => openShareModal()]
    ];

    for (const [text, action] of actions) {
        const row = byText(text);
        if (!row) continue;
        row.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeStreamMenu();
            action();
        });
    }

    const audio = byText("Compartilhar áudio");

    if (audio) {
        const checkbox = audio.querySelector('[class*="checkboxOption__714a9"]');
        const isEnabledNow = () => (state.broadcasting ? Boolean(state.broadcastAudio) : Boolean(config.captureAudio));
        const reflect = enabled => {
            audio.setAttribute("aria-checked", String(enabled));

            if (enabled) checkbox?.setAttribute("data-selected", "true");
            else checkbox?.removeAttribute("data-selected");
        };
        reflect(isEnabledNow());
        audio.addEventListener("click", async event => {
            event.preventDefault();
            event.stopPropagation();
            const enable = !isEnabledNow();
            config.captureAudio = enable;
            reflect(enable);
            if (!state.broadcasting) return;
            state.broadcastAudio = enable;

            const tracks = native.setBroadcastAudio
                ? await native
                      .setBroadcastAudio({
                          enabled: enable
                      })
                      .catch(err => {
                          log("setBroadcastAudio:", String(err));
                          return null;
                      })
                : null;

            log("broadcast audio:", enable ? "on" : "off", "tracks:", tracks);

            if (enable && tracks === 0 && state.lastChoice) {
                beginBroadcast({
                    ...state.lastChoice,
                    muteAudio: false
                }).catch(err => log("re-enabling audio:", String(err)));
            }
        });
    }

    const quality = byText("Qualidade da transmissão");

    if (quality) {
        let submenuDelay = 0;
        quality.addEventListener("mouseenter", () => {
            clearTimeout(submenuDelay);
            submenuDelay = setTimeout(() => openQualitySubmenu(root, quality), 100);
        });
        quality.addEventListener("mouseleave", () => clearTimeout(submenuDelay));
        quality.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openQualitySubmenu(root, quality);
        });
        for (const row of rows) {
            if (row === quality) continue;
            row.addEventListener("mouseenter", () => {
                root.querySelector('[class*="submenu_c1e9c4"]')?.remove();
            });
        }
    }

    const reportRow = byText("Relatar um problema");

    if (reportRow) {
        const previous = reportRow.previousElementSibling;
        if (previous?.getAttribute("role") === "separator") previous.remove();
        reportRow.remove();
    }

    const nub = anchor ? anchor.closest('[class*="contextMenuNub_"]') || anchor : null;
    const arrow = nub?.querySelector('[class*="contextMenuCaret_"]');
    nub?.classList.add("popoutOpen_f1ceac", "active_f1ceac");
    arrow?.classList.add("open_f1ceac");

    streamMenu = {
        host,
        node,
        nub,
        arrow: arrow,
        anchor
    };

    if (point) {
        placeAtPoint(node, point);
        document.addEventListener("mousedown", onStreamMenuOutside, true);
        return;
    }

    const box = anchor.getBoundingClientRect();
    const panelElement = anchor.closest('[class*="panels_"], [class*="wrapper_e131a9"]');
    const BORDER = 12;
    const left = panelElement ? Math.round(panelElement.getBoundingClientRect().left) + BORDER : Math.round(box.left);
    node.style.position = "fixed";
    node.style.transform = "none";
    node.style.left = `${left}px`;
    node.style.top = "auto";
    node.style.bottom = `${Math.round(innerHeight - box.top + 8)}px`;
    const fromPip = Boolean(anchor.getRootNode?.()?.host?.hasAttribute?.("data-hugin-pip"));

    if (fromPip) {
        const picked = placeDiscordPopout(node, box, {
            position: "top",
            align: "left",
            spacing: 8,
            autoInvert: true,
            nudgeAlignIntoViewport: true
        });
        node.style.left = "auto";
        node.style.right = "auto";
        node.style.top = "auto";
        node.style.bottom = "auto";
        for (const [side, value] of Object.entries(picked.style)) node.style[side] = value + "px";
    } else {
        const menu = node.getBoundingClientRect();
        if (menu.top < 8) {
            node.style.bottom = "auto";
            node.style.top = Math.round(box.bottom + 8) + "px";
        }
        if (menu.right > innerWidth - 8) {
            node.style.left = Math.max(8, Math.round(innerWidth - 8 - menu.width)) + "px";
        }
    }

    document.addEventListener("mousedown", onStreamMenuOutside, true);
}
