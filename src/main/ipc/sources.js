/**
 * Screens and windows available for sharing.
 */

let lastSourceCount = -1;

electron.ipcMain.handle("hugin:getSources", async () => {
    const sources = await electron.desktopCapturer.getSources({
        types: ["screen", "window"],
        thumbnailSize: {
            width: 960,
            height: 540
        },
        fetchWindowIcons: true
    });

    if (DEBUG_MODE && sources.length !== lastSourceCount) {
        lastSourceCount = sources.length;
        log("desktopCapturer returned", sources.length, "sources");
    }

    return sources.map(s => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail.isEmpty() ? null : "data:image/jpeg;base64," + s.thumbnail.toJPEG(88).toString("base64"),
        appIcon: s.appIcon ? s.appIcon.toDataURL() : null,
        kind: s.id.startsWith("screen:") ? "screen" : "window"
    }));
});
