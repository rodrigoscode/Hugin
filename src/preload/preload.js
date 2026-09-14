/**
 * Preload chained into Discord's main window: runs Discord's own preload, exposes the bridge to the
 * main process, and injects the renderer bundle into the page.
 */

const { readFileSync } = require("fs");
const { join } = require("path");
const { ipcRenderer, webFrame, contextBridge } = require("electron");

/**
 * Forwards a log line to the main process log file.
 */
const send = (source, ...args) => {
    try {
        ipcRenderer.send("hugin:log", source, args);
    } catch {}
};

const log = (...args) => {
    console.log("[Hugin]", ...args);
    send("preload", ...args);
};

/**
 * Reads one of the additionalArguments our patched BrowserWindow passes.
 */
function arg(name) {
    const prefix = `--${name}=`;
    return process.argv.find(a => a.startsWith(prefix))?.slice(prefix.length);
}

const original = arg("hugin-original-preload");

if (original) {
    try {
        require(original);
        log("original preload loaded");
    } catch (err) {
        log("original preload FAILED:", String(err?.stack ?? err));
    }
} else {
    log("no --hugin-original-preload argument");
}

/**
 * Subscribes once to an IPC channel and fans its messages out to every registered listener.
 */
function fanout(channel) {
    const listeners = new Set();

    ipcRenderer.on(channel, (_e, ...args) => {
        for (const fn of listeners) {
            try {
                fn(...args);
            } catch (err) {
                log(`listener for ${channel} threw:`, String(err));
            }
        }
    });

    return listeners;
}

const endedListeners = fanout("hugin:streamEnded");
const videoCountListeners = fanout("hugin:videoCount");

/**
 * The config passed in the process arguments, available synchronously before Discord's bundle runs.
 */
function configFromArgs() {
    try {
        const blob = arg("hugin-config");
        return blob ? JSON.parse(Buffer.from(blob, "base64").toString("utf8")) : {};
    } catch (err) {
        log("unreadable config argument:", String(err));
        return {};
    }
}

const api = {
    config: configFromArgs(),
    getSources: () => ipcRenderer.invoke("hugin:getSources"),
    getConfig: () => ipcRenderer.invoke("hugin:getConfig"),
    getFont: name => ipcRenderer.invoke("hugin:getFont", name),
    getSound: name => ipcRenderer.invoke("hugin:getSound", name),
    getViewers: request => ipcRenderer.invoke("hugin:getViewers", request),
    captureView: request => ipcRenderer.invoke("hugin:captureView", request),
    probeStructure: request => ipcRenderer.invoke("hugin:probeStructure", request),
    copy: text => ipcRenderer.invoke("hugin:copy", text),
    attachView: request => ipcRenderer.invoke("hugin:attachView", request),
    setViewBounds: bounds => ipcRenderer.invoke("hugin:setViewBounds", bounds),
    setViewVolume: request => ipcRenderer.invoke("hugin:setViewVolume", request),
    setBroadcastQuality: request => ipcRenderer.invoke("hugin:setBroadcastQuality", request),
    setStreamGain: request => ipcRenderer.invoke("hugin:setStreamGain", request),
    setBroadcastAudio: request => ipcRenderer.invoke("hugin:setBroadcastAudio", request),
    snapshotView: request => ipcRenderer.invoke("hugin:snapshotView", request),
    overlay: request => ipcRenderer.invoke("hugin:overlay", request),
    detachView: request => ipcRenderer.invoke("hugin:detachView", request),
    onStreamEnded: fn => {
        endedListeners.add(fn);
        return () => endedListeners.delete(fn);
    },
    onVideoCount: fn => {
        videoCountListeners.add(fn);
        return () => videoCountListeners.delete(fn);
    },
    log: (...args) => send("renderer", ...args),
    debug: arg("hugin-debug") === "1"
};

try {
    contextBridge.exposeInMainWorld("HuginNative", api);
    log("bridge exposed via contextBridge");
} catch (err) {
    globalThis.HuginNative = api;
    log("contextBridge unavailable, using global:", String(err));
}

const dataDir = arg("hugin-data-dir") ?? join(process.env.APPDATA ?? "", "Hugin");
const bundlePath = join(dataDir, "renderer.js");

try {
    const bundle = readFileSync(bundlePath, "utf8");
    log("bundle read:", bundle.length, "bytes from", bundlePath);
    webFrame
        .executeJavaScript(bundle)
        .then(() => log("bundle executed"))
        .catch(err => log("bundle THREW:", String(err?.stack ?? err)));
} catch (err) {
    log("couldn't read bundle at", bundlePath, String(err));
}
