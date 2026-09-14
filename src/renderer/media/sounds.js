/**
 * Broadcast event sounds.
 */

const SOUNDS = {
    start: "stream-started.mp3",
    stop: "stream-ended.mp3",
    join: "stream-user-joined.mp3",
    left: "stream-user-lefted.mp3"
};

const loadedSounds = {};

/**
 * Loads the sounds as blob URLs: Discord's CSP allows blob: media but not data:.
 */
async function loadSounds() {
    for (const [eventName, file] of Object.entries(SOUNDS)) {
        try {
            const base64 = await native.getSound?.(file);
            if (!base64) continue;
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const url = URL.createObjectURL(
                new Blob([bytes], {
                    type: "audio/mpeg"
                })
            );
            const audio = new Audio(url);
            audio.preload = "auto";
            audio.volume = 0.5;
            loadedSounds[eventName] = audio;
        } catch (err) {
            log("sound", file, "unavailable:", err);
        }
    }

    log("sounds loaded:", Object.keys(loadedSounds).join(",") || "(none)");
}

function playSound(eventName, reason) {
    log("sound:", eventName, reason ? "(" + reason + ")" : "");
    if (!config.playSounds) return;
    const audio = loadedSounds[eventName];
    if (!audio) return;

    try {
        const clone = audio.cloneNode();
        clone.volume = audio.volume;
        clone.play().catch(err => log("sound", eventName, "didn't play:", String(err)));
    } catch {}
}
