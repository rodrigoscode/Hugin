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

    async function poll() {
        const info = voiceChannelInfo();
        const channelId = leftViaGateway ? null : (channelFromGateway ?? info?.id ?? voiceChannelId());
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

        if (!channelId) {
            closePip();
            closeWatchScreen();
        }

        if (state.broadcasting) await stopBroadcast();
        await leaveRoom();
        if (channelId && config.autoWatch) await joinRoom(channelId);
        render();
    }
}
