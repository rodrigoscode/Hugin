/**
 * Config, sounds and fonts served to the renderer from the data directory.
 */

electron.ipcMain.on("hugin:log", (_e, source, args) => write(source, args));

function readConfig() {
    try {
        return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
    } catch {
        return {};
    }
}

electron.ipcMain.handle("hugin:getConfig", readConfig);
const soundCache = new Map();
const fontCache = new Map();

/**
 * Reads an asset from the data directory once, base64-encoded, caching misses too.
 */
function readCachedAsset(cache, name, namePattern, subdir) {
    if (typeof name !== "string" || !namePattern.test(name)) return null;
    if (cache.has(name)) return cache.get(name);

    try {
        const base64 = readFileSync(join(DATA_DIR, subdir, name)).toString("base64");
        cache.set(name, base64);
        return base64;
    } catch {
        cache.set(name, null);
        return null;
    }
}

electron.ipcMain.handle("hugin:getSound", (_e, name) => readCachedAsset(soundCache, name, /^[\w.-]+\.mp3$/, "sounds"));
electron.ipcMain.handle("hugin:getFont", (_e, name) => readCachedAsset(fontCache, name, /^[\w.-]+\.woff2$/, "fonts"));
