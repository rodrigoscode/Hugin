/** Diagnostics remain accessible without enumerating capture sources or opening DevTools. */
const DIAGNOSTIC_UI_CSS = `
    .diagnostic-menu { position:fixed; min-width:220px; padding:6px; border-radius:8px; pointer-events:auto;
        background:var(--background-floating,#18191c); color:var(--text-normal,#dbdee1); box-shadow:0 8px 24px #0006; }
    [data-hugin-diagnostic-action] { display:block; width:100%; min-height:32px; padding:6px 8px; border:0;
        border-radius:4px; background:transparent; color:inherit; font:inherit; text-align:left; cursor:pointer; }
    [data-hugin-diagnostic-action]:is(:hover,:focus-visible) { background:var(--background-mod-subtle,#ffffff14); outline:2px solid transparent; }
    .diagnostic-status { position:fixed; right:20px; bottom:24px; max-width:360px; padding:12px 16px; border-radius:8px;
        background:var(--background-floating,#18191c); color:var(--text-normal,#dbdee1); box-shadow:0 8px 24px #0006; pointer-events:auto; }
`;
let diagnosticMenu = null, diagnosticStatus = null, diagnosticCopyTask = null;

function showDiagnosticStatus(text, duration = 0) {
    if (diagnosticStatus) {
        clearTimeout(diagnosticStatus.timer);
        diagnosticStatus.node.textContent = text;
    } else {
        const { host, root } = mountShadow(BASE_CSS + DIAGNOSTIC_UI_CSS);
        host.setAttribute("data-hugin-diagnostic-status", "");
        const node = document.createElement("div");
        node.className = "diagnostic-status";
        node.setAttribute("role", "status");
        node.setAttribute("aria-live", "polite");
        node.textContent = text;
        root.appendChild(node);
        diagnosticStatus = { host, node, timer: null };
    }
    if (duration) {
        const status = diagnosticStatus;
        status.timer = setTimeout(() => {
            status.host.remove();
            if (diagnosticStatus === status) diagnosticStatus = null;
        }, duration);
    }
}

function copySessionDiagnostic() {
    if (diagnosticCopyTask) return diagnosticCopyTask;
    showDiagnosticStatus("Coletando diagnóstico…");
    diagnosticCopyTask = (async () => {
        let timer;
        try {
            if (!native.copyDiagnostics) {
                showDiagnosticStatus("Diagnóstico indisponível. Reinicie o Discord após atualizar o Hugin.", 6000);
                return false;
            }
            let snapshot = null;
            try { snapshot = diagnosticPlaybackSnapshot(); } catch {}
            const result = await Promise.race([
                native.copyDiagnostics(snapshot),
                new Promise(resolve => { timer = setTimeout(() => resolve({ ok: false, reason: "timeout" }), 3000); })
            ]);
            if (result?.ok) {
                showDiagnosticStatus(result.partial ? "Diagnóstico copiado (coleta parcial)." : "Diagnóstico copiado.", 5000);
                return true;
            }
            showDiagnosticStatus(result?.reason === "timeout" ? "A coleta demorou demais. Tente novamente." :
                "Não foi possível copiar o diagnóstico. Tente novamente.", 6000);
            return false;
        } catch {
            showDiagnosticStatus("Não foi possível copiar o diagnóstico. Tente novamente.", 6000);
            return false;
        } finally {
            clearTimeout(timer);
        }
    })().finally(() => { diagnosticCopyTask = null; });
    return diagnosticCopyTask;
}

function appendDiagnosticMenuItem(menu, onSelect = () => {}) {
    const style = document.createElement("style");
    style.textContent = DIAGNOSTIC_UI_CSS;
    menu.appendChild(style);
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.setAttribute("data-hugin-diagnostic-action", "");
    button.textContent = "Copiar diagnóstico";
    button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        onSelect();
        copySessionDiagnostic();
    });
    menu.appendChild(button);
    return button;
}

function closeDiagnosticMenu() {
    if (!diagnosticMenu) return;
    document.removeEventListener("mousedown", diagnosticMenu.outside, true);
    document.removeEventListener("keydown", diagnosticMenu.onKey, true);
    diagnosticMenu.host.remove();
    diagnosticMenu = null;
}

function openDiagnosticMenu(point, anchor = null) {
    closeDiagnosticMenu();
    const { host, root } = mountShadow(BASE_CSS + DIAGNOSTIC_UI_CSS);
    host.setAttribute("data-hugin-diagnostic-menu", "");
    const menu = document.createElement("div");
    menu.className = "diagnostic-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Diagnóstico do Hugin");
    root.appendChild(menu);
    const button = appendDiagnosticMenuItem(menu, closeDiagnosticMenu);
    if (typeof appendUpdateMenuItem === "function") appendUpdateMenuItem(menu, closeDiagnosticMenu);
    const box = anchor?.getBoundingClientRect();
    menu.style.left = Math.max(8, Math.min(point?.x ?? box?.left ?? 8, innerWidth - 240)) + "px";
    menu.style.top = Math.max(8, Math.min(point?.y ?? box?.bottom ?? 8, innerHeight - 100)) + "px";
    const outside = event => { if (!event.composedPath().includes(host)) closeDiagnosticMenu(); };
    const onKey = event => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeDiagnosticMenu(); anchor?.focus(); }
    };
    diagnosticMenu = { host, outside, onKey };
    document.addEventListener("mousedown", outside, true);
    document.addEventListener("keydown", onKey, true);
    button.focus();
}

function bindDiagnosticShortcut(button) {
    if (button.__huginDiagnostic) return;
    button.__huginDiagnostic = true;
    button.addEventListener("contextmenu", event => {
        event.preventDefault();
        event.stopPropagation();
        openDiagnosticMenu({ x: event.clientX, y: event.clientY }, button);
    });
    button.addEventListener("keydown", event => {
        if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
        event.preventDefault();
        event.stopPropagation();
        openDiagnosticMenu(null, button);
    });
}
