/**
 * Markup for the stage zoom panel: the zoom-out button, the level slider and the minimap.
 */

const MINUS_PATH = "M6 10a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Z";

/**
 * Clones Discord's zoom-in button into the matching zoom-out button.
 */
function createZoomOutButton(zoomInButton) {
    const button = zoomInButton.cloneNode(true);
    button.setAttribute("aria-label", "Afastar");
    button.removeAttribute("aria-describedby");
    button.querySelectorAll("svg path")[1]?.setAttribute("d", MINUS_PATH);
    return button;
}

function createZoomSlider() {
    const template = document.createElement("div");

    template.innerHTML =
        '<div class="container__5a838" data-layout="vertical" data-disabled="false"><div class="control__5a838">' +
        '<div class="slider_a562c8" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1" aria-disabled="false" aria-label="Nível de zoom" aria-invalid="false" role="slider" tabindex="0" style="--grabber-size: 16px; --bar-size: 4px;">' +
        '<div class="track_a562c8"></div><div class="bar_a562c8"><div class="barFill_a562c8" style="width: 0%;"></div></div>' +
        '<div class="track_a562c8"><div class="grabber_a562c8" style="left: 0%;"></div><span class="hiddenVisually_b18fe2">100%</span></div>' +
        "</div></div></div>";

    const root = template.firstElementChild;

    return {
        root,
        handle: root.querySelector('[role="slider"]'),
        track: root.querySelector('[class*="track_a562c8"]'),
        fill: root.querySelector('[class*="barFill_a562c8"]'),
        grabber: root.querySelector('[class*="grabber_a562c8"]'),
        levelText: root.querySelector('[class*="hiddenVisually_"]')
    };
}

function createZoomMinimap() {
    const template = document.createElement("div");

    template.innerHTML =
        '<div role="button" tabindex="0"><div class="minimap__07fe9">' +
        '<div class="media-engine-video minimapVideo__07fe9"></div><div class="minimapIndicator__07fe9"></div>' +
        "</div></div>";

    const block = template.firstElementChild;
    const map = block.firstElementChild;

    return {
        block,
        map,
        video: map.firstElementChild,
        indicator: map.lastElementChild
    };
}
