/**
 * Quality popover of the share modal: presets, resolution and frame rate submenus, and options.
 */

const NATIVE_HEIGHT = 0;
const heightLabel = height => (height ? `${height}p` : "Fonte");

const RESOLUTIONS = [
    {
        label: "480p (SD)",
        height: 480
    },
    {
        label: "720p (HD)",
        height: 720
    },
    {
        label: "1080p (Full HD)",
        height: 1080
    },
    {
        label: "1440p (2K)",
        height: 1440
    },
    {
        label: "Fonte",
        height: NATIVE_HEIGHT
    }
];

const FRAMERATES = [
    {
        label: "60 FPS (Suave)",
        fps: 60
    },
    {
        label: "30 FPS (Padrão)",
        fps: 30
    },
    {
        label: "15 FPS (Econômico)",
        fps: 15
    }
];

const SHARE_QUALITY_PRESETS = [
    {
        name: "Jogos",
        height: 1440,
        fps: 60
    },
    {
        name: "Compartilhamento de tela",
        height: 1440,
        fps: 15
    },
    {
        name: "Personalizada"
    }
];

/**
 * Submenus that pick one value of the modal's choice; key is both the list item's field and the
 * choice's.
 */
const SHARE_QUALITY_GROUPS = [
    {
        title: "Resolução da tela",
        list: RESOLUTIONS,
        key: "height",
        text: item => heightLabel(item.height)
    },
    {
        title: "Taxa de quadros",
        list: FRAMERATES,
        key: "fps",
        text: item => `${item.fps}fps`
    }
];

const SHARE_QUALITY_FIXES_CSS = `
    [data-cs="0"], [data-cs="1"], [data-cs="2"], [data-cs="3"],
    [data-cs="47"], [data-cs="48"], [data-cs="49"], [data-cs="50"] { height: auto; }
    [class*="text_a4ac84"], [class*="label_c1e9c4"], [class*="container_a4ac84"],
    [class*="item_c1e9c4"] {
        width: auto; max-width: none;
    }
    [data-cs="47"], [data-cs="48"], [data-cs="50"] { width: auto; }
    [data-cs="49"] { width: auto; min-width: 188px; max-width: 320px; }
    [class*="layer__"], [class*="menu_c1e9c4"] { pointer-events: auto; }
    [class*="item_c1e9c4"]:hover { background: var(--background-mod-subtle); }

    [class*="checkmark__714a9"] { display: none; }
    [role="menuitemcheckbox"][aria-checked="true"] [class*="checkboxIndicator__"] {
        background: var(--brand-500); border-color: var(--brand-500); color: #fff;
    }
    [role="menuitemcheckbox"][aria-checked="true"] [class*="checkStroke__"],
    [role="menuitemcheckbox"][aria-checked="true"] [class*="checkStroke__"] path {
        opacity: 1; fill: currentColor;
    }

    [role="menuitemradio"] [class*="outerRadioFill__"],
    [role="menuitemradio"] [class*="innerDotRadio__"] { fill: none; stroke: none; }
    [role="menuitemradio"] [class*="outerRadioBase__"] {
        fill: rgba(0, 0, 0, 0.08); stroke: rgba(151, 151, 159, 0.64);
    }
    [role="menuitemradio"][aria-checked="true"] [class*="outerRadioBase__"] {
        fill: rgb(88, 101, 242); stroke: rgba(151, 151, 159, 0.12);
    }
    [role="menuitemradio"][aria-checked="true"] [class*="outerRadioFill__"] {
        fill: rgb(88, 101, 242); stroke: rgba(151, 151, 159, 0.12);
    }
    [role="menuitemradio"][aria-checked="true"] [class*="innerDotRadio__"] {
        fill: rgb(255, 255, 255);
    }
`;

/**
 * Opens the popover from the share modal's gear, or closes it when already open.
 */
function toggleShareQualityMenu(modal) {
    if (modal.quality) {
        closeShareQualityMenu(modal);
        return;
    }

    openShareQualityMenu(modal);
}

function closeShareQualityMenu(modal) {
    if (!modal.quality) return;
    modal.quality.host.remove();
    modal.quality = null;
    modal.gear?.setAttribute("aria-expanded", "false");
}

function setMenuRowText(row, text) {
    const holder = row.querySelector('[class*="text_a4ac84"]') ?? row.querySelector('[class*="label_c1e9c4"]');
    if (holder) holder.textContent = text;
}

/**
 * Builds the popover from Discord's captured settings menu, reusing its rows as templates.
 */
function openShareQualityMenu(modal) {
    const mounted = mountShadow(BASE_CSS + CAPTURED_SETTINGS_CSS + SHARE_QUALITY_FIXES_CSS);
    mounted.host.setAttribute("data-hugin-quality", "");
    const shell = document.createElement("div");
    shell.innerHTML = CAPTURED_SETTINGS_HTML;
    const wrapper = shell.firstElementChild;
    mounted.root.appendChild(wrapper);

    const menu = {
        host: mounted.host,
        root: mounted.root,
        wrapper,
        openSubmenu: null,
        submenuOwner: null,
        exitTimer: null,
        presetRows: []
    };

    modal.quality = menu;
    const menuElement = wrapper.querySelector('[class*="menu_c1e9c4"]');
    const menuScroller = menuElement.querySelector('[class*="scroller_c1e9c4"]');
    const submenuLayer = wrapper.querySelector('[class*="layer__"]');
    const submenuPanel = submenuLayer.querySelector('[class*="submenu_c1e9c4"]');
    const submenuScroller = submenuPanel.querySelector('[class*="scroller_c1e9c4"]');
    const rows = [...menuScroller.querySelectorAll('[class*="item_c1e9c4"]')];
    const caretRows = rows.filter(row => row.querySelector('[class*="caret_c1e9c4"]'));
    const optionRows = [...submenuScroller.querySelectorAll('[class*="item_c1e9c4"]')];
    const caretTemplate = (caretRows[1] ?? caretRows[0]).cloneNode(true);
    menu.submenuLayer = submenuLayer;
    menu.markedTemplate = (optionRows[2] ?? optionRows[0]).cloneNode(true);
    menu.plainTemplate = optionRows[0].cloneNode(true);
    menu.checkTemplate = wrapper.querySelector('[role="menuitemcheckbox"]').cloneNode(true);
    const separatorTemplate = wrapper.querySelector('[class*="separator_c1e9c4"]')?.cloneNode(true);
    const presetGroup = menuScroller.querySelector('[role="group"]')?.cloneNode(true);
    menuScroller.textContent = "";
    submenuLayer.remove();

    if (presetGroup) {
        menuScroller.appendChild(presetGroup);
        bindShareQualityPresets(modal, menu, presetGroup);
        if (separatorTemplate) menuScroller.appendChild(separatorTemplate.cloneNode(true));
    }

    for (const group of SHARE_QUALITY_GROUPS) {
        const row = caretTemplate.cloneNode(true);
        setMenuRowText(row, group.title);
        row.addEventListener("mouseenter", () => openShareQualitySubmenu(modal, menu, group, row));
        row.addEventListener("click", event => {
            event.stopPropagation();
            openShareQualitySubmenu(modal, menu, group, row);
        });
        menuScroller.appendChild(row);
    }

    if (separatorTemplate) menuScroller.appendChild(separatorTemplate.cloneNode(true));

    addShareQualityCheckbox(
        menu,
        menuScroller,
        "Silenciar áudio da transmissão",
        () => modal.choice.muteAudio,
        value => {
            modal.choice.muteAudio = value;
        }
    );

    const advanced = caretTemplate.cloneNode(true);
    setMenuRowText(advanced, "Avançado");
    advanced.addEventListener("mouseenter", () => openShareAdvancedSubmenu(modal, menu, advanced));

    advanced.addEventListener("click", event => {
        event.stopPropagation();
        openShareAdvancedSubmenu(modal, menu, advanced);
    });

    menuScroller.appendChild(advanced);

    for (const row of menuScroller.querySelectorAll(`[class*="item_c1e9c4"]`)) {
        row.addEventListener("mouseenter", () => {
            if (menu.openSubmenu && menu.submenuOwner !== row) closeShareQualitySubmenu(menu);
        });
    }

    wrapper.addEventListener("mouseleave", () => {
        clearTimeout(menu.exitTimer);

        menu.exitTimer = setTimeout(() => {
            if (!menu.openSubmenu?.matches(":hover")) closeShareQualitySubmenu(menu);
        }, 160);
    });

    wrapper.addEventListener("mouseenter", () => clearTimeout(menu.exitTimer));
    positionShareQualityMenu(modal.gear, wrapper, menuElement);
}

/**
 * Opens the popover above the gear, right-aligned with it and kept inside the window.
 */
function positionShareQualityMenu(gear, wrapper, menuElement) {
    gear?.setAttribute("aria-expanded", "true");
    const anchor = gear.getBoundingClientRect();
    wrapper.style.position = "fixed";
    wrapper.style.right = "auto";
    wrapper.style.bottom = "auto";
    const width = menuElement.offsetWidth || 245;
    const tall = menuElement.offsetHeight || 120;
    wrapper.style.left = `${Math.round(Math.min(Math.max(8, anchor.right - width), innerWidth - width - 8))}px`;
    wrapper.style.top = `${Math.round(Math.max(8, anchor.top - tall - 8))}px`;
}

function bindShareQualityPresets(modal, menu, presetGroup) {
    menu.presetRows = [...presetGroup.querySelectorAll('[role="menuitemradio"]')];

    menu.presetRows.forEach((row, index) => {
        const preset = SHARE_QUALITY_PRESETS[index];
        if (!preset) return;

        row.addEventListener("click", event => {
            event.stopPropagation();
            modal.choice.mode = preset.name;
            if (preset.height) modal.choice.height = preset.height;
            if (preset.fps) modal.choice.fps = preset.fps;
            syncShareQualityPresets(menu, modal.choice.mode);
            drawShareSummary(modal);
        });
    });

    syncShareQualityPresets(menu, modal.choice.mode);
}

function syncShareQualityPresets(menu, mode) {
    menu.presetRows.forEach((row, index) => {
        const marked = SHARE_QUALITY_PRESETS[index]?.name === mode;
        row.setAttribute("aria-checked", String(marked));

        row.querySelector('[class*="standaloneRadioIndicator__"]')?.setAttribute("data-selected", String(marked));
    });
}

function closeShareQualitySubmenu(menu) {
    menu.openSubmenu?.remove();
    menu.openSubmenu = null;
    menu.submenuOwner = null;
}

/**
 * Lists a group's values in a submenu next to its row; picking one switches the preset to
 * "Personalizada".
 */
function openShareQualitySubmenu(modal, menu, group, anchorRow) {
    const { choice } = modal;
    closeShareQualitySubmenu(menu);
    const layer = menu.submenuLayer.cloneNode(true);
    const scroller = layer.querySelector('[class*="scroller_c1e9c4"]');
    scroller.textContent = "";

    for (const item of group.list) {
        const marked = item[group.key] === choice[group.key];
        const row = (marked ? menu.markedTemplate : menu.plainTemplate).cloneNode(true);
        setMenuRowText(row, group.text(item));
        row.addEventListener("click", event => {
            event.stopPropagation();
            choice[group.key] = item[group.key];
            choice.mode = "Personalizada";
            syncShareQualityPresets(menu, choice.mode);
            drawShareSummary(modal);
            closeShareQualitySubmenu(menu);
            openShareQualitySubmenu(modal, menu, group, anchorRow);
        });
        scroller.appendChild(row);
    }

    showShareQualitySubmenu(menu, layer, anchorRow);
}

function openShareAdvancedSubmenu(modal, menu, anchorRow) {
    closeShareQualitySubmenu(menu);
    const layer = menu.submenuLayer.cloneNode(true);
    const scroller = layer.querySelector('[class*="scroller_c1e9c4"]');
    scroller.textContent = "";

    addShareQualityCheckbox(
        menu,
        scroller,
        "Ocultar prévia da transmissão",
        () => modal.choice.hidePreview,
        value => {
            modal.choice.hidePreview = value;
            state.hidePreview = value;
        }
    );

    showShareQualitySubmenu(menu, layer, anchorRow);
}

function showShareQualitySubmenu(menu, layer, anchorRow) {
    menu.root.appendChild(layer);
    placeShareQualitySubmenu(menu, layer, anchorRow);
    menu.openSubmenu = layer;
    menu.submenuOwner = anchorRow;
}

/**
 * Places a submenu beside its row (on the left when it would overflow) and closes it shortly after
 * the pointer leaves both menus.
 */
function placeShareQualitySubmenu(menu, layer, anchorRow) {
    const anchor = anchorRow.getBoundingClientRect();
    layer.style.transform = "none";
    layer.style.position = "fixed";
    layer.style.right = "auto";
    layer.style.bottom = "auto";
    const width = layer.offsetWidth || 245;
    const overflows = anchor.right + 4 + width > innerWidth - 8;
    const left = overflows ? anchor.left - width - 4 : anchor.right + 4;
    layer.style.left = `${Math.round(Math.max(8, left))}px`;
    layer.style.top = `${Math.round(Math.max(8, anchor.top - 8))}px`;
    layer.addEventListener("mouseenter", () => clearTimeout(menu.exitTimer));

    layer.addEventListener("mouseleave", () => {
        clearTimeout(menu.exitTimer);

        menu.exitTimer = setTimeout(() => {
            if (!menu.wrapper.matches(":hover") && !layer.matches(":hover")) closeShareQualitySubmenu(menu);
        }, 160);
    });
}

function addShareQualityCheckbox(menu, parent, label, get, set) {
    const row = menu.checkTemplate.cloneNode(true);
    row.removeAttribute("id");
    setMenuRowText(row, label);
    row.setAttribute("aria-checked", String(get()));

    row.addEventListener("click", event => {
        event.stopPropagation();
        set(!get());
        row.setAttribute("aria-checked", String(get()));
    });

    parent.appendChild(row);
    return row;
}
