/**
 * Markup and styles of Discord's live-stream hover preview.
 */

const CAPTURED_PREVIEW_HTML = `<div class="container_d7bc5d popover_d6f39b scrollbarGutterStable_d125d2 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll;"><div class="streamPreviewWrapper__0489e"><div class="streamHeaderVoiceUserActivities__0489e"><div class="text-xs/medium_cf4812" data-text-variant="text-xs/medium" style="color: var(--text-muted);">Transmitindo agora</div><div class="eyebrow_cf4812 live_a7acae liveSmall_a7acae textBadge__463b7 base__463b7 liveShapeRound_a7acae" data-text-variant="eyebrow" style="background-color: var(--red-400);">Ao Vivo</div></div><div class="previewContainerUserActivity__0489e previewContainer__0489e" role="button" tabindex="0"><div class="previewImage__0489e"><img alt="" class="image__04666" draggable="false" data-placeholder="thumb"></div><div class="previewHover__0489e"><div class="text-sm/normal_cf4812 white__0489e" data-text-variant="text-sm/normal">Você está transmitindo!</div></div></div><div class="bodyUserActivity__0489e"><div class="flex__7c0ba vertical_abf706 justifyStart_abf706 alignStretch_abf706 wrap_abf706 activityActions__0489e buttonsWrapper__65bb6 vertical__65bb6" style="flex: 0 1 auto;"><div class="watchStreamRow__43481"><button data-mana-component="button" role="button" class="button_a22cb0 sm_a22cb0 secondary_a22cb0 hasText_a22cb0 fullWidth_a22cb0" type="button" disabled=""><div class="buttonChildrenWrapper_a22cb0"><div class="buttonChildren_a22cb0"><svg class="icon_a22cb0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm16 3a1 1 0 0 0-.3-.7l-3-3a1 1 0 1 0-1.4 1.4L14.58 7H13a6 6 0 0 0-6 6 1 1 0 1 0 2 0 4 4 0 0 1 4-4h1.59l-1.3 1.3a1 1 0 0 0 1.42 1.4l3-3A1 1 0 0 0 18 8Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M13 19.5c0 .28.22.5.5.5H15a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h1.5a.5.5 0 0 0 .5-.5v-2c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v2Z" class=""></path></svg><span class="lineClamp1__4bd52 text-sm/medium_cf4812" data-text-variant="text-sm/medium">Você está transmitindo!</span></div></div></button></div></div></div></div></div>`;

const CAPTURED_PREVIEW_CSS = `:root {
  --background-secondary-alt: color-mix(in oklab,hsl(232.5 calc(1*6.557%) 23.922%/1) 100%,#000 0%);
  --background-surface-high: color-mix(in oklab,hsl(240 calc(1*6.494%) 15.098%/1) 100%,#000 0%);
  --border-muted: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --control-secondary-background-active: hsl(240 calc(1*4%) 60.784%/0.2);
  --control-secondary-background-default: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --control-secondary-background-hover: hsl(240 calc(1*4%) 60.784%/0.1607843137254902);
  --control-secondary-border-active: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-default: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-hover: hsl(240 calc(1*4%) 60.784%/0.0392156862745098);
  --control-secondary-text-active: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-default: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-hover: hsl(0 calc(1*0%) 98.431%/1);
  --custom-live-indicator-border-radius: 16px;
  --font-primary: "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  --font-weight-semibold: 600;
  --opacity-black-60: hsl(0 calc(1*0%) 0%/0.6);
  --opacity-green-60: hsl(151.128 calc(1*100%) 26.078%/0.6);
  --opacity-white-60: hsl(0 calc(1*0%) 100%/0.6);
  --primary-500-hsl: 234.545 calc(1*6.509%) 33.137%;
  --radius-md: 12px;
  --radius-sm: 8px;
  --red-400: hsl(357.692 calc(1*67.826%) 54.902%/1);
  --scrollbar-thin-thumb: color-mix(in oklab,hsl(234.545 calc(1*5.473%) 39.412%/1) 100%,#000 0%);
  --scrollbar-thin-track: color-mix(in oklab,hsl(0 calc(1*0%) 0%/0) 100%,hsl(0 0% 0%/0) 0%);
  --shadow-border: 0 0 0 1px hsl(none 0% 100%/0.08);
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --space-16: 16px;
  --space-4: 4px;
  --space-8: 8px;
  --space-sm: 12px;
  --space-xs: 8px;
  --text-muted: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
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

.flex__7c0ba, .horizontal__7c0ba { display: flex; }

.horizontal__7c0ba > .flex__7c0ba, .horizontal__7c0ba > .flexChild__7c0ba { margin-inline: 10px; }

.horizontal__7c0ba > .flex__7c0ba:first-child, .horizontal__7c0ba > .flexChild__7c0ba:first-child { margin-inline-start: 0px; }

.horizontal__7c0ba > .flex__7c0ba:last-child, .horizontal__7c0ba > .flexChild__7c0ba:last-child { margin-inline-end: 0px; }

.horizontalReverse__7c0ba > .flex__7c0ba, .horizontalReverse__7c0ba > .flexChild__7c0ba { margin-inline: 10px; }

.horizontalReverse__7c0ba > .flex__7c0ba:first-child, .horizontalReverse__7c0ba > .flexChild__7c0ba:first-child { margin-inline-end: 0px; }

.horizontalReverse__7c0ba > .flex__7c0ba:last-child, .horizontalReverse__7c0ba > .flexChild__7c0ba:last-child { margin-inline-start: 0px; }

.alignStretch_abf706 { align-items: stretch; }

.justifyStart_abf706 { justify-content: flex-start; }

.wrap_abf706 { flex-wrap: wrap; }

.vertical_abf706 { display: flex; flex-direction: column; }

.horizontal_abf706 > .spacer_abf706, .horizontalReverse_abf706 > .spacer_abf706, .vertical_abf706 > .spacer_abf706 { min-height: 1px; }

.lineClamp1__4bd52 { min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.eyebrow_cf4812 { font-family: var(--font-primary); font-size: 12px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.33333; text-transform: uppercase; }

.eyebrow_cf4812.fontScaling_cf4812 { font-size: 0.75rem; }

:where(.mana-type-consolidation) .eyebrow_cf4812 { font-family: var(--font-primary); font-size: 14px; font-weight: 500; letter-spacing: normal; line-height: 1.28571; text-transform: none; }

:where(.mana-type-consolidation) .eyebrow_cf4812.fontScaling_cf4812 { font-size: 0.875rem; }

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

.secondary_a22cb0 { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }

.secondary_a22cb0:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }

.secondary_a22cb0:active { background-color: var(--control-secondary-background-active); border-color: var(--control-secondary-border-active); color: var(--control-secondary-text-active); }

.fullWidth_a22cb0.hasText_a22cb0 { flex: 1 1 0%; width: 100%; }

.enable-forced-colors .button_a22cb0 { background-color: buttonface; border-color: buttontext; color: buttontext; forced-color-adjust: none; }

.enable-forced-colors .button_a22cb0:disabled { background-color: canvas; border-color: graytext; color: graytext; opacity: 1; }

.enable-forced-colors .button_a22cb0 .expressiveFill_a22cb0 { display: none; }

.base__463b7 { box-sizing: border-box; color: var(--white); flex: 0 0 auto; height: 16px; min-height: 16px; min-width: 16px; text-align: center; text-transform: uppercase; }

.textBadge__463b7 { border-radius: var(--radius-sm); overflow: hidden; padding: 0px 6px; text-overflow: ellipsis; white-space: nowrap; }

.enable-forced-colors .base__463b7 { color: highlighttext; forced-color-adjust: none; outline: canvas solid 2px; background-color: highlight !important; }

.popover_d6f39b { background: var(--background-surface-high); border-radius: var(--radius-md); box-shadow: inset 0 0 0 1px var(--border-subtle),var(--shadow-high); box-sizing: border-box; display: flex; flex-direction: column; gap: var(--space-16); padding: var(--space-16); position: relative; text-align: center; --custom-popover-caret-gradient-color-start: transparent; --custom-popover-caret-gradient-color-end: transparent; }

:where(.popover_d6f39b) { max-width: var(--custom-popover-width); width: var(--custom-popover-width); }

.live_a7acae { padding: 0px 6px; }

.liveShapeRound_a7acae { border-radius: var(--custom-live-indicator-border-radius); }

.liveSmall_a7acae { text-transform: uppercase; }

.image__04666 { height: 100%; object-fit: contain; width: 100%; }

.watchStreamRow__43481 { align-items: stretch; display: flex; flex-direction: row; gap: 8px; }

.buttonsWrapper__65bb6 { flex: 0 1 auto; margin-top: 12px; }

.buttonsWrapper__65bb6:empty { margin: 0px; }

.vertical__65bb6 > :not(:first-child) { margin-top: 8px; }

.streamPreviewWrapper__0489e { width: 100%; }

.streamHeaderVoiceUserActivities__0489e { display: flex; justify-content: space-between; margin-bottom: var(--space-xs); }

.previewContainer__0489e { background-color: var(--background-secondary-alt); box-sizing: border-box; height: 142px; position: relative; width: 100%; }

.previewContainer__0489e:hover .previewHover__0489e { opacity: 1; }

.previewContainerUserActivity__0489e { border-radius: var(--radius-sm); overflow: hidden; }

.skipContainer__0489e .previewContainer__0489e { box-shadow: var(--shadow-border),var(--shadow-high); }

.previewHover__0489e { align-items: center; opacity: 0; position: absolute; top: 0px; inset-inline: 0px; bottom: 0px; cursor: pointer; display: flex; font-weight: var(--font-weight-semibold); justify-content: center; line-height: 18px; transition: opacity 0.2s ease-in-out; }

.previewImage__0489e { height: 100%; width: 100%; }

.bodyUserActivity__0489e { padding-top: var(--space-xs); }

.activityActions__0489e { margin-top: 0px; }

.white__0489e { color: var(--white); }

.theme-dark .previewHover__0489e { background: var(--opacity-black-60); }

.theme-light .previewHover__0489e { background: hsl(var(--primary-500-hsl)/.6); }

.container_d7bc5d { display: flex; flex-direction: column; gap: var(--space-sm); max-height: 90vh; text-align: unset; width: 280px; }

.container_d7bc5d > :not(:first-child) { border-top: 1px solid var(--border-muted); padding-top: var(--space-sm); }

.has-webkit-scrollbar .container_d7bc5d { padding-inline-end: calc(var(--space-16) - var(--space-8)); }
:root {
  --background-secondary-alt: color-mix(in oklab,hsl(232.5 calc(1*6.557%) 23.922%/1) 100%,#000 0%);
  --background-surface-high: color-mix(in oklab,hsl(240 calc(1*6.494%) 15.098%/1) 100%,#000 0%);
  --border-muted: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --control-secondary-background-active: hsl(240 calc(1*4%) 60.784%/0.2);
  --control-secondary-background-default: hsl(240 calc(1*4%) 60.784%/0.12156862745098039);
  --control-secondary-background-hover: hsl(240 calc(1*4%) 60.784%/0.1607843137254902);
  --control-secondary-border-active: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-default: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.0392156862745098) 100%,hsl(0 0% 0%/0.0392156862745098) 0%);
  --control-secondary-border-hover: hsl(240 calc(1*4%) 60.784%/0.0392156862745098);
  --control-secondary-text-active: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-default: hsl(0 calc(1*0%) 98.431%/1);
  --control-secondary-text-hover: hsl(0 calc(1*0%) 98.431%/1);
  --custom-live-indicator-border-radius: 16px;
  --font-primary: "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  --font-weight-semibold: 600;
  --opacity-black-60: hsl(0 calc(1*0%) 0%/0.6);
  --opacity-green-60: hsl(151.128 calc(1*100%) 26.078%/0.6);
  --opacity-white-60: hsl(0 calc(1*0%) 100%/0.6);
  --primary-500-hsl: 234.545 calc(1*6.509%) 33.137%;
  --radius-md: 12px;
  --radius-sm: 8px;
  --red-400: hsl(357.692 calc(1*67.826%) 54.902%/1);
  --scrollbar-thin-thumb: color-mix(in oklab,hsl(234.545 calc(1*5.473%) 39.412%/1) 100%,#000 0%);
  --scrollbar-thin-track: color-mix(in oklab,hsl(0 calc(1*0%) 0%/0) 100%,hsl(0 0% 0%/0) 0%);
  --shadow-border: 0 0 0 1px hsl(none 0% 100%/0.08);
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --space-16: 16px;
  --space-4: 4px;
  --space-8: 8px;
  --space-sm: 12px;
  --space-xs: 8px;
  --text-default: color-mix(in oklab,hsl(240 calc(1*6.667%) 94.118%/1) 100%,#000 0%);
  --text-muted: color-mix(in oklab,hsl(232.5 calc(1*3.96%) 60.392%/1) 100%,#000 0%);
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

.flex__7c0ba, .horizontal__7c0ba { display: flex; }

.horizontal__7c0ba > .flex__7c0ba, .horizontal__7c0ba > .flexChild__7c0ba { margin-inline: 10px; }

.horizontal__7c0ba > .flex__7c0ba:first-child, .horizontal__7c0ba > .flexChild__7c0ba:first-child { margin-inline-start: 0px; }

.horizontal__7c0ba > .flex__7c0ba:last-child, .horizontal__7c0ba > .flexChild__7c0ba:last-child { margin-inline-end: 0px; }

.horizontalReverse__7c0ba > .flex__7c0ba, .horizontalReverse__7c0ba > .flexChild__7c0ba { margin-inline: 10px; }

.horizontalReverse__7c0ba > .flex__7c0ba:first-child, .horizontalReverse__7c0ba > .flexChild__7c0ba:first-child { margin-inline-end: 0px; }

.horizontalReverse__7c0ba > .flex__7c0ba:last-child, .horizontalReverse__7c0ba > .flexChild__7c0ba:last-child { margin-inline-start: 0px; }

.alignStretch_abf706 { align-items: stretch; }

.justifyStart_abf706 { justify-content: flex-start; }

.wrap_abf706 { flex-wrap: wrap; }

.vertical_abf706 { display: flex; flex-direction: column; }

.horizontal_abf706 > .spacer_abf706, .horizontalReverse_abf706 > .spacer_abf706, .vertical_abf706 > .spacer_abf706 { min-height: 1px; }

.lineClamp1__4bd52 { min-width: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.eyebrow_cf4812 { font-family: var(--font-primary); font-size: 12px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.33333; text-transform: uppercase; }

.eyebrow_cf4812.fontScaling_cf4812 { font-size: 0.75rem; }

:where(.mana-type-consolidation) .eyebrow_cf4812 { font-family: var(--font-primary); font-size: 14px; font-weight: 500; letter-spacing: normal; line-height: 1.28571; text-transform: none; }

:where(.mana-type-consolidation) .eyebrow_cf4812.fontScaling_cf4812 { font-size: 0.875rem; }

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

.secondary_a22cb0 { background-color: var(--control-secondary-background-default); border-color: var(--control-secondary-border-default); color: var(--control-secondary-text-default); }

.secondary_a22cb0:hover { background-color: var(--control-secondary-background-hover); border-color: var(--control-secondary-border-hover); color: var(--control-secondary-text-hover); }

.secondary_a22cb0:active { background-color: var(--control-secondary-background-active); border-color: var(--control-secondary-border-active); color: var(--control-secondary-text-active); }

.fullWidth_a22cb0.hasText_a22cb0 { flex: 1 1 0%; width: 100%; }

.enable-forced-colors .button_a22cb0 { background-color: buttonface; border-color: buttontext; color: buttontext; forced-color-adjust: none; }

.enable-forced-colors .button_a22cb0:disabled { background-color: canvas; border-color: graytext; color: graytext; opacity: 1; }

.enable-forced-colors .button_a22cb0 .expressiveFill_a22cb0 { display: none; }

.base__463b7 { box-sizing: border-box; color: var(--white); flex: 0 0 auto; height: 16px; min-height: 16px; min-width: 16px; text-align: center; text-transform: uppercase; }

.textBadge__463b7 { border-radius: var(--radius-sm); overflow: hidden; padding: 0px 6px; text-overflow: ellipsis; white-space: nowrap; }

.enable-forced-colors .base__463b7 { color: highlighttext; forced-color-adjust: none; outline: canvas solid 2px; background-color: highlight !important; }

.popover_d6f39b { background: var(--background-surface-high); border-radius: var(--radius-md); box-shadow: inset 0 0 0 1px var(--border-subtle),var(--shadow-high); box-sizing: border-box; display: flex; flex-direction: column; gap: var(--space-16); padding: var(--space-16); position: relative; text-align: center; --custom-popover-caret-gradient-color-start: transparent; --custom-popover-caret-gradient-color-end: transparent; }

:where(.popover_d6f39b) { max-width: var(--custom-popover-width); width: var(--custom-popover-width); }

.live_a7acae { padding: 0px 6px; }

.liveShapeRound_a7acae { border-radius: var(--custom-live-indicator-border-radius); }

.liveSmall_a7acae { text-transform: uppercase; }

.emptyPreviewContainer__04666 { align-items: center; position: absolute; top: 0px; inset-inline: 0px; bottom: 0px; display: flex; flex: 1 1 auto; flex-direction: column; gap: 10px; justify-content: center; }

.emptyPreviewImage__04666 { background-position: 50% center; background-repeat: no-repeat; height: 60%; width: 80%; }

.emptyPreviewText__04666 { color: var(--text-default); }

.images-light .emptyPreviewImage__04666 { background-image: url("https://discord.com/assets/bc689a4cf705a445.svg"); }

.images-light .emptyPreviewImage__04666.noImage__04666 { background-image: none; }

.images-dark .emptyPreviewImage__04666 { background-image: url("https://discord.com/assets/6b1a461f35c05c7a.svg"); }

.images-dark .emptyPreviewImage__04666.noImage__04666 { background-image: none; }

.watchStreamRow__43481 { align-items: stretch; display: flex; flex-direction: row; gap: 8px; }

.buttonsWrapper__65bb6 { flex: 0 1 auto; margin-top: 12px; }

.buttonsWrapper__65bb6:empty { margin: 0px; }

.vertical__65bb6 > :not(:first-child) { margin-top: 8px; }

.streamPreviewWrapper__0489e { width: 100%; }

.streamHeaderVoiceUserActivities__0489e { display: flex; justify-content: space-between; margin-bottom: var(--space-xs); }

.previewContainer__0489e { background-color: var(--background-secondary-alt); box-sizing: border-box; height: 142px; position: relative; width: 100%; }

.previewContainer__0489e:hover .previewHover__0489e { opacity: 1; }

.previewContainerUserActivity__0489e { border-radius: var(--radius-sm); overflow: hidden; }

.skipContainer__0489e .previewContainer__0489e { box-shadow: var(--shadow-border),var(--shadow-high); }

.previewHover__0489e { align-items: center; opacity: 0; position: absolute; top: 0px; inset-inline: 0px; bottom: 0px; cursor: pointer; display: flex; font-weight: var(--font-weight-semibold); justify-content: center; line-height: 18px; transition: opacity 0.2s ease-in-out; }

.previewImage__0489e { height: 100%; width: 100%; }

.bodyUserActivity__0489e { padding-top: var(--space-xs); }

.activityActions__0489e { margin-top: 0px; }

.white__0489e { color: var(--white); }

.theme-dark .previewHover__0489e { background: var(--opacity-black-60); }

.theme-light .previewHover__0489e { background: hsl(var(--primary-500-hsl)/.6); }

.container_d7bc5d { display: flex; flex-direction: column; gap: var(--space-sm); max-height: 90vh; text-align: unset; width: 280px; }

.container_d7bc5d > :not(:first-child) { border-top: 1px solid var(--border-muted); padding-top: var(--space-sm); }

.has-webkit-scrollbar .container_d7bc5d { padding-inline-end: calc(var(--space-16) - var(--space-8)); }`;

const CAPTURED_PREVIEW_EMPTY_HTML = `<div class="emptyPreviewContainer__04666 previewImage__0489e"><div class="emptyPreviewImage__04666"></div><div class="text-sm/normal_cf4812 emptyPreviewText__04666" data-text-variant="text-sm/normal">A transmissão acabou de começar. Corre!</div></div>`;
