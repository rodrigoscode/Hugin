/**
 * Top-level render and the probing timeout.
 */

/**
 * Brings what depends on the state up to date: today, the stage's native views.
 */
function render() {
    if (stageView) syncViewBounds();
}

/**
 * Ends the probing window once it runs out.
 */
function watchProbing() {
    setInterval(() => {
        if (state.probing && Date.now() > state.probeUntil) {
            state.probing = false;
            render();
        }
    }, 1000);
}
