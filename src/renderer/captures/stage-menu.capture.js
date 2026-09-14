/**
 * Markup and styles of the stage context menu, its sliders and the zoom panel.
 */

const CAPTURED_VIEWER_MENU_HTML = `<div class="menu_c1e9c4 fixed_c1e9c4" role="menu" id="stream-context" tabindex="-1" aria-label="Ações de transmissão" style="--custom-menu-viewport-padding: 48px; --custom-menu-flexible-min-width: 144px;"><div class="scroller_c1e9c4 scrollerWithScrollbar_c1e9c4 scrollbarGutterStable_d125d2 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll;"><div role="group"><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitem" id="stream-context-watch" tabindex="-1" data-menu-item="true" data-marquee-active="false"><div class="iconContainerLeft_c1e9c4 iconContainer_c1e9c4"><svg aria-hidden="true" class="icon_c1e9c4" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm6.3.3a1 1 0 0 1 1.4 0L12 7.58l2.3-2.3a1 1 0 1 1 1.4 1.42L13.42 9l2.3 2.3a1 1 0 0 1-1.42 1.4L12 10.42l-2.3 2.3a1 1 0 0 1-1.4-1.42L10.58 9l-2.3-2.3a1 1 0 0 1 0-1.4Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M13 19.5c0 .28.22.5.5.5H15a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h1.5a.5.5 0 0 0 .5-.5v-2c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v2Z" class=""></path></svg></div><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Parar de assistir</span></div></div></div></div><div role="separator" class="separator_c1e9c4" style="--custom-menu-separator-margin: 8px 0;"></div><div role="group"><div class="item_c1e9c4 text-sm/medium_c1e9c4 checkboxContainer_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemcheckbox" id="stream-context-mute" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Silenciar</span></div></div><div class="iconContainer_c1e9c4"><div class="checkboxOption__714a9"><div class="checkboxIndicator__714a9" aria-hidden="true"><svg class="checkmark__714a9" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle class="dot__714a9" cx="10" cy="10" r="1.1" fill="currentColor"></circle></svg><svg class="checkStroke__714a9" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19.06 6.94a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.12L10 13.88l6.94-6.94a1.5 1.5 0 0 1 2.12 0Z" clip-rule="evenodd" class=""></path></svg></div></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 colorDefault_c1e9c4 hideInteraction_c1e9c4 nonInteractive_c1e9c4" role="menuitem" id="stream-context-user-volume" tabindex="-1"><div class="labelContainer_c1e9c4"><div class="label_c1e9c4">Volume da transmissão</div></div><div class="sliderContainer__65039"><div class="container__5a838" data-layout="vertical" data-disabled="false"><div class="control__5a838"><div class="slider_a562c8 slider__65039 mini_a562c8" aria-valuemin="0" aria-valuemax="200" aria-valuenow="100" aria-disabled="false" aria-orientation="horizontal" aria-label="Volume da transmissão" aria-invalid="false" role="slider" tabindex="-1" style="--grabber-size: 16px; --bar-size: 4px;"><div class="track_a562c8"></div><div class="bar_a562c8"><div class="barFill_a562c8" style="width: 50%;"></div></div><div class="track_a562c8"><div class="grabber_a562c8" style="left: 50%;"></div><span class="hiddenVisually_b18fe2">100%</span></div></div></div></div></div></div></div></div></div>`;

const CAPTURED_MENU_SLIDER_CSS = `
:host {
    --text-default: hsl(240 calc(1*4.348%) 95.49%/1);
    --space-4: 4px;
    --slider-track-background: hsl(234 calc(1*5.319%) 36.863%/1);
    --background-brand: hsl(234.935 calc(1*85.556%) 64.706%/1);
    --border-normal: hsl(240 calc(1*4%) 60.784%/0.2);
    --shadow-border: 0 0 0 1px hsl(none 0% 100%/0.08);
    --shadow-ledge: 0 2px 0 0 hsl(none 0% 0%/0.05),0 1.5px 0 0 hsl(none 0% 0%/0.05),0 1px 0 0 hsl(none 0% 0%/0.16);
    --shadow-low: 0 1px 4px 0 hsl(none 0% 0%/0.14);
}
.hiddenVisually_b18fe2, .showOnFocus_b18fe2:not(:focus-within) { clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; user-select: none; white-space: nowrap; width: 1px; }
.defaultColor__4bd52 { color: var(--text-default); }
.text-xs\\/normal_cf4812 { font-family: var(--font-primary); font-size: 12px; font-weight: 400; line-height: 1.33333; }
.text-sm\\/medium_cf4812 { font-family: var(--font-primary); font-size: 14px; font-weight: 500; line-height: 1.28571; }
.text-sm\\/medium_c1e9c4 { font-family: var(--font-primary); font-size: 14px; font-weight: 500; line-height: 1.28571; }
.fixed_c1e9c4 { width: 220px; }
.subtext_c1e9c4 { margin-top: 2px; white-space: normal; }
.sliderContainer__65039 { box-sizing: border-box; overflow: visible; padding: 0px 8px; }
.slider__65039 { position: relative; top: -4px; }
.container__5a838 { --custom-description-max-width: 70ch; flex-grow: 1; interpolate-size: allow-keywords; display: grid; grid-template-areas: "labels" "control" "helper-text"; }
.control__5a838 { display: flex; flex-direction: column; gap: var(--space-4); grid-area: control; min-width: 0px; }
.slider_a562c8 { height: 40px; position: relative; width: 100%; }
.mini_a562c8 { height: 20px; }
.mini_a562c8 .bar_a562c8 { height: 6px; top: 17px; }
.mini_a562c8 .grabber_a562c8 { border-radius: 50%; height: 12px; margin-inline-start: -7px; margin-top: 3px; width: 12px; }
.bar_a562c8 { background-color: var(--slider-track-background); border-radius: 4px; display: block; height: 8px; overflow: hidden; position: relative; top: 16px; }
.barFill_a562c8 { background: var(--control-brand-foreground-new); height: 100%; }
.track_a562c8 { --custom-track-inset: 5px; position: absolute; top: 0px; inset-inline: var(--custom-track-inset); bottom: 0px; }
.grabber_a562c8 { background-color: var(--white); border: 1px solid var(--border-strong); border-radius: 3px; box-shadow: var(--shadow-border),var(--shadow-ledge),var(--shadow-low); cursor: ew-resize; height: 24px; margin-inline-start: -5px; margin-top: -13px; top: 50%; width: 10px; }
.grabber_a562c8, .mark_a562c8 { inset-inline-start: 0px; position: absolute; }
.mini_a562c8, .slider_a562c8 { height: calc(24px + var(--bar-offset)); --grabber-size: 16px; --bar-size: 4px; --bar-offset: 0px; }
.mini_a562c8 .grabber_a562c8, .slider_a562c8 .grabber_a562c8 { border: 1px solid var(--border-normal); border-radius: 50%; box-shadow: var(--shadow-low); box-sizing: border-box; height: var(--grabber-size); margin-inline-start: calc(var(--grabber-size)/-2); margin-top: calc(var(--grabber-size)/-2 + var(--bar-offset)/2); width: var(--grabber-size); }
.mini_a562c8 .bar_a562c8, .slider_a562c8 .bar_a562c8 { background-color: var(--slider-track-background); height: var(--bar-size); top: calc((24px - var(--bar-size))/2 + var(--bar-offset)); }
.mini_a562c8 .barFill_a562c8, .slider_a562c8 .barFill_a562c8 { background-color: var(--background-brand); border: 1px solid rgba(255, 255, 255, 0.1); }
`;

const CAPTURED_ZOOM_CSS = `
.controlsWithChildren__07fe9 { background: var(--background-scrim); border-radius: 12px; margin: -4px; padding: 4px; }
.minimap__07fe9 { border-radius: 8px; cursor: grab; height: var(--custom-zoom-minimap-height); opacity: 1; overflow: hidden; position: relative; transition: opacity 0.2s ease-in-out; width: var(--custom-zoom-minimap-width); }
.minimap__07fe9:active { cursor: grabbing; }
.minimapVideo__07fe9 { object-fit: contain; }
.minimapIndicator__07fe9, .minimapVideo__07fe9 { height: 100%; inset-inline-start: 0px; pointer-events: none; position: absolute; top: 0px; width: 100%; }
.minimapIndicator__07fe9::after { background: var(--opacity-blurple-16); border: 2px solid var(--opacity-blurple-64); border-radius: 8px; box-sizing: border-box; content: ""; height: var(--custom-zoom-indicator-height); inset-inline-start: var(--custom-zoom-indicator-left); pointer-events: none; position: absolute; top: var(--custom-zoom-indicator-top); width: var(--custom-zoom-indicator-width); }
.container__5a838 { --custom-description-max-width: 70ch; flex-grow: 1; interpolate-size: allow-keywords; display: grid; grid-template-areas: "labels" "control" "helper-text"; }
.control__5a838 { display: flex; flex-direction: column; gap: var(--space-4); grid-area: control; min-width: 0px; }
.slider_a562c8 { height: 40px; position: relative; width: 100%; }
.bar_a562c8 { background-color: var(--slider-track-background); border-radius: 4px; display: block; height: 8px; overflow: hidden; position: relative; top: 16px; }
.barFill_a562c8 { background: var(--control-brand-foreground-new); height: 100%; }
.track_a562c8 { --custom-track-inset: 5px; position: absolute; top: 0px; inset-inline: var(--custom-track-inset); bottom: 0px; }
.grabber_a562c8 { background-color: var(--white); border: 1px solid var(--border-strong); border-radius: 3px; box-shadow: var(--shadow-border),var(--shadow-ledge),var(--shadow-low); cursor: ew-resize; height: 24px; margin-inline-start: -5px; margin-top: -13px; top: 50%; width: 10px; }
.grabber_a562c8, .mark_a562c8 { inset-inline-start: 0px; position: absolute; }
.mini_a562c8, .slider_a562c8 { height: calc(24px + var(--bar-offset)); --grabber-size: 16px; --bar-size: 4px; --bar-offset: 0px; }
.mini_a562c8 .grabber_a562c8, .slider_a562c8 .grabber_a562c8 { border: 1px solid var(--border-normal); border-radius: 50%; box-shadow: var(--shadow-low); box-sizing: border-box; height: var(--grabber-size); margin-inline-start: calc(var(--grabber-size)/-2); margin-top: calc(var(--grabber-size)/-2 + var(--bar-offset)/2); width: var(--grabber-size); }
.mini_a562c8 .bar_a562c8, .slider_a562c8 .bar_a562c8 { background-color: var(--slider-track-background); height: var(--bar-size); top: calc((24px - var(--bar-size))/2 + var(--bar-offset)); }
.mini_a562c8 .barFill_a562c8, .slider_a562c8 .barFill_a562c8 { background-color: var(--background-brand); border: 1px solid rgba(255, 255, 255, 0.1); }
.videoContainer__1505a { bottom: 0px; contain: layout style paint; height: 100%; position: absolute; top: 0px; inset-inline: 0px; width: 100%; will-change: transform, transform-origin; }
.videoContainer__1505a.zoomed__1505a { transform: translate(var(--custom-pan-x),var(--custom-pan-y)) scale(var(--custom-zoom-scale)); transform-origin: center center; }
.zoomEnabled__1505a { cursor: grab; }
.zoomDragging__1505a { cursor: grabbing; }
`;
