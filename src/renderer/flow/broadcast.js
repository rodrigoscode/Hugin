/**
 * Room membership, the viewer beacon, and starting or stopping a broadcast.
 */

let beaconActive = false;

/**
 * Publishes the viewer beacon (our identity, no real video) while in a room where someone is live, or
 * while broadcasting.
 */
async function syncBeacon() {
    const shouldAnnounce = state.watching && (state.broadcasting || state.streams.size > 0);
    if (shouldAnnounce === beaconActive) return;

    if (shouldAnnounce) {
        beaconActive = true;
        try {
            const streamId = await beaconStreamId();
            if (!streamId) {
                beaconActive = false;
                return;
            }
            state.selfBeaconId = streamId;
            const label = packIdentity(currentUserName(), null, VIEWER_MARK);
            const url = pushUrl(
                state.room,
                streamId,
                label,
                {
                    height: 2,
                    fps: 1
                },
                "screen"
            );
            await native.attachView({
                role: "identify",
                url,
                visible: false
            });
            log("viewer beacon: on");
        } catch (err) {
            beaconActive = false;
            log("viewer beacon: failed to turn on:", err);
        }
    } else {
        beaconActive = false;
        state.selfBeaconId = null;
        try {
            await native.detachView({
                role: "identify"
            });
        } catch {}
        log("viewer beacon: off");
    }
}

async function attachScene() {
    if (!state.room) return;

    try {
        const url = sceneUrl(state.room, state.selfStreamId);
        log("scene:", url.replace(/password=[^&]*/, "password=***"));
        await native.attachView({
            role: "watch",
            url,
            visible: false
        });
        state.sceneExcludeId = state.selfStreamId;
        state.watching = true;
        state.probing = true;
        state.probeUntil = Date.now() + 10000;
        syncBeacon().catch(err => log("syncBeacon:", err));
    } catch (err) {
        state.watching = false;
        log("couldn't join the scene:", err);
    }
}

async function joinRoom(channelId) {
    const room = await roomForChannel(channelId);
    if (!room) return;
    state.room = room;
    state.roomPassword = await passwordForChannel(channelId);
    state.videoCount = 0;
    await attachScene();
    log("joined room scene", room);
    render();
}

async function leaveRoom() {
    state.watching = false;
    state.probing = false;
    state.videoCount = 0;
    state.streams.clear();
    state.watchers.clear();
    announced.clear();
    viewersAnnounced.clear();
    lastSceneReport = null;
    firstScene = true;
    firstBeacon = true;
    state.room = null;
    closeLivePreview();
    refreshLiveBadges();

    try {
        await native.detachView({
            role: "watch"
        });
    } catch {}

    await syncBeacon();
    render();
}

/**
 * Starts or replaces the broadcast from a picker choice: { source, height, fps, muteAudio, hidePreview
 * }.
 */
async function beginBroadcast(choice) {
    const source = choice?.source;
    if (!state.room || !source) return;
    const wasBroadcasting = state.broadcasting;
    state.resolution = choice.height ?? state.resolution;
    state.fps = choice.fps ?? state.fps;
    state.mode = source.kind === "camera" ? "camera" : "screen";

    state.source = {
        name: source.name,
        kind: source.kind,
        appIcon: source.appIcon ?? null
    };

    state.isFullScreenShare = source.kind === "screen";
    const streamId = (await streamIdFor(state.userId)) || randomId(12);
    if (!state.userId) log("no user id: the stream will go out unnamed");

    const quality = {
        height: state.resolution,
        fps: state.fps
    };

    const withAudio = Boolean(config.captureAudio && !choice.muteAudio);

    try {
        await native.attachView({
            role: "broadcast",
            url: pushUrl(
                state.room,
                streamId,
                packIdentity(source.name, {
                    ...quality,
                    mode: state.mode
                }),
                quality,
                state.mode,
                source.deviceLabel
            ),
            visible: false,
            sourceId: state.mode === "camera" ? null : source.id,
            audio: withAudio
        });
    } catch (err) {
        log("attachView(broadcast) failed:", err);
        return;
    }

    state.broadcasting = true;
    state.broadcastAudio = withAudio;
    state.lastChoice = choice;
    if (!wasBroadcasting) playSound("start", "you started broadcasting");
    state.hidePreview = choice.hidePreview === true;
    state.pushId = streamId;
    state.startedAt ||= Date.now();
    syncBeacon().catch(err => log("syncBeacon:", err));
    syncAnnounce().catch(err => log("syncAnnounce:", err));
    syncWatchPresence();
    const onCallScreen = Boolean(chatPage()?.querySelector('[class*="callContainer_cb9592"]'));

    if (!watchScreen && onCallScreen) {
        const own = streamers().find(entry => entry.mine);
        if (own) openWatchScreen(own);
    }

    render();

    log(
        "broadcasting in room",
        state.room,
        "id",
        streamId,
        "-",
        `${heightLabel(state.resolution)} ${state.fps}fps`,
        "|",
        targetBitrate(state.resolution, state.fps, state.mode),
        "kbps"
    );
}

async function stopBroadcast() {
    const wasLive = state.broadcasting;

    try {
        await native.detachView({
            role: "broadcast"
        });
    } catch {}

    state.broadcasting = false;
    if (wasLive) playSound("stop", "you stopped broadcasting");
    state.pushId = null;
    state.isFullScreenShare = false;
    state.source = null;
    if (state.streams.size === 0) state.startedAt = 0;
    syncBeacon().catch(err => log("syncBeacon:", err));
    syncAnnounce().catch(err => log("syncAnnounce:", err));
    syncWatchPresence();
    render();
}

/**
 * Drops a user's stream as soon as Discord reports they left the call.
 */
async function leftCall(userId) {
    const target = await streamIdFor(keyFor(userId, rosterByUser.get(userId)?.name));
    if (!target || !state.streams.has(target)) return;
    state.streams.delete(target);
    state.videoCount = state.streams.size;
    log("left the call:", userId, "-> dropping", target, "from the list");
    syncWatchPresence();
    if (state.videoCount === 0 && !state.broadcasting) state.startedAt = 0;
    render();
}

/**
 * Reads stream labels from VDO.Ninja's peer connections every few seconds.
 */
function watchLabels() {
    setInterval(async () => {
        if (!state.watching || state.streams.size === 0) return;
        const peers = [];

        for (const role of ["watch", "broadcast"]) {
            try {
                const info = await native.getViewers?.({
                    role
                });
                if (info?.peers?.length) peers.push(...info.peers);
            } catch {}
        }

        if (!peers.length) return;
        let changed = false;

        for (const peer of peers) {
            const label = (peer.label ?? "").trim();
            if (!label) continue;
            let data = peer.streamID ? state.streams.get(peer.streamID) : null;
            if (!data && peer.uuid) {
                for (const item of state.streams.values()) {
                    if (item.uuid === peer.uuid) {
                        data = item;
                        break;
                    }
                }
            }
            if (!data) continue;
            try {
                if (applyLabel(data, label, "rpcs")) changed = true;
            } catch (err) {
                log("label ignored:", String(err));
            }
        }

        if (changed) render();
    }, 3000);
}
