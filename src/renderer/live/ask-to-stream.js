/**
 * Discord's "Ask to Stream" button in the activities card of a user who is live with us.
 */

/**
 * Discord offers the button for a user who plays a game without streaming, and hides it once they go
 * live with Discord's own share, which our stream is not. DKHhec is the intl key of its label.
 */
const ASK_TO_STREAM_KEY = "DKHhec";
const ASK_TO_STREAM_FALLBACK_LABELS = ["Pedir para a transmitir", "Ask to Stream"];
const ASK_TO_STREAM_MARK = "data-hugin-ask-to-stream";
const ASK_TO_STREAM_RESCAN_MS = 10000;

let askToStreamLabelCache = null;
let askToStreamScannedAt = 0;

/**
 * The button's label in every locale Discord has loaded, read from its message bundles.
 */
function askToStreamLabels() {
    if (askToStreamLabelCache?.found || Date.now() - askToStreamScannedAt < ASK_TO_STREAM_RESCAN_MS) {
        return askToStreamLabelCache?.labels ?? new Set(ASK_TO_STREAM_FALLBACK_LABELS);
    }

    askToStreamScannedAt = Date.now();
    const labels = new Set(ASK_TO_STREAM_FALLBACK_LABELS);
    let found = false;

    for (const id in webpackRequire?.c ?? {}) {
        let exports;
        try {
            exports = webpackRequire.c[id]?.exports;
        } catch {
            continue;
        }

        for (const bundle of [exports, exports?.default]) {
            let message;
            try {
                message = bundle?.[ASK_TO_STREAM_KEY];
            } catch {
                continue;
            }
            if (!Array.isArray(message) || message.length !== 1 || typeof message[0] !== "string") continue;
            labels.add(message[0]);
            found = true;
        }
    }

    askToStreamLabelCache = {
        labels,
        found
    };

    return labels;
}

/**
 * Hides the button in a card that shows our stream, with its wrapper when the button is all it holds.
 */
function hideAskToStream(card) {
    const labels = askToStreamLabels();

    for (const button of card.querySelectorAll("button")) {
        if (button.hasAttribute(ASK_TO_STREAM_MARK) || !labels.has(button.textContent.trim())) continue;
        const wrapper = button.parentElement;
        const target = wrapper && wrapper !== card && wrapper.childElementCount === 1 ? wrapper : button;
        target.style.display = "none";
        target.setAttribute(ASK_TO_STREAM_MARK, "");
    }
}

function restoreAskToStream() {
    for (const hidden of document.querySelectorAll(`[${ASK_TO_STREAM_MARK}]`)) {
        hidden.style.display = "";
        hidden.removeAttribute(ASK_TO_STREAM_MARK);
    }
}
