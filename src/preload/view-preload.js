/**
 * Preload for the hidden VDO.Ninja windows: keeps the broadcast preview clean, applies volume, reports
 * the streams in the room scene and the server lobby, gives the lobby announcement a synthetic video,
 * and notices when the shared window's capture ends.
 */

const { ipcRenderer, contextBridge, webFrame } = require("electron");
const ROLE = process.argv.find(a => a.startsWith("--hugin-role="))?.slice(13) ?? "";
let last = "";
let volume = null;

/**
 * Runs a self-contained function in the page's own world, where VDO.Ninja keeps window.session.
 */
function inMainWorld(func) {
    try {
        if (typeof contextBridge.executeInMainWorld === "function") {
            return Promise.resolve(contextBridge.executeInMainWorld({ func }));
        }
        return webFrame.executeJavaScript(`(${func})()`);
    } catch (err) {
        return Promise.reject(err);
    }
}

/**
 * Replaces display capture with a 4x2 canvas, so the lobby announcement never opens a capture device
 * (a 2 px capture would size the device a real broadcast shares).
 */
function fakeDisplayMedia() {
    const fake = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 2;
        const context = canvas.getContext("2d");
        let tick = 0;
        context.fillRect(0, 0, 4, 2);
        setInterval(() => {
            context.fillStyle = tick++ % 2 ? "#000" : "#111";
            context.fillRect(0, 0, 4, 2);
        }, 500);
        return canvas.captureStream(1);
    };

    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", { value: fake, configurable: true });
}

/**
 * The lobby announcements VDO.Ninja is connected to: stream id and label of each peer.
 */
function readLobbyPeers() {
    const peers = [];
    for (const peer of Object.values(window.session?.rpcs ?? {})) {
        const label = typeof peer?.label === "string" ? peer.label : "";
        const streamID = typeof peer?.streamID === "string" ? peer.streamID : "";
        if (streamID && label.startsWith("l1~")) peers.push({ streamID, label });
    }
    return peers;
}

if (ROLE === "announce") inMainWorld(fakeDisplayMedia).catch(() => {});

/**
 * Gives the broadcast Hugin.exe's system audio (without Discord's own sound) instead of Chromium's
 * loopback: PCM arrives on a MessagePort and plays through a ring buffer into a MediaStream track that
 * replaces the display-media audio.
 */
function useSystemAudio() {
    const rate = 48000;
    const maxBuffered = rate * 2 * 0.2;
    const keepBuffered = rate * 2 * 0.05;
    const context = new AudioContext({ sampleRate: rate, latencyHint: "interactive" });
    const destination = context.createMediaStreamDestination();
    const processor = context.createScriptProcessor(1024, 0, 2);
    const ring = new Float32Array(rate * 2);
    let read = 0;
    let write = 0;
    let filled = 0;

    processor.onaudioprocess = event => {
        const left = event.outputBuffer.getChannelData(0);
        const right = event.outputBuffer.getChannelData(1);
        for (let i = 0; i < left.length; i++) {
            if (filled < 2) {
                left[i] = 0;
                right[i] = 0;
                continue;
            }
            left[i] = ring[read];
            right[i] = ring[(read + 1) % ring.length];
            read = (read + 2) % ring.length;
            filled -= 2;
        }
    };

    processor.connect(destination);

    addEventListener("message", event => {
        const port = event.data?.huginSystemAudio;
        if (!(port instanceof MessagePort)) return;
        port.onmessage = message => {
            const pcm = new Int16Array(message.data);
            for (let i = 0; i < pcm.length; i++) {
                ring[write] = pcm[i] / 32768;
                write = (write + 1) % ring.length;
                if (filled < ring.length) filled++;
                else read = (read + 1) % ring.length;
            }
            if (filled > maxBuffered) {
                const drop = (filled - keepBuffered) & ~1;
                read = (read + drop) % ring.length;
                filled -= drop;
            }
        };
    });

    const track = destination.stream.getAudioTracks()[0];
    const original = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

    Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
        configurable: true,
        value: async constraints => {
            const stream = await original(constraints);
            for (const other of stream.getAudioTracks()) {
                stream.removeTrack(other);
                other.stop();
            }
            stream.addTrack(track);
            context.resume().catch(() => {});
            return stream;
        }
    });
}

if (ROLE === "broadcast" && process.argv.includes("--hugin-system-audio")) {
    const channel = new MessageChannel();

    ipcRenderer.on("hugin:systemAudio", (_e, chunk) => {
        const copy = Uint8Array.from(chunk).buffer;
        channel.port1.postMessage(copy, [copy]);
    });

    inMainWorld(useSystemAudio)
        .then(() => window.postMessage({ huginSystemAudio: channel.port2 }, "*", [channel.port2]))
        .catch(() => {});
}

ipcRenderer.on("hugin:volume", (_e, value) => {
    volume = Math.min(1, Math.max(0, Number(value) || 0));
    applyVolume();
});

/**
 * Applies the requested volume to every media element; the broadcast preview is always muted, or it
 * would replay the captured system audio.
 */
function applyVolume() {
    try {
        if (ROLE === "broadcast") {
            for (const media of document.querySelectorAll("video, audio")) {
                media.muted = true;
                media.volume = 0;
            }
            return;
        }
        if (volume === null) return;
        for (const media of document.querySelectorAll("video, audio")) {
            if (media.volume !== volume) media.volume = volume;
            media.muted = volume === 0;
        }
    } catch {}
}

/**
 * Makes VDO.Ninja's zero-width self preview fill the broadcast window.
 */
function forceSelfPreview() {
    if (ROLE !== "broadcast") return;
    if (document.getElementById("hugin-preview-css")) return;
    if (!document.head) return;
    const style = document.createElement("style");
    style.id = "hugin-preview-css";

    style.textContent = `
        html, body { margin: 0 !important; width: 100% !important; height: 100% !important;
                     background: #000 !important; overflow: hidden !important; }


        video {
            position: fixed !important; inset: 0 !important;
            width: 100vw !important; height: 100vh !important;
            min-width: 0 !important; max-width: none !important;
            max-height: none !important; margin: 0 !important;
            object-fit: contain !important; background: #000 !important;
            display: block !important; visibility: visible !important; opacity: 1 !important;
            transform: none !important; clip-path: none !important;
            z-index: 2147483647 !important;
        }
    `;

    document.head.appendChild(style);
}

/**
 * Hides everything on the broadcast page except the <video> and its ancestors.
 */
function hideChrome() {
    if (ROLE !== "broadcast") return;
    const video = document.querySelector("video");
    if (!video || !document.body) return;
    const keepSet = new Set();
    for (let node = video; node; node = node.parentElement) keepSet.add(node);

    for (const node of keepSet) {
        if (node.dataset && node.dataset.huginHidden) {
            node.style.display = "";
            delete node.dataset.huginHidden;
        }
    }

    for (const el of document.body.querySelectorAll("*")) {
        if (keepSet.has(el)) continue;
        if (el.tagName === "VIDEO") continue;
        if (el.dataset.huginHidden) continue;
        el.dataset.huginHidden = "1";
        el.style.display = "none";
    }
}

const mutedSince = new Map();
const NEGOTIATING_TOLERANCE = 20000;
const STALLED_TOLERANCE = 6000;
const hadFrame = new Set();

/**
 * The streams in the room scene, keyed by VDO.Ninja stream id, dropping ones whose tracks ended or
 * stayed silent past their tolerance.
 */
function collectStreams() {
    const found = [];
    const alive = new Set();

    try {
        for (const video of document.querySelectorAll("video")) {
            const parent = video.parentElement;
            const uuid = video.dataset?.UUID || parent?.dataset?.UUID || "";
            const sid = video.dataset?.sid || parent?.dataset?.sid || "";
            const id = sid || uuid || video.id || `anon${found.length}`;
            const ready = video.readyState >= 2 && video.videoWidth > 0;
            const stream = video.srcObject;
            if (!ready && !stream) continue;
            const tracks = stream?.getVideoTracks?.() ?? [];
            const ended = tracks.length > 0 && tracks.every(f => f.readyState === "ended");
            if (ended) continue;
            if (ready) hadFrame.add(id);
            const noData = tracks.length === 0 || tracks.every(f => f.muted);
            if (noData) {
                const since = mutedSince.get(id) ?? Date.now();
                mutedSince.set(id, since);
                const deadline = hadFrame.has(id) ? STALLED_TOLERANCE : NEGOTIATING_TOLERANCE;
                if (Date.now() - since > deadline) continue;
            } else {
                mutedSince.delete(id);
            }
            alive.add(id);
            const candidates = [video.dataset?.label, parent?.dataset?.label, video.getAttribute("aria-label")];
            const label =
                candidates
                    .map(x => (x || "").replace(/\s+/g, " ").trim())
                    .find(x => x.startsWith("g1~") || x.startsWith("s1~") || x.startsWith("glp1.")) || "";
            found.push({
                id: String(id),
                uuid: String(uuid),
                label,
                ready,
                height: video.videoHeight || 0,
                aspect:
                    video.videoWidth > 0 && video.videoHeight > 0
                        ? Math.round((video.videoWidth / video.videoHeight) * 10000) / 10000
                        : 0
            });
        }
        for (const id of [...mutedSince.keys()]) {
            if (!alive.has(id)) mutedSince.delete(id);
        }
        for (const id of [...hadFrame]) {
            if (!alive.has(id)) hadFrame.delete(id);
        }
    } catch {}

    return found;
}

let sourceTrack = null;
let sourceEndReported = false;

/**
 * Reports once when the broadcast's capture track ends, as it does when the shared window closes.
 */
function watchSource() {
    if (ROLE !== "broadcast" || sourceEndReported) return;

    try {
        const video = document.getElementById("videosource") ?? document.querySelector("video");
        const tracks = video?.srcObject?.getVideoTracks?.() ?? [];
        const liveTrack = tracks.find(track => track.readyState === "live");
        if (liveTrack) {
            sourceTrack = liveTrack;
            return;
        }
        if (sourceTrack && sourceTrack.readyState === "ended") {
            sourceEndReported = true;
            ipcRenderer.send("hugin:broadcastSourceEnded");
        }
    } catch {}
}

/**
 * Sends the stream list to the main process whenever it changes. The lobby has no videos, so its list
 * comes from VDO.Ninja's peer connections.
 */
function report() {
    if (ROLE === "announce") return;

    if (ROLE === "lobby") {
        inMainWorld(readLobbyPeers)
            .then(peers =>
                sendStreams(
                    (peers ?? []).map(peer => ({
                        id: peer.streamID,
                        uuid: "",
                        label: peer.label,
                        ready: true,
                        height: 0,
                        aspect: 0
                    }))
                )
            )
            .catch(() => {});
        return;
    }

    forceSelfPreview();
    hideChrome();
    applyVolume();
    watchSource();
    sendStreams(collectStreams());
}

function sendStreams(streams) {
    const signature = streams
        .map(s => s.id + ":" + s.uuid + ":" + s.label + ":" + (s.ready ? 1 : 0) + ":" + s.height + ":" + s.aspect)
        .sort()
        .join("|");

    if (signature === last) return;
    last = signature;

    try {
        ipcRenderer.send("hugin:viewVideoCount", {
            count: streams.length,
            streams
        });
    } catch {}
}

setInterval(report, 1000);

window.addEventListener("DOMContentLoaded", () => {
    forceSelfPreview();
    report();
});
