/**
 * LIVE badges on voice rows, and which Discord user owns each stream.
 */

const LIVE_BADGE_CLASS =
    "eyebrow_cf4812 live_a7acae liveSmall_a7acae textBadge__463b7 base__463b7 liveShapeRound_a7acae";

const ICONS_CLASS = "icons__07f91";
const ICON_GROUP_CLASS = "iconGroup__07f91";
const VOICE_ROW_SELECTOR = '[class*="content__07f91"]';
const BADGE_MARK = "data-hugin-live";
let hoveredVoiceRow = null;

/**
 * Voice channel rows by Discord user id, read from each row's React props.
 */
function voiceRowsByUser() {
    const rows = new Map();

    for (const row of document.querySelectorAll(VOICE_ROW_SELECTOR)) {
        const fiberKey = Object.keys(row).find(key => key.startsWith("__reactFiber$"));
        if (!fiberKey) continue;
        let node = row[fiberKey];
        for (let depth = 0; node && depth < 8; depth++, node = node.return) {
            const id = node.memoizedProps?.user?.id;
            if (!id) continue;
            rows.set(id, row);
            break;
        }
    }

    return rows;
}

/**
 * The Discord user behind a room stream: first from the stream id (derived from the user id), then
 * from its label.
 */
function streamOwner(id, data) {
    return rosterByStream.get(id)?.userId || data?.userId || null;
}

function liveUserIds() {
    const live = new Set();

    for (const [id, stream] of state.streams) {
        const owner = streamOwner(id, stream);
        if (!owner) continue;
        if (state.userId && owner === state.userId) continue;
        live.add(owner);
    }

    for (const entry of state.lobby.values()) {
        if (entry.userId !== state.userId) live.add(entry.userId);
    }

    if (state.broadcasting && state.userId) live.add(state.userId);
    return live;
}

function syncLiveBadges() {
    if (livePreview?.item && !previewStillLive(livePreview.item)) closeLivePreview();
    const rows = voiceRowsByUser();
    const live = liveUserIds();

    for (const badge of document.querySelectorAll(`[${BADGE_MARK}]`)) {
        const owner = badge.getAttribute(BADGE_MARK);
        if (!live.has(owner) || badge.closest(VOICE_ROW_SELECTOR) !== rows.get(owner)) badge.remove();
    }

    for (const userId of live) {
        const row = rows.get(userId);
        if (!row) continue;
        bindRowPreview(row, userId);
        if (row.querySelector(`[${BADGE_MARK}]`)) continue;
        const native = row.querySelector(`[class*="live_"]:not([${BADGE_MARK}])`);
        if (native) continue;
        let icons = row.querySelector(`[class*="icons__"]`);
        if (!icons) {
            icons = document.createElement("div");
            icons.className = ICONS_CLASS;
            row.appendChild(icons);
        }
        let group = icons.querySelector(`[class*="iconGroup__"]`);
        if (!group) {
            group = document.createElement("div");
            group.className = ICON_GROUP_CLASS;
            icons.appendChild(group);
        }
        const badge = document.createElement("div");
        badge.className = LIVE_BADGE_CLASS;
        badge.setAttribute("data-text-variant", "eyebrow");
        badge.setAttribute(BADGE_MARK, userId);
        badge.style.backgroundColor = "var(--red-400)";
        badge.textContent = "Ao Vivo";
        group.appendChild(badge);
    }

    openPreviewUnderPointer(rows, live);
}

/**
 * Opens the preview for a stream that goes live under the pointer, as when someone starts streaming
 * while their row, or the activities card it opened, is hovered.
 */
function openPreviewUnderPointer(rows, live) {
    const row = hoveredVoiceRow;
    if (livePreview || sharing || !row?.isConnected) return;
    if (!row.matches(":hover") && !nativeActivitiesCard()?.matches(":hover")) return;

    for (const userId of live) {
        if (rows.get(userId) !== row) continue;
        const item = streamerForUser(userId);
        if (item) openLivePreview(item, row);
        return;
    }
}

/**
 * Keeps the badges in sync in or out of a call; out of one, the server lobby still reports who is live.
 */
function watchLiveBadges() {
    addEventListener(
        "mouseover",
        event => {
            const row = event.target?.closest?.(VOICE_ROW_SELECTOR);
            if (row) hoveredVoiceRow = row;
        },
        true
    );

    setInterval(() => {
        try {
            syncLiveBadges();
        } catch (err) {
            log("syncLiveBadges threw:", err);
        }

        if (!state.channelId) return;

        try {
            syncActivityPanel();
        } catch (err) {
            log("syncActivityPanel threw:", err);
        }

        try {
            syncIframeBitrates();
        } catch (err) {
            log("syncBitrateDosIframes threw:", err);
        }
    }, 1500);
}

function streamerForUser(userId) {
    const list = streamers();

    if (state.broadcasting && userId === state.userId) {
        return list.find(item => item.mine) ?? null;
    }

    for (const [id, data] of state.streams) {
        if (streamOwner(id, data) !== userId) continue;
        return list.find(item => item.key === id) ?? null;
    }

    for (const entry of state.lobby.values()) {
        if (entry.userId === userId && userId !== state.userId) return lobbyStreamer(entry);
    }

    return null;
}
