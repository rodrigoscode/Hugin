/**
 * The log file shared by the main process, the preloads and the renderer.
 */

/**
 * Appends to the log file shared by every process; Discord's DevTools may be unavailable.
 */
function write(source, args) {
    const line = args
        .map(a =>
            typeof a === "string"
                ? a
                : (() => {
                      try {
                          return JSON.stringify(a);
                      } catch {
                          return String(a);
                      }
                  })()
        )
        .join(" ");

    try {
        appendFileSync(LOG_FILE, `${new Date().toISOString()} [${source}] ${line}\n`);
    } catch {}
}

function log(...args) {
    console.log("[Hugin]", ...args);
    write("main", args);
}

try {
    mkdirSync(DATA_DIR, {
        recursive: true
    });
} catch {}

const LOG_LIMIT = 512 * 1024;

try {
    let size = 0;
    try {
        size = statSync(LOG_FILE).size;
    } catch {}
    if (size > LOG_LIMIT) {
        writeFileSync(LOG_FILE, new Date().toISOString() + " [main] --- log rotated ---\n");
    }
    appendFileSync(LOG_FILE, new Date().toISOString() + " [main] --- start (pid " + process.pid + ") ---\n");
} catch {}

process.on("uncaughtException", err => {
    write("main", ["uncaughtException:", err?.stack ?? String(err)]);
    throw err;
});
