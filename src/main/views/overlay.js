/**
 * Transparent overlay window drawn over Discord.
 */

let overlay = null;
let overlayRect = null;

function destroyOverlay() {
    overlayRect = null;
    if (!overlay) return;
    const win = overlay;
    overlay = null;

    try {
        if (!win.isDestroyed()) win.destroy();
    } catch {}
}

electron.ipcMain.handle("hugin:overlay", (_e, request) => {
    const { action, bounds, html, interactive } = request ?? {};

    if (action === "hide" || action === "destroy") {
        destroyOverlay();
        return true;
    }

    if (!mainWindow || mainWindow.isDestroyed()) return false;

    if (!overlay || overlay.isDestroyed()) {
        overlay = new OriginalBrowserWindow({
            parent: mainWindow,
            show: false,
            frame: false,
            transparent: true,
            backgroundColor: "#00000000",
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: true,
            hasShadow: false,
            roundedCorners: false,
            focusable: false,
            webPreferences: {
                sandbox: true,
                contextIsolation: true,
                nodeIntegration: false
            }
        });
        overlay.setIgnoreMouseEvents(true, {
            forward: true
        });
        overlay.on("closed", () => {
            if (overlay) overlay = null;
        });
        log("overlay created");
    }

    if (typeof html === "string") {
        overlay
            .loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html))
            .catch(err => log("overlay loadURL:", String(err)));
    }

    if (typeof interactive === "boolean") {
        overlay.setIgnoreMouseEvents(!interactive, {
            forward: true
        });
    }

    if (bounds) {
        overlayRect = bounds;
        const origin = contentOrigin();
        overlay.setBounds({
            x: Math.round(origin.x + bounds.x),
            y: Math.round(origin.y + bounds.y),
            width: Math.max(1, Math.round(bounds.width)),
            height: Math.max(1, Math.round(bounds.height))
        });
    }

    if (!overlay.isVisible()) overlay.showInactive();
    overlay.moveTop();
    return true;
});
