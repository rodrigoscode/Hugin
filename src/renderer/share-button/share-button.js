/**
 * Replaces or hijacks Discord's screen-share button.
 */

const SHARE_LABELS = [
    /compartilhar (a )?tela/i,
    /compartilhamento de tela/i,
    /share your screen/i,
    /share screen/i,
    /screen share/i
];

const SHARE_ICON_SIGNATURE = "M19 2a3 3 0 0 1 3 3v6.88";
const ACTIVE_BUTTON_CLASS = "buttonActive_e131a9";

/**
 * Undoes replaceShareButton: removes our button and shows Discord's again.
 */
function restoreOriginalButton() {
    for (const ours of [...document.querySelectorAll("[data-hugin-btn]")]) {
        const original = ours.nextElementSibling;
        if (original?.__huginReplaced) {
            original.style.display = "";
            original.__huginReplaced = false;
        }
        ours.remove();
    }

    for (const el of document.querySelectorAll("button, [role='button']")) {
        if (!el.__huginReplaced) continue;
        el.style.display = "";
        el.__huginReplaced = false;
    }
}

function replaceShareButton(original) {
    const parent = original.parentElement;
    if (!parent) return;

    const drawIcon = button => {
        button.innerHTML = state.broadcasting ? ICON.discordStopShare(20) : ICON.discordShareScreen(20);
        button.classList.toggle(ACTIVE_BUTTON_CLASS, state.broadcasting);
    };

    const existing = parent.querySelector("[data-hugin-btn]");

    if (original.__huginReplaced && existing) {
        drawIcon(existing);
        return;
    }

    const replacement = document.createElement(original.tagName);
    replacement.setAttribute("data-hugin-btn", "");
    replacement.className = original.className;
    replacement.setAttribute("aria-label", "Compartilhar tela (P2P)");
    replacement.title = "Compartilhar tela por P2P";
    drawIcon(replacement);

    replacement.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        if (state.broadcasting) openStreamMenu(replacement);
        else openShareModal();
    });

    parent.insertBefore(replacement, original);
    original.style.display = "none";
    original.__huginReplaced = true;
    log("Discord's screen button replaced with ours");
}

const SUPPRESSED_PRESS_EVENTS = ["pointerdown", "mousedown", "pointerup", "mouseup", "click"];

/**
 * Opens Discord's own screen picker by calling the go-live callback its button already holds.
 */
function openNativePicker(element) {
    const fiberKey = Object.keys(element).find(key => key.startsWith("__reactFiber$"));
    if (!fiberKey) return false;
    let node = element[fiberKey];
    let owner = null;

    for (let depth = 0; node && depth < 16; depth++, node = node.return) {
        if (typeof node.type === "function" && node.memoizedProps?.canGoLive !== undefined) {
            owner = node;
            break;
        }
    }

    if (!owner) return false;
    const channel = owner.memoizedProps.channel;
    if (!channel) return false;

    for (let hook = owner.memoizedState, i = 0; hook && i < 60; hook = hook.next, i++) {
        const state = hook.memoizedState;
        const isCallback =
            Array.isArray(state) && state.length === 2 && typeof state[0] === "function" && Array.isArray(state[1]);
        if (!isCallback) continue;
        const [, deps] = state;
        if (deps[0] !== channel.guild_id || deps[1] !== channel.id) continue;
        try {
            state[0]();
        } catch (err) {
            log("native picker threw:", err);
            return false;
        }
        return true;
    }

    return false;
}

function hijackShare(element) {
    if (element.__huginHijacked) return;
    element.__huginHijacked = true;

    for (const type of SUPPRESSED_PRESS_EVENTS) {
        element.addEventListener(
            type,
            event => {
                if (!config.hijackShareButton) return;
                if (config.useNativePicker && type !== "click") return;
                event.preventDefault();
                event.stopImmediatePropagation();
                if (type !== "click") return;

                log(
                    "share button clicked | broadcasting:",
                    state.broadcasting,
                    "| modal already up:",
                    sharing,
                    "| native picker:",
                    config.useNativePicker
                );

                if (state.broadcasting) {
                    stopBroadcast().catch(err => log("stopBroadcast:", err));
                    return;
                }

                if (config.useNativePicker) {
                    if (openNativePicker(element)) return;
                    log("native picker unavailable; falling back to ours");
                }

                openShareModal();
            },
            true
        );
    }

    log("hijacked Discord's screen button");
}

let labelsLogged = false;

function voicePanel() {
    for (const el of document.querySelectorAll("button[aria-label], div[role='button'][aria-label]")) {
        const label = el.getAttribute("aria-label") ?? "";
        if (!DISCONNECT_LABELS.some(rx => rx.test(label))) continue;
        let node = el;
        for (let depth = 0; node && depth < 6; depth++, node = node.parentElement) {
            const buttons = node.querySelectorAll?.("button, [role='button']") ?? [];
            if (buttons.length >= 2) return node;
        }
        return el.parentElement;
    }

    return null;
}

function logPanelLabels() {
    if (!native.debug || labelsLogged || !state.channelId) return;
    const panelNode = voicePanel();
    if (!panelNode) return;
    const descriptions = [];

    for (const el of panelNode.querySelectorAll("button, [role='button']")) {
        const firstClass = String(el.className || "")
            .split(" ")[0]
            .slice(0, 28);
        descriptions.push(
            [
                el.tagName.toLowerCase(),
                "aria=" + (el.getAttribute("aria-label") || "-"),
                "title=" + (el.getAttribute("title") || "-"),
                "texto=" + (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 20),
                "classe=" + (firstClass || "-")
            ].join(" ")
        );
    }

    if (!descriptions.length) return;
    labelsLogged = true;
    log("voice panel buttons (" + descriptions.length + "):", descriptions.join(" || ").slice(0, 1500));
}

/**
 * A button's accessible name, from aria-label or the element its aria-describedby points to.
 */
function accessibleName(element) {
    const label = element.getAttribute("aria-label");
    if (label) return label;
    const describedBy = element.getAttribute("aria-describedby");
    if (!describedBy) return "";
    return document.getElementById(describedBy)?.textContent ?? "";
}

function takeShareButton(element) {
    if (element.hasAttribute("data-hugin-btn")) return;

    if (config.replaceShareButton) replaceShareButton(element);
    else hijackShare(element);
}

function scanShareButton() {
    logPanelLabels();
    let found = false;

    for (const element of document.querySelectorAll(
        "button[aria-label], button[aria-describedby], [role='button'][aria-label], [role='button'][aria-describedby]"
    )) {
        if (!SHARE_LABELS.some(rx => rx.test(accessibleName(element)))) continue;
        takeShareButton(element);
        found = true;
    }

    if (found) return;

    for (const icon of document.querySelectorAll(`path[d^="${SHARE_ICON_SIGNATURE}"]`)) {
        const element = icon.closest("button, [role='button']");
        if (element) takeShareButton(element);
    }
}
