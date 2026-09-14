/**
 * Discord's animated gear (Lottie) for the share modal's options button.
 */

let discordLottie = null;

/**
 * Finds Discord's bundled lottie-web among the webpack modules.
 */
function findLottie() {
    if (discordLottie) return discordLottie;
    if (!webpackRequire?.m) return null;

    for (const [id, factory] of Object.entries(webpackRequire.m)) {
        let source;
        try {
            source = String(factory);
        } catch {
            continue;
        }
        if (source.length < 50000 || !source.includes("loadAnimation")) continue;
        if (!source.includes("bodymovin") && !source.includes("lottie")) continue;
        try {
            const webpackModule = webpackRequire(id);
            const lib =
                typeof webpackModule?.loadAnimation === "function"
                    ? webpackModule
                    : typeof webpackModule?.default?.loadAnimation === "function"
                      ? webpackModule.default
                      : null;
            if (lib) {
                discordLottie = lib;
                break;
            }
        } catch {}
    }

    return discordLottie;
}

/**
 * Plays Discord's Lottie gear animation on click, falling back to a CSS rotation when Discord's Lottie
 * is not loaded.
 */
function animateGear(button) {
    const box = button?.querySelector('[class*="lottieIcon__5eb9b"]');
    const lottie = box ? findLottie() : null;
    if (!box || !lottie) return null;
    const drawing = [...box.childNodes];
    box.replaceChildren();
    let animation;

    try {
        animation = lottie.loadAnimation({
            container: box,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: JSON.parse(CAPTURED_GEAR_LOTTIE),
            initialSegment: [0, 66]
        });
    } catch (err) {
        box.replaceChildren(...drawing);
        log("animated gear:", err);
        return null;
    }

    button.addEventListener("click", () => {
        if (button.getAttribute("aria-expanded") === "true") return;
        animation.resetSegments(true);

        if (document.documentElement.classList.contains("reduce-motion")) {
            animation.setSegment(66, 66);
            animation.stop();
            return;
        }

        animation.setLoop(false);
        animation.playSegments([0, 66], true);
    });

    return animation;
}
