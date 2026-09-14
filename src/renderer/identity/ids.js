/**
 * Room, password and stream ids derived from the voice channel and the Discord user.
 */

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

const randomId = (size = 10) =>
    Array.from(crypto.getRandomValues(new Uint8Array(size)), b => ALPHABET[b % ALPHABET.length]).join("");

async function sha256Hex(text) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Only the channel id feeds room derivation; channel ids are already unique across Discord.
 */
function channelPart(channelId) {
    return channelId ? String(channelId).split(":").pop() : null;
}

async function roomForChannel(channelId) {
    if (config.room) return config.room;
    const channel = channelPart(channelId);
    if (!channel) return null;
    const hex = await sha256Hex(`golive-p2p:${channel}:${config.roomSecret ?? ""}`);
    return "glp" + hex.slice(0, 16);
}

/**
 * Room password derived from the channel with a different salt, so the public room name does not
 * reveal it.
 */
async function passwordForChannel(channelId) {
    if (config.password) return config.password;
    const channel = channelPart(channelId);
    if (!channel) return "";
    const hex = await sha256Hex(`golive-p2p-key:${channel}:${config.roomSecret ?? ""}`);
    return hex.slice(0, 24);
}

const derivedIds = new Map();

async function streamIdFor(key) {
    if (!key) return null;
    const ready = derivedIds.get(key);
    if (ready) return ready;
    const hex = await sha256Hex(`golive-p2p-user:${key}:${config.roomSecret ?? ""}`);
    const id = "u" + hex.slice(0, 12);
    derivedIds.set(key, id);
    return id;
}

/**
 * The viewer beacon's stream id: same identity, different key, so it never collides with that person's
 * own broadcast.
 */
function beaconStreamId() {
    const key = keyFor(state.userId, currentUserName());
    return key ? streamIdFor("watch:" + key) : Promise.resolve(null);
}

/**
 * Identity key by display name, for users on Discord's default avatar, whose URL carries no id.
 */
function keyForName(name) {
    const normalized = String(name ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    return normalized ? "n:" + normalized : null;
}

function keyFor(userId, name) {
    return userId || keyForName(name);
}
