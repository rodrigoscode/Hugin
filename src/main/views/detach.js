/**
 * Detaching and reporting on role windows.
 */

electron.ipcMain.handle("hugin:detachView", (_e, request) => {
    const role = request?.role;

    if (role)
        destroyView(role, {
            notifyViewers: true
        });
    else
        for (const key of [...views.keys()])
            destroyView(key, {
                notifyViewers: true
            });

    if (!role || role === "broadcast") {
        pending = null;
        honorTimerResolution(false);
        stopWindowWatcher();
        stopSystemAudio();
        closeAnnotate();
        if (pencilShortcutRegistered) {
            electron.globalShortcut.unregister(PENCIL_SHORTCUT);
            pencilShortcutRegistered = false;
        }
    }

    return true;
});

electron.ipcMain.on("hugin:broadcastSourceEnded", event => {
    const win = views.get("broadcast");
    if (!win || win.isDestroyed() || win.webContents.id !== event.sender.id) return;
    log("broadcast source ended (application closed?)");
    notifyEnded("source-ended");
});

electron.ipcMain.on("hugin:viewVideoCount", (event, payload) => {
    let role = null;

    for (const [key, win] of views) {
        if (!win.isDestroyed() && win.webContents.id === event.sender.id) {
            role = key;
            break;
        }
    }

    if (!mainWindow || mainWindow.isDestroyed()) return;

    try {
        mainWindow.webContents.send("hugin:videoCount", {
            role,
            count: payload?.count ?? 0,
            streams: payload?.streams ?? []
        });
    } catch {}
});
