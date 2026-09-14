/**
 * Fullscreen for the stage, and tooltips of its controls.
 */

const EXIT_FULLSCREEN_ICON =
    '<path fill="currentColor" d="M8 6a2 2 0 0 1-2 2H3a1 1 0 0 0 0 2h3a4 4 0 0 0 4-4V3a1 1 0 0 0-2 0v3ZM8 18a2 2 0 0 0-2-2H3a1 1 0 1 1 0-2h3a4 4 0 0 1 4 4v3a1 1 0 1 1-2 0v-3ZM18 8a2 2 0 0 1-2-2V3a1 1 0 1 0-2 0v3a4 4 0 0 0 4 4h3a1 1 0 1 0 0-2h-3ZM16 18c0-1.1.9-2 2-2h3a1 1 0 1 0 0-2h-3a4 4 0 0 0-4 4v3a1 1 0 1 0 2 0v-3Z"></path>';

/**
 * Moves our shadow hosts into the fullscreen element and back, except the PiP, whose iframe would
 * reload.
 */
function moveLayersTo(destination) {
    for (const host of document.querySelectorAll("[data-hugin]")) {
        if (host.parentElement === destination) continue;
        if (host.shadowRoot?.querySelector("iframe")) continue;
        destination.appendChild(host);
    }
}

/**
 * Wires the stage's fullscreen button and double click to browser fullscreen.
 */
function bindFullscreen(node) {
    const button = node.querySelector('button[aria-label="Tela cheia"]');
    const icon = button?.querySelector("svg");
    const enterIcon = icon?.innerHTML ?? "";
    const container = node.querySelector('[class*="callContainer_cb9592"]');
    const hadNoChat = node.classList.contains("noChat_cb9592");

    const toggle = () => {
        if (document.fullscreenElement === node) {
            document.exitFullscreen().catch(err => log("exit fullscreen:", String(err)));
        } else {
            node.requestFullscreen().catch(err => log("fullscreen:", String(err)));
        }
    };

    const reflect = () => {
        const isFullscreen = document.fullscreenElement === node;
        node.classList.toggle("fullScreen_cb9592", isFullscreen);
        if (hadNoChat) node.classList.toggle("noChat_cb9592", !isFullscreen);
        container?.classList.toggle("fullScreen_cb9592", isFullscreen);
        button?.setAttribute("aria-label", isFullscreen ? "Sair da tela cheia" : "Tela cheia");
        if (icon) icon.innerHTML = isFullscreen ? EXIT_FULLSCREEN_ICON : enterIcon;
        moveLayersTo(document.fullscreenElement ?? document.body);
        watchScreen?.wake?.();
    };

    button?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    });

    if (button) createStageTooltip(button);

    node.querySelector('[class*="root__6981d"]')?.addEventListener("dblclick", event => {
        if (event.target.closest?.("button, [role='button'], [role='slider'], [class*='controls__07fe9']")) return;
        event.preventDefault();
        toggle();
    });

    document.addEventListener("fullscreenchange", reflect);

    return () => {
        document.removeEventListener("fullscreenchange", reflect);
        if (document.fullscreenElement !== node) return;
        moveLayersTo(document.body);
        document.exitFullscreen().catch(() => {});
    };
}

let stageTooltips = null;

function createStageTooltip(button) {
    if (!stageTooltips) {
        stageTooltips = mountShadow(CAPTURED_TOOLTIP_CSS.replace(/:root\s*\{/, ".tooltipLayer_fa450d {"));
    }

    createPipTooltip(stageTooltips.root, button);
}
