/**
 * Drawing over the shared monitor (Ctrl+Shift+D).
 */

const PENCIL_SHORTCUT = "CommandOrControl+Shift+D";

const ANNOTATE_HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
                 background: transparent; cursor: crosshair; }
    canvas { position: fixed; inset: 0; }
    .toolbar {
        position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
        display: flex; align-items: center; gap: 10px; padding: 10px 14px;
        background: rgba(20,20,24,.85); border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,.5); font-family: -apple-system, sans-serif;
    }
    .swatch { width: 22px; height: 22px; border-radius: 999px; border: 2px solid rgba(255,255,255,.5);
           cursor: pointer; }
    .swatch.active { border-color: #fff; }
    .action {
        width: 34px; height: 34px; border-radius: 8px; border: 0; background: rgba(255,255,255,.12);
        color: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center;
        justify-content: center;
    }
    .action:hover { background: rgba(255,255,255,.22); }
    .hint { color: #9a9ca3; font-size: 11px; white-space: nowrap; }
</style></head><body>
    <canvas id="c"></canvas>
    <div class="toolbar">
        <div class="swatch active" style="background:#ED4245" data-color="#ED4245"></div>
        <div class="swatch" style="background:#FEE75C" data-color="#FEE75C"></div>
        <div class="swatch" style="background:#57F287" data-color="#57F287"></div>
        <div class="swatch" style="background:#5865F2" data-color="#5865F2"></div>
        <div class="swatch" style="background:#fff" data-color="#ffffff"></div>
        <button class="action" data-act="clear" title="Limpar">&#128465;</button>
        <span class="hint">Ctrl+Shift+D para sair</span>
    </div>
    <script>
        const c = document.getElementById("c");
        const ctx = c.getContext("2d");
        function fit() { c.width = window.innerWidth; c.height = window.innerHeight; }
        fit();
        window.addEventListener("resize", fit);

        let color = "#ED4245";
        let drawing = false;
        let lastX = 0, lastY = 0;

        function strokeTo(x, y) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            lastX = x; lastY = y;
        }

        c.addEventListener("mousedown", e => { drawing = true; lastX = e.clientX; lastY = e.clientY; });
        c.addEventListener("mousemove", e => { if (drawing) strokeTo(e.clientX, e.clientY); });
        window.addEventListener("mouseup", () => { drawing = false; });

        for (const el of document.querySelectorAll(".swatch")) {
            el.addEventListener("mousedown", () => {
                color = el.dataset.color;
                document.querySelectorAll(".swatch").forEach(x => x.classList.remove("active"));
                el.classList.add("active");
            });
        }
        document.querySelector('[data-act="clear"]').addEventListener("mousedown", () => {
            ctx.clearRect(0, 0, c.width, c.height);
        });
    </script>
</body></html>`;

let annotateWin = null;
let pencilShortcutRegistered = false;

function closeAnnotate() {
    if (annotateWin && !annotateWin.isDestroyed()) annotateWin.destroy();
    annotateWin = null;
}

/**
 * The display a screen source captures, matched by display_id.
 */
async function displayForSourceId(sourceId) {
    try {
        const sources = await electron.desktopCapturer.getSources({
            types: ["screen"]
        });
        const source = sources.find(s => s.id === sourceId);
        const displays = electron.screen.getAllDisplays();
        const match = source && displays.find(d => String(d.id) === source.display_id);
        return match || electron.screen.getPrimaryDisplay();
    } catch {
        return electron.screen.getPrimaryDisplay();
    }
}

async function toggleAnnotate() {
    if (annotateWin) {
        closeAnnotate();
        log("pencil: off");
        return;
    }

    if (!pending?.sourceId || !pending.sourceId.startsWith("screen:")) {
        log("pencil: shortcut pressed without a full-screen share -- ignored");
        return;
    }

    const display = await displayForSourceId(pending.sourceId);

    annotateWin = new OriginalBrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
        resizable: false,
        movable: false,
        focusable: true,
        fullscreenable: false,
        roundedCorners: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    annotateWin.setAlwaysOnTop(true, "screen-saver");

    annotateWin.on("closed", () => {
        annotateWin = null;
    });

    try {
        await annotateWin.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(ANNOTATE_HTML));
        log("pencil: on, monitor", display.id, display.bounds);
    } catch (err) {
        log("pencil: failed to open:", String(err));
        closeAnnotate();
    }
}

electron.app.on("will-quit", () => {
    try {
        electron.globalShortcut.unregisterAll();
    } catch {}
});
