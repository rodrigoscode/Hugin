/**
 * Hover preview popout for a live user, in Discord's markup.
 */

let livePreview = null;
let livePreviewTimer = null;
let livePreviewFrames = null;
let livePreviewMerge = null;
let peekKey = null;
let peekCloseTimer = null;

/**
 * The hidden viewer stays connected this long after its preview closes, so reopening is instant.
 */
const PEEK_LINGER_MS = 15000;

/**
 * A stream's last good frame is shown right away when its preview reopens within this time.
 */
const PREVIEW_FRAME_TTL_MS = 60000;

const previewFrames = new Map();

function closeLivePreview() {
    clearTimeout(livePreviewTimer);
    clearInterval(livePreviewFrames);
    clearInterval(livePreviewMerge);
    livePreviewFrames = null;
    livePreviewMerge = null;
    for (const stray of document.querySelectorAll("[data-hugin-preview]")) stray.remove();
    livePreview = null;
    closePeekSoon();
}

function closePeekSoon() {
    if (!peekKey) return;
    clearTimeout(peekCloseTimer);

    peekCloseTimer = setTimeout(() => {
        peekKey = null;

        native
            .detachView({
                role: "peek"
            })
            .catch(() => {});
    }, PEEK_LINGER_MS);
}

/**
 * Whether the stream behind a preview is still live: our broadcast, a stream in our call, or a lobby
 * announcement.
 */
function previewStillLive(item) {
    if (item.mine || item.simulated) return state.broadcasting;
    if (state.streams.has(item.key)) return true;
    return Boolean(item.lobby) && [...state.lobby.values()].some(entry => entry.streamId === item.key);
}

/**
 * A hidden low-resolution viewer for a stream outside our call, open only while its preview is.
 */
function openPeek(item) {
    clearTimeout(peekCloseTimer);
    if (peekKey === item.key) return;
    peekKey = item.key;

    native
        .attachView({
            role: "peek",
            url: soloUrl(item.key, true, null, {
                room: item.lobby.room,
                password: item.lobby.password,
                scale: 25,
                videobitrate: 400
            }),
            visible: false
        })
        .catch(err => {
            if (peekKey !== item.key) return;
            peekKey = null;
            log("peek:", err);
        });
}

/**
 * Closes the preview after a short delay, so the pointer can move from the row into the popout.
 */
function scheduleCloseLivePreview() {
    clearTimeout(livePreviewTimer);
    livePreviewTimer = setTimeout(closeLivePreview, 260);
}

/**
 * How long black frames are held back (the spinner or the last image stays) before a stream that is
 * really black gets shown.
 */
const BLANK_FRAME_WAIT_MS = 8000;

/**
 * Whether a frame is empty: entirely black, or the flat green a decoder shows before its first keyframe,
 * as happens while a stream starts or its source is being switched.
 */
function isBlankFrame(dataUrl) {
    return new Promise(resolve => {
        const img = new Image();
        img.onerror = () => resolve(false);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 64;
            canvas.height = 36;

            const ctx = canvas.getContext("2d", {
                willReadFrequently: true
            });

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let px;

            try {
                px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            } catch {
                return resolve(false);
            }

            const total = px.length / 4;
            let dark = 0;
            let green = 0;

            for (let i = 0; i < px.length; i += 4) {
                const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
                if (r <= 18 && g <= 18 && b <= 18) dark++;
                else if (r <= 40 && b <= 40 && g >= 80) green++;
            }

            resolve(dark === total || (green >= total * 0.6 && dark + green >= total * 0.9));
        };

        img.src = dataUrl;
    });
}

/**
 * Crops the black letterbox bars from a captured frame before it becomes a thumbnail.
 */
function trimLetterbox(dataUrl) {
    return new Promise(resolve => {
        const img = new Image();
        img.onerror = () => resolve(dataUrl);

        img.onload = () => {
            const w = img.naturalWidth,
                h = img.naturalHeight;

            if (!w || !h) return resolve(dataUrl);
            const surface = document.createElement("canvas");
            surface.width = w;
            surface.height = h;

            const ctx = surface.getContext("2d", {
                willReadFrequently: true
            });

            ctx.drawImage(img, 0, 0);
            let px;

            try {
                px = ctx.getImageData(0, 0, w, h).data;
            } catch {
                return resolve(dataUrl);
            }

            const LIMIT = 18;

            const dark = (x, y) => {
                const i = (y * w + x) * 4;
                return px[i] <= LIMIT && px[i + 1] <= LIMIT && px[i + 2] <= LIMIT;
            };

            const isDarkRow = y => {
                for (let k = 0; k < 16; k++) if (!dark(Math.floor(((k + 0.5) * w) / 16), y)) return false;
                return true;
            };

            const isDarkColumn = x => {
                for (let k = 0; k < 16; k++) if (!dark(x, Math.floor(((k + 0.5) * h) / 16))) return false;
                return true;
            };

            const limitY = Math.floor(h * 0.4),
                limitX = Math.floor(w * 0.4);

            let topEdge = 0,
                base = h - 1,
                leftEdge = 0,
                dir = w - 1;

            while (topEdge < limitY && isDarkRow(topEdge)) topEdge++;
            while (base > h - 1 - limitY && isDarkRow(base)) base--;
            while (leftEdge < limitX && isDarkColumn(leftEdge)) leftEdge++;
            while (dir > w - 1 - limitX && isDarkColumn(dir)) dir--;

            let cropWidth = dir - leftEdge + 1,
                cropHeight = base - topEdge + 1;

            if (cropWidth < 8 || cropHeight < 8) return resolve(dataUrl);

            if (cropWidth > 40 && cropHeight > 40) {
                leftEdge += 1;
                topEdge += 1;
                cropWidth -= 2;
                cropHeight -= 2;
            }

            const crop = document.createElement("canvas");
            crop.width = cropWidth;
            crop.height = cropHeight;

            crop.getContext("2d").drawImage(
                surface,
                leftEdge,
                topEdge,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            resolve(crop.toDataURL("image/png"));
        };

        img.src = dataUrl;
    });
}

function openLivePreview(item, rowEl) {
    if (state.simulateViewer && item?.mine)
        item = {
            ...item,
            mine: false,
            simulated: true
        };

    if (livePreview?.key === item.key) {
        clearTimeout(livePreviewTimer);
        return;
    }

    closeLivePreview();

    const fixes = `
            [data-placeholder] { visibility: hidden; }
            [class*="layer__"], [class*="popover_"], [class*="container_d7bc5d"] { pointer-events: auto; }

            [class*="emptyPreviewImage__"] {
                background-image: url("https://discord.com/assets/6b1a461f35c05c7a.svg");
            }

            [class*="container_d7bc5d"] { overflow: hidden !important; scrollbar-gutter: auto !important; }

            * { outline: none; }

            [class*="previewHover__"] { background: rgba(0, 0, 0, .6); }
            [class*="previewContainer__"] { box-shadow: none; }

            :host {
                --control-connected-background-default: hsl(151.128 calc(1*100%) 26.078%/1);
                --control-connected-background-hover: hsl(150.556 calc(1*100%) 21.176%/1);
                --control-connected-background-active: hsl(150.316 calc(1*100%) 18.627%/1);
                --control-connected-border-default: hsl(0 calc(1*0%) 100%/0.0784313725490196);
                --control-connected-border-hover: hsl(0 calc(1*0%) 100%/0.0784313725490196);
                --control-connected-border-active: hsl(0 calc(1*0%) 100%/0.0784313725490196);
                --control-connected-text-default: hsl(0 calc(1*0%) 100%/1);
                --control-connected-text-hover: hsl(0 calc(1*0%) 100%/1);
                --control-connected-text-active: hsl(0 calc(1*0%) 100%/1);
            }
            .active_a22cb0 { background-color: var(--control-connected-background-default); border-color: var(--control-connected-border-default); color: var(--control-connected-text-default); }
            .active_a22cb0:hover { background-color: var(--control-connected-background-hover); border-color: var(--control-connected-border-hover); color: var(--control-connected-text-hover); }
            .active_a22cb0:active { background-color: var(--control-connected-background-active); border-color: var(--control-connected-border-active); color: var(--control-connected-text-active); }
        `;

    const { host, root } = mountShadow(BASE_CSS + CAPTURED_PREVIEW_CSS + CAPTURED_SPINNER_CSS + fixes);
    host.setAttribute("data-hugin-preview", "");
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_PREVIEW_HTML;
    const wrapper = shell.firstElementChild;
    root.appendChild(wrapper);
    const section = wrapper.querySelector('[class*="streamPreviewWrapper__"]');
    section?.setAttribute("data-hugin-preview", "");

    livePreview = {
        host,
        key: item.key,
        item,
        wrapper,
        section,
        row: rowEl,
        merged: null
    };

    const watchThis = () => {
        closeLivePreview();

        if (item.lobby && item.lobby.channelId !== state.channelId) joinCallAndWatch(item);
        else openWatchScreen(item);
    };

    const main = wrapper.querySelector('[class*="watchStreamRow__"] button');
    const label = main?.querySelector('[class*="lineClamp1__"]');

    const watching =
        !item.mine &&
        ((Boolean(watchScreen?.node.isConnected) && watchScreen.item.key === item.key) || pip?.item.key === item.key);

    const buttonText = item.mine
        ? "Você está transmitindo!"
        : watching
          ? "Assistindo transmissão"
          : "Assista à transmissão";

    if (label) label.textContent = buttonText;

    if (item.mine || watching) {
        main?.setAttribute("disabled", "");
    } else {
        main?.removeAttribute("disabled");
        main?.classList.replace("secondary_a22cb0", "active_a22cb0");
        main?.addEventListener("click", watchThis);
    }

    wrapper.querySelector('[class*="previewContainer"]')?.addEventListener("click", watchThis);
    const overlapping = wrapper.querySelector('[class*="previewHover__"] [data-text-variant]');
    if (overlapping) overlapping.textContent = buttonText;
    const previewHidden = item.mine && state.hidePreview;

    if (previewHidden) {
        const box = wrapper.querySelector('[class*="previewImage__0489e"]');
        if (box) {
            const template = document.createElement("template");
            template.innerHTML = CAPTURED_PREVIEW_EMPTY_HTML;
            const next = template.content.firstElementChild;
            if (next) box.replaceWith(next);
            wrapper.querySelector('[class*="previewHover__"]')?.remove();
        }
    }

    wrapper.addEventListener("mouseenter", () => clearTimeout(livePreviewTimer));
    wrapper.addEventListener("mouseleave", scheduleCloseLivePreview);
    const shot = previewHidden ? null : wrapper.querySelector('[class*="image__"], [class*="previewImage__"] img');
    let spinnerElement = null;

    if (shot) {
        const template = document.createElement("template");
        template.innerHTML = CAPTURED_SPINNER_HTML;
        spinnerElement = template.content.firstElementChild;
        if (spinnerElement) {
            spinnerElement.style.cssText =
                "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" + "width:32px;height:32px;";
            shot.parentElement?.appendChild(spinnerElement);
        }
    }

    if (shot) {
        const role = item.mine || item.simulated ? "broadcast" : item.lobby ? "peek" : "watch";
        if (role === "peek") openPeek(item);
        let blankSince = Date.now();

        const showFrame = frame => {
            shot.setAttribute("src", frame);
            shot.removeAttribute("data-placeholder");
            spinnerElement?.remove();
            spinnerElement = null;
        };

        const cached = previewFrames.get(item.key);

        if (cached && Date.now() - cached.at < PREVIEW_FRAME_TTL_MS) {
            showFrame(cached.frame);
            blankSince = null;
        }

        const refresh = () => {
            if (!livePreview || livePreview.key !== item.key) return;

            const fromWindow = () =>
                native
                    .captureView({
                        role,
                        width: 320
                    })
                    .then(frame => (frame ? trimLetterbox(frame) : null));

            const request =
                role !== "broadcast" && native.snapshotView
                    ? native
                          .snapshotView({
                              role,
                              streamId: item.key
                          })
                          .then(frame => frame ?? fromWindow())
                    : fromWindow();

            request
                .then(async frame => {
                    if (!frame || !livePreview || livePreview.key !== item.key) return;

                    if (await isBlankFrame(frame)) {
                        blankSince ??= Date.now();
                        if (Date.now() - blankSince < BLANK_FRAME_WAIT_MS) return;
                    } else {
                        blankSince = null;
                    }

                    if (!livePreview || livePreview.key !== item.key) return;
                    previewFrames.set(item.key, {
                        frame,
                        at: Date.now()
                    });
                    showFrame(frame);
                })
                .catch(err => log("captureView:", err));
        };
        refresh();
        livePreviewFrames = setInterval(refresh, 1500);
    }

    wrapper.style.transform = "none";
    wrapper.style.position = "fixed";
    wrapper.style.right = "auto";
    wrapper.style.bottom = "auto";
    const anchor = rowEl.getBoundingClientRect();
    const width = wrapper.offsetWidth || 280;
    const height = wrapper.offsetHeight || 238;
    const left = anchor.right + 8 + width > innerWidth - 8 ? anchor.left - width - 8 : anchor.right + 8;
    wrapper.style.left = `${Math.round(Math.max(8, left))}px`;
    wrapper.style.top = `${Math.round(Math.min(Math.max(8, anchor.top - 8), innerHeight - height - 8))}px`;
    mergeIntoActivitiesCard();
    livePreviewMerge = setInterval(mergeIntoActivitiesCard, 150);
}

/**
 * Scoped copies of the popout's shadow fixes, for when the stream section lives in Discord's own card.
 */
const MERGED_PREVIEW_CSS = `
    [data-hugin-preview] [data-placeholder] { visibility: hidden; }
    [data-hugin-preview] .active_a22cb0 {
        background-color: hsl(151.128 100% 26.078%); border-color: hsl(0 0% 100% / 0.078); color: hsl(0 0% 100%);
    }
    [data-hugin-preview] .active_a22cb0:hover { background-color: hsl(150.556 100% 21.176%); }
    [data-hugin-preview] .active_a22cb0:active { background-color: hsl(150.316 100% 18.627%); }
`;

const CARD_HOVER_MARK = "__huginPreviewCard";

function ensureMergedPreviewStyle() {
    if (document.querySelector("style[data-hugin-preview-style]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-hugin-preview-style", "");
    style.textContent = MERGED_PREVIEW_CSS;
    document.head.appendChild(style);
}

/**
 * Discord's voice activities card ("Jogando agora", "Ouvindo agora"), in either of its layouts: the
 * element whose children are the sections.
 */
function nativeActivitiesCard() {
    return (
        document.querySelector('[class*="experimentContainer_d7bc5d"] [class*="scroller_d7bc5d"]') ??
        document.querySelector('[class*="container_d7bc5d"]')
    );
}

/**
 * Keeps the pointer's trip between the row and Discord's card from closing the preview.
 */
function bindCardHover(card) {
    if (card[CARD_HOVER_MARK]) return;
    card[CARD_HOVER_MARK] = true;
    card.addEventListener("mouseenter", () => clearTimeout(livePreviewTimer));
    card.addEventListener("mouseleave", scheduleCloseLivePreview);
}

/**
 * Discord places its card before our section grows it; nudges the layer up when it now runs off the
 * bottom of the window.
 */
function keepCardInView(card) {
    requestAnimationFrame(() => {
        const layer = card.closest('[class*="layer_"]') ?? card;
        const overflow = layer.getBoundingClientRect().bottom - (innerHeight - 8);
        const top = parseFloat(layer.style.top);
        if (overflow > 0 && Number.isFinite(top)) layer.style.top = `${Math.max(8, top - overflow)}px`;
    });
}

/**
 * Discord shows a live user's stream as the first section of its voice activities card. When that card
 * opens for the hovered row, our stream section moves into it and our own popout hides; if the card
 * goes away while the row is still hovered, the section returns to our popout.
 */
function mergeIntoActivitiesCard() {
    const preview = livePreview;
    if (!preview?.section) return;
    const card = preview.merged?.isConnected ? preview.merged : nativeActivitiesCard();

    if (card && (preview.merged === card || preview.row.matches(":hover") || card.matches(":hover"))) {
        if (preview.section.parentElement !== card) {
            ensureMergedPreviewStyle();
            card.insertBefore(preview.section, card.firstChild);
            bindCardHover(card);
            keepCardInView(card);
        }
        preview.merged = card;
        preview.host.style.display = "none";
        return;
    }

    if (!preview.merged) return;

    if (!preview.row.matches(":hover")) {
        closeLivePreview();
        return;
    }

    preview.merged = null;
    preview.wrapper.insertBefore(preview.section, preview.wrapper.firstChild);
    preview.host.style.display = "";
}

const HOVER_MARK = "__huginPreviewHover";

/**
 * Opens the live preview when a voice row is hovered, bound once per element.
 */
function bindRowPreview(row, userId) {
    if (row[HOVER_MARK]) return;
    row[HOVER_MARK] = true;

    row.addEventListener("mouseenter", event => {
        if (sharing) return;
        const openRect = (livePreview?.merged ?? livePreview?.wrapper)?.getBoundingClientRect();

        if (
            openRect &&
            event.clientX >= openRect.left &&
            event.clientX <= openRect.right &&
            event.clientY >= openRect.top &&
            event.clientY <= openRect.bottom
        )
            return;

        const item = streamerForUser(userId);
        if (!item) return;
        openLivePreview(item, row);
    });

    row.addEventListener("mouseleave", scheduleCloseLivePreview);
}
