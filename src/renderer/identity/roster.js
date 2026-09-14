/**
 * Who is in the voice channel, and who we are, from Discord's DOM and the API index.
 */

const rosterByStream = new Map();
const rosterByUser = new Map();
let rosterSignature = "";

/**
 * Last resort for our own display name: the first text line next to exactly one avatar.
 */
function nameFromAvatar(img) {
    let node = img.parentElement;

    for (let depth = 0; node && depth < 6; depth++, node = node.parentElement) {
        const avatarImgs = node.querySelectorAll?.('img[src*="/avatars/"], img[src*="/embed/avatars/"]');
        if ((avatarImgs?.length ?? 0) > 1) return "";
        const firstLine = (node.innerText || "")
            .split("\n")
            .map(x => x.trim())
            .find(Boolean);
        if (firstLine && firstLine.length <= 40) return firstLine;
    }

    return "";
}

/**
 * Indexes the channel's members by the stream ids their Discord ids and names derive to.
 */
async function refreshRoster(channelId) {
    if (!channelId) {
        rosterByStream.clear();
        rosterByUser.clear();
        rosterSignature = "";
        return;
    }

    rosterByStream.clear();
    rosterByUser.clear();

    for (const [id, data] of apiIndex) {
        const entry = {
            userId: id,
            name: data.name,
            avatar: data.avatar
        };
        rosterByUser.set(id, entry);
        for (const key of [id, keyForName(data.name)]) {
            const streamId = key ? await streamIdFor(key) : null;
            if (streamId) rosterByStream.set(streamId, entry);
        }
    }

    state.selfStreamId ??= await streamIdFor(keyFor(state.userId, state.userName));
    const signature = rosterByStream.size + ":" + (state.userName || "");
    if (signature === rosterSignature) return;
    rosterSignature = signature;

    if (native.debug) {
        log(
            "resolvable ids:",
            rosterByStream.size,
            "| self:",
            (state.userName || "(no name)") + "/" + String(state.userId ?? "?").slice(-4)
        );
    }

    render();
}

const DISCONNECT_LABELS = [/desconectar/i, /sair do canal/i, /disconnect/i, /leave (voice|call)/i];

/**
 * The current voice channel, from the voice panel's channel link, found through the disconnect button.
 */
function voiceChannelInfo() {
    try {
        let node = null;
        for (const el of document.querySelectorAll("button[aria-label], div[role='button'][aria-label]")) {
            const label = el.getAttribute("aria-label") ?? "";
            if (DISCONNECT_LABELS.some(rx => rx.test(label))) {
                node = el;
                break;
            }
        }
        if (!node) return null;
        for (let depth = 0; node && depth < 8; depth++, node = node.parentElement) {
            const link = node.querySelector?.('a[href*="/channels/"]');
            if (!link) continue;
            const match = /\/channels\/(@me|\d+)\/(\d+)/.exec(link.getAttribute("href") ?? "");
            if (!match) continue;
            const name = (link.textContent ?? "")
                .replace(/\s+/g, " ")
                .trim()
                .split(/\s+\/\s+/)[0]
                .slice(0, 48);
            return {
                id: `${match[1]}:${match[2]}`,
                name
            };
        }
    } catch (err) {
        log("DOM channel read failed:", err);
    }

    return null;
}

function voiceChannelId() {
    try {
        const fromStore = stores.selectedChannel?.getVoiceChannelId?.();
        if (fromStore) return String(fromStore);
    } catch {}

    return voiceChannelInfo()?.id ?? null;
}

const SETTINGS_LABELS = [/configura[cc\u00e7][oo\u00f5]es de usu[aa\u00e1]rio/i, /user settings/i, /configura/i];

function userPanelAvatar() {
    try {
        let best = null;
        for (const img of document.querySelectorAll('img[src*="/avatars/"]')) {
            const r = img.getBoundingClientRect();
            if (!r.width) continue;
            if (r.left > 360) continue;
            if (r.bottom < innerHeight - 160) continue;
            if (!best || r.bottom > best.r.bottom)
                best = {
                    img,
                    r
                };
        }
        if (best) return best.img;
        let node = null;
        for (const el of document.querySelectorAll("button[aria-label], div[role='button'][aria-label]")) {
            const label = el.getAttribute("aria-label") ?? "";
            if (SETTINGS_LABELS.some(rx => rx.test(label))) {
                node = el;
                break;
            }
        }
        for (let depth = 0; node && depth < 8; depth++, node = node.parentElement) {
            const img = node.querySelector?.('img[src*="/avatars/"]');
            if (img?.getAttribute("src")) return img;
        }
    } catch {}

    return null;
}

let lastSelfSignature = "";

function refreshIdentity() {
    if (state.userId && state.userName) return;
    const img = userPanelAvatar();
    if (!img) return;
    const src = img.getAttribute("src") ?? "";
    state.avatarUrl = src.replace(/([?&])size=\d+/, "$1size=128");
    state.userId ??= /\/avatars\/(\d+)\//.exec(src)?.[1] ?? null;
    state.userName ||= nameFromAvatar(img);
    const selfSignature = state.userName + "/" + state.userId;

    if (state.userName && selfSignature !== lastSelfSignature) {
        lastSelfSignature = selfSignature;
        log("self:", state.userName, "| id:", state.userId ?? "?");
    }
}

function currentUserName() {
    try {
        const me = stores.currentUser?.getCurrentUser?.();
        const name = me?.globalName || me?.username;
        if (name) return String(name);
    } catch {}

    return state.userName || "";
}
