/**
 * Shared UI building blocks: fonts, shadow-root layers, the share button icons and base styles.
 */

const FONT_SANS = '"gg sans", sans-serif';

const GG_SANS_WEIGHTS = [
    ["ggsans-Normal.woff2", "gg sans", 400],
    ["ggsans-Medium.woff2", "gg sans", 500],
    ["ggsans-SemiBold.woff2", "gg sans", 600],
    ["ggsans-Bold.woff2", "gg sans", 700],
    ["ggsansmono-Normal.woff2", "gg sans mono", 400],
    ["ggsansmono-Bold.woff2", "gg sans mono", 700]
];

async function ggSansCss() {
    const rules = [];

    for (const [file, family, weight] of GG_SANS_WEIGHTS) {
        try {
            const base64 = await native.getFont?.(file);
            if (!base64) continue;
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const url = URL.createObjectURL(
                new Blob([bytes], {
                    type: "font/woff2"
                })
            );
            rules.push(
                `@font-face { font-family: "${family}"; ` +
                    `src: url(${url}) format("woff2"); font-weight: ${weight}; font-display: swap; }`
            );
        } catch (err) {
            log("gg sans", file, "unavailable:", err);
        }
    }

    return rules.join("\n");
}

/**
 * Declares gg sans on the document: @font-face on the document applies to every shadow root.
 */
async function ensureFonts() {
    if (document.querySelector("style[data-hugin-fonts]")) return;
    let css = "";

    try {
        css = await ggSansCss();
    } catch (err) {
        log("fonts unavailable:", err);
    }

    if (!css) {
        log("gg sans unavailable, falling back to the system font");
        return;
    }

    const style = document.createElement("style");
    style.setAttribute("data-hugin-fonts", "");
    style.textContent = css;
    document.head.appendChild(style);

    try {
        await document.fonts.ready;
        let loaded = false;
        document.fonts.forEach(face => {
            if (face.family.replace(/"/g, "") === "gg sans") loaded = true;
        });
        log("gg sans loaded:", loaded);
    } catch {}
}

/**
 * Closes on the next tick, so a click-outside close does not swallow the click meant for Discord's
 * window buttons.
 */
function deferClose(fn) {
    setTimeout(fn, 0);
}

const TITLEBAR = 44;

/**
 * Clicks in the title bar strip are ignored by click-outside handling, or Discord's window buttons
 * stop responding.
 */
function inTitleBar(event) {
    return event.clientY <= TITLEBAR;
}

/**
 * Creates a click-through host with an open shadow root, inside the fullscreen element when there is
 * one.
 */
function mountShadow(css) {
    const host = document.createElement("div");
    host.setAttribute("data-hugin", "");
    host.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;" + "pointer-events:none;z-index:2147483000;";
    (document.fullscreenElement ?? document.body).appendChild(host);

    const root = host.attachShadow({
        mode: "open"
    });

    const style = document.createElement("style");
    style.textContent = CAPTURED_TYPOGRAPHY_CSS + css;
    root.appendChild(style);

    return {
        host,
        root
    };
}

function filled(size, body) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
            aria-hidden="true">${body}</svg>`;
}

const ICON = {
    discordShareScreen: size =>
        filled(
            size,
            `<g transform="translate(12 12) scale(1.0725)">
            <path fill="currentColor" d="M1,7.5 C1,7.776000022888184 1.2239999771118164,8 1.5,8 C1.5,8 3,8 3,8 C3.552000045776367,8 4,8.447999954223633 4,9 C4,9.552000045776367 3.552000045776367,10 3,10 C3,10 -3,10 -3,10 C-3.552000045776367,10 -4,9.552000045776367 -4,9 C-4,8.447999954223633 -3.552000045776367,8 -3,8 C-3,8 -1.5,8 -1.5,8 C-1.2239999771118164,8 -1,7.776000022888184 -1,7.5 C-1,7.5 -1,5.5 -1,5.5 C-1,5.223999977111816 -0.7760000228881836,5 -0.5,5 C-0.5,5 0.5,5 0.5,5 C0.7760000228881836,5 1,5.223999977111816 1,5.5 C1,5.5 1,7.5 1,7.5z"></path>
            <path fill="currentColor" fill-rule="evenodd" d="M-10,-7 C-10,-8.656999588012695 -8.656999588012695,-10 -7,-10 C-7,-10 7,-10 7,-10 C8.656999588012695,-10 10,-8.656999588012695 10,-7 C10,-7 10,1 10,1 C10,2.6570000648498535 8.656999588012695,4 7,4 C7,4 -7,4 -7,4 C-8.656999588012695,4 -10,2.6570000648498535 -10,1 C-10,1 -10,-7 -10,-7z M6,-4 C6,-4.264999866485596 5.894999980926514,-4.519000053405762 5.706999778747559,-4.706999778747559 C5.706999778747559,-4.706999778747559 2.7070000171661377,-7.706999778747559 2.7070000171661377,-7.706999778747559 C2.315999984741211,-8.097999572753906 1.684000015258789,-8.097999572753906 1.2929999828338623,-7.706999778747559 C0.9020000100135803,-7.315999984741211 0.9020000100135803,-6.684000015258789 1.2929999828338623,-6.293000221252441 C1.2929999828338623,-6.293000221252441 2.5859999656677246,-5 2.5859999656677246,-5 C2.5859999656677246,-5 1,-5 1,-5 C-2.313999891281128,-5 -5,-2.313999891281128 -5,1 C-5,1.5520000457763672 -4.552000045776367,2 -4,2 C-3.447999954223633,2 -3,1.5520000457763672 -3,1 C-3,-1.2089999914169312 -1.2089999914169312,-3 1,-3 C1,-3 2.5859999656677246,-3 2.5859999656677246,-3 C2.5859999656677246,-3 1.2929999828338623,-1.7070000171661377 1.2929999828338623,-1.7070000171661377 C0.9020000100135803,-1.315999984741211 0.9020000100135803,-0.6840000152587891 1.2929999828338623,-0.2930000126361847 C1.684000015258789,0.09799999743700027 2.315999984741211,0.09799999743700027 2.7070000171661377,-0.2930000126361847 C2.7070000171661377,-0.2930000126361847 5.706999778747559,-3.2929999828338623 5.706999778747559,-3.2929999828338623 C5.894999980926514,-3.4809999465942383 6,-3.734999895095825 6,-4z"></path>
        </g>`
        ),
    discordStopShare: size =>
        filled(
            size,
            `<g transform="translate(12 12) scale(1.0725)">
            <path fill="currentColor" d="M1,7.5 C1,7.776000022888184 1.2239999771118164,8 1.5,8 C1.5,8 3,8 3,8 C3.552000045776367,8 4,8.447999954223633 4,9 C4,9.552000045776367 3.552000045776367,10 3,10 C3,10 -3,10 -3,10 C-3.552000045776367,10 -4,9.552000045776367 -4,9 C-4,8.447999954223633 -3.552000045776367,8 -3,8 C-3,8 -1.5,8 -1.5,8 C-1.2239999771118164,8 -1,7.776000022888184 -1,7.5 C-1,7.5 -1,5.5 -1,5.5 C-1,5.223999977111816 -0.7760000228881836,5 -0.5,5 C-0.5,5 0.5,5 0.5,5 C0.7760000228881836,5 1,5.223999977111816 1,5.5 C1,5.5 1,7.5 1,7.5z"></path>
            <path fill="currentColor" fill-rule="evenodd" d="M-10,-7 C-10,-8.656999588012695 -8.656999588012695,-10 -7,-10 C-7,-10 7,-10 7,-10 C8.656999588012695,-10 10,-8.656999588012695 10,-7 C10,-7 10,1 10,1 C10,2.6570000648498535 8.656999588012695,4 7,4 C7,4 -7,4 -7,4 C-8.656999588012695,4 -10,2.6570000648498535 -10,1 C-10,1 -10,-7 -10,-7z M-3.7070000171661377,-6.706999778747559 C-3.315999984741211,-7.0980000495910645 -2.684000015258789,-7.0980000495910645 -2.2929999828338623,-6.706999778747559 C-2.2929999828338623,-6.706999778747559 0,-4.414000034332275 0,-4.414000034332275 C0,-4.414000034332275 2.2929999828338623,-6.706999778747559 2.2929999828338623,-6.706999778747559 C2.684000015258789,-7.0980000495910645 3.315999984741211,-7.0980000495910645 3.7070000171661377,-6.706999778747559 C4.0980000495910645,-6.315999984741211 4.0980000495910645,-5.684000015258789 3.7070000171661377,-5.293000221252441 C3.7070000171661377,-5.293000221252441 1.4140000343322754,-3 1.4140000343322754,-3 C1.4140000343322754,-3 3.7070000171661377,-0.7070000171661377 3.7070000171661377,-0.7070000171661377 C4.0980000495910645,-0.3160000145435333 4.0980000495910645,0.3160000145435333 3.7070000171661377,0.7070000171661377 C3.315999984741211,1.0980000495910645 2.684000015258789,1.0980000495910645 2.2929999828338623,0.7070000171661377 C2.2929999828338623,0.7070000171661377 0,-1.5859999656677246 0,-1.5859999656677246 C0,-1.5859999656677246 -2.2929999828338623,0.7070000171661377 -2.2929999828338623,0.7070000171661377 C-2.684000015258789,1.0980000495910645 -3.315999984741211,1.0980000495910645 -3.7070000171661377,0.7070000171661377 C-4.0980000495910645,0.3160000145435333 -4.0980000495910645,-0.3160000145435333 -3.7070000171661377,-0.7070000171661377 C-3.7070000171661377,-0.7070000171661377 -1.4140000343322754,-3 -1.4140000343322754,-3 C-1.4140000343322754,-3 -3.7070000171661377,-5.293000221252441 -3.7070000171661377,-5.293000221252441 C-4.0980000495910645,-5.684000015258789 -4.0980000495910645,-6.316000000000001 -3.7070000171661377,-6.706999778747559z"></path>
        </g>`
        )
};

const BASE_CSS = `
        :host { all: initial; }
        * { box-sizing: border-box; font-family: ${FONT_SANS}; }

        .backdrop {
            position: fixed; inset: 0;
            display: flex; align-items: center; justify-content: center;
            padding: 24px; background: transparent;
            opacity: 0; pointer-events: none;
            transition: opacity .2s cubic-bezier(.16,1,.3,1);
        }
        .backdrop.active { opacity: 1; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.22); }
    `;
