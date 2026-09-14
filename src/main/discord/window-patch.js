/**
 * Wraps Discord's BrowserWindow to chain our preload into its main window.
 */

const OriginalBrowserWindow = electron.BrowserWindow;

/**
 * With --debug, copies the page's console errors and warnings into our log.
 */
function forwardConsole(win) {
    win.webContents.on("console-message", (event, level, message, line, source) => {
        const detail =
            typeof event === "object" && event !== null && "message" in event
                ? {
                      level: event.level,
                      message: event.message,
                      line: event.lineNumber,
                      source: event.sourceId
                  }
                : {
                      level,
                      message,
                      line,
                      source
                  };

        const serious =
            detail.level === "error" || detail.level === "warning" || detail.level === 2 || detail.level === 3;

        if (!serious) return;

        write("console", [
            String(detail.level),
            String(detail.message).slice(0, 1200),
            `${detail.source ?? "?"}:${detail.line ?? "?"}`
        ]);
    });
}

function openDevToolsWhenReady(win) {
    win.webContents.once("dom-ready", () => {
        try {
            win.webContents.openDevTools({
                mode: "detach"
            });
            log("DevTools opened (debug mode)");
        } catch (err) {
            log("couldn't open DevTools:", String(err));
        }
    });
}

/**
 * Discord's BrowserWindow with our preload chained in front of Discord's own.
 */
const PatchedBrowserWindow = new Proxy(OriginalBrowserWindow, {
    construct(target, args) {
        const options = args[0] ?? {};
        const preload = options?.webPreferences?.preload;
        if (DEBUG_MODE) log("window:", JSON.stringify(options?.title ?? null), preload ?? "(no preload)");
        const isMain = Boolean(preload && options.title);

        if (isMain) {
            if (DEBUG_MODE) {
                log(
                    "original webPreferences:",
                    "sandbox=" + options.webPreferences.sandbox,
                    "contextIsolation=" + options.webPreferences.contextIsolation,
                    "nodeIntegration=" + options.webPreferences.nodeIntegration
                );
            }
            const configBlob = Buffer.from(JSON.stringify(readConfig()), "utf8").toString("base64");
            options.webPreferences.additionalArguments = [
                ...(options.webPreferences.additionalArguments ?? []),
                "--hugin-original-preload=" + preload,
                "--hugin-data-dir=" + DATA_DIR,
                "--hugin-debug=" + (DEBUG_MODE ? "1" : "0"),
                "--hugin-config=" + configBlob
            ];
            options.webPreferences.preload = join(__dirname, "preload.js");
            options.webPreferences.sandbox = false;
            log("preload chained");
        }

        const win = Reflect.construct(target, args, target);

        if (isMain) {
            mainWindow = win;
            win.on("closed", () => {
                if (mainWindow === win) mainWindow = null;
            });
            allowVdoFraming(win);
            win.webContents.on("did-fail-load", (_e, code, description, url) =>
                write("console", ["did-fail-load", String(code), description, String(url).slice(0, 200)])
            );
            win.webContents.on("render-process-gone", (_e, details) =>
                write("console", ["render-process-gone", JSON.stringify(details)])
            );
            for (const eventName of ["move", "resize", "restore", "maximize", "unmaximize", "show"]) {
                win.on(eventName, repositionAll);
            }
            if (DEBUG_MODE) {
                forwardConsole(win);
                openDevToolsWhenReady(win);
            }
        }

        return win;
    }
});

let patched;
const originalLoad = Module._load;

Module._load = function (request, ...rest) {
    const loaded = originalLoad.call(this, request, ...rest);
    if (request !== "electron") return loaded;

    return (patched ??= new Proxy(loaded, {
        get(target, prop) {
            if (prop === "BrowserWindow") return PatchedBrowserWindow;
            return target[prop];
        }
    }));
};
