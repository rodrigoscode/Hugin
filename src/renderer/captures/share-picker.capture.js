/**
 * Markup and styles of Discord's screen-share picker, captured from the client.
 */

const CAPTURED_SHARE_CSS = `:root {
  --background-base-lowest: color-mix(in oklab,hsl(240 calc(1*5.263%) 7.451%/1) 100%,#000 0%);
  --background-mod-muted: hsl(240 calc(1*4%) 60.784%/0.0784313725490196);
  --background-mod-strong: hsl(240 calc(1*4%) 60.784%/0.2);
  --background-mod-subtle: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --background-surface-high: color-mix(in oklab,hsl(240 calc(1*6.494%) 15.098%/1) 100%,#000 0%);
  --black: hsl(0 calc(1*0%) 0%/1);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --brand-500: hsl(234.935 calc(1*85.556%) 64.706%/1);
  --control-secondary-background-active: hsl(240 calc(1*4%) 60.784%/0.2);
  --control-secondary-background-default: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --control-secondary-background-hover: hsl(240 calc(1*4%) 60.784%/0.1607843137254902);
  --control-secondary-border-active: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-default: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-hover: hsl(240 calc(1*4%) 60.784%/0.0392156862745098);
  --control-secondary-text-active: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-default: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-hover: hsl(0 calc(1*0%) 98.431%/1);
  --custom-app-top-bar-height: 32px;
  --custom-border-radius: 12px;
  --custom-modal-padding-bottom: 16px;
  --custom-modal-padding-md: 16px;
  --custom-modal-padding-sm: 8px;
  --custom-modal-padding-top: 8px;
  --interactive-icon-default: color-mix(in oklab,hsl(231.429 calc(1*4.348%) 68.431%/1) 100%,#000 0%);
  --interactive-text-active: color-mix(in oklab,hsl(0 calc(1*0%) 98.431%/1) 100%,#000 0%);
  --interactive-text-default: color-mix(in oklab,hsl(231.429 calc(1*4.348%) 68.431%/1) 100%,#000 0%);
  --opacity-black-40: hsl(0 calc(1*0%) 0%/0.4);
  --opacity-green-60: hsl(151.128 calc(1*100%) 26.078%/0.6);
  --opacity-white-60: hsl(0 calc(1*0%) 100%/0.6);
  --radius-md: 12px;
  --radius-sm: 8px;
  --scrollbar-auto-scrollbar-color-thumb: color-mix(in oklab,hsl(234.545 calc(1*5.473%) 39.412%/1) 100%,#000 0%);
  --scrollbar-auto-scrollbar-color-track: color-mix(in oklab,hsl(240 calc(1*6.667%) 5.882%/1) 100%,#000 0%);
  --scrollbar-auto-thumb: color-mix(in oklab,hsl(234 calc(1*4.673%) 41.961%/1) 100%,#000 0%);
  --scrollbar-auto-track: color-mix(in oklab,hsl(0 calc(1*0%) 0%/0) 100%,hsl(0 0% 0%/0) 0%);
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-4: 4px;
  --space-8: 8px;
  --text-default: color-mix(in oklab,hsl(240 calc(1*6.667%) 94.118%/1) 100%,#000 0%);
  --text-muted: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
  --text-strong: color-mix(in oklab,hsl(0 calc(1*0%) 98.431%/1) 100%,#000 0%);
  --text-subtle: color-mix(in oklab,hsl(231.429 calc(1*4.348%) 68.431%/1) 100%,#000 0%);
  --white: hsl(0 calc(1*0%) 100%/1);
}

.scrollerBase_d125d2 { box-sizing: border-box; flex: 1 1 auto; min-height: 0px; position: relative; }

.scrollbarGutterStable_d125d2 { scrollbar-gutter: stable; }

.auto_d125d2, .none_d125d2, .thin_d125d2 { }

.auto_d125d2::-webkit-scrollbar { height: 16px; width: 16px; }

.auto_d125d2::-webkit-scrollbar-track { background-color: var(--scrollbar-auto-track); }

.auto_d125d2::-webkit-scrollbar-thumb, .auto_d125d2::-webkit-scrollbar-track { background-clip: padding-box; border: 4px solid transparent; border-radius: 8px; }

.auto_d125d2::-webkit-scrollbar-thumb { background-color: var(--scrollbar-auto-thumb); min-height: 40px; }

.auto_d125d2::-webkit-scrollbar-corner { background-color: transparent; }

.custom-theme-background .customTheme_d125d2.auto_d125d2::-webkit-scrollbar-track { background-color: var(--background-mod-muted); }

.no-webkit-scrollbar .auto_d125d2 { scrollbar-color: var(--scrollbar-auto-scrollbar-color-thumb) var(--scrollbar-auto-scrollbar-color-track); scrollbar-width: auto; }

.no-webkit-scrollbar .auto_d125d2.fade_d125d2.scrolling_d125d2, .no-webkit-scrollbar .auto_d125d2.fade_d125d2:hover { scrollbar-color: var(--scrollbar-auto-scrollbar-color-thumb) var(--scrollbar-auto-scrollbar-color-track); }

.enable-forced-colors .auto_d125d2::-webkit-scrollbar { height: 8px; width: 8px; }

.enable-forced-colors .auto_d125d2::-webkit-scrollbar-track { border-radius: 0px; border-width: 1px; }

.defaultColor__4bd52 { color: var(--text-default); }

.container__8a031, .outerContainer__8a031 { box-sizing: border-box; display: flex; }

.container__8a031 { --custom-border-radius: var(--radius-md); background: var(--background-surface-high); border: 1px solid var(--border-subtle); border-radius: var(--custom-border-radius); box-shadow: var(--shadow-high); color: var(--text-default); flex-direction: column; max-height: 100%; pointer-events: auto; width: 100%; }

.padding-size-sm__8a031 { --custom-modal-padding: var(--space-24); --custom-modal-padding-sm: var(--space-8); --custom-modal-padding-md: var(--space-16); --custom-modal-padding-top: var(--custom-modal-padding-sm); --custom-modal-padding-bottom: var(--custom-modal-padding-md); }

.padding-size-lg__8a031, .padding-size-sm__8a031 { padding-bottom: var(--custom-modal-padding-bottom); padding-top: var(--custom-modal-padding-top); }

.size-xl__8a031 { max-width: 960px; }

@media (max-height: 550px), (max-width: 485px) {
  .fullScreenOnMobile__8a031 .container__8a031 { --custom-border-radius: 0; --custom-modal-padding-top: calc(var(--custom-app-top-bar-height) + var(--custom-modal-padding-sm)); border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; height: 100%; overflow-y: auto; }
}

.button_a22cb0 { align-items: center; background: initial; border: 1px solid transparent; border-radius: var(--radius-sm); box-sizing: border-box; color: inherit; cursor: pointer; display: flex; flex-grow: 0; flex-shrink: 0; font-size: medium; font-weight: 400; justify-content: center; margin: 0px; max-height: min-content; max-width: 100%; padding: 0px; position: relative; text-align: start; transition: background-color 50ms ease-in, color 50ms ease-in, border-color 50ms ease-in, opacity 50ms ease-in; width: min-content; }

.button_a22cb0:hover { transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, opacity 0.15s ease-out; }

.button_a22cb0:disabled { opacity: 0.5; pointer-events: none; }

.highlight-mana-buttons .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-white-60); }

.highlight-mana-buttons [data-button-hoisted-classname-wrapper] .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-green-60); }

.buttonChildrenWrapper_a22cb0 { border-radius: var(--radius-sm); box-sizing: border-box; justify-content: center; position: relative; width: 100%; }

.buttonChildren_a22cb0, .buttonChildrenWrapper_a22cb0 { align-items: center; display: flex; overflow: hidden; }

.buttonChildren_a22cb0 { gap: var(--space-4); text-overflow: ellipsis; transition: opacity 0.2s ease-out, transform 0.2s ease-out; white-space: nowrap; }

.icon_a22cb0 { flex-shrink: 0; }

.buttonChildren_a22cb0 { opacity: 1; }

.buttonChildren_a22cb0.loading_a22cb0 { opacity: 0; }

.full-motion .buttonChildren_a22cb0 { transform: translateY(0px); }

.full-motion .buttonChildren_a22cb0.loading_a22cb0 { transform: translateY(-100%); }

.xs_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 22px; min-width: 22px; }

.xs_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-8) - 1px); }

.sm_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 30px; min-width: 30px; }

.sm_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-12) - 1px); }

.md_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 38px; min-width: 38px; }

.md_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,100px); }

.md_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-8) - 1px) calc(var(--space-16) - 1px); }

.secondary_a22cb0 { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }

.secondary_a22cb0:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }

.secondary_a22cb0:active { background-color: var(--control-secondary-background-active); border-color: var(--control-secondary-border-active); color: var(--control-secondary-text-active); }

.enable-forced-colors .button_a22cb0 { background-color: buttonface; border-color: buttontext; color: buttontext; forced-color-adjust: none; }

.enable-forced-colors .button_a22cb0:disabled { background-color: canvas; border-color: graytext; color: graytext; opacity: 1; }

.enable-forced-colors .button_a22cb0 .expressiveFill_a22cb0 { display: none; }

.lottieIconColors__5eb9b :not(defs *)[fill][fill-opacity] { fill: var(--__lottieIconColor,var(--interactive-text-default)); }

.lottieIconColors__5eb9b :not(defs *)[stroke][stroke-opacity] { stroke: var(--__lottieIconColor,var(--interactive-text-default)); }

.lottieIcon__5eb9b svg { transform: none !important; }

.enable-forced-colors .lottieIcon__5eb9b :not(defs *)[fill][fill-opacity] { fill: currentcolor; }

.enable-forced-colors .lottieIcon__5eb9b :not(defs *)[stroke][stroke-opacity] { stroke: currentcolor; }

.tabListItem__9e06a { flex: 0 1 auto; }

.tabListItemPill__9e06a { flex: 1 1 0%; }

.pillContainer__9e06a, .tabContainer__9e06a { display: flex; flex-direction: row; }

.pillContainer__9e06a { background-color: var(--background-base-lowest); border-radius: var(--radius-md); gap: var(--space-4); justify-content: stretch; padding: var(--space-4); }

.pillItem__9e06a { border-radius: var(--radius-sm); color: var(--text-subtle); cursor: pointer; display: flex; flex: 1 1 auto; justify-content: center; padding: 8px 16px; }

.pillItem__9e06a:not(.pillItemSelected__9e06a):hover { background-color: var(--background-mod-subtle); }

.pillItemSelected__9e06a { background-color: var(--background-surface-high); color: var(--interactive-text-active); }

.icon__9e06a { height: 16px; width: 16px; }

.controlText__9e06a { align-items: center; display: flex; gap: var(--space-8); }

.pillItemText__9e06a { line-height: 1; }

.root__2f580 { display: grid; gap: 24px 16px; grid-template-columns: 1fr 1fr; }

.source__2f580 { display: flex; flex-direction: column; max-width: 447px; min-width: 0px; }

.source__2f580:hover { cursor: pointer; }

.source__2f580:hover .sourceOverlay__2f580 { display: flex; }

.source__2f580:hover:not(.selectedSource__2f580) .sourcePreviewContainer__2f580::before { border-color: var(--background-mod-strong); }

.selectedSource__2f580 .sourcePreviewContainer__2f580::before { border-color: var(--brand-500); }

.sourcePreviewContainer__2f580 { border-radius: var(--radius-md); position: relative; }

.sourcePreviewContainer__2f580::before { border: 2px solid transparent; border-radius: var(--radius-md); bottom: -4px; content: ""; position: absolute; top: -4px; inset-inline: -4px; }

.sourcePreviewImage__2f580 { height: 100%; object-fit: contain; object-position: center center; width: 100%; }

.sourcePreview__2f580 { aspect-ratio: 16 / 9; background-color: var(--black); border-radius: var(--radius-sm); max-width: 447px; overflow: hidden; position: relative; }

.sourceOverlay__2f580 { align-items: center; background: var(--opacity-black-40); display: none; justify-content: center; position: absolute; top: 0px; inset-inline: 0px; bottom: 0px; }

.sourceOverlayCTA__2f580 { background-color: var(--white); border-radius: var(--radius-sm); color: var(--black); padding: var(--space-12) var(--space-24); }

.sourceNameContainer__2f580 { align-items: center; display: flex; gap: var(--space-8); margin-top: var(--space-8); width: 100%; }

.sourceIcon__2f580 { border-radius: 2px; flex-shrink: 0; height: 16px; width: 16px; }

.sourceName__2f580 { flex: 1 1 auto; min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.root_e529a0 { align-items: center; gap: var(--space-16); }

.root_e529a0, .summary_e529a0 { display: flex; min-width: 0px; }

.summary_e529a0 { flex-direction: column; gap: 2px; justify-content: center; }

.summaryDetail_e529a0 { align-items: center; display: flex; gap: var(--space-8); }

.summaryDetail_e529a0 span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.summaryDetail_e529a0 span:last-child { flex: 1 1 auto; }

.ellipsis_e529a0 { color: var(--background-mod-subtle); }

.sourceOrPresetName_e529a0 { min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.root_a55fdc { display: flex; flex-direction: column; height: calc(-80px + 100vh); max-height: 720px; overflow: hidden; width: 100%; }

.root_a55fdc.nativePicker_a55fdc { height: 570px; }

@media (max-height: 820px) {
  .root_a55fdc.nativePicker_a55fdc { height: min(570px, -90px + 100vh); max-height: 550px; }
}

.root_a55fdc.channelSelector_a55fdc { height: 504px; }

.root_a55fdc.confirmStep_a55fdc { height: auto; }

.footer_a55fdc { background-color: var(--background-surface-high); }

.footerContent_a55fdc { display: flex; flex-direction: row; gap: var(--space-32); justify-content: space-between; padding: var(--space-16) var(--space-24) 0; }

.header_a55fdc { padding: var(--space-16) var(--space-24); }

.segmentedControl_a55fdc { flex: 1 1 auto; }

.segmentedControlOption_a55fdc { flex-basis: 0px; }

.content_a55fdc { padding-inline: var(--space-24); padding-top: var(--space-8); position: relative; }

.rightButtonGroup_a55fdc { align-items: center; display: flex; gap: var(--space-8); }

.auto_d125d2::-webkit-scrollbar { height: 16px; width: 16px; }

.auto_d125d2::-webkit-scrollbar-track { background-color: var(--scrollbar-auto-track); }

.auto_d125d2::-webkit-scrollbar-thumb, .auto_d125d2::-webkit-scrollbar-track { background-clip: padding-box; border: 4px solid transparent; border-radius: 8px; }

.auto_d125d2::-webkit-scrollbar-thumb { background-color: var(--scrollbar-auto-thumb); min-height: 40px; }

.auto_d125d2::-webkit-scrollbar-corner { background-color: transparent; }

.custom-theme-background .customTheme_d125d2.auto_d125d2::-webkit-scrollbar-track { background-color: var(--background-mod-muted); }

.enable-forced-colors .auto_d125d2::-webkit-scrollbar { height: 8px; width: 8px; }

.enable-forced-colors .auto_d125d2::-webkit-scrollbar-track { border-radius: 0px; border-width: 1px; }

.source__2f580:hover:not(.selectedSource__2f580) .sourcePreviewContainer__2f580::before { border-color: var(--background-mod-strong); }

.selectedSource__2f580 .sourcePreviewContainer__2f580::before { border-color: var(--brand-500); }

.sourcePreviewContainer__2f580::before { border: 2px solid transparent; border-radius: var(--radius-md); bottom: -4px; content: ""; position: absolute; top: -4px; inset-inline: -4px; }

[data-cs="0"] {
  box-sizing: border-box;
  display: flex;
  position: static;
  width: 960px;
  height: 746px;
  min-width: auto;
  max-width: 960px;
  min-height: auto;
  max-height: 100%;
  padding-top: 8px;
  padding-bottom: 16px;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: oklab(0.26239 0.00252313 -0.00890189);
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: oklab(0.678923 0.00325415 -0.0111644 / 0.121569);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 12px 24px 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  transform: matrix(1, 0, 0, 1, 0, 0);
  cursor: auto;
}

[data-cs="1"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 958px;
  height: 720px;
  min-width: auto;
  min-height: auto;
  max-height: 720px;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="2"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 910px;
  height: 40px;
  min-width: auto;
  min-height: auto;
  padding-top: 16px;
  padding-right: 24px;
  padding-bottom: 16px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="3"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 902px;
  height: 32px;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  padding-left: 4px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: stretch;
  flex-grow: 1;
  gap: 4px;
  background-color: oklab(0.183087 0.00112148 -0.00387992);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="4"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 298px;
  height: 32px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  flex-basis: 0%;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="5"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 266px;
  height: 16px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 0px;
  background-color: oklab(0.26239 0.00252313 -0.00890189);
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="6"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 91.0625px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="7"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: none;
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}

[data-cs="8"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: oklab(0.745443 0.00131971 -0.00849813);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="9"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: oklab(0.745443 0.00131971 -0.00849813);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="10"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 298px;
  height: 32px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  flex-basis: 0%;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="11"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 266px;
  height: 16px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 0px;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="12"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 90.3906px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="13"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: none;
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}

[data-cs="14"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: oklab(0.745443 0.00131971 -0.00849813);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="15"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 298px;
  height: 32px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  flex-basis: 0%;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="16"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 266px;
  height: 16px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 0px;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="17"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 96.7656px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="18"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: none;
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}

[data-cs="19"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.745443 0.00131971 -0.00849813);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.745443 0.00131971 -0.00849813);
  fill: oklab(0.745443 0.00131971 -0.00849813);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="20"] {
  box-sizing: border-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 958px;
  height: 592px;
  min-width: auto;
  padding-top: 8px;
  padding-right: 24px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: scroll;
  cursor: auto;
}

[data-cs="21"] {
  box-sizing: content-box;
  display: grid;
  position: static;
  width: 894px;
  height: 1460.69px;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 24px 16px;
  grid-template-columns: 439px 439px;
  grid-template-rows: 272.938px 272.938px 272.938px 272.938px 272.938px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="22"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="23"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="24"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="25"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="26"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="27"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="28"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="29"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="30"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="31"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="32"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="33"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="34"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="35"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="36"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="37"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="38"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="39"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="40"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="41"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="42"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="43"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="44"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="45"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="46"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="47"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="48"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="49"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="50"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="51"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="52"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="53"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="54"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="55"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="56"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="57"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="58"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="59"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="60"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="61"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="62"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="63"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="64"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="65"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="66"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="67"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="68"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="69"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="70"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="71"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="72"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="73"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="74"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="75"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="76"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="77"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="78"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="79"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="80"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="81"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="82"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="83"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="84"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="85"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="86"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="87"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="88"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="89"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="90"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="91"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="92"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="93"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="94"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="95"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="96"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="97"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="98"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="99"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="100"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="101"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="102"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 272.938px;
  max-width: 447px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="103"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="104"] {
  box-sizing: content-box;
  display: block;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 439px;
  height: 246.938px;
  max-width: 447px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(0, 0, 0);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  aspect-ratio: 16 / 9;
  cursor: auto;
}

[data-cs="105"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 439px;
  height: 246.938px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  object-fit: contain;
  cursor: auto;
}

[data-cs="106"] {
  box-sizing: content-box;
  display: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="107"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  padding-top: 12px;
  padding-right: 24px;
  padding-bottom: 12px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="108"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(0, 0, 0);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(0, 0, 0);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="109"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 439px;
  height: 18px;
  min-width: auto;
  min-height: auto;
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="110"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 16px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: clip;
  overflow-y: clip;
  cursor: auto;
}

[data-cs="111"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 415px;
  height: 18px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="112"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 958px;
  height: 56px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  background-color: oklab(0.26239 0.00252313 -0.00890189);
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="113"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 910px;
  height: 40px;
  padding-top: 16px;
  padding-right: 24px;
  padding-left: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 32px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="114"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 98.0625px;
  height: 40px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 16px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="115"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 98.0625px;
  height: 38px;
  min-height: auto;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 2px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="116"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 98.0625px;
  height: 20px;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.988078 0.0000451207 0.0000197291);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.988078 0.0000451207 0.0000197291);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="117"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 98.0625px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.677774 0.00174385 -0.0101101);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.677774 0.00174385 -0.0101101);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="118"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 3.57812px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgba(151, 151, 159, 0.12);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgba(151, 151, 159, 0.12);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="119"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 31.7812px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: oklab(0.677774 0.00174385 -0.0101101);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.677774 0.00174385 -0.0101101);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="120"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 3.57812px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgba(151, 151, 159, 0.12);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgba(151, 151, 159, 0.12);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="121"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 35.125px;
  height: 16px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-grow: 1;
  border-color: oklab(0.677774 0.00174385 -0.0101101);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.677774 0.00174385 -0.0101101);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: auto;
}

[data-cs="122"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 40px;
  height: 40px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  border-color: oklab(0.952693 0.000792831 -0.00253612);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: oklab(0.952693 0.000792831 -0.00253612);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: auto;
}

[data-cs="123"] {
  box-sizing: border-box;
  display: flex;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 40px;
  height: 40px;
  min-width: auto;
  max-width: 100%;
  min-height: auto;
  max-height: min-content;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background-color: rgba(151, 151, 159, 0.12);
  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: oklab(0.678923 0.00325415 -0.0111644 / 0.0392157);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: normal;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="124"] {
  box-sizing: border-box;
  display: flex;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: normal;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}

[data-cs="125"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 20px;
  height: 20px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  transform: matrix(1, 0, 0, 1, 0, 0);
  cursor: pointer;
}

[data-cs="126"] {
  box-sizing: content-box;
  display: flex;
  position: static;
  width: 20px;
  height: 20px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="127"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: 20px;
  height: 20px;
  min-width: auto;
  min-height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  cursor: pointer;
}

[data-cs="128"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="129"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="130"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: 24px;
  height: 24px;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="131"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="132"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="133"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="134"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  transform: matrix(0.04, 0, 0, 0.04, 0, 0);
  cursor: pointer;
}

[data-cs="135"] {
  box-sizing: content-box;
  display: block;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  transform: matrix(-25, 0, 0, -25, 300, 300);
  cursor: pointer;
}

[data-cs="136"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(0, 0, 0);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  transform: matrix(1, 0, 0, 1, 0, 0);
  cursor: pointer;
}

[data-cs="137"] {
  box-sizing: content-box;
  display: inline;
  position: static;
  width: auto;
  height: auto;
  flex-direction: row;
  flex-wrap: nowrap;
  border-color: rgb(251, 251, 251);
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  color: rgb(251, 251, 251);
  fill: rgb(251, 251, 251);
  stroke: none;
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: visible;
  cursor: pointer;
}

[data-cs="0"] {
  opacity: 1;
  transform: none;
}`;

const CAPTURED_SHARE_HTML = `<div data-mana-component="modal" class="container__8a031 size-xl__8a031 padding-size-sm__8a031" data-cs="0"><div class="root_a55fdc" data-cs="1"><div class="header_a55fdc" data-cs="2"><div role="tablist" tabindex="0" data-list-id="_r_4jn_" aria-orientation="horizontal" class="pillContainer__9e06a segmentedControl_a55fdc" data-cs="3"><div class="tabListItem__9e06a tabListItemPill__9e06a" data-cs="4"><div class="pillItem__9e06a segmentedControlOption_a55fdc pillItemSelected__9e06a" role="tab" data-list-item-id="_r_4jn____window" tabindex="0" aria-disabled="false" aria-selected="true" data-cs="5"><div class="text-sm/medium_cf4812 controlText__9e06a pillItemText__9e06a" data-text-variant="text-sm/medium" data-cs="6"><svg class="icon__9e06a" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" data-cs="7"><path fill="var(--interactive-icon-default)" d="M20 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h16ZM4 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" class="" data-cs="8"></path><path fill="var(--interactive-icon-default)" fill-rule="evenodd" d="M20 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h16ZM4 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clip-rule="evenodd" class="" data-cs="9"></path></svg>Aplicativos</div></div></div><div class="tabListItem__9e06a tabListItemPill__9e06a" data-cs="10"><div class="pillItem__9e06a segmentedControlOption_a55fdc" role="tab" data-list-item-id="_r_4jn____screen" tabindex="-1" aria-disabled="false" aria-selected="false" data-cs="11"><div class="text-sm/medium_cf4812 controlText__9e06a pillItemText__9e06a" data-text-variant="text-sm/medium" data-cs="12"><svg class="icon__9e06a" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" data-cs="13"><path fill="var(--interactive-icon-default)" d="M5 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5ZM13.5 20a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-.5.5H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-1.5Z" class="" data-cs="14"></path></svg>Tela Inteira</div></div></div><div class="tabListItem__9e06a tabListItemPill__9e06a" data-cs="15"><div class="pillItem__9e06a segmentedControlOption_a55fdc" role="tab" data-list-item-id="_r_4jn____camera" tabindex="-1" aria-disabled="false" aria-selected="false" data-cs="16"><div class="text-sm/medium_cf4812 controlText__9e06a pillItemText__9e06a" data-text-variant="text-sm/medium" data-cs="17"><svg class="icon__9e06a" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" data-cs="18"><path fill="var(--interactive-icon-default)" d="M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0 0 0 .55.9l3 1.5a1 1 0 0 0 1.45-.9V7.62a1 1 0 0 0-1.45-.9l-3 1.5a1 1 0 0 0-.55.9V7a3 3 0 0 0-3-3H4Z" class="" data-cs="19"></path></svg>Dispositivos</div></div></div></div> </div><div class="content_a55fdc scrollbarGutterStable_d125d2 auto_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll;" data-cs="20"><div class="root__2f580" data-cs="21"><div class="source__2f580" role="button" tabindex="0" data-cs="22"><div class="sourcePreviewContainer__2f580" data-cs="23"><div class="sourcePreview__2f580" data-cs="24"><img class="sourcePreviewImage__2f580" alt="" data-cs="25" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="26"><div class="sourceOverlayCTA__2f580" data-cs="27"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="28">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="29"><img class="sourceIcon__2f580" alt="" data-cs="30" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="31">Remover pílula e mover s… - Discord - Visual Studio Code</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="32"><div class="sourcePreviewContainer__2f580" data-cs="33"><div class="sourcePreview__2f580" data-cs="34"><img class="sourcePreviewImage__2f580" alt="" data-cs="35" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="36"><div class="sourceOverlayCTA__2f580" data-cs="37"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="38">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="39"><img class="sourceIcon__2f580" alt="" data-cs="40" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="41">discord-share-modal (copia do Discord) - Google Chrome</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="42"><div class="sourcePreviewContainer__2f580" data-cs="43"><div class="sourcePreview__2f580" data-cs="44"><img class="sourcePreviewImage__2f580" alt="" data-cs="45" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="46"><div class="sourceOverlayCTA__2f580" data-cs="47"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="48">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="49"><img class="sourceIcon__2f580" alt="" data-cs="50" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="51"> Novo(a) Documento de Texto.txt - Bloco de notas</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="52"><div class="sourcePreviewContainer__2f580" data-cs="53"><div class="sourcePreview__2f580" data-cs="54"><img class="sourcePreviewImage__2f580" alt="" data-cs="55" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="56"><div class="sourceOverlayCTA__2f580" data-cs="57"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="58">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="59"><img class="sourceIcon__2f580" alt="" data-cs="60" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="61">Developer Tools - https://discord.com/app?_=1789085278619</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="62"><div class="sourcePreviewContainer__2f580" data-cs="63"><div class="sourcePreview__2f580" data-cs="64"><img class="sourcePreviewImage__2f580" alt="" data-cs="65" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="66"><div class="sourceOverlayCTA__2f580" data-cs="67"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="68">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="69"><img class="sourceIcon__2f580" alt="" data-cs="70" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="71">Documentos – Explorador de Arquivos</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="72"><div class="sourcePreviewContainer__2f580" data-cs="73"><div class="sourcePreview__2f580" data-cs="74"><img class="sourcePreviewImage__2f580" alt="" data-cs="75" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="76"><div class="sourceOverlayCTA__2f580" data-cs="77"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="78">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="79"><img class="sourceIcon__2f580" alt="" data-cs="80" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="81">Matuê - Vampiro</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="82"><div class="sourcePreviewContainer__2f580" data-cs="83"><div class="sourcePreview__2f580" data-cs="84"><img class="sourcePreviewImage__2f580" alt="" data-cs="85" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="86"><div class="sourceOverlayCTA__2f580" data-cs="87"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="88">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="89"><img class="sourceIcon__2f580" alt="" data-cs="90" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="91">Windows PowerShell</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="92"><div class="sourcePreviewContainer__2f580" data-cs="93"><div class="sourcePreview__2f580" data-cs="94"><img class="sourcePreviewImage__2f580" alt="" data-cs="95" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="96"><div class="sourceOverlayCTA__2f580" data-cs="97"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="98">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="99"><img class="sourceIcon__2f580" alt="" data-cs="100" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="101">Windows PowerShell</div></div></div><div class="source__2f580" role="button" tabindex="0" data-cs="102"><div class="sourcePreviewContainer__2f580" data-cs="103"><div class="sourcePreview__2f580" data-cs="104"><img class="sourcePreviewImage__2f580" alt="" data-cs="105" data-placeholder="thumb"><div class="sourceOverlay__2f580" data-cs="106"><div class="sourceOverlayCTA__2f580" data-cs="107"><div class="text-sm/medium_cf4812" data-text-variant="text-sm/medium" style="color: currentcolor;" data-cs="108">Compartilhar tela</div></div></div></div></div><div class="sourceNameContainer__2f580" data-cs="109"><img class="sourceIcon__2f580" alt="" data-cs="110" data-placeholder="icon"><div class="defaultColor__4bd52 text-sm/medium_cf4812 sourceName__2f580" data-text-variant="text-sm/medium" data-cs="111">#geral | Servidor - Discord</div></div></div></div></div><div class="footer_a55fdc" data-cs="112"><div class="footerContent_a55fdc" data-cs="113"><div class="root_e529a0" data-cs="114"><div class="summary_e529a0" data-cs="115"><div class="text-md/semibold_cf4812 sourceOrPresetName_e529a0" data-text-variant="text-md/semibold" style="color: var(--text-strong);" data-cs="116">Personalizada</div><div class="text-xs/medium_cf4812 summaryDetail_e529a0" data-text-variant="text-xs/medium" style="color: var(--text-muted);" data-cs="117"><span class="ellipsis_e529a0" data-cs="118">•</span><span data-cs="119">1440p</span><span class="ellipsis_e529a0" data-cs="120">•</span><span data-cs="121">60fps</span></div></div></div><div class="rightButtonGroup_a55fdc" data-cs="122"><button data-mana-component="button" role="button" class="button_a22cb0 md_a22cb0 secondary_a22cb0" type="button" aria-label="Opções" aria-expanded="false" data-cs="123"><div class="buttonChildrenWrapper_a22cb0" data-cs="124"><div class="buttonChildren_a22cb0" data-cs="125"><div class="lottieIcon__5eb9b lottieIconColors__5eb9b icon_a22cb0" style="--__lottieIconColor: currentColor; display: flex; width: 20px; height: 20px;" data-cs="126"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;" data-cs="127"><defs data-cs="128"><clipPath id="__lottie_element_1280" data-cs="129"><rect width="24" height="24" x="0" y="0" data-cs="130"></rect></clipPath><clipPath id="__lottie_element_1282" data-cs="131"><path d="M0,0 L600,0 L600,600 L0,600z" data-cs="132"></path></clipPath></defs><g clip-path="url(#__lottie_element_1280)" data-cs="133"><g clip-path="url(#__lottie_element_1282)" transform="matrix(0.03999999910593033,0,0,0.03999999910593033,0,0)" opacity="1" style="display: block;" data-cs="134"><g transform="matrix(-25,0,0,-25,300,300)" opacity="1" style="display: block;" data-cs="135"><g opacity="1" transform="matrix(1,0,0,1,0,0)" data-cs="136"><path fill="rgb(88,101,242)" fill-opacity="1" d=" M-1.4420000314712524,-10.906000137329102 C-1.8949999809265137,-10.847000122070312 -2.1470000743865967,-10.375 -2.078000068664551,-9.92300033569336 C-1.899999976158142,-8.756999969482422 -2.265000104904175,-7.7210001945495605 -3.061000108718872,-7.390999794006348 C-3.8570001125335693,-7.060999870300293 -4.8480000495910645,-7.534999847412109 -5.546000003814697,-8.484999656677246 C-5.816999912261963,-8.852999687194824 -6.329999923706055,-9.008999824523926 -6.691999912261963,-8.730999946594238 C-7.458000183105469,-8.142999649047852 -8.142999649047852,-7.458000183105469 -8.730999946594238,-6.691999912261963 C-9.008999824523926,-6.329999923706055 -8.852999687194824,-5.816999912261963 -8.484999656677246,-5.546000003814697 C-7.534999847412109,-4.8480000495910645 -7.060999870300293,-3.8570001125335693 -7.390999794006348,-3.061000108718872 C-7.7210001945495605,-2.265000104904175 -8.756999969482422,-1.899999976158142 -9.92300033569336,-2.078000068664551 C-10.375,-2.1470000743865967 -10.847000122070312,-1.8949999809265137 -10.906000137329102,-1.4420000314712524 C-10.968000411987305,-0.9700000286102295 -11,-0.48899999260902405 -11,0 C-11,0.48899999260902405 -10.968000411987305,0.9700000286102295 -10.906000137329102,1.4420000314712524 C-10.847000122070312,1.8949999809265137 -10.375,2.1470000743865967 -9.92300033569336,2.078000068664551 C-8.756999969482422,1.899999976158142 -7.7210001945495605,2.265000104904175 -7.390999794006348,3.061000108718872 C-7.060999870300293,3.8570001125335693 -7.534999847412109,4.8470001220703125 -8.484999656677246,5.546000003814697 C-8.852999687194824,5.816999912261963 -9.008999824523926,6.328999996185303 -8.730999946594238,6.691999912261963 C-8.142999649047852,7.458000183105469 -7.458000183105469,8.142999649047852 -6.691999912261963,8.730999946594238 C-6.329999923706055,9.008999824523926 -5.816999912261963,8.852999687194824 -5.546000003814697,8.484999656677246 C-4.8480000495910645,7.534999847412109 -3.8570001125335693,7.060999870300293 -3.061000108718872,7.390999794006348 C-2.265000104904175,7.7210001945495605 -1.899999976158142,8.756999969482422 -2.078000068664551,9.92300033569336 C-2.1470000743865967,10.375 -1.8949999809265137,10.847000122070312 -1.4420000314712524,10.906000137329102 C-0.9700000286102295,10.968000411987305 -0.48899999260902405,11 0,11 C0.48899999260902405,11 0.9700000286102295,10.968000411987305 1.4420000314712524,10.906000137329102 C1.8949999809265137,10.847000122070312 2.1470000743865967,10.375 2.078000068664551,9.92300033569336 C1.899999976158142,8.756999969482422 2.2660000324249268,7.7210001945495605 3.062000036239624,7.390999794006348 C3.8580000400543213,7.060999870300293 4.8480000495910645,7.534999847412109 5.546000003814697,8.484999656677246 C5.816999912261963,8.852999687194824 6.328999996185303,9.008999824523926 6.691999912261963,8.730999946594238 C7.458000183105469,8.142999649047852 8.142999649047852,7.458000183105469 8.730999946594238,6.691999912261963 C9.008999824523926,6.328999996185303 8.852999687194824,5.816999912261963 8.484999656677246,5.546000003814697 C7.534999847412109,4.8480000495910645 7.060999870300293,3.8570001125335693 7.390999794006348,3.061000108718872 C7.7210001945495605,2.265000104904175 8.756999969482422,1.899999976158142 9.92300033569336,2.078000068664551 C10.375,2.1470000743865967 10.847000122070312,1.8949999809265137 10.906000137329102,1.4420000314712524 C10.968000411987305,0.9700000286102295 11,0.48899999260902405 11,0 C11,-0.48899999260902405 10.968000411987305,-0.9700000286102295 10.906000137329102,-1.4420000314712524 C10.847000122070312,-1.8949999809265137 10.375,-2.1470000743865967 9.92300033569336,-2.078000068664551 C8.756999969482422,-1.899999976158142 7.7210001945495605,-2.265000104904175 7.390999794006348,-3.061000108718872 C7.060999870300293,-3.8570001125335693 7.534999847412109,-4.8480000495910645 8.484999656677246,-5.546000003814697 C8.852999687194824,-5.816999912261963 9.008999824523926,-6.329999923706055 8.730999946594238,-6.691999912261963 C8.142999649047852,-7.458000183105469 7.458000183105469,-8.142999649047852 6.691999912261963,-8.730999946594238 C6.328999996185303,-9.008999824523926 5.817999839782715,-8.852999687194824 5.546999931335449,-8.484999656677246 C4.848999977111816,-7.534999847412109 3.8580000400543213,-7.060999870300293 3.062000036239624,-7.390999794006348 C2.2660000324249268,-7.7210001945495605 1.9010000228881836,-8.756999969482422 2.0789999961853027,-9.92300033569336 C2.1480000019073486,-10.375 1.8949999809265137,-10.847000122070312 1.4420000314712524,-10.906000137329102 C0.9700000286102295,-10.968000411987305 0.48899999260902405,-11 0,-11 C-0.48899999260902405,-11 -0.9700000286102295,-10.968000411987305 -1.4420000314712524,-10.906000137329102z M4,0 C4,2.2090001106262207 2.2090001106262207,4 0,4 C-2.2090001106262207,4 -4,2.2090001106262207 -4,0 C-4,-2.2090001106262207 -2.2090001106262207,-4 0,-4 C2.2090001106262207,-4 4,-2.2090001106262207 4,0z" data-cs="137"></path></g></g></g></g></svg></div></div></div></button></div></div></div></div></div>`;

const CAPTURED_BUTTON_CSS = `.button_a22cb0 { align-items: center; background: initial; border: 1px solid transparent; border-radius: var(--radius-sm); box-sizing: border-box; color: inherit; cursor: pointer; display: flex; flex-grow: 0; flex-shrink: 0; font-size: medium; font-weight: 400; justify-content: center; margin: 0px; max-height: min-content; max-width: 100%; padding: 0px; position: relative; text-align: start; transition: background-color 50ms ease-in, color 50ms ease-in, border-color 50ms ease-in, opacity 50ms ease-in; width: min-content; }
.button_a22cb0:hover { transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, opacity 0.15s ease-out; }
.button_a22cb0:disabled { opacity: 0.5; pointer-events: none; }
.highlight-mana-buttons .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-white-60); }
.highlight-mana-buttons [data-button-hoisted-classname-wrapper] .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-green-60); }
.buttonChildrenWrapper_a22cb0 { border-radius: var(--radius-sm); box-sizing: border-box; justify-content: center; position: relative; width: 100%; }
.buttonChildren_a22cb0, .buttonChildrenWrapper_a22cb0 { align-items: center; display: flex; overflow: hidden; }
.buttonChildren_a22cb0 { gap: var(--space-4); text-overflow: ellipsis; transition: opacity 0.2s ease-out, transform 0.2s ease-out; white-space: nowrap; }
.icon_a22cb0 { flex-shrink: 0; }
.buttonChildren_a22cb0 { opacity: 1; }
.buttonChildren_a22cb0.loading_a22cb0 { opacity: 0; }
.spinnerWrapper_a22cb0 { animation-duration: 0.2s; animation-fill-mode: forwards; animation-timing-function: ease; height: 100%; position: absolute; top: 0px; width: 100%; }
.spinnerWrapper_a22cb0.fadeIn_a22cb0 { animation-name: spinner-opacity-in_a22cb0; }
.spinnerWrapper_a22cb0.fadeOut_a22cb0 { animation-name: spinner-opacity-out_a22cb0; }
.full-motion .spinnerWrapper_a22cb0.fadeIn_a22cb0 { animation-name: spinner-transform-in_a22cb0, spinner-opacity-in_a22cb0; }
.full-motion .spinnerWrapper_a22cb0.fadeOut_a22cb0 { animation-name: spinner-transform-out_a22cb0, spinner-opacity-out_a22cb0; }
.full-motion .buttonChildren_a22cb0 { transform: translateY(0px); }
.full-motion .buttonChildren_a22cb0.loading_a22cb0 { transform: translateY(-100%); }
.xs_a22cb0 { border-radius: var(--radius-xs); }
.xs_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 22px; min-width: 22px; }
.xs_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,60px); }
.xs_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-8) - 1px); }
.sm_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 30px; min-width: 30px; }
.sm_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,60px); }
.sm_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-12) - 1px); }
.md_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 38px; min-width: 38px; }
.md_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,100px); }
.md_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-8) - 1px) calc(var(--space-16) - 1px); }
.spinnerItem_a22cb0 { background-color: currentcolor !important; }
.spinner_a22cb0 { height: 100%; }
.spinner-sm_a22cb0, .spinner-xs_a22cb0 { min-height: 16px; min-width: 16px; transform: scale(0.75); }
.spinner-md_a22cb0 { transform: scale(0.9); }
.spinner-lg_a22cb0, .spinner-md_a22cb0 { min-height: 20px; min-width: 20px; }
.primary_a22cb0 { background-color: var(--control-primary-background-default); border-color: var(--control-primary-border-default); color: var(--control-primary-text-default); }
.primary_a22cb0:hover { background-color: var(--control-primary-background-hover); border-color: var(--control-primary-border-hover); color: var(--control-primary-text-hover); }
.primary_a22cb0:active { background-color: var(--control-primary-background-active); border-color: var(--control-primary-border-active); color: var(--control-primary-text-active); }
.secondary_a22cb0 { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }
.secondary_a22cb0:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }
.secondary_a22cb0:active { background-color: var(--control-secondary-background-active); border-color: var(--control-secondary-border-active); color: var(--control-secondary-text-active); }
.icon-only_a22cb0 { background-color: transparent; border-color: transparent; color: var(--control-icon-only-icon-default); }
.icon-only_a22cb0:hover { background-color: var(--control-icon-only-background-hover); border-color: var(--control-icon-only-border-hover); color: var(--control-icon-only-icon-hover); }
.icon-only_a22cb0:active { background-color: var(--control-icon-only-background-active); border-color: var(--control-icon-only-border-active); color: var(--control-icon-only-icon-active); }
.color-mix_a22cb0 { background-color: transparent; border: transparent; color: var(--icon-strong); }
.color-mix_a22cb0:hover { color: var(--control-icon-only-icon-hover); }
.color-mix_a22cb0:active { color: var(--control-icon-only-icon-active); }
.color-mix_a22cb0::before { border: 1px solid transparent; border-radius: var(--radius-sm); box-sizing: border-box; content: ""; height: 100%; left: 0px; mix-blend-mode: plus-lighter; position: absolute; top: 0px; transition: background-color 50ms ease-in, border-color 50ms ease-in, opacity 50ms ease-in; width: 100%; }
.color-mix_a22cb0:hover::before { background-color: var(--control-icon-only-background-hover); border-color: var(--border-subtle); transition: background-color 0.15s ease-out, border-color 0.15s ease-out, opacity 0.15s ease-out; }
.color-mix_a22cb0:active::before { background-color: var(--control-icon-only-background-active); border-color: var(--border-subtle); }
.input-accessory_a22cb0 { border-radius: var(--radius-xs); color: var(--icon-strong); }
.theme-light .color-mix_a22cb0::before { mix-blend-mode: difference; }
.critical-primary_a22cb0 { background-color: var(--control-critical-primary-background-default); border-color: var(--control-critical-primary-border-default); color: var(--control-critical-primary-text-default); }
.critical-primary_a22cb0:hover { background-color: var(--control-critical-primary-background-hover); border-color: var(--control-critical-primary-border-hover); color: var(--control-critical-primary-text-hover); }
.critical-primary_a22cb0:active { background-color: var(--control-critical-primary-background-active); border-color: var(--control-critical-primary-border-active); color: var(--control-critical-primary-text-active); }
.critical-secondary_a22cb0 { background-color: var(--control-critical-secondary-background-default); border-color: var(--control-critical-secondary-border-default); color: var(--control-critical-secondary-text-default); }
.critical-secondary_a22cb0:hover { background-color: var(--control-critical-secondary-background-hover); border-color: var(--control-critical-secondary-border-hover); color: var(--control-critical-secondary-text-hover); }
.critical-secondary_a22cb0:active { background-color: var(--control-critical-secondary-background-active); border-color: var(--control-critical-secondary-border-active); color: var(--control-critical-secondary-text-active); }
.active_a22cb0 { background-color: var(--control-connected-background-default); border-color: var(--control-connected-border-default); color: var(--control-connected-text-default); }
.active_a22cb0:hover { background-color: var(--control-connected-background-hover); border-color: var(--control-connected-border-hover); color: var(--control-connected-text-hover); }
.active_a22cb0:active { background-color: var(--control-connected-background-active); border-color: var(--control-connected-border-active); color: var(--control-connected-text-active); }
.overlay-primary_a22cb0 { background-color: var(--control-overlay-primary-background-default); border-color: var(--control-overlay-primary-border-default); color: var(--control-overlay-primary-text-default); }
.overlay-primary_a22cb0:hover { background-color: var(--control-overlay-primary-background-hover); border-color: var(--control-overlay-primary-border-hover); color: var(--control-overlay-primary-text-hover); }
.overlay-primary_a22cb0:active { background-color: var(--control-overlay-primary-background-active); border-color: var(--control-overlay-primary-border-active); color: var(--control-overlay-primary-text-active); }
.overlay-secondary_a22cb0 { background-color: var(--control-overlay-secondary-background-default); border-color: var(--control-overlay-secondary-border-default); color: var(--control-overlay-secondary-text-default); }
.overlay-secondary_a22cb0:hover { background-color: var(--control-overlay-secondary-background-hover); border-color: var(--control-overlay-secondary-border-hover); color: var(--control-overlay-secondary-text-hover); }
.overlay-secondary_a22cb0:active { background-color: var(--control-overlay-secondary-background-active); border-color: var(--control-overlay-secondary-border-active); color: var(--control-overlay-secondary-text-active); }
.expressive_a22cb0 > * { pointer-events: none; z-index: 1; }
.expressiveRive_a22cb0 { height: calc(100% + var(--__glow-amount)*2 + 2px); left: calc(var(--__glow-amount)*-1 - 1px); position: absolute; top: calc(var(--__glow-amount)*-1 - 1px); width: calc(100% + var(--__glow-amount)*2 + 2px); }
.expressive_a22cb0 .expressiveBackground_a22cb0 { filter: blur(10px) saturate(var(--saturation-factor,1)); }
.reduce-motion .expressive_a22cb0 .expressiveBackground_a22cb0 { filter: blur(7px) saturate(var(--saturation-factor,1)); }
.expressive_a22cb0 { color: var(--control-expressive-text-default); }
.expressive_a22cb0 .expressiveFill_a22cb0 { --__glow-amount: 0px; background-color: var(--control-expressive-background-default); border-radius: 8px; transition: background-color 0.15s, width 0.15s, height 0.15s, top 0.15s, left 0.15s; }
.expressive_a22cb0:hover { color: var(--control-expressive-text-hover); }
.expressive_a22cb0:hover .expressiveFill_a22cb0 { background-color: var(--control-expressive-background-hover); }
.expressive_a22cb0:active { color: var(--control-expressive-text-active); }
.expressive_a22cb0:active .expressiveFill_a22cb0 { --__glow-amount: -1px; background-color: var(--control-expressive-background-active); }
.expressive_a22cb0 .expressiveHoverContainer_a22cb0 { filter: blur(8px); mix-blend-mode: plus-lighter; pointer-events: all; }
.expressiveWrapper_a22cb0 { --__glow-amount: 8px; display: flex; max-width: 100%; position: relative; width: min-content; }
.fullWidth_a22cb0.hasText_a22cb0 { flex: 1 1 0%; width: 100%; }
.rounded_a22cb0 { border-radius: var(--radius-round); }
.enable-forced-colors .button_a22cb0 { background-color: buttonface; border-color: buttontext; color: buttontext; forced-color-adjust: none; }
.enable-forced-colors .button_a22cb0:disabled { background-color: canvas; border-color: graytext; color: graytext; opacity: 1; }
.enable-forced-colors .button_a22cb0 .expressiveFill_a22cb0 { display: none; }`;

const CAPTURED_SUMMARY_ARROW = `<svg class="screenArrowIcon_e529a0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm16 3a1 1 0 0 0-.3-.7l-3-3a1 1 0 1 0-1.4 1.4L14.58 7H13a6 6 0 0 0-6 6 1 1 0 1 0 2 0 4 4 0 0 1 4-4h1.59l-1.3 1.3a1 1 0 0 0 1.42 1.4l3-3A1 1 0 0 0 18 8Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M13 19.5c0 .28.22.5.5.5H15a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h1.5a.5.5 0 0 0 .5-.5v-2c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v2Z" class=""></path></svg>`;
const CAPTURED_SUMMARY_GEAR = `<svg class="icon_e529a0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" class=""></path></svg>`;

const CAPTURED_PICKER_CSS = `.scrollerBase_d125d2 { box-sizing: border-box; flex: 1 1 auto; min-height: 0px; position: relative; }
.scrollbarGutterStable_d125d2 { scrollbar-gutter: stable; }
.auto_d125d2, .none_d125d2, .thin_d125d2 { }
.auto_d125d2::-webkit-scrollbar { height: 16px; width: 16px; }
.auto_d125d2::-webkit-scrollbar-track { background-color: var(--scrollbar-auto-track); }
.auto_d125d2::-webkit-scrollbar-thumb, .auto_d125d2::-webkit-scrollbar-track { background-clip: padding-box; border: 4px solid transparent; border-radius: 8px; }
.auto_d125d2::-webkit-scrollbar-thumb { background-color: var(--scrollbar-auto-thumb); min-height: 40px; }
.auto_d125d2::-webkit-scrollbar-corner { background-color: transparent; }
.custom-theme-background .customTheme_d125d2.auto_d125d2::-webkit-scrollbar-track { background-color: var(--background-mod-muted); }
.no-webkit-scrollbar .auto_d125d2 { scrollbar-color: var(--scrollbar-auto-scrollbar-color-thumb) var(--scrollbar-auto-scrollbar-color-track); scrollbar-width: auto; }
.no-webkit-scrollbar .auto_d125d2.fade_d125d2.scrolling_d125d2, .no-webkit-scrollbar .auto_d125d2.fade_d125d2:hover { scrollbar-color: var(--scrollbar-auto-scrollbar-color-thumb) var(--scrollbar-auto-scrollbar-color-track); }
.enable-forced-colors .auto_d125d2::-webkit-scrollbar { height: 8px; width: 8px; }
.enable-forced-colors .auto_d125d2::-webkit-scrollbar-track { border-radius: 0px; border-width: 1px; }
.defaultColor__4bd52 { color: var(--text-default); }
.lineClamp1__4bd52 { min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.container__8a031, .outerContainer__8a031 { box-sizing: border-box; display: flex; }
.container__8a031 { --custom-border-radius: var(--radius-md); background: var(--background-surface-high); border: 1px solid var(--border-subtle); border-radius: var(--custom-border-radius); box-shadow: var(--shadow-high); color: var(--text-default); flex-direction: column; max-height: 100%; pointer-events: auto; width: 100%; }
.padding-size-sm__8a031 { --custom-modal-padding: var(--space-24); --custom-modal-padding-sm: var(--space-8); --custom-modal-padding-md: var(--space-16); --custom-modal-padding-top: var(--custom-modal-padding-sm); --custom-modal-padding-bottom: var(--custom-modal-padding-md); }
.padding-size-lg__8a031, .padding-size-sm__8a031 { padding-bottom: var(--custom-modal-padding-bottom); padding-top: var(--custom-modal-padding-top); }
.size-xl__8a031 { max-width: 960px; }
@media (max-height: 550px), (max-width: 485px) {
  .fullScreenOnMobile__8a031 .container__8a031 { --custom-border-radius: 0; --custom-modal-padding-top: calc(var(--custom-app-top-bar-height) + var(--custom-modal-padding-sm)); border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; height: 100%; overflow-y: auto; }
}
.button_a22cb0 { align-items: center; background: initial; border: 1px solid transparent; border-radius: var(--radius-sm); box-sizing: border-box; color: inherit; cursor: pointer; display: flex; flex-grow: 0; flex-shrink: 0; font-size: medium; font-weight: 400; justify-content: center; margin: 0px; max-height: min-content; max-width: 100%; padding: 0px; position: relative; text-align: start; transition: background-color 50ms ease-in, color 50ms ease-in, border-color 50ms ease-in, opacity 50ms ease-in; width: min-content; }
.button_a22cb0:hover { transition: background-color 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, opacity 0.15s ease-out; }
.button_a22cb0:disabled { opacity: 0.5; pointer-events: none; }
.highlight-mana-buttons .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-white-60); }
.highlight-mana-buttons [data-button-hoisted-classname-wrapper] .button_a22cb0 { box-shadow: 0 0 4px 4px var(--opacity-green-60); }
.buttonChildrenWrapper_a22cb0 { border-radius: var(--radius-sm); box-sizing: border-box; justify-content: center; position: relative; width: 100%; }
.buttonChildren_a22cb0, .buttonChildrenWrapper_a22cb0 { align-items: center; display: flex; overflow: hidden; }
.buttonChildren_a22cb0 { gap: var(--space-4); text-overflow: ellipsis; transition: opacity 0.2s ease-out, transform 0.2s ease-out; white-space: nowrap; }
.icon_a22cb0 { flex-shrink: 0; }
.buttonChildren_a22cb0 { opacity: 1; }
.buttonChildren_a22cb0.loading_a22cb0 { opacity: 0; }
.full-motion .buttonChildren_a22cb0 { transform: translateY(0px); }
.full-motion .buttonChildren_a22cb0.loading_a22cb0 { transform: translateY(-100%); }
.xs_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 22px; min-width: 22px; }
.xs_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,60px); }
.xs_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-8) - 1px); }
.sm_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 30px; min-width: 30px; }
.sm_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,60px); }
.sm_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-4) - 1px) calc(var(--space-12) - 1px); }
.md_a22cb0 .buttonChildrenWrapper_a22cb0 { min-height: 38px; min-width: 38px; }
.md_a22cb0.hasText_a22cb0 { min-width: var(--__button-min-width,100px); }
.md_a22cb0.hasText_a22cb0 .buttonChildrenWrapper_a22cb0 { padding: calc(var(--space-8) - 1px) calc(var(--space-16) - 1px); }
.primary_a22cb0 { background-color: var(--control-primary-background-default); border-color: var(--control-primary-border-default); color: var(--control-primary-text-default); }
.primary_a22cb0:hover { background-color: var(--control-primary-background-hover); border-color: var(--control-primary-border-hover); color: var(--control-primary-text-hover); }
.primary_a22cb0:active { background-color: var(--control-primary-background-active); border-color: var(--control-primary-border-active); color: var(--control-primary-text-active); }
.secondary_a22cb0 { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }
.secondary_a22cb0:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }
.secondary_a22cb0:active { background-color: var(--control-secondary-background-active); border-color: var(--control-secondary-border-active); color: var(--control-secondary-text-active); }
.fullWidth_a22cb0.hasText_a22cb0 { flex: 1 1 0%; width: 100%; }
.enable-forced-colors .button_a22cb0 { background-color: buttonface; border-color: buttontext; color: buttontext; forced-color-adjust: none; }
.enable-forced-colors .button_a22cb0:disabled { background-color: canvas; border-color: graytext; color: graytext; opacity: 1; }
.enable-forced-colors .button_a22cb0 .expressiveFill_a22cb0 { display: none; }
.lottieIconColors__5eb9b :not(defs *)[fill][fill-opacity] { fill: var(--__lottieIconColor,var(--interactive-text-default)); }
.lottieIconColors__5eb9b :not(defs *)[stroke][stroke-opacity] { stroke: var(--__lottieIconColor,var(--interactive-text-default)); }
.lottieIcon__5eb9b svg { transform: none !important; }
.enable-forced-colors .lottieIcon__5eb9b :not(defs *)[fill][fill-opacity] { fill: currentcolor; }
.enable-forced-colors .lottieIcon__5eb9b :not(defs *)[stroke][stroke-opacity] { stroke: currentcolor; }
.tabListItem__9e06a { flex: 0 1 auto; }
.tabListItemPill__9e06a { flex: 1 1 0%; }
.pillContainer__9e06a, .tabContainer__9e06a { display: flex; flex-direction: row; }
.pillContainer__9e06a { background-color: var(--background-base-lowest); border-radius: var(--radius-md); gap: var(--space-4); justify-content: stretch; padding: var(--space-4); }
.pillItem__9e06a { border-radius: var(--radius-sm); color: var(--text-subtle); cursor: pointer; display: flex; flex: 1 1 auto; justify-content: center; padding: 8px 16px; }
.pillItem__9e06a:not(.pillItemSelected__9e06a):hover { background-color: var(--background-mod-subtle); }
.pillItemSelected__9e06a { background-color: var(--background-surface-high); color: var(--interactive-text-active); }
.icon__9e06a { height: 16px; width: 16px; }
.controlText__9e06a { align-items: center; display: flex; gap: var(--space-8); }
.pillItemText__9e06a { line-height: 1; }
.root__2f580 { display: grid; gap: 24px 16px; grid-template-columns: 1fr 1fr; }
.source__2f580 { display: flex; flex-direction: column; max-width: 447px; min-width: 0px; }
.source__2f580:hover { cursor: pointer; }
.source__2f580:hover .sourceOverlay__2f580 { display: flex; }
.source__2f580:hover:not(.selectedSource__2f580) .sourcePreviewContainer__2f580::before { border-color: var(--background-mod-strong); }
.selectedSource__2f580 .sourcePreviewContainer__2f580::before { border-color: var(--brand-500); }
.sourcePreviewContainer__2f580 { border-radius: var(--radius-md); position: relative; }
.sourcePreviewContainer__2f580::before { border: 2px solid transparent; border-radius: var(--radius-md); bottom: -4px; content: ""; position: absolute; top: -4px; inset-inline: -4px; }
.sourcePreviewImage__2f580 { height: 100%; object-fit: contain; object-position: center center; width: 100%; }
.sourcePreview__2f580 { aspect-ratio: 16 / 9; background-color: var(--black); border-radius: var(--radius-sm); max-width: 447px; overflow: hidden; position: relative; }
.sourceOverlay__2f580 { align-items: center; background: var(--opacity-black-40); display: none; justify-content: center; position: absolute; top: 0px; inset-inline: 0px; bottom: 0px; }
.sourceOverlayCTA__2f580 { background-color: var(--white); border-radius: var(--radius-sm); color: var(--black); padding: var(--space-12) var(--space-24); }
.sourceNameContainer__2f580 { align-items: center; display: flex; gap: var(--space-8); margin-top: var(--space-8); width: 100%; }
.sourceName__2f580 { flex: 1 1 auto; min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.root_e529a0 { align-items: center; gap: var(--space-16); }
.root_e529a0, .summary_e529a0 { display: flex; min-width: 0px; }
.summary_e529a0 { flex-direction: column; gap: 2px; justify-content: center; }
.summaryDetail_e529a0 { align-items: center; display: flex; gap: var(--space-8); }
.summaryDetail_e529a0 span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.summaryDetail_e529a0 span:last-child { flex: 1 1 auto; }
.icon_e529a0 { flex-shrink: 0; }
.iconSummaryContainer_e529a0 { align-items: center; display: flex; gap: 4px; }
.ellipsis_e529a0 { color: var(--background-mod-subtle); }
.sourceOrPresetName_e529a0 { min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.screenArrowIcon_e529a0 { background-color: var(--background-mod-subtle); border-radius: var(--radius-sm); color: var(--icon-muted); flex-shrink: 0; padding: var(--space-8); }
.root_a55fdc { display: flex; flex-direction: column; height: calc(-80px + 100vh); max-height: 720px; overflow: hidden; width: 100%; }
.root_a55fdc.nativePicker_a55fdc { height: 570px; }
@media (max-height: 820px) {
  .root_a55fdc.nativePicker_a55fdc { height: min(570px, -90px + 100vh); max-height: 550px; }
}
.root_a55fdc.channelSelector_a55fdc { height: 504px; }
.root_a55fdc.confirmStep_a55fdc { height: auto; }
.footer_a55fdc { background-color: var(--background-surface-high); }
.footerContent_a55fdc { display: flex; flex-direction: row; gap: var(--space-32); justify-content: space-between; padding: var(--space-16) var(--space-24) 0; }
.header_a55fdc { padding: var(--space-16) var(--space-24); }
.segmentedControl_a55fdc { flex: 1 1 auto; }
.segmentedControlOption_a55fdc { flex-basis: 0px; }
.content_a55fdc { padding-inline: var(--space-24); padding-top: var(--space-8); position: relative; }
.rightButtonGroup_a55fdc { align-items: center; display: flex; gap: var(--space-8); }
.sourceIcon__2f580 { border-radius: 2px; flex-shrink: 0; height: 16px; width: 16px; }`;
