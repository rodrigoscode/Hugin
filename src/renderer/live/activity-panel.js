/**
 * Activity panel shown to the broadcaster in Discord's sidebar.
 */

const ACTIVITY_MARK = "data-hugin-activity";
const ACTIVITY_DEDUPE_STYLE_ID = "hugin-activity-dedupe";

function ensureSinglePanel() {
    if (document.getElementById(ACTIVITY_DEDUPE_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = ACTIVITY_DEDUPE_STYLE_ID;

    style.textContent =
        'section[class*="panels__"]:has(> [' +
        ACTIVITY_MARK +
        ']) > [class*="activityPanel__"]:not([' +
        ACTIVITY_MARK +
        "]) { display: none !important; }";

    document.head.appendChild(style);
}

/**
 * Shows our activity panel while broadcasting and hides Discord's duplicate.
 */
function syncActivityPanel() {
    ensureSinglePanel();
    const section = document.querySelector('section[class*="panels__"]');
    const existing = document.querySelector(`[${ACTIVITY_MARK}]`);

    if (!state.broadcasting || state.simulateViewer || !section) {
        existing?.remove();
        return;
    }

    if (existing) {
        fillActivityPanel(existing);
        return;
    }

    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_ACTIVITY_HTML;
    const panel = shell.firstElementChild;
    panel.setAttribute(ACTIVITY_MARK, "");
    fillActivityPanel(panel);

    panel
        .querySelector('[aria-label="Parar de transmitir"]')
        ?.addEventListener("click", () => stopBroadcast().catch(err => log("stopBroadcast:", err)));

    section.insertBefore(panel, section.firstChild);
}

const LETTER_COLORS = [
    "rgb(233, 30, 99)",
    "rgb(156, 39, 176)",
    "rgb(63, 81, 181)",
    "rgb(0, 150, 136)",
    "rgb(255, 152, 0)",
    "rgb(96, 125, 139)"
];

function fillActivityPanel(panel) {
    const source = state.source;
    const title = panel.querySelector('[class*="title_"]');

    if (title) {
        title.textContent =
            source?.name ??
            (state.mode === "camera" ? "Você está compartilhando sua câmera." : "Você está compartilhando sua tela.");
    }

    const icon = panel.querySelector('[class*="icon_a629d4"]');

    if (icon && source) {
        const usableIcon = source.appIcon && source.appIcon.length > 128 ? source.appIcon : null;
        const wantedTag = usableIcon ? "IMG" : "DIV";
        let target = icon;
        if (icon.tagName !== wantedTag) {
            target = document.createElement(usableIcon ? "img" : "div");
            target.className = icon.className;
            icon.replaceWith(target);
        }
        if (usableIcon) {
            target.setAttribute("alt", "");
            target.setAttribute("src", usableIcon);
            target.removeAttribute("style");
        } else {
            let sum = 0;
            for (const ch of source.name || "") sum = (sum + ch.charCodeAt(0)) % 997;
            target.style.backgroundColor = LETTER_COLORS[sum % LETTER_COLORS.length];
            target.textContent = (source.name || "?").trim().charAt(0).toUpperCase();
        }
    }

    const quality = panel.querySelector('[class*="perksDemoText__"]');
    if (quality) quality.textContent = `${heightLabel(state.resolution)} ${state.fps}FPS`;
    const nitroBadge = quality?.parentElement?.querySelector("svg");

    if (nitroBadge) {
        nitroBadge.remove();
        quality.style.marginInlineStart = "0";
    }
}
