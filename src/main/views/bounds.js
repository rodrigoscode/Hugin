/**
 * Positioning native views over the page.
 */

const lastRect = new Map();

function applyViewBounds(role, bounds, visible) {
    const win = views.get(role);
    if (!win || win.isDestroyed()) return false;

    if (!visible) {
        if (win.isVisible()) win.hide();
        return true;
    }

    const rect = toRect(bounds);
    const origin = contentOrigin();

    win.setBounds({
        x: origin.x + rect.x,
        y: origin.y + rect.y,
        width: rect.width,
        height: rect.height
    });

    if (!win.isVisible()) win.showInactive();
    return true;
}

electron.ipcMain.handle("hugin:setViewBounds", (_e, request) => {
    const { role, bounds, visible } = request ?? {};
    if (!views.has(role)) return false;

    if (visible === false) {
        lastRect.delete(role);
    } else {
        lastRect.set(role, bounds);
    }

    return applyViewBounds(role, bounds, visible !== false);
});

/**
 * Moves visible child windows along with Discord's window.
 */
function repositionAll() {
    for (const [role, bounds] of lastRect) applyViewBounds(role, bounds, true);

    if (overlay && !overlay.isDestroyed() && overlayRect) {
        const origin = contentOrigin();
        overlay.setBounds({
            x: Math.round(origin.x + overlayRect.x),
            y: Math.round(origin.y + overlayRect.y),
            width: Math.max(1, Math.round(overlayRect.width)),
            height: Math.max(1, Math.round(overlayRect.height))
        });
        overlay.moveTop();
    }
}
