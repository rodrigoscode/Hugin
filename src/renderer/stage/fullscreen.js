/**
 * Fullscreen for the stage, and tooltips of its controls.
 */

const EXIT_FULLSCREEN_ICON =
    '<path fill="currentColor" d="M8 6a2 2 0 0 1-2 2H3a1 1 0 0 0 0 2h3a4 4 0 0 0 4-4V3a1 1 0 0 0-2 0v3ZM8 18a2 2 0 0 0-2-2H3a1 1 0 1 1 0-2h3a4 4 0 0 1 4 4v3a1 1 0 1 1-2 0v-3ZM18 8a2 2 0 0 1-2-2V3a1 1 0 1 0-2 0v3a4 4 0 0 0 4 4h3a1 1 0 1 0 0-2h-3ZM16 18c0-1.1.9-2 2-2h3a1 1 0 1 0 0-2h-3a4 4 0 0 0-4 4v3a1 1 0 1 0 2 0v-3Z"></path>';

/**
 * Moves our shadow hosts into the fullscreen element and back. A host holding an iframe (the PiP) moves
 * only where moveBefore can keep that iframe from reloading.
 */
function moveLayersTo(destination) {
    for (const host of document.querySelectorAll("[data-hugin]")) {
        if (host.parentElement === destination) continue;

        if (!host.shadowRoot?.querySelector("iframe")) {
            destination.appendChild(host);
            continue;
        }

        if (!canMoveFrames()) continue;

        try {
            destination.moveBefore(host, null);
        } catch (err) {
            log("layer move failed:", String(err));
        }
    }
}

/**
 * Wires the stage's fullscreen button and double click to browser fullscreen. Over Discord's call screen
 * it does what Discord's own fullscreen does: the whole app goes fullscreen, the app base drops its title
 * bar and hides the sidebar, and the call view fills the screen, so the chat and popouts rendered outside
 * the call view stay visible.
 */
function bindFullscreen(node) {
    const button = node.querySelector('button[aria-label="Tela cheia"]');
    const icon = button?.querySelector("svg");
    const enterIcon = icon?.innerHTML ?? "";
    const container = node.querySelector('[class*="callContainer_cb9592"]');
    const hadNoChat = node.classList.contains("noChat_cb9592");
    const callView = node.parentElement?.closest('[class*="wrapper_cb9592"]') ?? null;
    const callContainer = node.parentElement?.closest('[class*="callContainer_cb9592"]') ?? null;
    const target = (callView && document.getElementById("app-mount")) || node;
    let saved = null;

    const setAppFullscreen = on => {
        if (!callView) return;

        if (on && !saved) {
            const base = callView.closest('[class*="base__5e434"]');
            const sidebar = base?.querySelector('[class*="sidebar__5e434"]');

            saved = {
                base,
                sidebar,
                attribute: base?.getAttribute("data-fullscreen") ?? null,
                sidebarHidden: sidebar?.classList.contains("hidden__5e434") ?? false
            };

            base?.setAttribute("data-fullscreen", "true");
            sidebar?.classList.add("hidden__5e434");
        } else if (!on && saved) {
            if (saved.attribute === null) saved.base?.removeAttribute("data-fullscreen");
            else saved.base?.setAttribute("data-fullscreen", saved.attribute);
            if (!saved.sidebarHidden) saved.sidebar?.classList.remove("hidden__5e434");
            saved = null;
        }

        callView.classList.toggle("fullScreen_cb9592", on);
        callContainer?.classList.toggle("fullScreen_cb9592", on);
    };

    const toggle = () => {
        if (document.fullscreenElement === target) {
            document.exitFullscreen().catch(err => log("exit fullscreen:", String(err)));
        } else {
            target.requestFullscreen().catch(err => log("fullscreen:", String(err)));
        }
    };

    const reflect = () => {
        const isFullscreen = document.fullscreenElement === target;
        node.classList.toggle("fullScreen_cb9592", isFullscreen);
        if (hadNoChat) node.classList.toggle("noChat_cb9592", !isFullscreen);
        container?.classList.toggle("fullScreen_cb9592", isFullscreen);
        setAppFullscreen(isFullscreen);
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
        setAppFullscreen(false);
        if (document.fullscreenElement !== target) return;
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
