/**
 * Discord's tooltip markup and styles, and the animated gear used in the picker.
 */

const CAPTURED_GEAR_LOTTIE = `{"v":"4.8.0","ip":0,"op":66,"fr":60,"w":24,"h":24,"nm":"L","assets":[{"id":"comp_0","layers":[{"ind":3,"ty":3,"nm":"S","sr":1,"ks":{"o":{"a":0,"k":0},"r":{"a":0,"k":0},"p":{"a":0,"k":[300,300,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[2500,2500,100]}},"ip":0,"op":241,"st":0},{"ind":4,"ty":4,"nm":"U","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":1,"k":[{"i":{"x":[0.299],"y":[1]},"o":{"x":[0.504],"y":[0]},"t":3,"s":[0]},{"t":63,"s":[180]}]},"p":{"a":0,"k":[300,300,0]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[2500,2500,100]}},"shapes":[{"ty":"gr","nm":"G","bm":0,"it":[{"ty":"sh","nm":"P","ind":0,"ks":{"k":[{"i":{"x":0.667,"y":1},"o":{"x":0.62,"y":0},"t":0,"s":[{"i":[[0,-2.209],[2.209,0],[0,2.209],[-2.209,0]],"o":[[0,2.209],[-2.209,0],[0,-2.209],[2.209,0]],"v":[[4,0],[0,4],[-4,0],[0,-4]],"c":true}]},{"i":{"x":0.386,"y":1},"o":{"x":0.62,"y":0},"t":31,"s":[{"i":[[0,-1.943],[1.943,0],[0,1.943],[-1.943,0]],"o":[[0,1.943],[-1.943,0],[0,-1.943],[1.943,0]],"v":[[3.517,0],[0,3.517],[-3.517,0],[0,-3.517]],"c":true}]},{"t":60,"s":[{"i":[[0,-2.209],[2.209,0],[0,2.209],[-2.209,0]],"o":[[0,2.209],[-2.209,0],[0,-2.209],[2.209,0]],"v":[[4,0],[0,4],[-4,0],[0,-4]],"c":true}]}],"a":1}},{"ty":"sh","nm":"P","ind":1,"ks":{"k":{"i":[[0.472,-0.062],[-0.069,-0.452],[0.796,-0.33],[0.698,0.95],[0.362,-0.278],[0.588,-0.766],[-0.368,-0.271],[0.33,-0.796],[1.166,0.178],[0.059,-0.453],[0,-0.489],[-0.062,-0.472],[-0.452,0.069],[-0.33,-0.796],[0.95,-0.699],[-0.278,-0.363],[-0.766,-0.588],[-0.271,0.368],[-0.796,-0.33],[0.178,-1.166],[-0.453,-0.059],[-0.489,0],[-0.472,0.062],[0.069,0.452],[-0.796,0.33],[-0.698,-0.95],[-0.363,0.278],[-0.588,0.766],[0.368,0.271],[-0.33,0.796],[-1.166,-0.178],[-0.059,0.453],[0,0.489],[0.062,0.472],[0.452,-0.069],[0.33,0.796],[-0.95,0.698],[0.278,0.362],[0.766,0.588],[0.271,-0.368],[0.796,0.33],[-0.178,1.166],[0.453,0.059],[0.489,0]],"o":[[-0.453,0.059],[0.178,1.166],[-0.796,0.33],[-0.271,-0.368],[-0.766,0.588],[-0.278,0.362],[0.95,0.698],[-0.33,0.796],[-0.452,-0.069],[-0.062,0.472],[0,0.489],[0.059,0.453],[1.166,-0.178],[0.33,0.796],[-0.368,0.271],[0.588,0.766],[0.362,0.278],[0.698,-0.95],[0.796,0.33],[-0.069,0.452],[0.472,0.062],[0.489,0],[0.453,-0.059],[-0.178,-1.166],[0.796,-0.33],[0.271,0.368],[0.766,-0.588],[0.278,-0.363],[-0.95,-0.698],[0.33,-0.796],[0.452,0.069],[0.062,-0.472],[0,-0.489],[-0.059,-0.453],[-1.166,0.178],[-0.33,-0.796],[0.368,-0.271],[-0.588,-0.766],[-0.363,-0.278],[-0.698,0.95],[-0.796,-0.33],[0.069,-0.452],[-0.472,-0.062],[-0.489,0]],"v":[[-1.442,-10.906],[-2.078,-9.923],[-3.061,-7.391],[-5.546,-8.485],[-6.692,-8.731],[-8.731,-6.692],[-8.485,-5.546],[-7.391,-3.061],[-9.923,-2.078],[-10.906,-1.442],[-11,0],[-10.906,1.442],[-9.923,2.078],[-7.391,3.061],[-8.485,5.546],[-8.731,6.692],[-6.692,8.731],[-5.546,8.485],[-3.061,7.391],[-2.078,9.923],[-1.442,10.906],[0,11],[1.442,10.906],[2.078,9.923],[3.062,7.391],[5.546,8.485],[6.692,8.731],[8.731,6.692],[8.485,5.546],[7.391,3.061],[9.923,2.078],[10.906,1.442],[11,0],[10.906,-1.442],[9.923,-2.078],[7.391,-3.061],[8.485,-5.546],[8.731,-6.692],[6.692,-8.731],[5.547,-8.485],[3.062,-7.391],[2.079,-9.923],[1.442,-10.906],[0,-11]],"c":true},"a":0}},{"ty":"fl","nm":"F","bm":0,"c":{"a":0,"k":[0.345098039216,0.396078431373,0.949019607843,1]},"o":{"a":0,"k":100},"r":1},{"ty":"tr","o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"nm":"T","sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}]}],"ip":0,"op":241,"st":0}]}],"layers":[{"ind":1,"ty":0,"nm":"I","sr":1,"ks":{"o":{"a":0,"k":100},"r":{"a":0,"k":0},"p":{"a":0,"k":[12,12,0]},"a":{"a":0,"k":[300,300,0]},"s":{"a":0,"k":[4,4,100]}},"ip":0,"op":241,"st":0,"refId":"comp_0","h":600,"w":600}],"markers":[{"cm":"all","tm":0,"dr":66}]}`;
const CAPTURED_TOOLTIP_HTML = `<div class="tooltipLayer_fa450d layer__529b0" data-popover-layer="true" tabindex="-1" data-floating-ui-focusable="" style="position: fixed; left: 0px; top: 0px; visibility: visible; transform: translate(0px, 0px);"><div style="opacity: 0; transform: scale(0.95);"><div class="tooltip_fa450d" role="tooltip" data-position="top" data-mana-component="tooltip"><div class="caret__0b5f9 caret--bottom__0b5f9 caret--center__0b5f9"><svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="caretIcon_fa450d"><path class="caretFill_fa450d" d="M10.3426 7.0715C9.14163 8.57272 6.85837 8.57272 5.65739 7.0715L0 -0.000244141L16 -0.000244141L10.3426 7.0715Z"></path><mask id="mask0_tooltip_caret" maskUnits="userSpaceOnUse" x="0" y="-1" width="16" height="10" style="mask-type: alpha;"><path d="M10.3426 7.0715C9.14163 8.57272 6.85837 8.57272 5.65739 7.0715L0 -0.000244141L16 -0.000244141L10.3426 7.0715Z" class="caretFill_fa450d"></path></mask><g mask="url(#mask0_tooltip_caret)"><path class="caretStroke_fa450d" d="M9.93457 6.84546C8.93433 8.06766 7.06567 8.06766 6.06543 6.84546L0.0546875 -0.500244L15.9453 -0.500244L9.93457 6.84546Z"></path></g></svg></div><div class="tooltipContent_fa450d"><div class="defaultColor__4bd52 text-sm/medium_cf4812" data-text-variant="text-sm/medium"></div></div></div></div></div>`;

const CAPTURED_TOOLTIP_CSS = `:root {
  --background-surface-high: color-mix(in oklab,hsl(240 calc(1*6.494%) 15.098%/1) 100%,#000 0%);
  --border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784%/0.12156862745098039) 100%,hsl(0 0% 0%/0.12156862745098039) 0%);
  --custom-caret-border-overlap: ;
  --custom-caret-edge-offset-horizontal: ;
  --custom-caret-edge-offset-vertical: ;
  --custom-caret-half-height: ;
  --custom-caret-half-width: ;
  --custom-caret-horizontal-distance: ;
  --custom-caret-offset-x: ;
  --custom-caret-offset-y: ;
  --radius-sm: 8px;
  --shadow-high: 0 12px 24px 0 hsl(none 0% 0%/0.24);
  --space-12: 12px;
  --space-4: 4px;
  --space-8: 8px;
  --text-default: color-mix(in oklab,hsl(240 calc(1*6.667%) 94.118%/1) 100%,#000 0%);
}

.layer__529b0 { position: fixed; z-index: 9999; }

.tooltip_fa450d { align-items: center; background-color: var(--background-surface-high); border-radius: var(--radius-sm); box-shadow: inset 0 0 0 1px var(--border-subtle),var(--shadow-high); box-sizing: border-box; color: var(--text-default); display: flex; gap: var(--space-8); max-width: 200px; padding: var(--space-8) var(--space-12); position: relative; text-align: center; width: auto; will-change: opacity, transform; }

.tooltipLayer_fa450d { pointer-events: none; }

.richTooltip_fa450d { max-width: none; padding: 0px; text-align: initial; width: auto; }

.tooltipContent_fa450d { overflow: hidden; }

.tooltipContentAllowOverflow_fa450d { overflow: visible; }

.tooltip_fa450d[data-position="top"] { transform-origin: 50% 100%; }

.tooltip_fa450d[data-position="bottom"] { transform-origin: 50% 0px; }

.tooltip_fa450d[data-position="left"] { transform-origin: 100% 50%; }

.tooltip_fa450d[data-position="right"] { transform-origin: 0px 50%; }

.caretIcon_fa450d .caretFill_fa450d { fill: var(--background-surface-high); }

.caretIcon_fa450d .caretStroke_fa450d { stroke: var(--border-subtle); stroke-opacity: 1; }

.tooltipWithShortcut_fa450d { align-items: center; display: flex; flex-direction: column; gap: var(--space-4); justify-content: center; text-align: center; }

.caret__0b5f9 { --custom-caret-half-width: 8px; --custom-caret-half-height: 7px; --custom-caret-edge-offset-horizontal: 16px; --custom-caret-edge-offset-vertical: 10px; --custom-caret-horizontal-distance: 11px; --custom-caret-border-overlap: 5px; pointer-events: none; position: absolute; transform-origin: center center; }

.caret--bottom__0b5f9 { top: calc(100% - var(--custom-caret-border-overlap)); transform: rotate(0deg); }

.caret--top__0b5f9 { bottom: calc(100% - var(--custom-caret-border-overlap)); transform: rotate(180deg); }

.caret--left__0b5f9 { inset-inline-start: calc(var(--custom-caret-horizontal-distance)*-1); transform: rotate(90deg); }

.caret--right__0b5f9 { inset-inline-end: calc(var(--custom-caret-horizontal-distance)*-1); transform: rotate(-90deg); }

:is(.caret--top__0b5f9, .caret--bottom__0b5f9).caret--center__0b5f9 { inset-inline-start: 50%; margin-inline-start: calc(var(--custom-caret-half-width)*-1); }

:is(.caret--top__0b5f9, .caret--bottom__0b5f9).caret--start__0b5f9 { inset-inline-start: var(--custom-caret-edge-offset-horizontal); margin-inline-start: calc(var(--custom-caret-half-width)*-1); }

:is(.caret--top__0b5f9, .caret--bottom__0b5f9).caret--end__0b5f9 { inset-inline-end: var(--custom-caret-edge-offset-horizontal); margin-inline-end: calc(var(--custom-caret-half-width)*-1); }

:is(.caret--left__0b5f9, .caret--right__0b5f9).caret--center__0b5f9 { margin-top: calc(var(--custom-caret-half-height)*-1); top: 50%; }

:is(.caret--left__0b5f9, .caret--right__0b5f9).caret--start__0b5f9 { margin-top: calc(var(--custom-caret-half-height)*-1); top: var(--custom-caret-edge-offset-vertical); }

:is(.caret--left__0b5f9, .caret--right__0b5f9).caret--end__0b5f9 { bottom: var(--custom-caret-edge-offset-vertical); margin-bottom: calc(var(--custom-caret-half-height)*-1); }

.caret--custom__0b5f9 { --custom-caret-offset-x: 0; --custom-caret-offset-y: 0; }

.caret--bottom__0b5f9.caret--custom__0b5f9, .caret--top__0b5f9.caret--custom__0b5f9 { inset-inline-start: 50%; margin-inline-start: calc(var(--custom-caret-offset-x) - var(--custom-caret-half-width)); }

.caret--left__0b5f9.caret--custom__0b5f9, .caret--right__0b5f9.caret--custom__0b5f9 { margin-top: calc(var(--custom-caret-offset-y) - var(--custom-caret-half-height)); top: 50%; }
`;
