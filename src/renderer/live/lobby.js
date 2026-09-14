/**
 * Server-wide LIVE badges. Broadcasters announce themselves in a lobby room per Discord server, and
 * everyone watches the lobby of the server they have open, so a stream shows up without joining its
 * call. The lobby carries no video, only the peer list and its labels.
 */

const LOBBY_MARK = "l1~";
const LOBBY_RETRY_MS = 30000;
const PENDING_WATCH_MS = 20000;
let lobbyGuild = null;
let lobbyRetryAt = 0;
let lobbyReportSequence = 0;
let announceKey = null;
let announceRetryAt = 0;
let pendingWatch = null;

native.onVideoCount?.(payload => {
    if (payload?.role !== "lobby") return;
    applyLobbyReport(payload.streams ?? []).catch(err => log("lobby report:", err));
});

/**
 * The server open in Discord, or null in DMs.
 */
function viewedGuildId() {
    return /^\/channels\/(\d+)(?:\/|$)/.exec(location.pathname)?.[1] ?? null;
}

function guildOf(channelId) {
    const guild = channelId ? String(channelId).split(":")[0] : "";
    return /^\d+$/.test(guild) ? guild : null;
}

/**
 * Lobby room and password for a server, derived like the call rooms but with their own salts.
 */
async function lobbyFor(guildId) {
    const secret = config.roomSecret ?? "";
    const room = await sha256Hex(`golive-p2p-lobby:${guildId}:${secret}`);
    const key = await sha256Hex(`golive-p2p-lobby-key:${guildId}:${secret}`);

    return {
        room: "glp" + room.slice(0, 16),
        password: key.slice(0, 24)
    };
}

/**
 * Our lobby label: user id, the channel we broadcast in, then as much of the name as fits.
 */
function packLobbyLabel(channelId) {
    const name = String(currentUserName() || "")
        .replace(/~/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const prefix = `${LOBBY_MARK}${packId(state.userId)}~${packId(channelPart(channelId))}~`;
    return prefix + name.slice(0, Math.max(0, LABEL_LIMIT - prefix.length));
}

function unpackLobbyLabel(label) {
    const text = String(label ?? "").trim();
    if (!text.startsWith(LOBBY_MARK)) return null;
    const [, user, channel, ...rest] = text.split("~");
    const userId = unpackId(user);
    const channelId = unpackId(channel);
    if (!userId || !channelId) return null;

    return {
        userId,
        channelId,
        name: rest.join("~").trim()
    };
}

function refreshLiveBadges() {
    try {
        syncLiveBadges();
    } catch (err) {
        log("syncLiveBadges threw:", err);
    }
}

/**
 * Keeps our announcement in the lobby of the server we broadcast in, and takes it down when we stop.
 * The announcement's stream id mirrors the broadcast's ("l" instead of "u"), so viewers can map it
 * back.
 */
async function syncAnnounce() {
    const guild = guildOf(state.channelId);

    const wanted =
        state.broadcasting && guild && state.userId && state.pushId?.startsWith("u") && !config.room
            ? `${state.channelId}|${state.pushId}`
            : null;

    if (wanted === announceKey) return;
    if (wanted && Date.now() < announceRetryAt) return;
    const previous = announceKey;
    announceKey = wanted;

    if (!wanted) {
        await native
            .detachView({
                role: "announce"
            })
            .catch(() => {});
        if (previous) log("lobby announce: off");
        return;
    }

    const { room, password } = await lobbyFor(guild);
    if (announceKey !== wanted) return;

    try {
        await native.attachView({
            role: "announce",
            url: announceUrl(room, password, "l" + state.pushId.slice(1), packLobbyLabel(state.channelId)),
            visible: false
        });
        log("lobby announce: on in server", guild);
    } catch (err) {
        if (announceKey === wanted) announceKey = null;
        announceRetryAt = Date.now() + LOBBY_RETRY_MS;
        log("lobby announce failed:", err);
    }
}

/**
 * Watches the lobby of the server open in Discord. In DMs the last server's lobby stays, so its badges
 * are ready when that server is opened again.
 */
async function syncLobby() {
    const guild = config.room ? null : viewedGuildId();
    if (!guild || guild === lobbyGuild || Date.now() < lobbyRetryAt) return;
    lobbyGuild = guild;

    if (state.lobby.size) {
        state.lobby = new Map();
        refreshLiveBadges();
    }

    const { room, password } = await lobbyFor(guild);
    if (lobbyGuild !== guild) return;

    try {
        await native.attachView({
            role: "lobby",
            url: lobbyUrl(room, password),
            visible: false
        });
        log("lobby: watching server", guild);
    } catch (err) {
        if (lobbyGuild === guild) lobbyGuild = null;
        lobbyRetryAt = Date.now() + LOBBY_RETRY_MS;
        log("lobby failed:", err);
    }
}

/**
 * Replaces the lobby list with a report from the lobby window. Each entry keeps the broadcast's stream
 * id and its channel's room, so the preview can reach the stream from outside the call.
 */
async function applyLobbyReport(peers) {
    const guild = lobbyGuild;
    if (!guild) return;
    const sequence = ++lobbyReportSequence;
    const next = new Map();

    for (const peer of peers) {
        const id = String(peer.id ?? "");
        const who = unpackLobbyLabel(peer.label);
        if (!who || !id.startsWith("l")) continue;
        const channelId = `${guild}:${who.channelId}`;

        next.set(id, {
            streamId: "u" + id.slice(1),
            userId: who.userId,
            name: who.name,
            channelId,
            room: await roomForChannel(channelId),
            password: await passwordForChannel(channelId)
        });
    }

    if (guild !== lobbyGuild || sequence !== lobbyReportSequence) return;

    const signature = list =>
        [...list.values()]
            .map(entry => entry.userId + "@" + entry.channelId)
            .sort()
            .join(",");

    const changed = signature(next) !== signature(state.lobby);
    state.lobby = next;
    if (!changed) return;
    log("lobby sees:", signature(next) || "(nobody live)");
    refreshLiveBadges();
}

/**
 * A lobby entry as a stream item; item.lobby tells the preview and the watch button that the stream is
 * outside our call.
 */
function lobbyStreamer(entry) {
    const known = rosterByUser.get(entry.userId);

    return {
        key: entry.streamId,
        label: known?.name || entry.name || "Transmissão",
        avatar: known?.avatar ?? null,
        quality: null,
        height: 0,
        aspect: 0,
        ready: true,
        mine: false,
        lobby: entry
    };
}

/**
 * Joins the broadcaster's voice channel from the preview, like Discord's watch button, then opens the
 * stream once the call's scene sees it.
 */
function joinCallAndWatch(item) {
    const channel = channelPart(item.lobby.channelId);
    const row = document.querySelector(`[data-list-item-id="channels___${channel}"]`);

    if (!row) {
        log("voice channel not in the sidebar:", channel);
        return;
    }

    pendingWatch = {
        key: item.key,
        until: Date.now() + PENDING_WATCH_MS
    };

    row.click();
}

function openPendingWatch() {
    if (!pendingWatch) return;

    if (Date.now() > pendingWatch.until) {
        pendingWatch = null;
        return;
    }

    const item = streamers().find(entry => entry.key === pendingWatch.key);
    if (!item) return;
    pendingWatch = null;
    openWatchScreen(item);
}

function watchLobby() {
    setInterval(() => {
        syncLobby().catch(err => log("syncLobby:", err));
        syncAnnounce().catch(err => log("syncAnnounce:", err));
        openPendingWatch();
    }, 1000);
}
