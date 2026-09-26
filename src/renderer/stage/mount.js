/**
 * Opening, mounting and closing the stage inside Discord's call screen.
 */

/**
 * With keepFrame the stream's iframe is parked for the PiP or a new stage; otherwise it is dropped.
 */
function closeWatchScreen(options = {}) {
    if (!watchScreen) {
        if (!options.keepFrame) dropAllStreamFrames();
        return;
    }

    document.removeEventListener("keydown", onWatchScreenKey, true);
    document.getElementById(WATCH_STYLE_ID)?.remove();

    native
        .overlay?.({
            action: "destroy"
        })
        .catch(() => {});

    watchScreen.observer?.disconnect();
    watchScreen.chatObserver?.disconnect();
    watchScreen.stopIdle?.();
    watchScreen.disableZoom?.();
    watchScreen.disableFullscreen?.();
    closeStageMenu();
    closeWatchChoiceMenu();
    stageTooltips?.host.remove();
    stageTooltips = null;
    clearInterval(watchScreen.exitWatcher);
    watchScreen.hostElement?.removeAttribute("data-hugin-host");
    const iframeVideo = watchScreen.frame;
    for (const frame of watchScreen.frames ?? (iframeVideo ? [iframeVideo] : [])) {
        if (frame?.huginListener) removeEventListener("message", frame.huginListener);
        clearInterval(frame?.huginWatchdog);
    }

    const frames = watchScreen.frames ?? (iframeVideo ? [iframeVideo] : []);

    if (options.keepFrame && frames.length === 1) {
        const frame = frames[0];
        parkStreamFrame(frame.dataset.huginStream, frame.dataset.huginMine === "1");
    } else {
        for (const frame of frames) dropStreamFrame(frame.dataset.huginStream, frame.dataset.huginMine === "1");
    }

    watchScreen.node.remove();
    for (const hidden of watchScreen.hidden) hidden.el.style.display = hidden.display;
    watchScreen = null;
    stageView = null;
    syncViewBounds();
}

const DROPPED_WATCH_CONTROLS = [
    'button[aria-label="Nova Janela"]',
    'button[aria-label="Mostrar chat"]',
    'button[aria-label="Começar Atividade"]',
    'button[aria-label="Abrir efeitos sonoros"]',
    'button[aria-label="Mais opções"]',
    'button[aria-label="Silenciar"]',
    'button[aria-label="Ativar câmera"]',
    '[aria-label="Mais opções de microfone"]',
    '[aria-label="Mais opções de câmera"]',
    'button[aria-label="Ocultar membros"]',
    'button[aria-label="Mostrar membros"]',
    'button[aria-label="Convidar para a transmissão"]',
    'button[aria-label="Desconectar"]'
];

const KEPT_WATCH_SECTIONS = '[class*="edgeControls"], [class*="centerControls"], [class*="controlSection"]';

/**
 * Removes a control and only the wrappers it leaves empty.
 */
function removeAndPrune(element, root) {
    let parent = element.parentElement;
    element.remove();

    while (
        parent &&
        parent !== root &&
        parent.children.length === 0 &&
        !parent.textContent.trim() &&
        !parent.matches(KEPT_WATCH_SECTIONS)
    ) {
        const above = parent.parentElement;
        parent.remove();
        parent = above;
    }
}

/**
 * Removes captured stage controls that do not apply to this stage.
 */
function dropWatchControls(node, options = {}) {
    for (const selector of DROPPED_WATCH_CONTROLS) {
        if (options.keepChat && selector.includes("Mostrar chat")) continue;
        for (const element of node.querySelectorAll(selector)) removeAndPrune(element, node);
    }

    if (options.placeholder) {
        for (const magnifier of node.querySelectorAll('button[aria-label="Aproximar"]')) {
            (magnifier.closest('[class*="controls__07fe9"]') ?? magnifier).remove();
        }
        for (const isFullscreen of node.querySelectorAll('button[aria-label="Tela cheia"]'))
            removeAndPrune(isFullscreen, node);
    }

    const clipBadge = node.querySelector('[class*="clipBadgeText__"]');
    if (clipBadge) removeAndPrune(clipBadge.parentElement ?? clipBadge, node);

    for (const section of node.querySelectorAll(
        '[class*="buttonSection__"], [class*="attachedCaretButtonContainer"]'
    )) {
        for (const child of [...section.children]) {
            const hasControl = child.querySelector("button, [role='button']");
            const box = child.getBoundingClientRect();
            if (!hasControl && box.width < 2 && box.height < 2) {
                child.remove();
                continue;
            }
            if (child.children.length === 0 && !child.textContent.trim()) child.remove();
        }
        if (section.children.length === 0 && !section.matches(KEPT_WATCH_SECTIONS)) section.remove();
    }
}

let pendingOpen = 0;
const MAX_WATCH_STREAMS = 2;
let watchChoiceMenu = null;

function watchItemsOf(item) {
    return Array.isArray(item?.items) && item.items.length ? item.items : item ? [item] : [];
}

function watchedItems() {
    return watchItemsOf(watchScreen?.item);
}

function itemForStreamId(streamId, items = watchedItems()) {
    return items.find(item => streamIdOf(item) === streamId) ?? null;
}

function liveWatchedItems(items = watchedItems()) {
    const live = streamers();
    return items.filter(item => item.mine || live.some(entry => entry.key === item.key));
}

function sameWatchStream(a, b) {
    const left = a ? streamIdOf(a) : null;
    const right = b ? streamIdOf(b) : null;
    return Boolean(left && right && left === right);
}

function escapeWatchChoiceText(value) {
    return String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

function requestWatchStream(item) {
    const current = watchItemsOf(watchScreen?.item);

    if (!current.length || current.some(entry => sameWatchStream(entry, item))) {
        openWatchScreen(item);
        return;
    }

    openWatchChoiceMenu(item, current);
}

function stopWatchingStream(streamId = null) {
    const items = watchedItems();

    if (items.length <= 1) {
        closeWatchScreen();
        return;
    }

    const target = streamId && itemForStreamId(streamId, items) ? streamId : watchScreen?.focusedStreamId || streamIdOf(items[items.length - 1]);
    const remaining = items.filter(item => streamIdOf(item) !== target);

    if (remaining.length === 1) openWatchScreen(remaining[0]);
    else if (remaining.length > 1) openWatchScreen({ ...remaining[0], items: remaining });
    else closeWatchScreen();
}

function closeWatchChoiceMenu() {
    watchChoiceMenu?.host.remove();
    watchChoiceMenu = null;
}

function openWatchChoiceMenu(item, current) {
    closeWatchChoiceMenu();

    const canJoin = current.length < MAX_WATCH_STREAMS;
    const currentName = escapeWatchChoiceText(broadcasterName(current[0]) || "uma transmissão");
    const nextName = escapeWatchChoiceText(broadcasterName(item) || "esta transmissão");
    const { host, root } = mountShadow(
        BASE_CSS +
            `
            .hugin-watch-choice-backdrop { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:auto; }
            .hugin-watch-choice { width:360px; max-width:calc(100vw - 32px); padding:16px; border-radius:12px; color:var(--text-normal,#dbdee1); background:var(--modal-background,#313338); box-shadow:var(--elevation-high,0 8px 24px rgba(0,0,0,.35)); }
            .hugin-watch-choice-title { margin:0 0 6px; color:var(--header-primary,#f2f3f5); font-size:16px; line-height:20px; font-weight:700; }
            .hugin-watch-choice-text { margin:0 0 14px; color:var(--text-muted,#b5bac1); font-size:14px; line-height:20px; }
            .hugin-watch-choice-actions { display:flex; justify-content:flex-end; gap:8px; }
            .hugin-watch-choice-button { min-width:96px; height:38px; padding:0 14px; border:0; border-radius:4px; color:#fff; background:var(--button-secondary-background,#4e5058); font-size:14px; font-weight:500; cursor:pointer; }
            .hugin-watch-choice-button:hover { background:var(--button-secondary-background-hover,#5c5e66); }
            .hugin-watch-choice-button.primary { background:var(--button-positive-background,#248046); }
            .hugin-watch-choice-button.primary:hover { background:var(--button-positive-background-hover,#1a6334); }
            .hugin-watch-choice-button.link { min-width:auto; color:var(--text-normal,#dbdee1); background:transparent; }
            .hugin-watch-choice-button.link:hover { text-decoration:underline; background:transparent; }
        `
    );

    host.setAttribute("data-hugin-watch-choice", "");
    const shell = document.createElement("div");
    shell.className = "hugin-watch-choice-backdrop";
    shell.innerHTML = `
        <div class="hugin-watch-choice" role="dialog" aria-modal="true" aria-label="Escolher transmissão">
            <h2 class="hugin-watch-choice-title">Assistir transmissão</h2>
            <p class="hugin-watch-choice-text">Você já está assistindo ${currentName}. O que deseja fazer com ${nextName}?</p>
            <div class="hugin-watch-choice-actions">
                <button type="button" class="hugin-watch-choice-button link" data-action="cancel">Cancelar</button>
                <button type="button" class="hugin-watch-choice-button" data-action="replace">Substituir</button>
                ${canJoin ? '<button type="button" class="hugin-watch-choice-button primary" data-action="join">Assistir junto</button>' : ""}
            </div>
        </div>`;
    root.appendChild(shell);

    shell.addEventListener("click", event => {
        if (event.target === shell) closeWatchChoiceMenu();
    });

    for (const button of shell.querySelectorAll("button[data-action]")) {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            const action = button.getAttribute("data-action");
            closeWatchChoiceMenu();

            if (action === "join") {
                openWatchScreen({
                    ...current[0],
                    items: [...current, item]
                });
            } else if (action === "replace") openWatchScreen(item);
        });
    }

    watchChoiceMenu = {
        host
    };
}

function hasCallScreen(page) {
    return [...(page?.querySelectorAll('[class*="callContainer_cb9592"]') ?? [])].some(
        el => !el.closest("[" + WATCH_SCREEN_MARK + "]")
    );
}

function callLink() {
    const [guildId, channelId] = String(voiceChannelId() || "").split(":");
    if (!guildId || !channelId) return null;
    return document.querySelector('a[href="/channels/' + guildId + "/" + channelId + '"]');
}

/**
 * Opens the stage for a stream on the call screen, navigating there first when needed. The call screen
 * is looked for on every frame, so the stage mounts before Discord's own call view is painted.
 */
function openWatchScreen(item) {
    if (state.simulateViewer && item?.mine)
        item = {
            ...item,
            mine: false,
            simulated: true
        };

    const request = ++pendingOpen;
    const link = hasCallScreen(chatPage()) ? null : callLink();

    if (!link) {
        mountWatchScreen(item);
        return;
    }

    link.click();
    const start = Date.now();

    const wait = () => {
        if (request !== pendingOpen) return;

        if (hasCallScreen(chatPage())) {
            mountWatchScreen(item);
            return;
        }

        if (Date.now() - start > 4000) {
            log("the call screen did not appear; opening the stage on the current page");
            mountWatchScreen(item);
            return;
        }

        requestAnimationFrame(wait);
    };

    requestAnimationFrame(wait);
}

/**
 * Builds the stage from Discord's captured markup inside the call screen.
 */
function mountWatchScreen(item) {
    pendingOpen++;
    const page = chatPage();
    const watchItems = watchItemsOf(item);
    const primaryItem = watchItems[0] ?? item;
    const wasMultiWatch = (watchScreen?.frames?.length ?? 0) > 1;

    if (!page) {
        dropStreamFrame();
        log("chat area not found; stage not mounted");
        return;
    }

    closeWatchScreen({
        keepFrame: true
    });

    closeLivePreview();

    closePip({
        keepFrame: true
    });

    ensureWatchStyle();
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_WATCH_HTML;
    const node = shell.firstElementChild;
    node.setAttribute(WATCH_SCREEN_MARK, "");
    const overCallScreen = hasCallScreen(page);
    if (!primaryItem.mine) swapDisconnectForStopWatching(node);

    dropWatchControls(node, {
        keepChat: true,
        viewer: !primaryItem.mine
    });

    node.style.flex = "1 1 auto";
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.minWidth = "0";
    node.querySelector('[class*="participantsWrapper"]')?.remove();
    const tileTitle = node.querySelector('[class*="overlayTitleText__"]');

    if (tileTitle) {
        tileTitle.textContent = watchItems.length > 1 ? "Transmissões" : broadcasterName(primaryItem);
        tileTitle.classList.remove("dnsFont__89a31", "newRocker__89a31");
    }

    const tileFocus = node.querySelector('[class*="videoWrapperAnimated_"] [class*="focusTarget__"]');
    if (tileFocus)
        tileFocus.setAttribute(
            "aria-label",
            "Janela de chamada, transmissão, " + (watchItems.length > 1 ? "múltiplas transmissões" : broadcasterName(primaryItem))
        );

    const stage =
        node.querySelector('[class*="videoSizer_a21736"]') ?? node.querySelector('[class*="root_bfe55a"]') ?? node;

    const h1 = node.querySelector('[class*="title__9293f"]');
    const channelText = h1 && [...h1.childNodes].reverse().find(child => child.nodeType === 3);
    if (channelText) channelText.nodeValue = state.channelName || "Voz";
    const name = node.querySelector('[class*="headerWrapper"] [class*="lineClamp1__"]');
    if (name)
        name.textContent = watchItems.length > 1 ? "Tela dividida" : primaryItem.mine ? "Sua transmissão" : `Tela de ${primaryItem.label}`;
    const own = primaryItem.mine || primaryItem.simulated;
    const owner = own ? state.userId : streamOwner(primaryItem.key, state.streams.get(primaryItem.key));
    const photo = (own ? state.avatarUrl : primaryItem.avatar) || avatarFor(owner, null);

    for (const img of node.querySelectorAll('img[class*="avatar__44b0c"]')) {
        if (photo) img.setAttribute("src", photo);
        else img.closest('[class*="wrapper__44b0c"]')?.remove();
    }

    for (const decoration of node.querySelectorAll('[class*="avatarDecoration__44b0c"]')) decoration.remove();

    for (const frameElement of node.querySelectorAll('[class*="wrapper__44b0c"][aria-label]')) {
        frameElement.setAttribute("aria-label", watchItems.length > 1 ? "Transmissões" : broadcasterName(primaryItem));
    }

    node.querySelector('[class*="premiumStreamIcon__"]')?.remove();

    const quality =
        primaryItem.mine || primaryItem.simulated
            ? {
                  height: state.resolution,
                  fps: state.fps
              }
            : primaryItem.quality;

    const resolutionText = node.querySelector('[class*="qualityResolution__"]');

    if (resolutionText && quality) {
        resolutionText.textContent = `${heightLabel(quality.height)}`;
        const fpsText = resolutionText.nextElementSibling;
        if (fpsText) fpsText.textContent = `${quality.fps}FPS`;
    }

    for (const hidden of node.querySelectorAll('[class*="hiddenVisually_"]')) {
        if (/Nitro/.test(hidden.textContent)) hidden.textContent = "Qualidade da transmissão";
    }

    const nativeCallScreen = overCallScreen
        ? [...page.children].find(
              el => !el.hasAttribute(WATCH_SCREEN_MARK) && el.querySelector('[class*="callContainer_cb9592"]')
          )
        : null;

    const hostElement = nativeCallScreen?.querySelector('[class*="callContainer_cb9592"]') || null;
    let hidden = [];

    if (hostElement) {
        hostElement.setAttribute("data-hugin-host", "");
        hostElement.appendChild(node);
        node.style.overflow = "hidden";
    } else {
        hidden = [...page.children].map(el => ({
            el,
            display: el.style.display
        }));
        for (const child of hidden) child.el.style.display = "none";
        page.appendChild(node);
    }

    node.querySelector('[class*="chatIcon__"]')
        ?.closest("button, [role='button']")
        ?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            if (!hostElement) {
                closeWatchScreen();
                return;
            }

            const candidates = [
                ...nativeCallScreen.querySelectorAll('button[aria-label="Mostrar chat"]'),
                ...[...nativeCallScreen.querySelectorAll('[class*="chatIcon__"]')].map(icon =>
                    icon.closest("button, [role='button']")
                )
            ];

            const nativeButton = candidates.find(button => button && !node.contains(button));

            if (!nativeButton) {
                log("native chat button not found");
                return;
            }

            nativeButton.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    button: 0,
                    view: window
                })
            );
        });

    let chatObserver = null;
    const nativeWrapper = nativeCallScreen?.querySelector('[class*="wrapper_cb9592"]');
    const ourChatButton = node.querySelector('[class*="chatIcon__"]')?.closest("button, [role='button']");

    if (nativeWrapper && ourChatButton) {
        const reflectChat = () => {
            const isOpen = /sidebarOpen_cb9592/.test(nativeWrapper.getAttribute("class") || "");
            ourChatButton.style.display = isOpen ? "none" : "";
        };
        reflectChat();
        chatObserver = new MutationObserver(reflectChat);
        chatObserver.observe(nativeWrapper, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    document.addEventListener("keydown", onWatchScreenKey, true);
    wireWatchControls(node);
    if (!primaryItem.mine) dropBroadcastButton(node);
    const initialAspect = watchItems.length > 1 ? gridAspectFor(watchItems) : knownAspect(primaryItem);
    if (initialAspect) node.dataset.huginAspect = String(initialAspect);
    const video = watchItems.length > 1 ? mountWatchVideoGrid(node, watchItems) : mountWatchVideo(node, primaryItem, { fresh: wasMultiWatch });
    if (!video) dropStreamFrame();
    const volume = watchItems.length > 1 ? null : mountWatchVolume(node, primaryItem);
    fitWatchStage(node);
    const disableFullscreen = bindFullscreen(node);
    const disableZoom = video && watchItems.length === 1 ? bindStageZoom(node, primaryItem) : null;
    bindStageMenu(node);
    releaseFocusAfterClick(node);
    const stageRoot = node.querySelector('[class*="root__6981d"]');
    let observer = null;

    if (stageRoot && typeof ResizeObserver === "function") {
        observer = new ResizeObserver(() => fitWatchStage(node));
        observer.observe(stageRoot);
    }

    watchScreen = {
        node,
        hidden,
        item: watchItems.length > 1 ? { ...primaryItem, items: watchItems } : primaryItem,
        items: watchItems,
        observer: observer,
        chatObserver: chatObserver,
        hostElement: hostElement,
        volume,
        disableFullscreen: disableFullscreen,
        disableZoom: disableZoom,
        placeholder: null,
        placeholderKind: null,
        frame: video?.frame ?? null,
        frames: video?.frames ?? (video?.frame ? [video.frame] : []),
        frameSlot: video?.slot ?? null,
        grid: video?.grid ?? null,
        focusedStreamId: null,
        parkedAt: 0
    };

    watchScreen.exitWatcher = setInterval(() => {
        if (!watchScreen) return;

        if (!watchScreen.node.isConnected) {
            leftStage();
            return;
        }

        if (watchScreen.parkedAt && Date.now() - watchScreen.parkedAt > PARKED_STAGE_FRAME_MS) {
            watchScreen.parkedAt = 0;
            const slot = watchScreen.frameSlot;
            if (!placeStreamFrame(slot?.parent, slot?.ref, STAGE_FRAME_STYLE)) mountWatchScreen(watchScreen.item);
        }
    }, 250);

    if (video && !video.playing && watchItems.length === 1) showStagePlaceholder("loading");
    const IDLE_MS = 2000;

    const IDLE_CLASSES = [
        ['[class*="root_bfe55a"]', "idle_bfe55a"],
        ['[class*="tile__2f4f7"]', "idle__2f4f7"],
        ['[class*="experimentOverlayTitle__2f4f7"]', "idle__2f4f7"],
        ['[class*="overlayButtonContainer__2f4f7"]', "idle__2f4f7"],
        ['[class*="overlayButton__2f4f7"]', "idle__2f4f7"],
        ['[class*="actionRow__6981d"]', "idle__6981d"],
        ['[class*="participantsButton_a21736"]', "idle_a21736"]
    ];

    let idleTimer = 0;

    const applyIdle = idle => {
        for (const [selector, cls] of IDLE_CLASSES) {
            for (const el of node.querySelectorAll(selector)) el.classList.toggle(cls, idle);
        }
    };

    const goIdle = () => {
        clearTimeout(idleTimer);

        if (streamMenu || stageMenu || watchScreen?.holdIdle) {
            idleTimer = setTimeout(goIdle, IDLE_MS);
            return;
        }

        applyIdle(true);
    };

    const wake = () => {
        applyIdle(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(goIdle, IDLE_MS);
    };

    node.addEventListener("mousemove", wake);
    node.addEventListener("mouseenter", wake);
    node.addEventListener("mouseleave", goIdle);
    watchScreen.stopIdle = () => clearTimeout(idleTimer);
    watchScreen.wake = wake;
    wake();

    stageView = {
        item: primaryItem,
        screen: stage
    };

    syncViewBounds();
}

function onWatchScreenKey(event) {
    if (event.key !== "Escape" || !watchScreen) return;

    if (stageMenu) {
        event.stopPropagation();
        closeStageMenu();
        return;
    }

    if (document.fullscreenElement) return;
    event.stopPropagation();
    closeWatchScreen();
}
