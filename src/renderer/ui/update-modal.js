/** Update UI uses text nodes for release notes and never starts an installer directly. */
const UPDATE_CSS = `
    .update-shade { position:fixed; inset:0; display:grid; place-items:center; padding:24px; background:#0009; pointer-events:auto; }
    .update-dialog { width:min(540px,100%); max-height:90vh; overflow:auto; border-radius:12px; padding:24px;
        background:var(--background-primary,#313338); color:var(--text-normal,#dbdee1); box-shadow:0 16px 48px #0008; font-size:14px; }
    .update-header { display:flex; gap:14px; align-items:center; } .update-icon { width:56px; height:56px; image-rendering:pixelated; }
    .update-dialog h2 { font-size:20px; margin:0 0 6px; color:var(--header-primary,#fff); }
    .update-project { display:flex; align-items:center; gap:6px; opacity:.8; }
    .update-notes { white-space:pre-wrap; overflow-wrap:anywhere; max-height:260px; overflow:auto; padding:14px; border-radius:6px;
        background:var(--background-secondary,#2b2d31); line-height:1.5; }
    .update-actions { display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; margin-top:18px; }
    .update-dialog button { font:inherit; border:0; border-radius:4px; padding:9px 12px; cursor:pointer;
        background:var(--background-secondary,#2b2d31); color:inherit; }
    .update-dialog button:focus-visible { outline:2px solid #00a8fc; outline-offset:2px; }
    .update-dialog button[data-primary] { background:#5865f2; color:white; }
    .update-dialog button:disabled { opacity:.5; cursor:default; }
    .update-dialog progress { display:block; width:100%; margin-top:12px; accent-color:#5865f2; }
    .update-status { min-height:36px; line-height:1.4; margin-top:12px; }
`;
let updateInfo = null, updateModal = null, updateUIBusy = false, updateUIStarted = false;
let updatePostponePending = false;
let updateUIPhase = "", updateDownloadProgress = null;

function updatePlaybackSafety() {
    try {
        if (typeof stores.selectedChannel?.getVoiceChannelId !== "function") return { known: false, idle: false };
        return { known: true, idle: !stores.selectedChannel.getVoiceChannelId() && !voiceChannelId() &&
            !state.channelId && !state.broadcasting && !state.watching && !state.probing &&
            streamFrames.size === 0 && releasingStreamFrames.size === 0 };
    } catch { return { known: false, idle: false }; }
}

function closeUpdateModal() {
    if (!updateModal) return;
    clearInterval(updateModal.timer);
    document.removeEventListener("keydown", updateModal.onKey, true);
    const previous = updateModal.previous;
    updateModal.host.remove(); updateModal = null;
    previous?.focus?.();
}

function updateError(result) {
    if (result?.reason === "call_active") return "Saia da chamada e encerre a reprodução antes de instalar. Se o estado da chamada não puder ser confirmado, a instalação fica bloqueada.";
    if (result?.reason === "busy") return "Já há uma operação de atualização em andamento.";
    if (result?.reason === "retry_later") return "Aguarde um minuto antes de verificar novamente.";
    return "Não foi possível concluir a atualização. Tente novamente. " + (result?.detail || "Confira sua conexão com a internet.");
}

function refreshUpdateModal() {
    if (!updateModal) return;
    const { primary, status } = updateModal;
    primary.textContent = updateInfo?.prepared ? "Reiniciar e atualizar" : "Baixar atualização";
    const safety = updatePlaybackSafety();
    primary.disabled = updateUIBusy || !updateInfo?.available || (updateInfo.prepared && !safety.idle);
    updateModal.host.shadowRoot.querySelector("[data-ignore]").disabled = updateUIBusy;
    if (updateUIBusy && !updateModal.error) status.textContent = updateUIPhase === "install" ? "Preparando reinicialização…" : "Baixando e verificando atualização…";
    if (updateUIBusy && updateUIPhase === "download" && updateDownloadProgress) {
        const { done, total } = updateDownloadProgress;
        updateModal.progress.hidden = false; updateModal.progress.max = total; updateModal.progress.value = Math.min(done, total);
        status.textContent = `Baixando atualização… ${Math.floor(Math.min(done / total, 1) * 100)}%`;
    }
    if (!updateUIBusy && !updateModal.error) status.textContent = updateInfo?.prepared ?
        (safety.idle ? "Tudo pronto. A instalação fechará e reabrirá o Discord." :
            safety.known ? "Atualização pronta. Encerre a chamada e a reprodução para instalar." :
                "Atualização pronta. Ainda não foi possível confirmar o estado da chamada.") :
        "O download não interrompe sua chamada. A instalação exige reiniciar o Discord.";
}

async function performUpdate() {
    if (updateUIBusy || !updateInfo?.available) return;
    const action = updateInfo.prepared ? "install" : "download";
    if (action === "install" && !updatePlaybackSafety().idle) return;
    updateUIBusy = true;
    updateUIPhase = action; updateDownloadProgress = null;
    if (updateModal) { updateModal.error = false; updateModal.status.textContent = action === "install" ? "Preparando reinicialização…" : "Baixando e verificando atualização…"; }
    refreshUpdateModal();
    try {
        const result = await native.update({ action, safety: updatePlaybackSafety() });
        if (!result?.ok) throw result;
        if (action === "download") updateInfo.prepared = true;
    } catch (result) {
        if (updateModal) { updateModal.error = true; updateModal.status.textContent = updateError(result); }
        else showDiagnosticStatus(updateError(result), 8000);
    } finally {
        updateUIBusy = false; updateUIPhase = ""; refreshUpdateModal();
        if (updatePostponePending) {
            updatePostponePending = false;
            native.update({ action: "later" }).catch(() => {});
        }
    }
}

function openUpdateModal() {
    if (updateModal || !updateInfo?.available) return;
    const { host, root } = mountShadow(BASE_CSS + UPDATE_CSS);
    host.setAttribute("data-hugin-update-modal", "");
    const shade = document.createElement("div"); shade.className = "update-shade";
    const dialog = document.createElement("section"); dialog.className = "update-dialog";
    dialog.setAttribute("role", "dialog"); dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-labelledby", "hugin-update-title");
    // Static local branding only; release content is assigned with textContent below.
    dialog.innerHTML = `<div class="update-header"><img class="update-icon" alt="Hugin"><div><h2 id="hugin-update-title">Atualização disponível</h2>
        <div class="update-project"><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38l-.01-1.49c-2.23.48-2.7-1.08-2.7-1.08-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 018 3.71c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.08-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.14.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>rodrigoscode/Hugin</div></div></div>
        <p data-version></p><h3 data-release-name></h3><div class="update-notes" tabindex="0"></div>
        <progress hidden aria-label="Download da atualização"></progress><div class="update-status" role="status" aria-live="polite"></div>
        <div class="update-actions"><button data-github>Ver no GitHub</button><button data-ignore>Ignorar esta versão</button>
        <button data-later>Depois</button><button data-primary></button></div>`;
    dialog.querySelector("img").src = HUGIN_ICON;
    dialog.querySelector("[data-version]").textContent = `Sua versão: ${VERSION} → ${updateInfo.release.tag}`;
    dialog.querySelector("[data-release-name]").textContent = updateInfo.release.name;
    dialog.querySelector(".update-notes").textContent = updateInfo.release.notes;
    const later = () => {
        const busy = updateUIBusy; closeUpdateModal();
        if (busy) updatePostponePending = true; else native.update({ action: "later" }).catch(() => {});
    };
    dialog.querySelector("[data-later]").onclick = later;
    dialog.querySelector("[data-ignore]").onclick = async () => {
        if (updateUIBusy) return;
        try {
            const result = await native.update({ action: "ignore" });
            if (!result?.ok) throw result;
            closeUpdateModal();
        } catch (result) { if (updateModal) { updateModal.error = true; updateModal.status.textContent = updateError(result); } }
    };
    dialog.querySelector("[data-github]").onclick = () => native.update({ action: "release" }).catch(() => {});
    const primary = dialog.querySelector("[data-primary]"); primary.onclick = performUpdate;
    const onKey = event => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); later(); }
        if (event.key === "Tab") {
            const focusable = [...dialog.querySelectorAll("button:not(:disabled),[tabindex='0']")];
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (event.shiftKey && root.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && root.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    };
    updateModal = { host, primary, status: dialog.querySelector(".update-status"), progress: dialog.querySelector("progress"),
        error: false, previous: document.activeElement, onKey, timer: setInterval(refreshUpdateModal, 1000) };
    document.addEventListener("keydown", onKey, true);
    shade.append(dialog); root.append(shade); refreshUpdateModal(); dialog.querySelector("[data-later]").focus();
}

async function checkHuginUpdates(manual = false) {
    if (!native.update || updateUIBusy) return;
    if (manual && updateInfo?.available) { openUpdateModal(); return; }
    updateUIBusy = true;
    try {
        const result = await native.update({ action: "check", manual });
        if (!result?.ok) { if (manual) showDiagnosticStatus(updateError(result), 8000); return; }
        updateInfo = result;
        if (result.available && (manual || result.notify)) {
            openUpdateModal();
        } else if (manual) showDiagnosticStatus(result.warning ? "A release mais recente ainda não possui um instalador verificável." : "O Hugin já está atualizado.", 5000);
    } catch { if (manual) showDiagnosticStatus("Não foi possível verificar atualizações. Tente novamente.", 6000); }
    finally { updateUIBusy = false; refreshUpdateModal(); }
}

function appendUpdateMenuItem(menu, onSelect) {
    if (!native.update) return;
    const button = document.createElement("button"); button.type = "button";
    button.setAttribute("role", "menuitem"); button.setAttribute("data-hugin-diagnostic-action", "");
    button.textContent = updateInfo?.available ? "Atualização disponível" : "Verificar atualizações";
    button.onclick = event => { event.preventDefault(); event.stopPropagation(); onSelect(); checkHuginUpdates(true); };
    menu.append(button);
}

function watchUpdates() {
    if (updateUIStarted || !native.update) return;
    updateUIStarted = true;
    native.onUpdateSafetyRequest?.(token => native.updateSafetyReply(token, updatePlaybackSafety()));
    native.onUpdateProgress?.(progress => {
        if (progress.phase === "error") {
            if (updateModal) { updateModal.error = true; updateModal.status.textContent = updateError(progress); }
            else showDiagnosticStatus(updateError(progress), 10000);
            return;
        }
        if (!updateModal || progress.phase !== "downloading") return;
        const { total, done } = progress;
        if (!Number.isFinite(total) || !Number.isFinite(done) || total <= 0) return;
        updateDownloadProgress = { total, done };
        updateModal.progress.hidden = false; updateModal.progress.max = total; updateModal.progress.value = Math.min(done, total);
        updateModal.status.textContent = `Baixando atualização… ${Math.floor(Math.min(done / total, 1) * 100)}%`;
    });
    whenDiscordMounted().then(mounted => { if (mounted) setTimeout(() => checkHuginUpdates(), 15000); }).catch(() => {});
    setInterval(() => { if (!updateModal) checkHuginUpdates(); }, 6 * 60 * 60 * 1000);
}
