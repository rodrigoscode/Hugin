/**
 * Stream tiles in Discord's call grid for the users who are live with Hugin, built like Discord's own stream
 * tile before you watch it: the dimmed preview, "Assista à transmissão" and the streamer's name.
 */

const CALL_TILE_MARK = "data-hugin-call-tile";
const CALL_ROW_MARK = "data-hugin-call-row";
const CALL_GRID_MARK = "data-hugin-grid";

/**
 * Discord's call grid: 16:9 tiles 8 px apart, 64 px of list padding above and below, and 16 px of the
 * width kept free.
 */
const CALL_GRID_GAP = 8;
const CALL_GRID_PADDING = 64;
const CALL_GRID_INSET = 16;
const CALL_GRID_MAX_TILES = 25;
const CALL_TILE_ASPECT = 16 / 9;
const CALL_TILE_SHOT_MS = 4000;

const SCREEN_ICON_PATH =
    "M5 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5ZM13.5 20a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-.5.5H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-1.5Z";

/**
 * While stream tiles are in, the grid's rows dissolve into one wrapping flow exactly as wide as the columns,
 * so each stream tile can sit right after its owner's tile without moving the tiles Discord renders.
 */
const CALL_TILES_CSS = `
    [${CALL_GRID_MARK}] {
        display: flex !important;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        gap: ${CALL_GRID_GAP}px;
        top: var(--hugin-call-top) !important;
        bottom: auto !important;
        width: var(--hugin-call-grid-width) !important;
        margin-inline: auto !important;
    }
    [${CALL_GRID_MARK}] > [class*="row_d6271c"] { display: contents !important; }
    [${CALL_GRID_MARK}] [class*="tile_d6271c"] {
        width: var(--hugin-call-tile-width) !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    [${CALL_TILE_MARK}] { cursor: pointer; }
    [${CALL_TILE_MARK}] .hugin-tile-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
    [${CALL_TILE_MARK}] .hugin-tile-preview:not([src]) { display: none; }
`;

let lastGridMismatch = "";

function callTileMarkup(name) {
    const template = document.createElement("template");

    template.innerHTML =
        '<div class="tile_d6271c"><div class="tileSizer_d6271c"><div class="wrapper__2f4f7 tile_eaee1d">' +
        '<div class="tile__2f4f7 tile__90dc5"><div class="tileChild__2f4f7">' +
        '<div class="content__2f4f7 streamPreview__2f4f7">' +
        '<div class="absoluteFill__2f4f7 streamPreviewOpacity__2f4f7"><img class="hugin-tile-preview" alt=""></div>' +
        '<div class="cta__2f4f7"><button data-mana-component="button" role="button" type="button" class="button_a22cb0 md_a22cb0 secondary_a22cb0 hasText_a22cb0">' +
        '<div class="buttonChildrenWrapper_a22cb0"><div class="buttonChildren_a22cb0">' +
        '<span class="lineClamp1__4bd52 text-md/medium_cf4812" data-text-variant="text-md/medium"></span>' +
        "</div></div></button></div></div></div>" +
        '<div class="overlayContainer__2f4f7"><div class="overlayTop__2f4f7"></div><div class="overlayBottom__2f4f7">' +
        '<div class="overlayIconsContainer__2f4f7"><div class="text-sm/normal_cf4812 experimentOverlayTitle__2f4f7" data-text-variant="text-sm/normal">' +
        `<svg class="titleIcon__2f4f7" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="${SCREEN_ICON_PATH}"></path></svg>` +
        '<span class="overlayTitleText__2f4f7"></span></div></div></div></div>' +
        "</div></div></div></div>";

    const cell = template.content.firstElementChild;
    cell.querySelector('[class*="overlayTitleText__"]').textContent = name;
    return cell;
}

function ensureCallTilesStyle() {
    if (document.querySelector("style[data-hugin-call-tiles]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-hugin-call-tiles", "");
    style.textContent = CALL_TILES_CSS;
    document.head.appendChild(style);
}

/**
 * The users of our call who are live, each with their stream item. The lobby announces a stream seconds
 * before the call's scene connects to it, so its entries count too.
 */
function callTileStreams() {
    const owners = new Set();
    if (state.broadcasting && state.userId) owners.add(state.userId);

    for (const [id, data] of state.streams) {
        const owner = streamOwner(id, data);
        if (owner) owners.add(owner);
    }

    for (const entry of state.lobby.values()) {
        if (state.channelId && entry.channelId === state.channelId) owners.add(entry.userId);
    }

    return [...owners]
        .map(owner => ({
            owner,
            item: streamerForUser(owner)
        }))
        .filter(entry => entry.item);
}

function createCallTile(owner, item) {
    const cell = callTileMarkup(broadcasterName(item));
    cell.setAttribute(CALL_TILE_MARK, owner);

    cell.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const current = streamerForUser(owner);
        if (current) requestWatchStream(current);
    });

    return cell;
}

/**
 * Refreshes a tile's dimmed preview from the frames the hover preview uses, at most every few seconds.
 */
function refreshCallTileShot(cell, item) {
    if (Date.now() < (cell.huginNextShot ?? 0)) return;
    cell.huginNextShot = Date.now() + CALL_TILE_SHOT_MS;
    const img = cell.querySelector(".hugin-tile-preview");
    const cached = previewFrames.get(item.key);
    if (cached && !img.getAttribute("src")) img.setAttribute("src", cached.frame);

    const request = item.mine
        ? native.captureView?.({
              role: "broadcast",
              width: 480
          })
        : native.snapshotView?.({
              role: "watch",
              streamId: item.key
          });

    request
        ?.then(async frame => {
            if (!frame || !cell.isConnected || (await isBlankFrame(frame))) return;
            img.setAttribute("src", frame);
        })
        .catch(() => {});
}

function columnsFitting(tileWidth, width) {
    return Math.max(1, Math.floor((width - tileWidth) / (CALL_GRID_GAP + tileWidth)) + 1);
}

/**
 * The first value in [low, high] for which fits() turns false, fits() being true below it.
 */
function firstFailing(low, high, fits) {
    let count = high - low;

    while (count > 0) {
        const step = Math.floor(count / 2);
        const probe = low + step;

        if (fits(probe)) {
            low = probe + 1;
            count -= step + 1;
        } else {
            count = step;
        }
    }

    return low;
}

/**
 * Discord's grid sizing: the widest tile for which the columns that fit, times the rows that fit, still hold
 * every tile (past 25 tiles the grid scrolls).
 */
function discordGridLayout(count, width, height) {
    const rowsFitting = (tileWidth, round) => {
        const tileHeight = tileWidth / CALL_TILE_ASPECT;
        return round((height - tileHeight) / (CALL_GRID_GAP + tileHeight)) + 1;
    };

    const narrowest = Math.floor(width / CALL_GRID_MAX_TILES);

    const tileWidth =
        count > CALL_GRID_MAX_TILES
            ? firstFailing(narrowest, width, w => columnsFitting(w, width) * rowsFitting(w, Math.ceil) > CALL_GRID_MAX_TILES)
            : firstFailing(narrowest, width, w => columnsFitting(w, width) * rowsFitting(w, Math.floor) >= count) - 1;

    const columns = columnsFitting(tileWidth, width);

    return {
        tileWidth,
        columns,
        rows: Math.ceil(count / columns)
    };
}

/**
 * The grid with our tiles added, measured on the scroller Discord measures. Null when Discord's own tiles
 * don't match the same math, so a grid that works differently is left alone.
 */
function callGridLayout(scroller, cells, extra) {
    const width = scroller.offsetWidth - CALL_GRID_INSET;
    const height = scroller.offsetHeight - 2 * CALL_GRID_PADDING;
    const expected = discordGridLayout(cells.length, width, height).tileWidth;
    const actual = parseFloat(cells[0]?.style.width);

    if (expected !== actual) {
        const mismatch = `${cells.length} tiles in ${scroller.offsetWidth}x${scroller.offsetHeight}: ${actual} vs ${expected}`;
        if (mismatch !== lastGridMismatch) log("call grid: Discord's layout differs,", mismatch);
        lastGridMismatch = mismatch;
        return null;
    }

    const grown = discordGridLayout(cells.length + extra, width, height);
    const rowHeight = Math.floor(grown.tileWidth / CALL_TILE_ASPECT) + CALL_GRID_GAP;

    return {
        ...grown,
        top: CALL_GRID_PADDING + Math.max(0, height - rowHeight * grown.rows) / 2
    };
}

function releaseCallGrid(grid) {
    grid.removeAttribute(CALL_GRID_MARK);
    for (const cell of grid.querySelectorAll('[class*="tile_d6271c"]')) cell.style.removeProperty("order");
}

function syncCallTiles() {
    const nativeTile = watchScreen
        ? null
        : [...document.querySelectorAll("[data-call-tile]")].find(tile => !tile.closest(`[${CALL_TILE_MARK}]`));
    const found = nativeTile?.closest('[class*="listItems_"]') ?? null;
    const cells = found ? [...found.querySelectorAll('[class*="tile_d6271c"]')].filter(cell => !cell.hasAttribute(CALL_TILE_MARK)) : [];
    const streams = found ? callTileStreams() : [];
    const layout = streams.length && found.parentElement ? callGridLayout(found.parentElement, cells, streams.length) : null;
    const list = layout ? found : null;

    for (const cell of document.querySelectorAll(`[${CALL_TILE_MARK}]`)) {
        const owner = cell.getAttribute(CALL_TILE_MARK);
        if (cell.closest('[class*="listItems_"]') !== list || !streams.some(entry => entry.owner === owner)) cell.remove();
    }

    for (const row of document.querySelectorAll(`[${CALL_ROW_MARK}]`)) {
        if (row.children.length === 0 || row.parentElement !== list) row.remove();
    }

    for (const grid of document.querySelectorAll(`[${CALL_GRID_MARK}]`)) {
        if (grid !== list) releaseCallGrid(grid);
    }

    if (!list) return;
    const firstRow = list.querySelector(`:scope > [class*="row_d6271c"]:not([${CALL_ROW_MARK}])`);
    if (!firstRow) return;
    ensureCallTilesStyle();

    let holder = list.querySelector(`:scope > [${CALL_ROW_MARK}]`);

    if (!holder) {
        holder = document.createElement("div");
        holder.className = firstRow.className;
        holder.setAttribute(CALL_ROW_MARK, "");
        list.appendChild(holder);
    }

    cells.forEach((cell, index) => cell.style.setProperty("order", String(index * 2)));

    for (const { owner, item } of streams) {
        let cell = holder.querySelector(`[${CALL_TILE_MARK}="${CSS.escape(owner)}"]`);

        if (!cell) {
            cell = createCallTile(owner, item);
            holder.appendChild(cell);
        }

        const ownerIndex = cells.findIndex(native => native.querySelector(`[data-selenium-video-tile="${owner}"]`));
        cell.style.setProperty("order", String((ownerIndex >= 0 ? ownerIndex : cells.length) * 2 + 1));
        cell.querySelector('[class*="overlayTitleText__"]').textContent = broadcasterName(item);
        refreshCallTileShot(cell, item);
    }

    const { tileWidth, columns, top } = layout;
    list.style.setProperty("--hugin-call-tile-width", `${tileWidth}px`);
    list.style.setProperty("--hugin-call-grid-width", `${columns * tileWidth + (columns - 1) * CALL_GRID_GAP + 1}px`);
    list.style.setProperty("--hugin-call-top", `${top}px`);
    list.setAttribute(CALL_GRID_MARK, "");

    for (const cell of holder.querySelectorAll(`[${CALL_TILE_MARK}]`)) {
        const small = tileWidth < 195;
        const label = cell.querySelector('[class*="cta__"] [data-text-variant]');
        const button = cell.querySelector('[class*="cta__"] button');
        if (label) label.textContent = tileWidth < 175 ? "Assistir" : "Assista à transmissão";
        button?.classList.toggle("sm_a22cb0", small);
        button?.classList.toggle("md_a22cb0", !small);
        cell.querySelector('[class*="content__2f4f7"]')?.classList.toggle("small__2f4f7", small);
        cell.querySelector('[class*="overlayContainer__"]')?.classList.toggle("compact__2f4f7", small);
    }
}

function watchCallTiles() {
    setInterval(() => {
        try {
            syncCallTiles();
        } catch (err) {
            log("call tiles:", String(err));
        }
    }, 500);
}
