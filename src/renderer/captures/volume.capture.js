/**
 * Markup, icons and styles of Discord's stage volume control.
 */

const CAPTURED_VOLUME_HTML = `<div><div class="rightTrayIcon_cb9592 container__2d263"><div class="volumeButtonSlider__2d263"><div class="mediaBar__2d263 vertical_b26b79"><div class="volumeSlider_cb9592 mediaBarInteraction_b26b79 mediaBarInteractionVolume_b26b79"><div class="mediaBarWrapper_b26b79 fakeEdges_b26b79 mediaBarWrapperVolume_b26b79"><div class="mediaBarProgress_b26b79 fakeEdges_b26b79" style="width: 100%;"><span class="mediaBarGrabber_b26b79"></span></div></div></div></div></div><div class="volumeButton__2d263" aria-label="Controle de volume" role="button" tabindex="0"><svg class="controlIcon_f1ceac" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="var(--interactive-icon-default)" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z" class=""></path><path fill="var(--interactive-icon-default)" d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" class=""></path></svg></div></div></div>`;

const CAPTURED_VOLUME_ICONS = {
    full: `<svg class="controlIcon_f1ceac" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="var(--interactive-icon-default)" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z" class=""></path><path fill="var(--interactive-icon-default)" d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" class=""></path></svg>`,
    half: `<svg class="controlIcon_f1ceac" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="var(--interactive-icon-default)" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.18 15.36c-.55.35-1.18-.12-1.18-.78v-.27c0-.36.2-.67.45-.93a2 2 0 0 0 0-2.76c-.24-.26-.45-.57-.45-.93v-.27c0-.66.63-1.13 1.18-.78a4 4 0 0 1 0 6.72Z" class=""></path></svg>`,
    muted: `<svg class="controlIcon_f1ceac" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="var(--interactive-icon-default)" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM22.7 8.3a1 1 0 0 0-1.4 0L19 10.58l-2.3-2.3a1 1 0 1 0-1.4 1.42L17.58 12l-2.3 2.3a1 1 0 0 0 1.42 1.4L19 13.42l2.3 2.3a1 1 0 0 0 1.4-1.42L20.42 12l2.3-2.3a1 1 0 0 0 0-1.4Z" class=""></path></svg>`
};

const CAPTURED_VOLUME_CSS = `:root {
  --brand-500: hsl(234.935 calc(1*85.556%) 64.706%/1);
  --brand-560: hsl(233.115 calc(1*49.194%) 51.373%/1);
  --interactive-icon-default: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --interactive-text-active: color-mix(in oklab,hsl(240 calc(1*4.478%) 86.863%/1) 100%,#000 0%);
  --interactive-text-default: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --opacity-black-28: hsl(0 calc(1*0%) 0%/0.2784313725490196);
  --opacity-black-68: hsl(0 calc(1*0%) 0%/0.6784313725490196);
  --primary-300-hsl: 228 calc(1*4.854%) 79.804%;
}

.controlIcon_f1ceac { color: var(--interactive-text-default); display: flex; height: 24px; width: 24px; }

.controlIcon_f1ceac.active_f1ceac, .controlIcon_f1ceac:hover { color: var(--interactive-text-active); }

.controlIcon_f1ceac.themeable_f1ceac { color: var(--interactive-text-default); }

.controlIcon_f1ceac.themeable_f1ceac.active_f1ceac, .controlIcon_f1ceac.themeable_f1ceac:hover { color: var(--interactive-text-active); }

.mediaBarInteraction_b26b79, .mediaBarInteractionDragging_b26b79 { align-items: center; align-self: stretch; cursor: pointer; display: flex; flex: 1 1 auto; margin: 0px 7px; position: relative; }

.mediaBarInteraction_b26b79:hover .mediaBarWrapper_b26b79, .mediaBarInteractionDragging_b26b79:hover .mediaBarWrapper_b26b79 { box-shadow: 0 1px 1px var(--opacity-black-28); }

.mediaBarInteraction_b26b79:hover .bubble_b26b79, .mediaBarInteractionDragging_b26b79:hover .bubble_b26b79 { opacity: 1; }

.mediaBarInteraction_b26b79:hover .mediaBarGrabber_b26b79 { background-color: var(--brand-560); transform: scale(1); }

.mediaBarInteraction_b26b79:hover .mediaBarPreview_b26b79 { opacity: 0.3; }

.mediaBarInteraction_b26b79:hover .bubble_b26b79, .mediaBarInteractionDragging_b26b79 .bubble_b26b79 { opacity: 1; }

.mediaBarInteractionDragging_b26b79 .mediaBarGrabber_b26b79 { background-color: var(--brand-560); transform: scale(1); }

.mediaBarInteractionVolume_b26b79 { align-self: center; background-color: var(--opacity-black-68); border-radius: 8px; flex: 0 0 auto; margin-block: 0px; margin-inline: 0px 4px; padding: 4px 8px; width: 72px; }

.vertical_b26b79 { align-items: center; display: flex; height: 54px; transform: rotate(-90deg); transform-origin: center top; width: 140px; }

.fakeEdges_b26b79 { position: relative; }

.fakeEdges_b26b79::after, .fakeEdges_b26b79::before { content: ""; height: 100%; position: absolute; top: 0px; width: 3px; z-index: 1; }

.fakeEdges_b26b79::before { border-radius: 3px 0px 0px 3px; inset-inline-start: -3px; }

.fakeEdges_b26b79::after { border-radius: 0px 3px 3px 0px; inset-inline-end: -3px; }

.mediaBarWrapper_b26b79 { flex: 1 1 auto; height: 6px; position: relative; }

.mediaBarWrapper_b26b79, .mediaBarWrapper_b26b79::after, .mediaBarWrapper_b26b79::before { background-color: hsl(var(--primary-300-hsl)/.3); }

.mediaBarWrapperVolume_b26b79 { display: flex; flex: 0 0 auto; justify-content: center; width: 72px; }

.mediaBarPreview_b26b79, .mediaBarProgress_b26b79 { height: 100%; inset-inline-start: 0px; position: absolute; top: 0px; }

.mediaBarPreview_b26b79, .mediaBarProgress_b26b79 { }

.mediaBarProgress_b26b79 { z-index: 3; }

.mediaBarGrabber_b26b79, .mediaBarProgress_b26b79, .mediaBarProgress_b26b79::after, .mediaBarProgress_b26b79::before { background-color: var(--brand-500); }

.mediaBarGrabber_b26b79 { border-radius: 5px; cursor: grab; height: 10px; inset-inline-end: 0px; margin-top: -5px; margin-inline-end: -5px; position: absolute; top: 50%; transform: scale(0); transform-origin: 50% 50%; width: 10px; z-index: 2; }

.full-motion .mediaBarGrabber_b26b79 { transition: transform 0.25s ease-in-out, background-color 0.25s linear; }

.enable-forced-colors .mediaBarGrabber_b26b79, .enable-forced-colors .mediaBarProgress_b26b79 { background-color: buttontext !important; }

.enable-forced-colors .mediaBarInteractionVolume_b26b79 { background-color: buttonface; }

.container__2d263 { align-items: center; display: flex; flex-direction: column; justify-content: flex-end; position: relative; }

.volumeButton__2d263 { cursor: pointer; line-height: 0; }

.volumeButtonSlider__2d263 { bottom: calc(100% + 16px); display: none; inset-inline: -78px 0px; position: absolute; app-region: no-drag; pointer-events: none; }

.volumeButtonSlider__2d263.sliderVisible__2d263 { display: initial; }

.mediaBar__2d263 { overflow: hidden; pointer-events: auto; }

@media (max-width: 456px) {
  .rightTrayIcon_cb9592 { margin-inline-start: 8px; }
}

.volumeSlider_cb9592 { margin-top: -16px; }`;
