/**
 * Passive observation of Discord's traffic: API responses (who is who), the gateway (current voice
 * channel) and the voice connection.
 */

const seenRoutes = new Set();
let channelFromGateway = null;
let leftViaGateway = false;
let onGatewayCallLeft = null;

const channelPoll = {
    active: false,
    pending: false
};

const SELF_ROUTE = /\/api\/v\d+\/users\/@me(?:$|\?)/;
const HOSTS = ["discord.com", "discordapp.com", "discord.gg", "discord.media"];

function isDiscordHost(url) {
    try {
        const host = new URL(url, location.origin).hostname;
        return HOSTS.some(d => host === d || host.endsWith("." + d));
    } catch {
        return false;
    }
}

const PEOPLE_ROUTE = /\/api\/v\d+\//;
const apiIndex = new Map();

function storeUser(u) {
    if (!u?.id || (!u.username && !u.global_name)) return false;
    const id = String(u.id);
    const name = String(u.global_name || u.username).trim();
    const avatar = avatarFor(id, u.avatar ?? null);
    const previous = apiIndex.get(id);
    if (previous?.name === name && previous?.avatar === avatar) return false;

    apiIndex.set(id, {
        name,
        avatar
    });

    if (id === state.userId) {
        state.userName = name;
        state.avatarUrl = avatar ?? state.avatarUrl;
        log("identity via API:", name, "| id:", id);
        render();
    }

    return true;
}

/**
 * Collects user objects from an API response at any depth: loose, in lists, or nested under messages.
 */
function harvestUsers(data) {
    let added = 0;

    const visit = (value, depth) => {
        if (!value || depth > 6 || added > 200) return;

        if (Array.isArray(value)) {
            for (const item of value) visit(item, depth + 1);
            return;
        }

        if (typeof value !== "object") return;
        if (storeUser(value)) added++;
        for (const key of Object.keys(value)) visit(value[key], depth + 1);
    };

    try {
        visit(data, 0);
    } catch {}

    return added;
}

function normalizeRoute(url) {
    if (!isDiscordHost(url)) return null;

    try {
        const path = new URL(url, location.origin).pathname;
        if (!path.includes("/api/")) return null;
        return path.replace(/\/\d{5,}/g, "/<id>");
    } catch {
        return null;
    }
}

let censusBatch = [];
let censusTimer = null;

/**
 * With --debug, logs each Discord API route the first time it is called, in batches.
 */
function census(url) {
    if (!native.debug) return;
    const route = normalizeRoute(url);
    if (!route || seenRoutes.has(route)) return;
    seenRoutes.add(route);
    censusBatch.push(route);
    clearTimeout(censusTimer);

    censusTimer = setTimeout(() => {
        log("new routes:", censusBatch.join(" ").slice(0, 1200));
        censusBatch = [];
    }, 3000);
}

function storeIdentity(data, source) {
    if (!data?.id) return;
    state.userId = String(data.id);
    state.userName = String(data.global_name || data.username || state.userName || "");

    if (data.avatar) {
        const ext = String(data.avatar).startsWith("a_") ? "gif" : "webp";
        state.avatarUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${ext}?size=128`;
    } else {
        try {
            const index = Number((BigInt(data.id) >> 22n) % 6n);
            state.avatarUrl = `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        } catch {}
    }

    log("identity via API (" + source + "):", state.userName, "| id:", state.userId);
    render();
}

let tokenInMemory = null;

function idFromToken(value, url) {
    if (!isDiscordHost(url)) return;

    if ((config.fetchOwnProfile || config.fetchProfiles) && !tokenInMemory && value) {
        tokenInMemory = String(value);
        if (config.fetchOwnProfile) fetchMyProfile();
    }

    if (state.userId) return;
    const first = String(value ?? "").split(".")[0];
    if (!first) return;

    try {
        const text = atob(first.replace(/-/g, "+").replace(/_/g, "/"));
        if (!/^\d{15,25}$/.test(text)) return;
        state.userId = text;
        log("user id via token:", text);
        render();
    } catch {}
}

let profileRequested = false;

async function fetchMyProfile() {
    if (profileRequested || !tokenInMemory) return;
    profileRequested = true;

    try {
        const response = await fetch("/api/v9/users/@me", {
            headers: {
                authorization: tokenInMemory
            }
        });
        if (!response.ok) {
            log("users/@me responded", response.status);
            return;
        }
        storeIdentity(await response.json(), "users/@me");
    } catch (err) {
        log("users/@me failed:", String(err));
    }
}

const profilesRequested = new Set();

async function ensureIdentity(userId) {
    if (!userId || apiIndex.has(userId) || profilesRequested.has(userId)) return;
    if (!config.fetchProfiles || !tokenInMemory) return;
    profilesRequested.add(userId);

    try {
        const response = await fetch(`/api/v9/users/${userId}`, {
            headers: {
                authorization: tokenInMemory
            }
        });
        if (!response.ok) {
            log("profile for", userId, "responded", response.status);
            return;
        }
        const data = await response.json();
        if (storeUser(data)) {
            log("profile fetched:", data.global_name || data.username);
            refreshRoster(state.channelId).catch(() => {});
        }
    } catch (err) {
        log("profile for", userId, "failed:", String(err));
    }
}

function readBody(body, source) {
    try {
        const data = typeof body === "string" ? JSON.parse(body) : body;
        storeIdentity(data, source);
    } catch {}
}

const peopleByRoute = new Set();

function readPeople(url, body) {
    if (!isDiscordHost(url)) return;
    let data = body;

    if (typeof body === "string") {
        try {
            data = JSON.parse(body);
        } catch {
            return;
        }
    }

    if (!data || typeof data !== "object") return;
    const added = harvestUsers(data);
    if (!added) return;
    const route = normalizeRoute(url);

    if (native.debug && route && !peopleByRoute.has(route)) {
        peopleByRoute.add(route);
        log("route with users:", route, "| index now:", apiIndex.size);
    }
}

function installNetworkObserver() {
    if (!config.observeNetwork) return;

    try {
        const originalFetch = window.fetch;
        if (typeof originalFetch === "function") {
            window.fetch = function (...args) {
                const response = originalFetch.apply(this, args);

                try {
                    const url = String(args[0]?.url ?? args[0] ?? "");
                    census(url);
                    const headers = args[0]?.headers ?? args[1]?.headers;
                    if (headers) {
                        const auth =
                            typeof headers.get === "function"
                                ? headers.get("authorization")
                                : (headers.authorization ?? headers.Authorization);
                        if (auth) idFromToken(auth, url);
                    }
                    if (SELF_ROUTE.test(url) || PEOPLE_ROUTE.test(url)) {
                        const isMe = SELF_ROUTE.test(url);
                        response.then(
                            r => {
                                r.clone()
                                    .text()
                                    .then(
                                        t => (isMe ? readBody(t, "fetch") : readPeople(url, t)),
                                        () => {}
                                    );
                            },
                            () => {}
                        );
                    }
                } catch {}

                return response;
            };
        }
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            try {
                this.__huginUrl = String(url);
            } catch {}

            return originalOpen.call(this, method, url, ...rest);
        };
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            try {
                if (String(name).toLowerCase() === "authorization") {
                    idFromToken(value, this.__huginUrl ?? "");
                }
            } catch {}

            return originalSetRequestHeader.apply(this, arguments);
        };
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (...args) {
            try {
                this.addEventListener("load", () => {
                    try {
                        const url = this.__huginUrl ?? "";
                        census(url);
                        const type = this.responseType;
                        const body = type === "" || type === "text" ? this.responseText : this.response;
                        if (SELF_ROUTE.test(url)) readBody(body, "xhr");
                        else if (PEOPLE_ROUTE.test(url)) readPeople(url, body);
                    } catch {}
                });
            } catch {}

            return originalSend.apply(this, args);
        };
        const DIGITS = /(\d{17,21})/;
        function fieldId(text, key) {
            const at = text.indexOf(key);
            if (at < 0) return undefined;
            const tag = text.charCodeAt(at + key.length);
            if (tag !== 109 && tag !== 107) return undefined;
            return DIGITS.exec(text.slice(at + key.length, at + key.length + 32))?.[1];
        }
        function readVoiceState(data) {
            let text = "";

            try {
                if (typeof data === "string") text = data;
                else {
                    const bytes = new Uint8Array(data?.buffer ?? data);
                    if (!bytes.length || bytes.length > 4096) return;
                    text = String.fromCharCode.apply(null, bytes);
                }
            } catch {
                return;
            }

            if (!text.includes("self_mute")) return;
            const channel = fieldId(text, "channel_id");
            const guild = fieldId(text, "guild_id");
            const value = channel ? (guild ?? "@me") + ":" + channel : null;
            if (value === channelFromGateway) return;
            channelFromGateway = value;
            log("voice channel via gateway:", value ?? "(left)");
            leftViaGateway = value === null;

            if (value === null) {
                try {
                    onGatewayCallLeft?.();
                } catch {}
            }
        }
        /**
         * Reads IDENTIFY from the voice connection (plain JSON, unlike the ETF gateway): an immediate "joined
         * the call" signal and a confirmation of our user id. The token is never read.
         */
        function readVoiceMedia(data) {
            if (typeof data !== "string") return;
            let msg;

            try {
                msg = JSON.parse(data);
            } catch {
                return;
            }

            if (msg?.op !== 0 || !msg?.d) return;
            const { server_id: server, user_id: user } = msg.d;
            log("voice connection opened | server:", server ?? "?", "| user:", user ?? "?");
            voiceSince = Date.now();
            inCall.clear();

            if (user && !state.userId) {
                state.userId = String(user);
                log("user id via voice connection:", state.userId);
                render();
            }
        }
        const seenOps = new Set();
        const inCall = new Set();
        let voiceSince = 0;
        const VOICE_WAIT_MS = 6000;
        function readVoiceMessage(data) {
            if (typeof data !== "string") return;
            let msg;

            try {
                msg = JSON.parse(data);
            } catch {
                return;
            }

            const user = msg?.d?.user_id;
            if (!user) return;
            const who = String(user);
            ensureIdentity(who);
            inCall.add(who);

            if (native.debug && !seenOps.has(msg.op)) {
                seenOps.add(msg.op);
                log("voice: op", msg.op, "carries user_id -- fields:", Object.keys(msg.d).join(","));
            }

            if (msg.op === 13) {
                const who = String(user);
                inCall.delete(who);
                leftCall(who);
            }
        }
        const OriginalWebSocket = window.WebSocket;
        const seenSockets = new Set();
        window.WebSocket = new Proxy(OriginalWebSocket, {
            construct(target, args) {
                const url = String(args[0] ?? "");
                if (!isDiscordHost(url)) return Reflect.construct(target, args, target);

                try {
                    const withoutQuery = url.split("?")[0];
                    if (!seenSockets.has(withoutQuery)) {
                        seenSockets.add(withoutQuery);
                        const params = new URLSearchParams(url.split("?")[1] ?? "");
                        const safeParams = ["encoding", "compress", "v"]
                            .map(k => (params.get(k) ? k + "=" + params.get(k) : null))
                            .filter(Boolean)
                            .join("&");
                        log("websocket:", withoutQuery.slice(0, 120) + (safeParams ? " ?" + safeParams : ""));
                    }
                } catch {}

                const socket = Reflect.construct(target, args, target);

                try {
                    const isGateway = url.includes("gateway");
                    const isVoice = url.includes("discord.media");
                    if (isGateway || isVoice) {
                        const originalSend = socket.send.bind(socket);
                        socket.send = function (data) {
                            try {
                                if (isGateway) readVoiceState(data);
                                else readVoiceMedia(data);
                            } catch {}

                            return originalSend(data);
                        };
                    }
                    if (isVoice) {
                        socket.addEventListener("message", eventName => {
                            try {
                                readVoiceMessage(eventName.data);
                            } catch {}
                        });
                    }
                    if (isVoice) {
                        socket.addEventListener("close", () => {
                            log("voice connection closed");
                        });
                    }
                } catch {}

                return socket;
            }
        });
        log("network observer installed");
    } catch (err) {
        log("couldn't observe the network:", err);
    }
}

installNetworkObserver();
