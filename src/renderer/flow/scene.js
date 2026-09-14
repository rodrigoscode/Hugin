/**
 * Processing of the hidden room scene: live streams, viewers and their sounds.
 */

/**
 * Scene ticks a stream may be missing before it leaves the list.
 */
const GRACE_TICKS = 3;
let lastScene = "";
const announced = new Set();
let firstScene = true;
let sceneSilenceUntil = 0;
const viewersAnnounced = new Set();
let firstBeacon = true;
let probeDone = false;
let lastSceneReport = null;

native.onVideoCount?.(payload => {
    if (payload?.role !== "watch") return;
    lastSceneReport = payload;
    processScene(payload, false);
});

let endingFromSource = false;

native.onStreamEnded?.((...args) => {
    const reason = args.find(arg => typeof arg === "string");
    if (reason !== "source-ended" || !state.broadcasting || endingFromSource) return;
    endingFromSource = true;
    log("broadcast source closed: stopping");

    stopBroadcast()
        .catch(err => log("stopBroadcast:", err))
        .finally(() => {
            endingFromSource = false;
        });
});

setInterval(() => {
    if (lastSceneReport && state.watching) processScene(lastSceneReport, true);
}, 1000);

/**
 * Applies a scene report: live streams and viewer beacons, the start, stop and join sounds, and the
 * stage.
 */
function processScene(payload, periodic) {
    const listBefore = [...state.streams.keys()].join(",") + "|" + [...state.watchers.keys()].join(",");
    const arrived = (payload.streams ?? []).map(x => x.id + (x.ready ? "" : "?")).join(",");

    if (arrived !== lastScene) {
        lastScene = arrived;
        log("scene sees:", arrived || "(nothing)", "| ours:", state.selfStreamId ?? "-");
    }

    if (native.debug && !probeDone && (payload.streams ?? []).length > 0) {
        probeDone = true;
        native
            .probeStructure?.({
                role: "watch"
            })
            .then(r => log("scene structure:", String(r).slice(0, 1200)))
            .catch(err => log("structure probe failed:", err));
    }

    const realStreams = [];
    const beacons = [];

    for (const item of payload.streams ?? []) {
        const known = state.streams.get(item.id);
        const label = String(item.label ?? "") || String(known?.rawLabel ?? "");
        const isBeacon =
            label.startsWith(VIEWER_MARK) ||
            Boolean(state.selfBeaconId && item.id === state.selfBeaconId) ||
            state.watchers.has(item.id) ||
            (item.height > 0 && item.height <= 2);
        if (isBeacon) {
            beacons.push(item);
            state.streams.delete(item.id);
        } else {
            realStreams.push(item);
        }
    }

    const seen = new Set();

    for (const item of realStreams) {
        if (state.pushId && item.id === state.pushId) continue;
        if (state.selfStreamId && item.id === state.selfStreamId) continue;
        seen.add(item.id);
        const current = state.streams.get(item.id);
        if (current) {
            current.missingTicks = 0;
            current.ready = item.ready !== false;
            current.uuid = item.uuid || current.uuid;
            current.height = item.height || current.height;
            current.aspect = item.aspect || current.aspect || 0;
            try {
                applyLabel(current, item.label, "scene");
            } catch (err) {
                log("label ignored:", String(err));
            }
        } else {
            const created = {
                label: "",
                avatarUrl: null,
                uuid: item.uuid || "",
                height: item.height || 0,
                aspect: item.aspect || 0,
                missingTicks: 0,
                ready: item.ready !== false
            };
            try {
                applyLabel(created, item.label, "scene");
            } catch (err) {
                log("label ignored:", String(err));
            }
            state.streams.set(item.id, created);
        }
    }

    for (const [id, data] of [...state.streams]) {
        if (seen.has(id)) continue;
        data.missingTicks += 1;
        if (data.missingTicks > GRACE_TICKS) state.streams.delete(id);
    }

    const listChanged = () =>
        [...state.streams.keys()].join(",") + "|" + [...state.watchers.keys()].join(",") !== listBefore;

    if (!periodic || listChanged()) {
        syncWatchPresence();
        try {
            syncLiveBadges();
        } catch (err) {
            log("syncLiveBadges threw:", err);
        }
    }

    if (firstScene) {
        sceneSilenceUntil = Date.now() + 5000;
        firstScene = false;
    }

    for (const id of seen) {
        if (announced.has(id)) continue;
        const data = state.streams.get(id);
        if (!data?.ready || (data.height > 0 && data.height <= 2)) continue;
        announced.add(id);
        if (Date.now() > sceneSilenceUntil) playSound("start", "someone started broadcasting");
    }

    for (const id of [...announced]) {
        if (state.streams.has(id)) continue;
        announced.delete(id);
        playSound("stop", "someone stopped broadcasting");
    }

    const seenBeacons = new Set();

    for (const item of beacons) {
        if (state.pushId && item.id === state.pushId) continue;
        if (state.selfStreamId && item.id === state.selfStreamId) continue;
        const who = unpackIdentity(item.label);
        if (!who?.name) continue;
        seenBeacons.add(item.id);
        const current = state.watchers.get(item.id);
        if (current) {
            current.missingTicks = 0;
            current.name = who.name;
            current.avatar = who.avatar ?? current.avatar ?? null;
            current.userId = who.userId ?? current.userId ?? null;
        } else {
            state.watchers.set(item.id, {
                name: who.name,
                avatar: who.avatar ?? null,
                userId: who.userId ?? null,
                missingTicks: 0
            });
        }
    }

    for (const [id, data] of [...state.watchers]) {
        if (seenBeacons.has(id)) continue;
        data.missingTicks += 1;
        if (data.missingTicks > GRACE_TICKS) state.watchers.delete(id);
    }

    for (const id of seenBeacons) {
        if (viewersAnnounced.has(id)) continue;
        viewersAnnounced.add(id);
        if (!firstBeacon && state.broadcasting) playSound("join", "a viewer started watching");
    }

    firstBeacon = false;

    for (const id of [...viewersAnnounced]) {
        if (state.watchers.has(id)) continue;
        viewersAnnounced.delete(id);
        if (state.broadcasting) playSound("left", "a viewer stopped watching");
    }

    if (state.streams.size > 0) state.probing = false;
    const previous = state.videoCount;
    state.videoCount = state.streams.size;

    if (previous === 0 && state.videoCount > 0) {
        state.startedAt ||= Date.now();
    }

    if (previous !== state.videoCount) syncBeacon().catch(err => log("syncBeacon:", err));
    if (!periodic || listChanged()) render();
}
