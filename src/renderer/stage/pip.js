/**
 * Picture-in-picture player shown when leaving the call screen while watching.
 */

let pip = null;
const PIP_IDLE_MS = 2000;

const PIP_FIXES =
    "\n* { outline: none; }\n" +
    ".spinner__48b20 { inset-inline-start: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); }\n";

/**
 * Whether the open page is the call screen of the channel we are connected to.
 */
function onMyCallScreen() {
    const [guildId, channelId] = String(voiceChannelId() || "").split(":");
    if (!guildId || !channelId) return false;
    return location.pathname === "/channels/" + guildId + "/" + channelId && hasCallScreen(chatPage());
}

/**
 * Opens the picture-in-picture player for a stream, draggable between the app's corners like
 * Discord's.
 */
function openPip(item) {
    closePip({
        keepFrame: true
    });

    const parts = buildPipShell(item);

    if (!parts) {
        dropStreamFrame();
        return;
    }

    const { host, shell, pipWindow, surface } = parts;
    bindPipButtons(shell, item);
    const video = attachPipVideo(surface, item);

    for (const button of shell.querySelectorAll('[class*="bottomControls_e4cb9a"] button[aria-label]')) {
        createPipTooltip(shell, button);
    }

    const position = bindPipDrag(parts);
    const stopIdle = bindPipIdle(pipWindow, surface, position.isDragging);

    shell.querySelector('[class*="headerTitle_e4cb9a"]')?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        returnFromPip();
    });

    pip = {
        host,
        item,
        frame: video.frame,
        listener: video.listener,
        watcher: watchPipStream(item),
        unmountPosition: position.unmount,
        stopIdle
    };

    log("PiP opened:", item.mine ? "own" : item.label);
}

/**
 * Mounts Discord's captured PiP markup in a shadow root, titled with the channel and the
 * broadcaster. Returns null when the markup is incomplete.
 */
function buildPipShell(item) {
    const css =
        (CAPTURED_PIP_CSS + "\n" + CAPTURED_PIP_MODULE_CSS).replace(/:root\s*\{/g, ":host {") +
        "\n" +
        CAPTURED_TOOLTIP_CSS.replace(/:root\s*\{/, ".tooltipLayer_fa450d {") +
        CAPTURED_SPINNER_CSS +
        PIP_FIXES;

    const { host, root } = mountShadow(css);
    host.setAttribute("data-hugin-pip", "");
    host.style.zIndex = "1000";
    const shell = document.createElement("div");
    shell.className = "theme-dark full-motion app-focused";
    shell.innerHTML = CAPTURED_PIP_HTML;
    root.appendChild(shell);
    const rootElement = shell.querySelector('[class*="pictureInPicture__"]');
    const pipWindow = shell.querySelector('[class*="pictureInPictureWindow__"]');
    const surface = shell.querySelector('[class*="pictureInPictureVideo_"]');

    if (!rootElement || !pipWindow || !surface) {
        host.remove();
        log("PiP: captured markup incomplete");
        return null;
    }

    const title = shell.querySelector('[class*="headerText_e4cb9a"]');
    if (title) title.textContent = state.channelName || "Voz";
    const name = shell.querySelector('[class*="participantName__2cdb8"]');
    if (name) name.textContent = broadcasterName(item);
    surface.querySelector("span")?.remove();
    shell.querySelector('[class*="root_e605a1"]')?.remove();

    return {
        host,
        shell,
        rootElement,
        pipWindow,
        surface
    };
}

/**
 * Our own stream keeps "stop streaming" and the settings gear; someone else's gets "stop watching".
 */
function bindPipButtons(shell, item) {
    if (item.mine) {
        shell.querySelector('button[aria-label="Parar de transmitir"]')?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            stopBroadcast().catch(err => log("stopBroadcast:", err));
        });
        const gearElement = shell.querySelector('button[aria-label="Configurações da transmissão"]');
        gearElement?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openStreamMenu(gearElement);
        });
        return;
    }

    shell.querySelector('button[aria-label="Configurações da transmissão"]')?.parentElement?.remove();
    const stopWatchingButton = shell.querySelector('button[aria-label="Parar de transmitir"]');
    if (!stopWatchingButton) return;
    stopWatchingButton.setAttribute("aria-label", "Parar de assistir");
    stopWatchingButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        closePip();
    });
}

/**
 * Plays the stream in the PiP through a VDO.Ninja iframe, with Discord's spinner until the video
 * arrives.
 */
function attachPipVideo(surface, item) {
    const taken = takeStreamFrame(surface, surface.firstChild, item, PIP_FRAME_STYLE);

    if (!taken) {
        return {
            frame: null,
            listener: null
        };
    }

    const { frame } = taken;
    const streamId = frame.dataset.huginStream;
    const spinnerTemplate = document.createElement("template");
    spinnerTemplate.innerHTML = CAPTURED_SPINNER_HTML;
    const spinner = spinnerTemplate.content.firstElementChild;

    const showSpinner = visible => {
        if (!spinner) return;

        if (visible && !spinner.isConnected) frame.insertAdjacentElement("afterend", spinner);
        else if (!visible) spinner.remove();
    };

    showSpinner(!taken.playing);
    if (taken.playing && !item.mine) sendVolumeToStage(frame, streamId);

    const listener = event => {
        if (event.source !== frame.contentWindow) return;
        const data = event.data;
        const videoStarted = data && (data.action === "new-video-track-added" || vdoVideoStarted(data, streamId));

        if (!item.mine && videoStarted) sendVolumeToStage(frame, streamId);

        if (videoStarted && frame.dataset.bitrate) {
            frame.contentWindow?.postMessage(
                {
                    bitrate: Number(frame.dataset.bitrate)
                },
                "*"
            );
        }

        if (vdoVideoStarted(data, streamId)) showSpinner(false);
        else if (data && data.action === "end-view-connection") showSpinner(true);
    };

    addEventListener("message", listener);

    return {
        frame,
        listener
    };
}

/**
 * Hides the PiP controls after a moment without the mouse, like Discord's. Returns the cleanup.
 */
function bindPipIdle(pipWindow, surface, isDragging) {
    let idleTimeout = 0;

    const goIdle = () => {
        clearTimeout(idleTimeout);
        if (isDragging()) return;
        if (streamMenu && pipWindow.contains(streamMenu.anchor)) return;
        surface.classList.add("idle_e4cb9a");
    };

    const wake = () => {
        surface.classList.remove("idle_e4cb9a");
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(goIdle, PIP_IDLE_MS);
    };

    pipWindow.addEventListener("mousemove", wake);
    pipWindow.addEventListener("mouseenter", wake);
    pipWindow.addEventListener("mouseleave", goIdle);
    wake();

    return () => clearTimeout(idleTimeout);
}

/**
 * Closes the PiP when the stream ends, or swaps it for the stage once we are back on the call
 * screen.
 */
function watchPipStream(item) {
    return setInterval(() => {
        if (!pip) return;

        if (!streamers().some(entry => entry.key === item.key)) {
            closePip();
            return;
        }

        if (onMyCallScreen()) {
            closePip({
                keepFrame: true
            });

            mountWatchScreen(item);
        }
    }, 300);
}

/**
 * With keepFrame the stream's iframe is parked for the stage; otherwise it is dropped.
 */
function closePip(options = {}) {
    if (!pip) {
        if (!options.keepFrame) dropStreamFrame();
        return;
    }

    clearInterval(pip.watcher);
    pip.stopIdle();
    pip.unmountPosition();
    if (streamMenu && pip.host.shadowRoot?.contains(streamMenu.anchor)) closeStreamMenu();
    if (pip.listener) removeEventListener("message", pip.listener);

    if (pip.frame) {
        if (options.keepFrame) parkStreamFrame(pip.frame.dataset.huginStream, pip.frame.dataset.huginMine === "1");
        else dropStreamFrame(pip.frame.dataset.huginStream, pip.frame.dataset.huginMine === "1");
    }

    pip.host.remove();
    pip = null;
}

/**
 * From the PiP back to the stage, navigating to the call when needed. The PiP stays up until the stage
 * mounts and takes its frame over.
 */
function returnFromPip() {
    if (pip) openWatchScreen(pip.item);
}

/**
 * The stage left the page without being closed: it becomes a PiP, unless the stream ended or we left
 * the call.
 */
function leftStage() {
    if (!watchScreen) return;
    const { item, placeholderKind } = watchScreen;

    closeWatchScreen({
        keepFrame: true
    });

    const staysOpen =
        placeholderKind !== "ended" &&
        !leftViaGateway &&
        Boolean(state.channelId) &&
        streamers().some(entry => entry.key === item.key);

    if (staysOpen) openPip(item);
    else dropStreamFrame();
}
