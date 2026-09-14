/**
 * The identity packet carried in VDO.Ninja labels: Discord user id, requested quality and display
 * name.
 */

const MARK = "g1~";
const LEGACY_MARK = "glp1.";
const VIEWER_MARK = "s1~";
const LABEL_LIMIT = 58;

function fromBase64Url(text) {
    return new TextDecoder().decode(b64ToBytes(text));
}

function bytesToB64(bytes) {
    let raw = "";
    for (const b of bytes) raw += String.fromCharCode(b);
    return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64ToBytes(text) {
    const raw = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
}

/**
 * Encodes a Discord id (snowflake) in 11 characters. Underscores become dots because VDO.Ninja turns
 * every underscore in a label into a space.
 */
function packId(id) {
    try {
        let n = BigInt(id);
        const bytes = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            bytes[i] = Number(n & 0xffn);
            n >>= 8n;
        }
        return bytesToB64(bytes).replace(/_/g, ".");
    } catch {
        return "";
    }
}

/**
 * Decodes packId output, including labels from older versions where VDO.Ninja already turned
 * underscores into spaces. Returns null unless exactly 8 bytes come back.
 */
function unpackId(text) {
    try {
        const bytes = b64ToBytes(String(text).replace(/[ .]/g, "_"));
        if (bytes.length !== 8) return null;
        let n = 0n;
        for (const b of bytes) n = (n << 8n) | BigInt(b);
        return n > 0n ? n.toString() : null;
    } catch {
        return null;
    }
}

/**
 * Decodes the 22-character avatar hash older labels carried; an "a" prefix marks an animated avatar.
 */
function unpackHash(text) {
    if (!text) return null;
    const animated = text.startsWith("a");
    const body = animated ? text.slice(1) : text;

    try {
        const bytes = b64ToBytes(body);
        if (bytes.length !== 16) return null;
        const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
        return (animated ? "a_" : "") + hex;
    } catch {
        return null;
    }
}

const HEIGHTS = {
    2160: "d",
    1440: "c",
    1080: "a",
    720: "b",
    480: "e",
    360: "f"
};

const HEIGHTS_REVERSE = Object.fromEntries(Object.entries(HEIGHTS).map(([k, v]) => [v, Number(k)]));

function packQuality(height, fps, mode) {
    const code = HEIGHTS[height] ?? "a";
    return code + (fps >= 60 ? "6" : "3") + (mode === "camera" ? "c" : "t");
}

function unpackQuality(text) {
    if (!text || text.length !== 3) return null;
    const height = HEIGHTS_REVERSE[text[0]];
    if (!height) return null;

    return {
        height,
        fps: text[1] === "6" ? 60 : 30,
        mode: text[2] === "c" ? "camera" : "screen"
    };
}

function packIdentity(fallbackName, quality, mark = MARK) {
    const id = state.userId ? packId(state.userId) : "";
    const spec = quality ? packQuality(quality.height, quality.fps, quality.mode) : "";

    const name = String(currentUserName() || fallbackName || "")
        .replace(/~/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const prefix = `${mark}${id}~${spec}~`;
    const space = Math.max(0, LABEL_LIMIT - prefix.length);
    return prefix + name.slice(0, space);
}

/**
 * The single entry point for labels, from the scene or from session.rpcs. Returns true when something
 * changed.
 */
function applyLabel(data, label, source) {
    const text = String(label ?? "").trim();
    if (!text || !data || data.rawLabel === text) return false;
    const who = unpackIdentity(text);

    if (!who?.name) {
        data.rawLabel = text;
        return false;
    }

    data.rawLabel = text;
    data.label = who.name;
    data.avatarUrl = who.avatar ?? data.avatarUrl ?? null;
    data.quality = who.quality ?? data.quality ?? null;
    data.userId = who.userId ?? data.userId ?? null;
    log("identity received (" + (source ?? "?") + "):", who.name, who.avatar ? "(with photo)" : "(no photo)");
    return true;
}

function unpackIdentity(label) {
    const text = String(label ?? "").trim();
    if (!text) return null;

    if (text.startsWith(MARK) || text.startsWith(VIEWER_MARK)) {
        const [, id, field, ...rest] = text.split("~");
        const userId = unpackId(id);
        const name = rest.join("~").trim();
        if (!name) return null;
        const quality = unpackQuality(field);
        const hash = quality ? null : unpackHash(field);
        return {
            name,
            avatar: avatarFor(userId, hash),
            quality,
            userId
        };
    }

    if (text.startsWith(LEGACY_MARK)) {
        try {
            const data = JSON.parse(fromBase64Url(text.slice(LEGACY_MARK.length)));
            return {
                name: String(data.n || ""),
                avatar: avatarFor(data.u, data.h)
            };
        } catch {
            return null;
        }
    }

    return {
        name: text,
        avatar: null
    };
}

function avatarFor(userId, hash) {
    if (!userId) return null;

    if (hash) {
        const ext = String(hash).startsWith("a_") ? "gif" : "webp";
        return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=128`;
    }

    try {
        const index = Number((BigInt(userId) >> 22n) % 6n);
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    } catch {
        return null;
    }
}
