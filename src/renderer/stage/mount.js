/**
 * Opening, mounting and closing the stage inside Discord's call screen.
 */

/**
 * With keepFrame the stream's iframe is parked for the PiP or a new stage; otherwise it is dropped.
 */
function closeWatchScreen(options = {}) {
    if (!watchScreen) {
        if (!options.keepFrame) dropStreamFrame();
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
    stageTooltips?.host.remove();
    stageTooltips = null;
    clearInterval(watchScreen.exitWatcher);
    watchScreen.hostElement?.removeAttribute("data-hugin-host");
    const iframeVideo = watchScreen.frame;
    if (iframeVideo?.huginListener) removeEventListener("message", iframeVideo.huginListener);
    clearInterval(iframeVideo?.huginWatchdog);

    if (iframeVideo && streamFrame?.frame === iframeVideo) {
        if (options.keepFrame) parkStreamFrame();
        else dropStreamFrame();
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
    if (!item.mine) swapDisconnectForStopWatching(node);

    dropWatchControls(node, {
        keepChat: true,
        viewer: !item.mine
    });

    node.style.flex = "1 1 auto";
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.minWidth = "0";
    node.querySelector('[class*="participantsWrapper"]')?.remove();
    const tileTitle = node.querySelector('[class*="overlayTitleText__"]');

    if (tileTitle) {
        tileTitle.textContent = broadcasterName(item);
        tileTitle.classList.remove("dnsFont__89a31", "newRocker__89a31");
    }

    const tileFocus = node.querySelector('[class*="videoWrapperAnimated_"] [class*="focusTarget__"]');
    if (tileFocus) tileFocus.setAttribute("aria-label", "Janela de chamada, transmissão, " + broadcasterName(item));

    const stage =
        node.querySelector('[class*="videoSizer_a21736"]') ?? node.querySelector('[class*="root_bfe55a"]') ?? node;

    const h1 = node.querySelector('[class*="title__9293f"]');
    const channelText = h1 && [...h1.childNodes].reverse().find(child => child.nodeType === 3);
    if (channelText) channelText.nodeValue = state.channelName || "Voz";
    const name = node.querySelector('[class*="headerWrapper"] [class*="lineClamp1__"]');
    if (name) name.textContent = item.mine ? "Sua transmissão" : `Tela de ${item.label}`;
    const own = item.mine || item.simulated;
    const owner = own ? state.userId : streamOwner(item.key, state.streams.get(item.key));
    const photo = (own ? state.avatarUrl : item.avatar) || avatarFor(owner, null);

    for (const img of node.querySelectorAll('img[class*="avatar__44b0c"]')) {
        if (photo) img.setAttribute("src", photo);
        else img.closest('[class*="wrapper__44b0c"]')?.remove();
    }

    for (const decoration of node.querySelectorAll('[class*="avatarDecoration__44b0c"]')) decoration.remove();

    for (const frameElement of node.querySelectorAll('[class*="wrapper__44b0c"][aria-label]')) {
        frameElement.setAttribute("aria-label", broadcasterName(item));
    }

    node.querySelector('[class*="premiumStreamIcon__"]')?.remove();

    const quality =
        item.mine || item.simulated
            ? {
                  height: state.resolution,
                  fps: state.fps
              }
            : item.quality;

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
    if (!item.mine) dropBroadcastButton(node);
    const initialAspect = knownAspect(item);
    if (initialAspect) node.dataset.huginAspect = String(initialAspect);
    const video = mountWatchVideo(node, item);
    if (!video) dropStreamFrame();
    const volume = mountWatchVolume(node, item);
    fitWatchStage(node);
    const disableFullscreen = bindFullscreen(node);
    const disableZoom = video ? bindStageZoom(node, item) : null;
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
        item,
        observer: observer,
        chatObserver: chatObserver,
        hostElement: hostElement,
        volume,
        disableFullscreen: disableFullscreen,
        disableZoom: disableZoom,
        placeholder: null,
        placeholderKind: null,
        frame: video?.frame ?? null,
        frameSlot: video?.slot ?? null,
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

    if (video && !video.playing) showStagePlaceholder("loading");
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
        item,
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
