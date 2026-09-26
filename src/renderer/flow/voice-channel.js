/**
 * Tracks the voice channel the user is in and joins or leaves the matching room.
 */

/**
 * Resolves once #app-mount has a child; webpack must not be touched before that.
 */
function whenDiscordMounted(timeoutMs = 120000) {
    return new Promise(resolve => {
        const mounted = () => (document.getElementById("app-mount")?.childElementCount ?? 0) > 0;
        if (mounted()) return resolve(true);

        const timer = setInterval(() => {
            if (!mounted()) return;
            clearInterval(timer);
            clearTimeout(giveUp);
            resolve(true);
        }, 500);

        const giveUp = setTimeout(() => {
            clearInterval(timer);
            resolve(false);
        }, timeoutMs);
    });
}

function watchVoiceChannel() {
    (async () => {
        const mounted = await whenDiscordMounted();
        log("Discord app mounted:", mounted);
        if (!mounted) return;
        let storeAttempts = 0;

        const storesPollTimer = setInterval(() => {
            storeAttempts++;
            if (acquireStores() || storeAttempts >= 3) clearInterval(storesPollTimer);
        }, 5000);

        acquireStores();
        loadSounds();
        refreshIdentity();

        onGatewayCallLeft = () => {
            closePip();
            closeWatchScreen();
            pollNow();
        };

        onVoiceConnectionChange = () => {
            pollNow();
            setTimeout(pollNow, 500);
        };
        pollNow();
        setInterval(pollNow, 2000);
    })().catch(err => log("watchVoiceChannel threw:", err));

    async function pollNow() {
        if (channelPoll.active) {
            channelPoll.pending = true;
            return;
        }

        channelPoll.active = true;

        try {
            do {
                channelPoll.pending = false;
                await poll().catch(err => log("poll threw:", err));
            } while (channelPoll.pending);
        } finally {
            channelPoll.active = false;
        }
    }

    let panelChannel = null;
    let panelChangedAt = 0;

    /**
     * The voice channel from two signals: the gateway's voice state, instant but it can miss a move, and
     * the voice panel, which follows every move a moment later. The one that changed last wins; the panel
     * alone never reports leaving, since it can be missing from the page.
     */
    function currentVoiceChannel(info) {
        const fromPanel = info?.id ?? null;

        if (fromPanel !== panelChannel) {
            panelChannel = fromPanel;
            panelChangedAt = Date.now();
        }

        if (fromPanel && fromPanel !== channelFromGateway && panelChangedAt > gatewayChangedAt) {
            if (fromPanel !== state.channelId) log("voice channel via the voice panel:", fromPanel);
            return fromPanel;
        }

        return leftViaGateway ? null : (channelFromGateway ?? fromPanel ?? voiceChannelId());
    }

    async function poll() {
        const info = voiceChannelInfo();
        const channelId = currentVoiceChannel(info);
        if (!state.userId || !state.userName) refreshIdentity();
        await refreshRoster(channelId);

        if (state.watching && state.selfStreamId && state.sceneExcludeId !== state.selfStreamId) {
            log("scene came up without our id; rebuilding with exclude");
            await attachScene();
        }

        if (info?.name && info.name !== state.channelName) {
            state.channelName = info.name;
            render();
        }

        if (channelId === state.channelId) return;
        state.channelId = channelId;
        if (!channelId) state.channelName = "";
        refreshIdentity();

        log(
            "voice channel changed:",
            channelId ?? "(left)",
            "| name:",
            state.channelName || "(not found)",
            "| avatar:",
            state.avatarUrl ? "ok" : "not found"
        );

        // Like Discord, leaving the call or being moved to another channel (the AFK one included) stops watching.
        closePip();
        closeWatchScreen();
        dropAllStreamFrames();

        if (state.broadcasting) await stopBroadcast();
        await leaveRoom();
        if (channelId && config.autoWatch) await joinRoom(channelId);
        render();
    }
}
