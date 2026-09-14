/**
 * Volume of role windows.
 */

electron.ipcMain.handle("hugin:setViewVolume", (_e, request) => {
    const role = request?.role;
    if (role === "broadcast") return false;
    const win = views.get(role);
    if (!win || win.isDestroyed()) return false;
    const volume = Math.min(1, Math.max(0, Number(request?.volume) || 0));
    win.webContents.setAudioMuted(volume === 0);

    try {
        win.webContents.send("hugin:volume", volume);
    } catch {}

    return true;
});
