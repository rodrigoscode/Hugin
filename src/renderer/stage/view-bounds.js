/**
 * The hidden native views behind the stage. Streams play in iframes, so the views stay hidden and silent
 * unless the stage has no iframe.
 */

let stageView = null;

/**
 * The native view the stage would show: our broadcast, or the room scene while someone is live.
 */
function stageViewRole() {
    if (!stageView) return null;
    if (stageView.item.mine) return state.broadcasting ? "broadcast" : null;
    return state.videoCount > 0 ? "watch" : null;
}

/**
 * Fits the stage and positions the native views over it; only the stage's view is visible and audible.
 */
function syncViewBounds() {
    const role = stageViewRole();
    if (watchScreen) fitWatchStage(watchScreen.node);
    const rect = stageView?.screen.getBoundingClientRect();

    const bounds = rect
        ? {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
          }
        : {
              x: 0,
              y: 0,
              width: 640,
              height: 360
          };

    const viaIframe = Boolean(watchScreen?.frame);

    for (const candidate of ["watch", "broadcast"]) {
        const active = !viaIframe && Boolean(role) && candidate === role;

        native
            .setViewBounds({
                role: candidate,
                visible: active,
                bounds
            })
            .catch(() => {});

        native
            .setViewVolume?.({
                role: candidate,
                volume: active ? state.volume : 0
            })
            .catch(() => {});
    }

    if (native.debug && role && rect) {
        log(
            "stage:",
            `${Math.round(rect.left)},${Math.round(rect.top)}`,
            `${Math.round(rect.width)}x${Math.round(rect.height)}`,
            "| role:",
            role,
            "| viewport:",
            `${innerWidth}x${innerHeight}`,
            "| dpr:",
            devicePixelRatio
        );
    }
}
