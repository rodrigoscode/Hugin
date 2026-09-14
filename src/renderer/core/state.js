/**
 * Shared runtime state and the list of live streams.
 */

const state = {
    channelId: null,
    room: null,
    watching: false,
    videoCount: 0,
    broadcasting: false,
    pushId: null,
    startedAt: 0,
    resolution: 1080,
    fps: 60,
    mode: "screen",
    source: null,
    roomPassword: "",
    probing: false,
    probeUntil: 0,
    sceneExcludeId: null,
    streams: new Map(),
    watchers: new Map(),
    lobby: new Map(),
    selfBeaconId: null,
    isFullScreenShare: false,
    volume: 1,
    lastVolume: 1,
    avatarUrl: null,
    userId: null,
    userName: "",
    selfStreamId: null,
    channelName: "",
    simulateViewer: false
};

function streamers() {
    const list = [];

    if (state.broadcasting) {
        list.push({
            key: "self",
            label: currentUserName() || "Você",
            ready: true,
            mode: state.mode,
            avatar: state.avatarUrl,
            mine: true
        });
    }

    let n = 0;

    for (const [id, data] of state.streams) {
        const who = rosterByStream.get(id) || rosterByStream.get(data.label);
        if (data.userId && data.userId === state.userId) continue;
        if (who?.userId && who.userId === state.userId) continue;
        if (state.pushId && id === state.pushId) continue;
        n++;
        list.push({
            key: id,
            label: who?.name || data.label || (state.streams.size > 1 ? `Transmissão ${n}` : "Transmissão do canal"),
            avatar: who?.avatar ?? data.avatarUrl ?? null,
            quality: data.quality ?? null,
            height: data.height || 0,
            aspect: data.aspect || 0,
            ready: data.ready !== false,
            mine: false
        });
    }

    return list;
}
