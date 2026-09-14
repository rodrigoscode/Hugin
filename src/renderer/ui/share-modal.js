/**
 * Screen-share picker modal (sources, quality presets and options) built from Discord's markup.
 */

const SHARE_FIXES_CSS = `
        [data-cs="0"] { height: auto; max-height: 86vh; }
        [data-cs="20"] { height: auto; flex: 1 1 auto; min-height: 0; }
        [data-cs="21"] { height: auto; grid-template-rows: auto; }
        [data-cs="117"] { width: auto; }

        [data-cs="113"] { width: auto; }
        [data-cs="122"] { width: auto; }

        [class*="screenArrowIcon_"] { box-sizing: content-box; }

        [class*="source__2f580"]:hover * { cursor: pointer; }

        [data-cs="114"] { width: auto; flex: 1 1 auto; min-width: 0; }
        [data-cs="115"] { width: auto; min-width: 0; }
        [data-cs="116"] { width: auto; }
    `;

const TAB_KINDS = ["window", "screen", "camera"];
const SELECTED_TAB_CLASS = "pillItemSelected__9e06a";
const SELECTED_SOURCE_CLASS = "selectedSource__2f580";

const GO_LIVE_BUTTON_HTML = `<button data-mana-component="button" role="button" class="button_a22cb0 md_a22cb0 primary_a22cb0 hasText_a22cb0" type="button" disabled=""><div class="buttonChildrenWrapper_a22cb0"><div class="buttonChildren_a22cb0"><span class="lineClamp1__4bd52 text-md/medium_cf4812" data-text-variant="text-md/medium">Transmitir</span></div></div></button>`;

let sharing = false;

function openShareModal() {
    if (sharing) return;
    sharing = true;
    closeLivePreview();

    Promise.all([native.getSources(), listCameras()])
        .then(([sources, cameras]) => showShareModal(numberScreens(sources), cameras))
        .catch(err => {
            sharing = false;
            log("getSources failed:", err);
        });
}

/**
 * Mounts the modal. Its state lives in one object that the card, summary and quality menu helpers
 * share.
 */
function showShareModal(sources, cameras = []) {
    const css =
        BASE_CSS +
        CAPTURED_SHARE_CSS.replace(":root {", ":host {") +
        CAPTURED_PICKER_CSS +
        CAPTURED_BUTTON_CSS +
        SHARE_FIXES_CSS;

    const { host, root } = mountShadow(css);
    host.setAttribute("data-hugin-share", "");
    const allSources = [...cameras, ...sources];
    log("sources:", sources.length, "| cameras:", cameras.length);
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_SHARE_HTML;
    const sheet = shell.firstElementChild;
    backdrop.appendChild(sheet);
    root.appendChild(backdrop);
    const grid = sheet.querySelector('[class*="root__2f580"]');
    const gear = sheet.querySelector('button[aria-label="Opções"]');

    const modal = {
        host,
        backdrop,
        grid,
        tabs: [...sheet.querySelectorAll('[class*="pillItem__"]')],
        summaryName: sheet.querySelector('[class*="sourceOrPresetName_"]'),
        summaryDetail: sheet.querySelector('[class*="summaryDetail_"]'),
        gear,
        gearAnimation: animateGear(gear),
        cardTemplate: grid.querySelector('[class*="source__2f580"]').cloneNode(true),
        goLiveButton: null,
        cameras,
        allSources,
        activeTab:
            ["window", "screen"].find(kind => allSources.some(item => item.kind === kind)) ??
            allSources[0]?.kind ??
            "window",
        choice: {
            height: state.resolution,
            fps: state.fps,
            muteAudio: false,
            hidePreview: false,
            mode: "Personalizada"
        },
        selected: null,
        cardsBySource: new Map(),
        quality: null,
        onKey: null,
        onOutsideClick: null
    };

    grid.textContent = "";
    modal.goLiveButton = createGoLiveButton(gear);

    modal.goLiveButton.addEventListener("click", () => {
        if (!modal.selected) return;
        closeShareModal(modal, shareResult(modal, modal.selected));
    });

    modal.tabs.forEach((tab, index) => {
        tab.removeAttribute("data-cs");
        for (const child of tab.querySelectorAll("[data-cs]")) child.removeAttribute("data-cs");

        tab.addEventListener("click", () => {
            modal.activeTab = TAB_KINDS[index];
            clearShareSelection(modal);
            drawShareModal(modal);
        });
    });

    refreshShareSources(modal);

    gear?.addEventListener("click", event => {
        event.stopPropagation();
        toggleShareQualityMenu(modal);
    });

    modal.onKey = event => {
        if (event.key !== "Escape") return;
        event.stopPropagation();

        if (modal.quality) closeShareQualityMenu(modal);
        else closeShareModal(modal, null);
    };

    modal.onOutsideClick = event => {
        if (inTitleBar(event)) return;
        const path = event.composedPath?.() ?? [];
        if (path.includes(host) || (modal.quality && path.includes(modal.quality.host))) return;
        deferClose(() => closeShareModal(modal, null));
    };

    document.addEventListener("click", modal.onOutsideClick, true);
    document.addEventListener("keydown", modal.onKey, true);
    drawShareModal(modal);
    requestAnimationFrame(() => backdrop.classList.add("active"));
}

/**
 * The "Transmitir" button next to the gear, used by the camera tab where a click only selects.
 */
function createGoLiveButton(gear) {
    const template = document.createElement("template");
    template.innerHTML = GO_LIVE_BUTTON_HTML;
    const button = template.content.firstElementChild;
    gear?.parentElement?.insertBefore(button, gear);
    return button;
}

/**
 * What the broadcast starts with: the source plus the current quality choice.
 */
function shareResult(modal, source) {
    const { height, fps, muteAudio, hidePreview } = modal.choice;

    return {
        source,
        height,
        fps,
        muteAudio,
        hidePreview
    };
}

function closeShareModal(modal, result) {
    document.removeEventListener("keydown", modal.onKey, true);
    document.removeEventListener("click", modal.onOutsideClick, true);
    closeShareQualityMenu(modal);
    modal.backdrop.classList.remove("active");
    sharing = false;
    modal.gearAnimation?.destroy();
    setTimeout(() => modal.host.remove(), 200);
    if (result) beginBroadcast(result).catch(err => log("beginBroadcast:", err));
}

function selectShareSource(modal, source, card) {
    modal.selected = source;
    for (const other of modal.grid.children) other.classList.remove(SELECTED_SOURCE_CLASS);
    card.classList.add(SELECTED_SOURCE_CLASS);
    modal.goLiveButton.disabled = false;
    drawShareSummary(modal);
}

function clearShareSelection(modal) {
    modal.selected = null;
    modal.goLiveButton.disabled = true;
}

function drawShareModal(modal) {
    drawShareTabs(modal);
    modal.goLiveButton.style.display = modal.activeTab === "camera" ? "" : "none";
    drawShareSummary(modal);
    modal.grid.textContent = "";
    modal.cardsBySource.clear();
    const visible = modal.allSources.filter(source => source.kind === modal.activeTab);

    if (visible.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "Nada disponível nesta aba.";
        empty.style.cssText = "grid-column:1/-1;padding:48px 0;text-align:center;color:var(--text-muted);";
        modal.grid.appendChild(empty);
        return;
    }

    for (const source of visible) modal.grid.appendChild(buildSourceCard(modal, source));
}

function drawShareTabs(modal) {
    modal.tabs.forEach((tab, index) => {
        const kind = TAB_KINDS[index];
        const total = modal.allSources.filter(source => source.kind === kind).length;
        tab.classList.toggle(SELECTED_TAB_CLASS, kind === modal.activeTab);
        tab.setAttribute("aria-selected", String(kind === modal.activeTab));
        tab.style.opacity = total === 0 ? ".5" : "";
    });
}

/**
 * The footer summary: the selected source (or the preset name), then resolution, fps and, for
 * cameras, the microphone.
 */
function drawShareSummary(modal) {
    const { summaryName, summaryDetail, selected, choice } = modal;
    if (summaryName) summaryName.textContent = selected ? selected.name : choice.mode;
    const summaryRoot = summaryName?.closest('[class*="root_e529a0"]');
    const arrow = summaryRoot?.querySelector('[class*="screenArrowIcon_"]');

    if (summaryRoot && selected && !arrow) {
        const template = document.createElement("template");
        template.innerHTML = CAPTURED_SUMMARY_ARROW;
        summaryRoot.insertBefore(template.content.firstElementChild, summaryRoot.firstChild);
    } else if (arrow && !selected) {
        arrow.remove();
    }

    if (!summaryDetail) return;
    summaryDetail.textContent = "";

    if (selected) {
        const preset = document.createElement("span");
        preset.className = "iconSummaryContainer_e529a0";
        preset.innerHTML = CAPTURED_SUMMARY_GEAR;
        preset.append(choice.mode);
        summaryDetail.appendChild(preset);
    }

    const parts = [heightLabel(choice.height), `${choice.fps}fps`];

    if (modal.activeTab === "camera") {
        const microphone = inputDeviceName();
        if (microphone) parts.push(microphone);
    }

    for (const part of parts) {
        const bullet = document.createElement("span");
        bullet.className = "ellipsis_e529a0";
        bullet.textContent = "•";
        const value = document.createElement("span");
        value.textContent = part;
        summaryDetail.append(bullet, value);
    }
}
