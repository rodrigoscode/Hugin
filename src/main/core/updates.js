/** The renderer requests actions; executable paths, releases and process control stay here. */
let updateOperation = null, updateRelease = null, updatePrepared = null, updateLastManual = 0;
let updateSafetyRequest = null;

function updateSender(event) {
    try {
        return Boolean(mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents &&
            event.senderFrame === mainWindow.webContents.mainFrame);
    } catch { return false; }
}

function sendUpdateProgress(progress) {
    try { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("hugin:updateProgress", progress); } catch {}
}

function runUpdateHelper(args, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(HELPER_EXE, ["update", ...args], { windowsHide: true, stdio: ["ignore", "pipe", "ignore"] });
        let buffer = "", result = null, failure = null;
        const timer = setTimeout(() => { child.kill(); reject(new Error("timeout")); }, args[0] === "download" ? 200000 : 30000);
        child.on("error", () => { clearTimeout(timer); reject(new Error("helper_unavailable")); });
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", chunk => {
            buffer += chunk;
            if (buffer.length > 256 * 1024) { child.kill(); return; }
            let newline;
            while ((newline = buffer.indexOf("\n")) !== -1) {
                const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
                try {
                    const message = JSON.parse(line);
                    if (message.type === "result") result = message.result;
                    if (message.type === "error") failure = String(message.message).slice(0, 300);
                    if (message.type === "progress" && Number.isFinite(message.done) && Number.isFinite(message.total))
                        onProgress({ phase: "downloading", done: message.done, total: message.total });
                } catch {}
            }
        });
        child.on("close", code => {
            clearTimeout(timer);
            if (code === 0 && result) resolve(result); else reject(new Error(failure || "operation_failed"));
        });
    });
}

function updateNativeIdle() {
    return !pending && !systemAudio && ![...views.keys()].some(role => role === "broadcast" || role === "scene") &&
        diagnosticClosingViews.size === 0;
}

function updateSafetyIdle(safety) { return safety?.known === true && safety?.idle === true && updateNativeIdle(); }

electron.ipcMain.on("hugin:updateSafetyReply", (event, token, safety) => {
    if (!updateSender(event) || !updateSafetyRequest || updateSafetyRequest.token !== token) return;
    updateSafetyRequest.resolve(updateSafetyIdle(safety));
});

function requestUpdateSafety() {
    return new Promise(resolve => {
        const token = require("crypto").randomBytes(16).toString("hex");
        const finish = idle => { clearTimeout(timer); updateSafetyRequest = null; resolve(idle); };
        const timer = setTimeout(() => finish(false), 2000);
        updateSafetyRequest = { token, resolve: finish };
        try { mainWindow.webContents.send("hugin:updateSafetyRequest", token); } catch { finish(false); }
    });
}

async function launchPreparedUpdate(event) {
    let branch;
    try { branch = JSON.parse(readFileSync(join(__dirname, ".hugin.json"), "utf8")).branch; } catch { throw new Error("installation_unknown"); }
    if (!["stable", "ptb", "canary", "development"].includes(branch)) throw new Error("installation_unknown");
    await runUpdateHelper(["preflight", branch]);
    if (!updateSender(event) || !await requestUpdateSafety()) throw new Error("call_active");
    return new Promise((resolve, reject) => {
        const child = spawn(join(DATA_DIR, "updates", "prepared", "Hugin.exe"), ["update", "apply", branch, String(process.pid), updatePrepared.version, updatePrepared.sha256], {
            detached: true, windowsHide: true, stdio: ["ignore", "pipe", "ignore"]
        });
        let ready = false, handedOff = false, ended = false, buffer = "";
        const timer = setTimeout(() => { ended = true; child.kill(); reject(new Error("timeout")); }, 15000);
        child.on("error", () => { ended = true; clearTimeout(timer); reject(new Error("installer_unavailable")); });
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", chunk => {
            buffer += chunk;
            if (buffer.length > 16384) { child.kill(); return; }
            let newline;
            while ((newline = buffer.indexOf("\n")) !== -1) {
                const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
                let message; try { message = JSON.parse(line); } catch { continue; }
                if (message.type === "error") {
                    clearTimeout(timer);
                    const detail = String(message.message).slice(0, 300);
                    if (handedOff) sendUpdateProgress({ phase: "error", detail });
                    reject(new Error(detail));
                }
                if (message.type !== "ready" || ready) continue;
                ready = true;
                (async () => {
                    if (!updateSender(event) || !await requestUpdateSafety()) { child.kill(); throw new Error("call_active"); }
                    if (ended) throw new Error("installer_failed");
                    clearTimeout(timer);
                    handedOff = true;
                    child.unref(); child.stdout.unref();
                    stopSystemAudio(); stopWindowWatcher();
                    resolve({ ok: true });
                    setImmediate(() => electron.app.quit());
                })().catch(error => { clearTimeout(timer); reject(error); });
            }
        });
        child.on("close", () => { ended = true; clearTimeout(timer); if (!handedOff) reject(new Error("installer_failed")); });
    });
}

electron.ipcMain.handle("hugin:update", async (event, request) => {
    if (!updateSender(event)) return { ok: false, reason: "unavailable" };
    const action = request?.action;
    if (action === "release") {
        if (!updateRelease?.url) return { ok: false, reason: "unavailable" };
        await electron.shell.openExternal(updateRelease.url); return { ok: true };
    }
    if (!["check", "download", "install", "later", "ignore"].includes(action)) return { ok: false, reason: "invalid_action" };
    if (updateOperation) return { ok: false, reason: "busy" };
    updateOperation = action;
    try {
        if (action === "check") {
            const manual = request.manual === true;
            if (manual && Date.now() - updateLastManual < 60000) return { ok: false, reason: "retry_later" };
            if (manual) updateLastManual = Date.now();
            const result = await runUpdateHelper(manual ? ["check", "manual"] : ["check"]);
            const release = result.release;
            // Only expose the descriptive fields. Download URLs and paths are never accepted from the page.
            updateRelease = result.available && /^v?\d+\.\d+\.\d+$/.test(release?.tag_name) &&
                release.html_url === "https://github.com/rodrigoscode/Hugin/releases/tag/" + release.tag_name ? {
                    tag: release.tag_name, name: String(release.name || release.tag_name).slice(0, 200),
                    notes: String(release.body || "Esta versão não possui notas de lançamento.").slice(0, 32000),
                    published: release.published_at, url: release.html_url
                } : null;
            const prepared = result.prepared;
            updatePrepared = updateRelease && prepared?.version === updateRelease.tag.replace(/^v/, "") &&
                /^[a-f0-9]{64}$/.test(prepared.sha256) ? prepared : null;
            return { ok: true, current: HUGIN_VERSION, available: Boolean(updateRelease), notify: result.notify === true,
                release: updateRelease, prepared: Boolean(updatePrepared), warning: result.error };
        }
        if (action === "download") {
            if (!updateRelease) return { ok: false, reason: "unavailable" };
            updatePrepared = null;
            const prepared = await runUpdateHelper(["download"], sendUpdateProgress);
            if (prepared.version !== updateRelease.tag.replace(/^v/, "")) throw new Error("release_changed");
            updatePrepared = prepared;
            sendUpdateProgress({ phase: "ready" });
            return { ok: true, prepared: true };
        }
        if (action === "install") {
            if (!updatePrepared) return { ok: false, reason: "not_prepared" };
            if (!updateSafetyIdle(request.safety)) return { ok: false, reason: "call_active" };
            return await launchPreparedUpdate(event);
        }
        await runUpdateHelper([action]); return { ok: true };
    } catch (error) {
        log("update:", action, String(error.message));
        return { ok: false, reason: error.message === "call_active" ? "call_active" : "operation_failed", detail: String(error.message).slice(0, 300) };
    } finally { updateOperation = null; }
});
