/**
 * Top-level render and the probing timeout.
 */

/**
 * Brings the stage's native views up to date with the state.
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
