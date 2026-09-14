/**
 * Markup and styles of Discord's live-stream menu and its quality submenu.
 */

const CAPTURED_STREAM_MENU_HTML = `<div class="menu_c1e9c4 flexible_c1e9c4" role="menu" id="manage-streams" tabindex="-1" aria-label="Parar de transmitir" style="--custom-menu-viewport-padding: 48px; --custom-menu-flexible-min-width: 144px;"><div class="scroller_c1e9c4 scrollerWithScrollbar_c1e9c4 scrollbarGutterStable_d125d2 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll;"><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDanger_c1e9c4 colorDefault_c1e9c4" role="menuitem" id="manage-streams-stop-streaming" tabindex="-1" data-menu-item="true" data-marquee-active="false"><div class="iconContainerLeft_c1e9c4 iconContainer_c1e9c4"><svg aria-hidden="true" class="icon_c1e9c4" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm6.3.3a1 1 0 0 1 1.4 0L12 7.58l2.3-2.3a1 1 0 1 1 1.4 1.42L13.42 9l2.3 2.3a1 1 0 0 1-1.42 1.4L12 10.42l-2.3 2.3a1 1 0 0 1-1.4-1.42L10.58 9l-2.3-2.3a1 1 0 0 1 0-1.4Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M13 19.5c0 .28.22.5.5.5H15a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h1.5a.5.5 0 0 0 .5-.5v-2c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v2Z" class=""></path></svg></div><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Parar de transmitir</span></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitem" id="manage-streams-change-windows" tabindex="-1" data-menu-item="true" data-marquee-active="false"><div class="iconContainerLeft_c1e9c4 iconContainer_c1e9c4"><svg aria-hidden="true" class="icon_c1e9c4" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm16 3a1 1 0 0 0-.3-.7l-3-3a1 1 0 1 0-1.4 1.4L14.58 7H13a6 6 0 0 0-6 6 1 1 0 1 0 2 0 4 4 0 0 1 4-4h1.59l-1.3 1.3a1 1 0 0 0 1.42 1.4l3-3A1 1 0 0 0 18 8Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M13 19.5c0 .28.22.5.5.5H15a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h1.5a.5.5 0 0 0 .5-.5v-2c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v2Z" class=""></path></svg></div><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Alterar a Transmissão</span></div></div></div><div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" aria-expanded="false" aria-haspopup="true" role="menuitem" id="manage-streams-stream-settings" tabindex="-1" data-menu-item="true" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Qualidade da transmissão</span></div></div><div class="iconContainer_c1e9c4"><svg class="caret_c1e9c4" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.3 5.3a1 1 0 0 0 0 1.4l5.29 5.3-5.3 5.3a1 1 0 1 0 1.42 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.42 0Z" class=""></path></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 checkboxContainer_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemcheckbox" id="manage-streams-stream-settings-audio-enable" tabindex="-1" aria-checked="true" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Compartilhar áudio da transmissão</span></div></div><div class="iconContainer_c1e9c4"><div class="checkboxOption__714a9" data-selected="true"><div class="checkboxIndicator__714a9" aria-hidden="true"><svg class="checkmark__714a9" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle class="dot__714a9" cx="10" cy="10" r="1.1" fill="currentColor"></circle></svg><svg class="checkStroke__714a9" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19.06 6.94a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.12L10 13.88l6.94-6.94a1.5 1.5 0 0 1 2.12 0Z" clip-rule="evenodd" class=""></path></svg></div></div></div></div><div role="separator" class="separator_c1e9c4" style="--custom-menu-separator-margin: 8px 0;"></div><div role="group"><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDanger_c1e9c4 colorDefault_c1e9c4" role="menuitem" id="manage-streams-report-stream-problem" tabindex="-1" data-menu-item="true" data-marquee-active="false"><div class="iconContainerLeft_c1e9c4 iconContainer_c1e9c4"><svg aria-hidden="true" class="icon_c1e9c4" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="transparent" class=""></circle><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1.44-15.94L13.06 14a1.06 1.06 0 0 1-2.12 0l-.38-6.94a1 1 0 0 1 1-1.06h.88a1 1 0 0 1 1 1.06Zm-.19 10.69a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z" clip-rule="evenodd" class=""></path></svg></div><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Relatar um problema</span></div></div></div></div></div></div>`;

const CAPTURED_STREAM_MENU_CSS = `:root {
  --app-frame-border: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --background-feedback-critical: color-mix(in oklab,hsl(355.636 calc(1*64.706%) 50%/0.0784313725490196) 100%,hsl(0 0% 0%/0.0784313725490196) 0%);
  --background-mod-subtle: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --background-surface-higher: color-mix(in oklab,hsl(240 calc(1*5.882%) 16.667%/1) 100%,#000 0%);
  --border-focus: color-mix(in oklab,hsl(213.043 calc(1*86.25%) 68.627%/1) 100%,#000 0%);
  --border-strong: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.4392156862745098) 100%,hsl(0 0% 0%/0.4392156862745098) 0%);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --checkbox-background-default: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --checkbox-background-hover: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --checkbox-background-selected-default: hsl(234.935 calc(1*85.556%) 64.706%/1);
  --checkbox-background-selected-hover: hsl(232.941 calc(1*46.667%) 50%/1);
  --checkbox-border-default: hsl(240 calc(1*4%) 60.784%/0.6392156862745098);
  --checkbox-border-hover: hsl(240 calc(1*4%) 60.784%/0.8);
  --checkbox-border-selected-default: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --checkbox-border-selected-hover: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --checkbox-icon-active: hsl(0 calc(1*0%) 100%/1);
  --control-brand-foreground-new: color-mix(in oklab,hsl(229.381 calc(1*96.581%) 77.059%/1) 100%,#000 0%);
  --custom-menu-flexible-min-width: 144px;
  --custom-menu-separator-margin: 8px;
  --custom-menu-viewport-padding: 48px;
  --guild-boosting-pink: hsl(302.143 calc(1*100%) 72.549%/1);
  --icon-feedback-critical: color-mix(in oklab,hsl(1.905 calc(1*90%) 72.549%/1) 100%,#000 0%);
  --interactive-background-hover: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --interactive-text-active: color-mix(in oklab,hsl(0 calc(1*0%) 98.431%/1) 100%,#000 0%);
  --interactive-text-default: color-mix(in oklab,hsl(231.429 calc(1*4.348%) 68.431%/1) 100%,#000 0%);
  --menu-border-width: 1px;
  --menu-scroller-block-padding: 8px;
  --radius-sm: 8px;
  --radius-xs: 4px;
  --reference-position-layer-max-height: 902px;
  --scrollbar-thin-thumb: color-mix(in oklab,hsl(234.545 calc(1*5.473%) 39.412%/1) 100%,#000 0%);
  --scrollbar-thin-track: color-mix(in oklab,hsl(0 calc(1*0%) 0%/0) 100%,hsl(0 0% 0%/0) 0%);
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --text-brand: color-mix(in oklab,hsl(230.625 calc(1*91.429%) 72.549%/1) 100%,#000 0%);
  --text-feedback-critical: color-mix(in oklab,hsl(1.905 calc(1*90%) 72.549%/1) 100%,#000 0%);
  --text-muted: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --text-strong: color-mix(in oklab,hsl(0 calc(1*0%) 98.431%/1) 100%,#000 0%);
  --text-subtle: color-mix(in oklab,hsl(231.429 calc(1*4.348%) 68.431%/1) 100%,#000 0%);
  --white: hsl(0 calc(1*0%) 100%/1);
}

.scrollerBase_d125d2 { box-sizing: border-box; flex: 1 1 auto; min-height: 0px; position: relative; }

.scrollbarGutterStable_d125d2 { scrollbar-gutter: stable; }

.auto_d125d2, .none_d125d2, .thin_d125d2 { }

.thin_d125d2::-webkit-scrollbar { height: 8px; width: 8px; }

.thin_d125d2::-webkit-scrollbar-track { background-color: var(--scrollbar-thin-track); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-color: var(--scrollbar-thin-track); }

.thin_d125d2::-webkit-scrollbar-thumb { background-clip: padding-box; background-color: var(--scrollbar-thin-thumb); border: 2px solid transparent; border-radius: 4px; min-height: 40px; }

.thin_d125d2::-webkit-scrollbar-corner { background-color: transparent; }

.no-webkit-scrollbar .thin_d125d2 { scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track); scrollbar-width: thin; }

.no-webkit-scrollbar .thin_d125d2.fade_d125d2.scrolling_d125d2, .no-webkit-scrollbar .thin_d125d2.fade_d125d2:hover { scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track); }

.checkboxOption__714a9 { align-items: start; border-radius: var(--radius-sm); display: flex; gap: var(--space-12); max-width: 100%; }

.checkboxIndicator__714a9 { align-items: center; background-color: var(--checkbox-background-default); border-width: 1px; border-style: solid; border-image: initial; border-color: var(--checkbox-border-default); border-radius: var(--radius-xs); box-sizing: border-box; display: flex; flex: 0 0 auto; height: 20px; justify-content: center; position: relative; width: 20px; }

.checkStroke__714a9 { opacity: 0; }

.checkStroke__714a9, .checkmark__714a9 { color: var(--checkbox-icon-active); display: block; height: 100%; inset: 0px; position: absolute; transform-box: fill-box; transform-origin: 50% 50%; width: 100%; }

.dot__714a9 { opacity: 0; transform-origin: 10px 10px; }

.checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 { background-color: var(--checkbox-background-selected-default); border-color: var(--checkbox-border-selected-default); }

.checkboxOption__714a9[data-selected] .checkStroke__714a9, .checkboxOption__714a9[data-selected] .checkmark__714a9 { color: var(--checkbox-icon-active); opacity: 1; }

.animateIn__714a9 .dot__714a9 { animation: 0.3s cubic-bezier(0.65, 0, 0.83, 0.83) 0s 1 normal forwards running dotGrow__714a9; }

.animateIn__714a9 .checkStroke__714a9 { animation: 0.3s cubic-bezier(0.65, 0, 0.83, 0.83) 0s 1 normal both running checkDraw__714a9; }

.animateOut__714a9 .dot__714a9 { animation: 0.12s cubic-bezier(0.65, 0, 0.83, 0.84) 0s 1 normal backwards running dotShrink__714a9; }

.animateOut__714a9 .checkStroke__714a9 { animation: 0.12s cubic-bezier(0.65, 0, 0.83, 0.84) 0s 1 normal backwards running checkUndraw__714a9; }

.checkboxOption__714a9:not([data-selected]):hover:not([data-disabled]) { cursor: pointer; }

.checkboxOption__714a9:not([data-selected]):hover:not([data-disabled]) .checkboxIndicator__714a9 { background-color: var(--checkbox-background-hover); border-color: var(--checkbox-border-hover); }

.checkboxOption__714a9[data-selected]:hover:not([data-disabled]) { cursor: pointer; }

.checkboxOption__714a9[data-selected]:hover:not([data-disabled]) .checkboxIndicator__714a9 { background-color: var(--checkbox-background-selected-hover); border-color: var(--checkbox-border-selected-hover); }

.checkboxOption__714a9[data-disabled] { cursor: not-allowed; opacity: 0.5; }

.enable-forced-colors .checkboxIndicator__714a9 { background-color: buttonface !important; border-color: buttontext !important; }

.enable-forced-colors .checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 { background-color: highlight !important; border-color: highlighttext !important; }

.enable-forced-colors .checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 svg * { fill: highlighttext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] { opacity: 1; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .checkboxIndicator__714a9 { background-color: transparent !important; border-color: graytext !important; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .checkboxIndicator__714a9 svg * { fill: graytext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled][data-selected] .checkboxIndicator__714a9 svg * { fill: graytext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .label__714a9, .enable-forced-colors .checkboxOption__714a9[data-disabled] .label__714a9 > div { color: graytext; }

.container_a4ac84 { min-width: 0px; overflow: hidden; }

.text_a4ac84 { display: inline-block; inset-inline-start: 0px; max-width: 100%; overflow: hidden; position: relative; text-overflow: ellipsis; vertical-align: top; white-space: nowrap; }

.row_a4ac84:hover .container_a4ac84[data-marquee-overflow="true"], .row_a4ac84[data-marquee-active="true"] .container_a4ac84[data-marquee-overflow="true"] { mask-image: linear-gradient(90deg, transparent, rgb(0, 0, 0) 8px, rgb(0, 0, 0) calc(100% - 8px), transparent); }

.row_a4ac84:hover .container_a4ac84[data-marquee-overflow="true"] .text_a4ac84, .row_a4ac84[data-marquee-active="true"] .container_a4ac84[data-marquee-overflow="true"] .text_a4ac84 { inset-inline-start: calc(var(--custom-marquee-overflow, 0px)*-1); max-width: none; overflow: visible; transition: inset-inline-start 2s linear; }

.menu_c1e9c4 { --custom-menu-viewport-padding: 16px; --custom-menu-separator-margin: 8px; --custom-menu-flexible-min-width: 188px; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: var(--background-surface-higher); border: var(--menu-border-width) solid var(--border-subtle); border-radius: 8px; box-shadow: var(--shadow-high); box-sizing: border-box; cursor: default; display: flex; height: auto; max-height: var(--reference-position-layer-max-height,calc(100vh - var(--custom-menu-viewport-padding)*2)); z-index: 1; }

.scroller_c1e9c4 { padding-block: var(--menu-scroller-block-padding); padding-inline: 8px; }

.has-webkit-scrollbar .scrollerWithScrollbar_c1e9c4 { padding-inline-end: 0px; }

.flexible_c1e9c4 { max-width: 320px; min-width: var(--custom-menu-flexible-min-width); }

.item_c1e9c4 { border-radius: 2px; box-sizing: border-box; cursor: pointer; margin: 0px; }

.item_c1e9c4:hover { background-color: var(--background-mod-subtle); }

.item_c1e9c4.nonInteractive_c1e9c4 { cursor: default; }

.item_c1e9c4.nonInteractive_c1e9c4:hover { background-color: transparent; }

.labelContainer_c1e9c4 { align-items: center; box-sizing: border-box; display: flex; justify-content: space-between; min-height: 32px; padding: 8px; }

.label_c1e9c4 { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.switchItem_c1e9c4 .labelContainer_c1e9c4 { min-height: 0px; padding: 0px; }

.switchItem_c1e9c4 .label_c1e9c4 { white-space: normal; }

.textInputItem_c1e9c4 .labelContainer_c1e9c4 { min-height: 0px; padding: 0px; }

.textInputItem_c1e9c4 .label_c1e9c4 { white-space: normal; }

.iconContainer_c1e9c4 { align-items: center; display: flex; flex: 0 0 auto; height: 20px; margin-inline-start: 8px; width: 20px; }

.iconContainerLeft_c1e9c4 { margin-inline: 0px 8px; }

.icon_c1e9c4 { height: 100%; width: 100%; }

.caret_c1e9c4 { color: var(--text-muted); height: 20px; width: 20px; }

.separator_c1e9c4 { border-bottom: 1px solid var(--border-subtle); box-sizing: border-box; margin: var(--custom-menu-separator-margin,8px); }

.colorDefault_c1e9c4 { border-color: var(--interactive-text-default); color: var(--interactive-text-default); }

.colorDefault_c1e9c4 .subtext_c1e9c4 { color: var(--text-muted); }

.colorDefault_c1e9c4 .checkbox_c1e9c4, .colorDefault_c1e9c4 .radioSelection_c1e9c4 { color: var(--control-brand-foreground-new); }

.colorDefault_c1e9c4 .check_c1e9c4 { color: var(--white); }

.colorDefault_c1e9c4.focused_c1e9c4 { background-color: var(--interactive-background-hover); border-radius: 4px; color: var(--text-strong); }

.keyboard-mode .colorDefault_c1e9c4.focused_c1e9c4 { outline: 2px solid var(--border-focus); outline-offset: -2px; }

.colorDefault_c1e9c4.focused_c1e9c4 .caret_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .checkbox_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .radioSelection_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .subtext_c1e9c4 { color: var(--white); }

.colorDefault_c1e9c4.focused_c1e9c4 .check_c1e9c4 { color: var(--text-brand); fill: var(--text-brand); }

.colorDefault_c1e9c4.focused_c1e9c4:not(.checkboxContainer_c1e9c4) path { fill: var(--interactive-text-active); }

.colorDefault_c1e9c4.focused_c1e9c4 .subtext_c1e9c4 { color: var(--text-subtle); }

.colorDefault_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: var(--background-mod-subtle); }

.colorDefault_c1e9c4 .label_c1e9c4 { color: var(--text-strong); }

.colorBrand_c1e9c4, .colorDanger_c1e9c4 { }

.colorDanger_c1e9c4 { color: var(--text-feedback-critical); }

.colorDanger_c1e9c4 .checkbox_c1e9c4, .colorDanger_c1e9c4 .radioSelection_c1e9c4 { color: var(--icon-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4 { background-color: var(--background-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4, .colorDanger_c1e9c4.focused_c1e9c4 .check_c1e9c4, .colorDanger_c1e9c4.focused_c1e9c4 .label_c1e9c4 { color: var(--text-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4:not(.checkboxContainer_c1e9c4) path { fill: var(--text-feedback-critical); }

.colorDanger_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: var(--background-feedback-critical); color: var(--text-feedback-critical); }

.colorDanger_c1e9c4 .label_c1e9c4 { color: var(--text-feedback-critical); }

.colorPremium_c1e9c4 .icon_c1e9c4 { color: var(--guild-boosting-pink); }

.colorPremium_c1e9c4.focused_c1e9c4 .icon_c1e9c4, .colorPremium_c1e9c4:active:not(.hideInteraction_c1e9c4) .icon_c1e9c4 { color: var(--white); }

.custom-theme-background .menu_c1e9c4 { border: 1px solid var(--border-strong); }

[data-popout-animating="true"] .item_c1e9c4[aria-haspopup="true"] { pointer-events: none; }

:where(.density-compact) .labelContainer_c1e9c4 { padding: 4px 8px; }

.refresh-fast-follow-distinct-borders .menu_c1e9c4 { border-color: var(--app-frame-border); }

.refresh-fast-follow-distinct-borders .separator_c1e9c4 { border-bottom-color: var(--app-frame-border); }

.enable-forced-colors .menu_c1e9c4 { background-color: buttonface; border: 2px solid canvastext; }

.enable-forced-colors .colorDefault_c1e9c4 { background-color: buttonface; border: 1px solid buttonface; color: buttontext; forced-color-adjust: none; }

.enable-forced-colors .colorDefault_c1e9c4 .caret_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .label_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .subtext_c1e9c4 { color: inherit; }

.enable-forced-colors .colorDefault_c1e9c4 .checkbox_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .radioSelection_c1e9c4 { color: highlight; }

.enable-forced-colors .colorDefault_c1e9c4 .check_c1e9c4 { color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4.focused_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4:hover { border-color: buttontext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"] { background-color: highlight; color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"].focused_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"]:hover { border-color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"] .radioSelection_c1e9c4 { color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: highlight; color: highlighttext; }
:root {
  --app-frame-border: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.2) 100%,hsl(0 0% 0%/0.2) 0%);
  --background-feedback-critical: color-mix(in oklab,hsl(355.636 calc(1*64.706%) 50%/0.0784313725490196) 100%,hsl(0 0% 0%/0.0784313725490196) 0%);
  --background-mod-subtle: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --background-surface-higher: color-mix(in oklab,hsl(240 calc(1*5.263%) 7.451%/1) 100%,#000 0%);
  --border-focus: color-mix(in oklab,hsl(213.043 calc(1*86.25%) 68.627%/1) 100%,#000 0%);
  --border-strong: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.4392156862745098) 100%,hsl(0 0% 0%/0.4392156862745098) 0%);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.2) 100%,hsl(0 0% 0%/0.2) 0%);
  --checkbox-background-default: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --checkbox-background-hover: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --checkbox-background-selected-default: hsl(234.935 calc(1*85.556%) 64.706%/1);
  --checkbox-background-selected-hover: hsl(232.941 calc(1*46.667%) 50%/1);
  --checkbox-border-default: hsl(240 calc(1*4%) 60.784%/0.6392156862745098);
  --checkbox-border-hover: hsl(240 calc(1*4%) 60.784%/0.8);
  --checkbox-border-selected-default: hsl(240 calc(1*4%) 60.784%/0.2);
  --checkbox-border-selected-hover: hsl(240 calc(1*4%) 60.784%/0.2);
  --checkbox-icon-active: hsl(0 calc(1*0%) 100%/1);
  --control-brand-foreground-new: color-mix(in oklab,hsl(229.381 calc(1*96.581%) 77.059%/1) 100%,#000 0%);
  --custom-menu-flexible-min-width: 144px;
  --custom-menu-separator-margin: 8px;
  --custom-menu-viewport-padding: 48px;
  --font-primary: "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  --green-230: hsl(136.438 calc(1*50.345%) 71.569%/1);
  --green-360: hsl(141.649 calc(1*44.292%) 42.941%/1);
  --guild-boosting-pink: hsl(302.143 calc(1*100%) 72.549%/1);
  --icon-feedback-critical: color-mix(in oklab,hsl(0.426 calc(1*77.901%) 64.51%/1) 100%,#000 0%);
  --interactive-background-hover: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --interactive-text-active: color-mix(in oklab,hsl(240 calc(1*4.478%) 86.863%/1) 100%,#000 0%);
  --interactive-text-default: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --menu-border-width: 1px;
  --menu-scroller-block-padding: 8px;
  --premium-tier-2-pink-for-gradients: hsl(325.385 calc(1*31.707%) 51.765%/1);
  --premium-tier-2-pink-for-gradients-2: hsl(295.42 calc(1*51.373%) 50%/1);
  --premium-tier-2-purple-for-gradients: hsl(269.291 calc(1*52.697%) 52.745%/1);
  --radio-background-default: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --radio-background-hover: hsl(0 calc(1*0%) 0%/0.0784313725490196);
  --radio-background-selected-default: hsl(234.935 calc(1*85.556%) 64.706%/1);
  --radio-background-selected-hover: hsl(232.941 calc(1*46.667%) 50%/1);
  --radio-border-default: hsl(240 calc(1*4%) 60.784%/0.6392156862745098);
  --radio-border-hover: hsl(240 calc(1*4%) 60.784%/0.8);
  --radio-border-selected-default: hsl(240 calc(1*4%) 60.784%/0.2);
  --radio-border-selected-hover: hsl(240 calc(1*4%) 60.784%/0.2);
  --radio-thumb-background-active: hsl(0 calc(1*0%) 100%/1);
  --radius-lg: 16px;
  --radius-sm: 8px;
  --radius-xs: 4px;
  --reference-position-layer-max-height: 943px;
  --scrollbar-thin-thumb: color-mix(in oklab,hsl(234 calc(1*5.319%) 36.863%/1) 100%,#000 0%);
  --scrollbar-thin-track: color-mix(in oklab,hsl(0 calc(1*0%) 0%/0) 100%,hsl(0 0% 0%/0) 0%);
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --text-brand: color-mix(in oklab,hsl(232.966 calc(1*86.826%) 67.255%/1) 100%,#000 0%);
  --text-feedback-critical: color-mix(in oklab,hsl(0.426 calc(1*77.901%) 64.51%/1) 100%,#000 0%);
  --text-muted: color-mix(in oklab,hsl(233.333 calc(1*3.704%) 52.353%/1) 100%,#000 0%);
  --text-strong: color-mix(in oklab,hsl(240 calc(1*4.478%) 86.863%/1) 100%,#000 0%);
  --text-subtle: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --white: hsl(0 calc(1*0%) 100%/1);
}

.scrollerBase_d125d2 { box-sizing: border-box; flex: 1 1 auto; min-height: 0px; position: relative; }

.scrollbarGutterStable_d125d2 { scrollbar-gutter: stable; }

.auto_d125d2, .none_d125d2, .thin_d125d2 { }

.thin_d125d2::-webkit-scrollbar { height: 8px; width: 8px; }

.thin_d125d2::-webkit-scrollbar-track { background-color: var(--scrollbar-thin-track); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-color: var(--scrollbar-thin-track); }

.thin_d125d2::-webkit-scrollbar-thumb { background-clip: padding-box; background-color: var(--scrollbar-thin-thumb); border: 2px solid transparent; border-radius: 4px; min-height: 40px; }

.thin_d125d2::-webkit-scrollbar-corner { background-color: transparent; }

.no-webkit-scrollbar .thin_d125d2 { scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track); scrollbar-width: thin; }

.no-webkit-scrollbar .thin_d125d2.fade_d125d2.scrolling_d125d2, .no-webkit-scrollbar .thin_d125d2.fade_d125d2:hover { scrollbar-color: var(--scrollbar-thin-thumb) var(--scrollbar-thin-track); }

.checkboxOption__714a9 { align-items: start; border-radius: var(--radius-sm); display: flex; gap: var(--space-12); max-width: 100%; }

.checkboxIndicator__714a9 { align-items: center; background-color: var(--checkbox-background-default); border-width: 1px; border-style: solid; border-image: initial; border-color: var(--checkbox-border-default); border-radius: var(--radius-xs); box-sizing: border-box; display: flex; flex: 0 0 auto; height: 20px; justify-content: center; position: relative; width: 20px; }

.checkStroke__714a9 { opacity: 0; }

.checkStroke__714a9, .checkmark__714a9 { color: var(--checkbox-icon-active); display: block; height: 100%; inset: 0px; position: absolute; transform-box: fill-box; transform-origin: 50% 50%; width: 100%; }

.dot__714a9 { opacity: 0; transform-origin: 10px 10px; }

.checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 { background-color: var(--checkbox-background-selected-default); border-color: var(--checkbox-border-selected-default); }

.checkboxOption__714a9[data-selected] .checkStroke__714a9, .checkboxOption__714a9[data-selected] .checkmark__714a9 { color: var(--checkbox-icon-active); opacity: 1; }

.animateIn__714a9 .dot__714a9 { animation: 0.3s cubic-bezier(0.65, 0, 0.83, 0.83) 0s 1 normal forwards running dotGrow__714a9; }

.animateIn__714a9 .checkStroke__714a9 { animation: 0.3s cubic-bezier(0.65, 0, 0.83, 0.83) 0s 1 normal both running checkDraw__714a9; }

.animateOut__714a9 .dot__714a9 { animation: 0.12s cubic-bezier(0.65, 0, 0.83, 0.84) 0s 1 normal backwards running dotShrink__714a9; }

.animateOut__714a9 .checkStroke__714a9 { animation: 0.12s cubic-bezier(0.65, 0, 0.83, 0.84) 0s 1 normal backwards running checkUndraw__714a9; }

.checkboxOption__714a9:not([data-selected]):hover:not([data-disabled]) { cursor: pointer; }

.checkboxOption__714a9:not([data-selected]):hover:not([data-disabled]) .checkboxIndicator__714a9 { background-color: var(--checkbox-background-hover); border-color: var(--checkbox-border-hover); }

.checkboxOption__714a9[data-selected]:hover:not([data-disabled]) { cursor: pointer; }

.checkboxOption__714a9[data-selected]:hover:not([data-disabled]) .checkboxIndicator__714a9 { background-color: var(--checkbox-background-selected-hover); border-color: var(--checkbox-border-selected-hover); }

.checkboxOption__714a9[data-disabled] { cursor: not-allowed; opacity: 0.5; }

.enable-forced-colors .checkboxIndicator__714a9 { background-color: buttonface !important; border-color: buttontext !important; }

.enable-forced-colors .checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 { background-color: highlight !important; border-color: highlighttext !important; }

.enable-forced-colors .checkboxOption__714a9[data-selected] .checkboxIndicator__714a9 svg * { fill: highlighttext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] { opacity: 1; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .checkboxIndicator__714a9 { background-color: transparent !important; border-color: graytext !important; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .checkboxIndicator__714a9 svg * { fill: graytext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled][data-selected] .checkboxIndicator__714a9 svg * { fill: graytext; }

.enable-forced-colors .checkboxOption__714a9[data-disabled] .label__714a9, .enable-forced-colors .checkboxOption__714a9[data-disabled] .label__714a9 > div { color: graytext; }

.layer__529b0 { position: fixed; z-index: 9999; }

.container_a4ac84 { min-width: 0px; overflow: hidden; }

.text_a4ac84 { display: inline-block; inset-inline-start: 0px; max-width: 100%; overflow: hidden; position: relative; text-overflow: ellipsis; vertical-align: top; white-space: nowrap; }

.row_a4ac84:hover .container_a4ac84[data-marquee-overflow="true"], .row_a4ac84[data-marquee-active="true"] .container_a4ac84[data-marquee-overflow="true"] { mask-image: linear-gradient(90deg, transparent, rgb(0, 0, 0) 8px, rgb(0, 0, 0) calc(100% - 8px), transparent); }

.row_a4ac84:hover .container_a4ac84[data-marquee-overflow="true"] .text_a4ac84, .row_a4ac84[data-marquee-active="true"] .container_a4ac84[data-marquee-overflow="true"] .text_a4ac84 { inset-inline-start: calc(var(--custom-marquee-overflow, 0px)*-1); max-width: none; overflow: visible; transition: inset-inline-start 2s linear; }

.menu_c1e9c4 { --custom-menu-viewport-padding: 16px; --custom-menu-separator-margin: 8px; --custom-menu-flexible-min-width: 188px; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: var(--background-surface-higher); border: var(--menu-border-width) solid var(--border-subtle); border-radius: 8px; box-shadow: var(--shadow-high); box-sizing: border-box; cursor: default; display: flex; height: auto; max-height: var(--reference-position-layer-max-height,calc(100vh - var(--custom-menu-viewport-padding)*2)); z-index: 1; }

.scroller_c1e9c4 { padding-block: var(--menu-scroller-block-padding); padding-inline: 8px; }

.has-webkit-scrollbar .scrollerWithScrollbar_c1e9c4 { padding-inline-end: 0px; }

.flexible_c1e9c4 { max-width: 320px; min-width: var(--custom-menu-flexible-min-width); }

.item_c1e9c4 { border-radius: 2px; box-sizing: border-box; cursor: pointer; margin: 0px; }

.item_c1e9c4:hover { background-color: var(--background-mod-subtle); }

.item_c1e9c4.nonInteractive_c1e9c4 { cursor: default; }

.item_c1e9c4.nonInteractive_c1e9c4:hover { background-color: transparent; }

.labelContainer_c1e9c4 { align-items: center; box-sizing: border-box; display: flex; justify-content: space-between; min-height: 32px; padding: 8px; }

.label_c1e9c4 { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.switchItem_c1e9c4 .labelContainer_c1e9c4 { min-height: 0px; padding: 0px; }

.switchItem_c1e9c4 .label_c1e9c4 { white-space: normal; }

.textInputItem_c1e9c4 .labelContainer_c1e9c4 { min-height: 0px; padding: 0px; }

.textInputItem_c1e9c4 .label_c1e9c4 { white-space: normal; }

.iconContainer_c1e9c4 { align-items: center; display: flex; flex: 0 0 auto; height: 20px; margin-inline-start: 8px; width: 20px; }

.iconContainerLeft_c1e9c4 { margin-inline: 0px 8px; }

.icon_c1e9c4 { height: 100%; width: 100%; }

.caret_c1e9c4 { color: var(--text-muted); height: 20px; width: 20px; }

.separator_c1e9c4 { border-bottom: 1px solid var(--border-subtle); box-sizing: border-box; margin: var(--custom-menu-separator-margin,8px); }

.submenuPaddingContainer_c1e9c4 { padding: 0px 8px; }

.submenu_c1e9c4 { max-height: var(--custom-floating-layer-max-height,var(--reference-position-layer-max-height)); max-width: 320px; min-width: 188px; }

.colorDefault_c1e9c4 { border-color: var(--interactive-text-default); color: var(--interactive-text-default); }

.colorDefault_c1e9c4 .subtext_c1e9c4 { color: var(--text-muted); }

.colorDefault_c1e9c4 .checkbox_c1e9c4, .colorDefault_c1e9c4 .radioSelection_c1e9c4 { color: var(--control-brand-foreground-new); }

.colorDefault_c1e9c4 .check_c1e9c4 { color: var(--white); }

.colorDefault_c1e9c4.focused_c1e9c4 { background-color: var(--interactive-background-hover); border-radius: 4px; color: var(--text-strong); }

.keyboard-mode .colorDefault_c1e9c4.focused_c1e9c4 { outline: 2px solid var(--border-focus); outline-offset: -2px; }

.colorDefault_c1e9c4.focused_c1e9c4 .caret_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .checkbox_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .radioSelection_c1e9c4, .colorDefault_c1e9c4.focused_c1e9c4 .subtext_c1e9c4 { color: var(--white); }

.colorDefault_c1e9c4.focused_c1e9c4 .check_c1e9c4 { color: var(--text-brand); fill: var(--text-brand); }

.colorDefault_c1e9c4.focused_c1e9c4:not(.checkboxContainer_c1e9c4) path { fill: var(--interactive-text-active); }

.colorDefault_c1e9c4.focused_c1e9c4 .subtext_c1e9c4 { color: var(--text-subtle); }

.colorDefault_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: var(--background-mod-subtle); }

.colorDefault_c1e9c4 .label_c1e9c4 { color: var(--text-strong); }

.colorBrand_c1e9c4, .colorDanger_c1e9c4 { }

.colorDanger_c1e9c4 { color: var(--text-feedback-critical); }

.colorDanger_c1e9c4 .checkbox_c1e9c4, .colorDanger_c1e9c4 .radioSelection_c1e9c4 { color: var(--icon-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4 { background-color: var(--background-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4, .colorDanger_c1e9c4.focused_c1e9c4 .check_c1e9c4, .colorDanger_c1e9c4.focused_c1e9c4 .label_c1e9c4 { color: var(--text-feedback-critical); }

.colorDanger_c1e9c4.focused_c1e9c4:not(.checkboxContainer_c1e9c4) path { fill: var(--text-feedback-critical); }

.colorDanger_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: var(--background-feedback-critical); color: var(--text-feedback-critical); }

.colorDanger_c1e9c4 .label_c1e9c4 { color: var(--text-feedback-critical); }

.colorPremium_c1e9c4 .icon_c1e9c4 { color: var(--guild-boosting-pink); }

.colorPremium_c1e9c4.focused_c1e9c4 .icon_c1e9c4, .colorPremium_c1e9c4:active:not(.hideInteraction_c1e9c4) .icon_c1e9c4 { color: var(--white); }

.colorPremiumGradient_c1e9c4.focused_c1e9c4, .colorPremiumGradient_c1e9c4:active:not(.hideInteraction_c1e9c4) { background: linear-gradient(270deg,var(--premium-tier-2-pink-for-gradients) 0,var(--premium-tier-2-pink-for-gradients-2) 33.63%,var(--premium-tier-2-purple-for-gradients) 100%); color: var(--white); }

.colorPremiumGradient_c1e9c4 .checkbox_c1e9c4, .colorPremiumGradient_c1e9c4.focused_c1e9c4 .check_c1e9c4 { color: var(--premium-tier-2-pink-for-gradients); }

.colorSuccess_c1e9c4.focused_c1e9c4 { background-color: var(--green-230); color: var(--white); }

.colorSuccess_c1e9c4.focused_c1e9c4 .check_c1e9c4 { color: var(--green-230); }

.colorSuccess_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: var(--green-360); color: var(--white); }

.groupLabel_c1e9c4 { color: var(--text-muted); font-family: var(--font-primary); font-size: 14px; font-weight: 500; line-height: 20px; }

.custom-theme-background .menu_c1e9c4 { border: 1px solid var(--border-strong); }

[data-popout-animating="true"] .item_c1e9c4[aria-haspopup="true"] { pointer-events: none; }

:where(.density-compact) .labelContainer_c1e9c4 { padding: 4px 8px; }

.refresh-fast-follow-distinct-borders .menu_c1e9c4 { border-color: var(--app-frame-border); }

.refresh-fast-follow-distinct-borders .separator_c1e9c4 { border-bottom-color: var(--app-frame-border); }

.enable-forced-colors .menu_c1e9c4 { background-color: buttonface; border: 2px solid canvastext; }

.enable-forced-colors .colorDefault_c1e9c4 { background-color: buttonface; border: 1px solid buttonface; color: buttontext; forced-color-adjust: none; }

.enable-forced-colors .colorDefault_c1e9c4 .caret_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .label_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .subtext_c1e9c4 { color: inherit; }

.enable-forced-colors .colorDefault_c1e9c4 .checkbox_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4 .radioSelection_c1e9c4 { color: highlight; }

.enable-forced-colors .colorDefault_c1e9c4 .check_c1e9c4 { color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4.focused_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4:hover { border-color: buttontext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"] { background-color: highlight; color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"].focused_c1e9c4, .enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"]:hover { border-color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4[aria-checked="true"] .radioSelection_c1e9c4 { color: highlighttext; }

.enable-forced-colors .colorDefault_c1e9c4:active:not(.hideInteraction_c1e9c4) { background-color: highlight; color: highlighttext; }

.enable-forced-colors .groupLabel_c1e9c4, .enable-forced-colors .groupLabel_c1e9c4:hover, .enable-forced-colors .hideInteraction_c1e9c4, .enable-forced-colors .hideInteraction_c1e9c4:hover { background-color: buttonface; border-color: buttonface; color: buttontext; }

.radioIndicator__64e61 { image-rendering: crisp-edges; }

.innerDotRadio__64e61, .outerRadioBase__64e61, .outerRadioFill__64e61, .radioIndicator__64e61 { transform-box: fill-box; transform-origin: center center; will-change: transform, opacity; fill: none; overflow: visible; }

.radioIndicator__64e61, .standaloneRadioIndicator__64e61 { background: transparent; border-radius: var(--radius-lg); box-sizing: border-box; display: block; }

.outerRadioBase__64e61 { fill: var(--radio-background-default); stroke: var(--radio-border-default); stroke-width: 2; }

.outerRadioFill__64e61 { fill: none; }

.radioGroupOption__64e61[data-selected] .outerRadioBase__64e61, .standaloneRadioIndicator__64e61[data-selected="true"] .outerRadioBase__64e61 { fill: var(--radio-background-selected-default); stroke: var(--radio-border-selected-default); }

.radioGroupOption__64e61[data-selected] .outerRadioFill__64e61, .standaloneRadioIndicator__64e61[data-selected="true"] .outerRadioFill__64e61 { fill: var(--radio-background-selected-default); stroke: var(--radio-border-selected-default); stroke-width: 2; }

.radioGroupOption__64e61[data-selected] .innerDotRadio__64e61, .standaloneRadioIndicator__64e61[data-selected="true"] .innerDotRadio__64e61 { fill: var(--radio-thumb-background-active); opacity: 1; }

.animateIn__64e61 .outerRadioFill__64e61 { animation: 225ms cubic-bezier(0.33, 0, 0.67, 1) 0s 1 normal forwards running fillIn__64e61; }

.animateIn__64e61 .innerDotRadio__64e61 { animation: 333ms cubic-bezier(0.26, 0.21, 0.67, 1) 0s 1 normal forwards running dotIn__64e61; }

.animateOut__64e61 .outerRadioFill__64e61 { animation: 0.16s cubic-bezier(0.33, 0, 0.67, 1) 0s 1 normal both running fillOut__64e61; }

.animateOut__64e61 .innerDotRadio__64e61 { fill: var(--radio-thumb-background-active); animation: 0.25s cubic-bezier(0.33, 0, 0.25, 1) 0s 1 normal both running dotOut__64e61; }

.radioGroupOption__64e61:not([data-selected]):not([data-disabled]):hover .outerRadioBase__64e61 { fill: var(--radio-background-hover); stroke: var(--radio-border-hover); }

.radioGroupOption__64e61[data-selected]:not([data-disabled]):hover .outerRadioBase__64e61, .radioGroupOption__64e61[data-selected]:not([data-disabled]):hover .outerRadioFill__64e61 { fill: var(--radio-background-selected-hover); stroke: var(--radio-border-selected-hover); }

.radioGroupOption__64e61[data-disabled], .standaloneRadioIndicator__64e61[data-disabled="true"] { cursor: not-allowed; opacity: 0.5; }

.enable-forced-colors .outerRadioBase__64e61 { fill: canvas; }

.enable-forced-colors .innerDotRadio__64e61 { fill: highlighttext; }

.enable-forced-colors .radioGroupOption__64e61[data-selected] .outerRadioBase__64e61 { fill: highlight; }

.enable-forced-colors .radioGroupOption__64e61[data-disabled] .outerRadioBase__64e61 { fill: canvas; }

.enable-forced-colors .radioGroupOption__64e61[data-disabled] .innerDotRadio__64e61, .enable-forced-colors .standaloneRadioIndicator__64e61[data-disabled="true"] .innerDotRadio__64e61 { fill: graytext; }

.enable-forced-colors .standaloneRadioIndicator__64e61[data-disabled="true"] { opacity: 1; }

.enable-forced-colors .standaloneRadioIndicator__64e61[data-disabled="true"] .outerRadioBase__64e61 { fill: canvas; }

.enable-forced-colors .standaloneRadioIndicator__64e61[data-disabled="true"] .outerRadioBorderStroke__64e61 { stroke: graytext; opacity: 1; }`;

const CAPTURED_QUALITY_SUBMENU_HTML = `<div class="submenu_c1e9c4 menu_c1e9c4" role="menu" tabindex="-1" aria-activedescendant="manage-streams-stream-settings"><div class="scroller_c1e9c4 scrollerWithScrollbar_c1e9c4 scrollbarGutterStable_d125d2 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll;"><div aria-label="Taxa de quadros" role="group"><div class="groupLabel_c1e9c4 labelContainer_c1e9c4 hideInteraction_c1e9c4 colorDefault_c1e9c4">Taxa de quadros</div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-fps-15" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">15 FPS</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-fps-30" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">30 FPS</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-fps-60" tabindex="-1" aria-checked="true" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">60 FPS</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="true"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div></div><div role="separator" class="separator_c1e9c4" style="--custom-menu-separator-margin: 8px 0;"></div><div aria-label="Resolução" role="group"><div class="groupLabel_c1e9c4 labelContainer_c1e9c4 hideInteraction_c1e9c4 colorDefault_c1e9c4">Resolução</div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-resolution-480" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">480p</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-resolution-720" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">720p</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-resolution-1080" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">1080p</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-resolution-1440" tabindex="-1" aria-checked="true" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">1440p</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="true"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div><div class="item_c1e9c4 text-sm/medium_c1e9c4 labelContainer_c1e9c4 row_a4ac84 colorDefault_c1e9c4" role="menuitemradio" id="manage-streams-stream-settings--stream-settings-resolution-0" tabindex="-1" aria-checked="false" data-marquee-active="false"><div class="label_c1e9c4"><div class="container_a4ac84" data-marquee-overflow="false"><span class="text-sm/medium_cf4812 text_a4ac84" data-text-variant="text-sm/medium">Fonte</span></div></div><div class="iconContainer_c1e9c4"><div class="standaloneRadioIndicator__64e61" data-selected="false"><svg aria-hidden="true" focusable="false" class="radioIndicator__64e61" width="20" height="20" viewBox="0 0 40 40" fill="none" shape-rendering="geometricPrecision"><circle cx="20" cy="20" r="20" class="outerRadioBase__64e61"></circle><circle cx="20" cy="20" r="20" class="outerRadioFill__64e61"></circle><circle cx="20" cy="20" r="8" class="innerDotRadio__64e61"></circle></svg></div></div></div></div></div></div>`;
