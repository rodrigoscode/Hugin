/**
 * Sources in the share modal: cameras, numbered screens, the source cards and their live refresh.
 */

/**
 * Cameras from the browser (getUserMedia devices); desktopCapturer only lists screens and windows.
 */
async function listCameras() {
    try {
        const devices = await navigator.mediaDevices?.enumerateDevices?.();
        if (!Array.isArray(devices)) return [];
        return devices
            .filter(device => device.kind === "videoinput")
            .map((device, index) => ({
                id: `camera:${device.deviceId || index}`,
                kind: "camera",
                name: device.label || (index === 0 ? "Câmera" : `Câmera ${index + 1}`),
                deviceLabel: device.label || "",
                thumbnail: null
            }));
    } catch (err) {
        log("couldn't list cameras:", err);
        return [];
    }
}

/**
 * Numbers monitors "Tela 1", "Tela 2" as Discord does; desktopCapturer names every monitor "Tela
 * cheia".
 */
function numberScreens(sources) {
    let n = 0;

    return sources.map(source =>
        source.kind === "screen"
            ? {
                  ...source,
                  name: `Tela ${++n}`
              }
            : source
    );
}

/**
 * Builds a card from Discord's captured source card. Clicking shares right away, or selects it when
 * the modal stays open (cameras, or config.keepShareModalOpen).
 */
function buildSourceCard(modal, source) {
    const card = modal.cardTemplate.cloneNode(true);
    card.classList.remove(SELECTED_SOURCE_CLASS);
    const preview = card.querySelector('[class*="sourcePreviewImage__"]');

    if (preview) {
        if (source.thumbnail) {
            preview.setAttribute("src", source.thumbnail);
            preview.addEventListener("error", () => preview.remove(), {
                once: true
            });
        } else {
            preview.remove();
        }
    }

    setSourceCardIcon(modal, card, source);
    const nameEl = card.querySelector('[class*="sourceName__"]');

    if (nameEl) {
        nameEl.textContent = source.name;
        nameEl.title = source.name;
    }

    if (source.kind === "window" && /discord/i.test(source.name)) {
        card.title = "Capturar o próprio Discord costuma sair preto (espelho infinito)";
    }

    const cta = card.querySelector('[class*="sourceOverlayCTA__"] [data-text-variant]');
    if (cta) cta.textContent = modal.activeTab === "camera" ? "Selecionar" : "Compartilhar tela";
    card.huginSource = source;

    card.addEventListener("click", () => {
        const current = card.huginSource;

        if (config.keepShareModalOpen || modal.activeTab === "camera") {
            selectShareSource(modal, current, card);
            return;
        }

        closeShareModal(modal, shareResult(modal, current));
    });

    modal.cardsBySource.set(source.id, card);
    return card;
}

/**
 * The app's own icon when the source has a usable one, otherwise the active tab's glyph.
 */
function setSourceCardIcon(modal, card, source) {
    const icon = card.querySelector('[class*="sourceIcon__"]');
    if (!icon) return;
    const usableIcon = source.appIcon && source.appIcon.length > 128 ? source.appIcon : null;

    if (usableIcon) {
        icon.setAttribute("src", usableIcon);
        return;
    }

    const fromTab = modal.tabs[TAB_KINDS.indexOf(modal.activeTab)]?.querySelector('[class*="icon__9e06a"]');

    if (!fromTab) {
        icon.remove();
        return;
    }

    const glyph = fromTab.cloneNode(true);
    glyph.removeAttribute("data-cs");
    for (const child of glyph.querySelectorAll("[data-cs]")) child.removeAttribute("data-cs");
    glyph.setAttribute("class", icon.className);
    glyph.setAttribute("width", "16");
    glyph.setAttribute("height", "16");
    icon.replaceWith(glyph);
}

/**
 * Updates an existing card in place so its thumbnail and name follow the window.
 */
function refreshSourceCard(modal, card, source) {
    const previous = card.huginSource;
    card.huginSource = source;
    if (modal.selected?.id === source.id) modal.selected = source;
    const preview = card.querySelector('[class*="sourcePreviewImage__"]');

    if (preview && source.thumbnail && source.thumbnail !== previous?.thumbnail) {
        preview.setAttribute("src", source.thumbnail);
    }

    const nameEl = card.querySelector('[class*="sourceName__"]');

    if (nameEl && nameEl.textContent !== source.name) {
        nameEl.textContent = source.name;
        nameEl.title = source.name;
    }
}

/**
 * Applies a fresh source list without rebuilding the grid: removes closed windows, updates the rest
 * and inserts new ones in order.
 */
function updateShareSources(modal, newSources) {
    modal.allSources = [...modal.cameras, ...newSources];
    drawShareTabs(modal);
    if (modal.activeTab === "camera") return;
    const visible = modal.allSources.filter(source => source.kind === modal.activeTab);

    if (visible.length === 0 || modal.cardsBySource.size === 0) {
        drawShareModal(modal);
        return;
    }

    const ids = new Set(visible.map(source => source.id));

    for (const [id, card] of modal.cardsBySource) {
        if (ids.has(id)) continue;
        card.remove();
        modal.cardsBySource.delete(id);
    }

    if (modal.selected && modal.selected.kind !== "camera" && !ids.has(modal.selected.id)) {
        clearShareSelection(modal);
    }

    visible.forEach((source, position) => {
        let card = modal.cardsBySource.get(source.id);

        if (card) refreshSourceCard(modal, card, source);
        else card = buildSourceCard(modal, source);

        if (modal.grid.children[position] !== card) {
            modal.grid.insertBefore(card, modal.grid.children[position] ?? null);
        }
    });
}

/**
 * Re-lists the sources every 2 s while the modal is open, so apps opened meanwhile show up.
 */
async function refreshShareSources(modal) {
    const { host } = modal;

    while (sharing && host.isConnected) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!sharing || !host.isConnected || document.hidden) continue;
        try {
            const newSources = numberScreens(await native.getSources());
            if (sharing && host.isConnected) updateShareSources(modal, newSources);
        } catch (err) {
            log("getSources (refresh) failed:", String(err));
        }
    }
}
