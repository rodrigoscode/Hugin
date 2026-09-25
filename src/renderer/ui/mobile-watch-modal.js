/**
 * Mobile sharing modal for the current broadcast: direct VDO.Ninja link and ready-to-send text.
 */

let mobileWatchModal = null;

const MOBILE_WATCH_CSS = `
        .mobile-card {
            width: min(480px, calc(100vw - 32px));
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: #111214;
            color: #f2f3f5;
            box-shadow: 0 16px 40px rgba(0,0,0,.42);
            overflow: hidden;
            pointer-events: auto;
        }

        .mobile-head { padding: 22px 24px 14px; }
        .mobile-title { margin: 0; font-size: 20px; line-height: 24px; font-weight: 700; }
        .mobile-subtitle { margin: 8px 0 0; color: #b5bac1; font-size: 14px; line-height: 20px; }

        .mobile-body { padding: 0 24px 24px; }
        .mobile-label { margin: 14px 0 8px; color: #dbdee1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .02em; }
        .mobile-link {
            width: 100%;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 8px;
            background: #1e1f22;
            color: #dbdee1;
            font: 13px/18px "gg sans mono", Consolas, monospace;
            padding: 10px 12px;
            resize: none;
            outline: none;
        }

        .mobile-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
        .mobile-button {
            border: 0;
            border-radius: 8px;
            min-height: 38px;
            padding: 0 14px;
            color: white;
            background: #5865f2;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
        }
        .mobile-button.secondary { background: #2b2d31; color: #f2f3f5; }
        .mobile-button:hover { filter: brightness(1.08); }

        .mobile-privacy {
            margin-top: 16px;
            border-radius: 10px;
            background: rgba(250,166,26,.1);
            color: #f0b232;
            padding: 10px 12px;
            font-size: 13px;
            line-height: 18px;
        }

        .mobile-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid rgba(255,255,255,.08);
            background: #1e1f22;
            padding: 16px 24px;
        }

        @media (max-width: 420px) {
            .mobile-actions { grid-template-columns: 1fr; }
            .mobile-head, .mobile-body, .mobile-footer { padding-left: 16px; padding-right: 16px; }
        }
    `;

function mobileWatchMessage(link) {
    return `Estou transmitindo pelo Hugin. Assista no celular: ${link}`;
}

function copyMobileWatch(button, text, label) {
    native
        .copy(text)
        .then(() => {
            const original = button.textContent;
            button.textContent = label;
            setTimeout(() => {
                if (button.isConnected) button.textContent = original;
            }, 1400);
        })
        .catch(err => log("copy mobile link:", String(err)));
}

function closeMobileWatchModal() {
    const modal = mobileWatchModal;
    if (!modal) return;
    document.removeEventListener("keydown", modal.onKey, true);
    document.removeEventListener("click", modal.onOutsideClick, true);
    modal.backdrop.classList.remove("active");
    mobileWatchModal = null;
    setTimeout(() => modal.host.remove(), 200);
}

function openMobileWatchModal() {
    const link = mobileWatchUrl();
    if (!link) return;
    closeMobileWatchModal();
    closeLivePreview();

    const { host, root } = mountShadow(BASE_CSS + MOBILE_WATCH_CSS);
    host.setAttribute("data-hugin-mobile-watch", "");

    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    const card = document.createElement("section");
    card.className = "mobile-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "Assistir no celular");
    card.innerHTML = `
        <div class="mobile-head">
            <h2 class="mobile-title">Assistir no celular</h2>
            <p class="mobile-subtitle">Envie este acesso para alguem abrir no navegador do celular e assistir via VDO.Ninja.</p>
        </div>
        <div class="mobile-body">
            <div class="mobile-label">Link direto</div>
            <textarea class="mobile-link" rows="3" readonly></textarea>
            <div class="mobile-actions">
                <button class="mobile-button" type="button" data-copy-link>Copiar link</button>
                <button class="mobile-button secondary" type="button" data-copy-message>Copiar mensagem</button>
            </div>
            <div class="mobile-privacy">Privacidade: quem receber este link pode entrar na transmissao enquanto ela estiver ao vivo. Compartilhe apenas com quem deve assistir.</div>
        </div>
        <div class="mobile-footer">
            <button class="mobile-button secondary" type="button" data-close>Fechar</button>
        </div>`;

    const message = mobileWatchMessage(link);
    card.querySelector(".mobile-link").value = link;
    card.querySelector("[data-copy-link]").addEventListener("click", event => copyMobileWatch(event.currentTarget, link, "Link copiado"));
    card.querySelector("[data-copy-message]").addEventListener("click", event => copyMobileWatch(event.currentTarget, message, "Mensagem copiada"));
    card.querySelector("[data-close]").addEventListener("click", closeMobileWatchModal);

    const onKey = event => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        closeMobileWatchModal();
    };

    const onOutsideClick = event => {
        if (inTitleBar(event)) return;
        const path = event.composedPath?.() ?? [];
        if (path.includes(host)) return;
        deferClose(closeMobileWatchModal);
    };

    mobileWatchModal = { host, backdrop, onKey, onOutsideClick };
    backdrop.appendChild(card);
    root.appendChild(backdrop);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("click", onOutsideClick, true);
    requestAnimationFrame(() => backdrop.classList.add("active"));
}
