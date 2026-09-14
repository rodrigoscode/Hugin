/**
 * Diagnostics and small utilities exposed to the renderer.
 */

/**
 * Script run in a VDO.Ninja page: the distinct peers across its session collections, with labels and
 * stream ids.
 */
const VIEWERS = `(() => {
    try {
        const s = window.session;
        if (!s) return null;

        const text = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");

        const byUuid = new Map();
        let source = "none";

        for (const key of ["rpcs", "pcs", "peers", "consumers"]) {
            const collection = s[key];
            if (!collection || typeof collection !== "object") continue;

            const entries = Object.entries(collection);
            if (source === "none" && entries.length) source = key;

            for (const [uuid, peer] of entries) {
                if (byUuid.size >= 24) break;

                const entry = byUuid.get(uuid) ?? { uuid: String(uuid).slice(0, 24), label: "", streamID: "" };

                entry.label ||= text(peer?.label, 60) || text(peer?.streamLabel, 60) || text(peer?.name, 60);
                entry.streamID ||= text(peer?.streamID, 40) || text(peer?.streamid, 40)
                    || text(peer?.stream_id, 40) || text(peer?.id, 40);

                byUuid.set(uuid, entry);
            }
        }

        const peers = [...byUuid.values()];
        return { source, total: peers.length, ids: peers.map(x => x.uuid), peers };
    } catch (err) {
        return null;
    }
})()`;

const STRUCTURE_PROBE = `(() => {
    const out = [];
    for (const v of document.querySelectorAll("video")) {
        const parent = v.parentElement;
        out.push({
            id: v.id || null,
            dataset: Object.keys(v.dataset || {}).map(k => k + "=" + v.dataset[k]),
            ready: v.readyState, w: v.videoWidth,
            parentId: parent?.id || null,
            parentClass: (parent?.className || "").toString().slice(0, 40),
            parentDataset: Object.keys(parent?.dataset || {}).map(k => k + "=" + parent.dataset[k]),
            parentText: (parent?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 60)
        });
    }
    return JSON.stringify(out);
})()`;

electron.ipcMain.handle("hugin:probeStructure", async (_e, request) => {
    const win = views.get(request?.role ?? "watch");
    if (!win || win.isDestroyed()) return null;

    try {
        return await win.webContents.executeJavaScript(STRUCTURE_PROBE, true);
    } catch (err) {
        return String(err);
    }
});

electron.ipcMain.handle("hugin:getViewers", async (_e, request) => {
    const win = views.get(request?.role ?? "broadcast");
    if (!win || win.isDestroyed()) return null;

    try {
        return await win.webContents.executeJavaScript(VIEWERS, true);
    } catch {
        return null;
    }
});

electron.ipcMain.handle("hugin:captureView", async (_e, request) => {
    const win = views.get(request?.role ?? "watch");
    if (!win || win.isDestroyed()) return null;

    try {
        const image = await win.webContents.capturePage();
        if (image.isEmpty()) return null;
        const width = Number(request?.width) || 320;
        return image
            .resize({
                width,
                quality: "good"
            })
            .toDataURL();
    } catch (err) {
        log("captureView failed:", String(err));
        return null;
    }
});

electron.ipcMain.handle("hugin:copy", (_e, text) => {
    electron.clipboard.writeText(String(text ?? ""));
    return true;
});
