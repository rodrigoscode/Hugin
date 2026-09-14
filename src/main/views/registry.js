/**
 * The hidden VDO.Ninja windows, one per role, and how they are destroyed.
 */

const views = new Map();

function contentOrigin() {
    try {
        const bounds = mainWindow?.getContentBounds?.();
        return {
            x: bounds?.x ?? 0,
            y: bounds?.y ?? 0
        };
    } catch {
        return {
            x: 0,
            y: 0
        };
    }
}

const PUBLISHING_ROLES = new Set(["broadcast", "identify", "announce"]);

/**
 * Destroys a role window. With notifyViewers, a publishing window hangs up first, so viewers see the
 * stream end.
 */
function destroyView(role, { notifyViewers = false } = {}) {
    const win = views.get(role);
    if (!win) return;
    views.delete(role);
    lastRect.delete(role);

    const destroyNow = () => {
        try {
            if (!win.isDestroyed()) win.destroy();
        } catch (err) {
            log(`error closing window "${role}":`, String(err));
        }
    };

    if (!notifyViewers || !PUBLISHING_ROLES.has(role) || win.isDestroyed()) {
        destroyNow();
        return;
    }

    try {
        win.hide();
    } catch {}

    const fallbackTimer = setTimeout(destroyNow, 1000);

    win.webContents
        .executeJavaScript("try { window.session && session.hangup(); } catch (e) {} true", true)
        .catch(() => {})
        .finally(() =>
            setTimeout(() => {
                clearTimeout(fallbackTimer);
                destroyNow();
            }, 250)
        );
}
