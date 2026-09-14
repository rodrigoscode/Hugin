/**
 * Discord's spring animation, popout positioning and tooltips, ported from its bundle.
 */

/**
 * Discord's react-spring stepping (SpringValue.advance): 1 ms steps until velocity and distance
 * settle.
 */
function reactSpring({ from: from, to: to, velocity = 0, config, onChange: onChange, onStop: onStop }) {
    const mass = config.mass ?? 1;
    const precision = config.precision ?? (from === to ? 0.005 : Math.min(1, 0.001 * Math.abs(to - from)));
    const restVelocity = config.restVelocity ?? precision / 10;

    let p = from,
        v = velocity,
        last = performance.now(),
        rafId = 0;

    const step = now => {
        const dt = Math.max(0, now - last);
        last = now;
        const steps = Math.ceil(dt / 1);
        let finished = false;

        for (let i = 0; i < steps; ++i) {
            if (!(Math.abs(v) > restVelocity) && (finished = Math.abs(to - p) <= precision)) break;
            const acceleration = (-(1e-6 * config.tension) * (p - to) + -(0.001 * config.friction) * v) / mass;
            v += acceleration;
            p += v;
        }

        onChange(p, v);

        if (finished) {
            rafId = 0;
            onStop?.();
            return;
        }

        rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return {
        stop: () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
        }
    };
}

/**
 * Discord's popout positioning: the preferred side, the opposite side with autoInvert, otherwise
 * overlapping the anchor.
 */
function placeDiscordPopout(element, target, options) {
    const {
        position,
        align = "left",
        spacing = 0,
        offset = 0,
        autoInvert = false,
        nudgeAlignIntoViewport = false
    } = options;

    const containerWidth = innerWidth,
        containerHeight = innerHeight;

    const elementWidth = element.offsetWidth,
        elementHeight = element.offsetHeight;

    const nudgeLeft = left => {
        if (!nudgeAlignIntoViewport) return left;
        const excess = left + elementWidth - containerWidth + 12;
        return excess > 0 ? Math.max(12, left - excess) : Math.max(12, left);
    };

    const horizontal = base => {
        if (align === "right") {
            const right = Math.ceil(containerWidth - target.right - offset);
            const nudge = nudgeAlignIntoViewport ? Math.min(containerWidth - right - elementWidth - 12, 0) : 0;
            return {
                ...base,
                right: right + nudge
            };
        }

        const start =
            align === "center" ? target.left + (target.width - elementWidth) / 2 + offset : target.left + offset;

        return {
            ...base,
            left: Math.ceil(nudgeLeft(start))
        };
    };

    const styleFor = side =>
        side === "top"
            ? horizontal({
                  bottom: containerHeight - target.top + spacing
              })
            : horizontal({
                  top: target.bottom + spacing
              });

    const space = (side, st) =>
        side === "top" ? containerHeight - (st.bottom + elementHeight) : containerHeight - (st.top + elementHeight);

    const opposite = side => (side === "top" ? "bottom" : "top");

    let picked = {
        position,
        style: styleFor(position)
    };

    const d = space(position, picked.style);
    let best = d;

    if (autoInvert && d < 0) {
        const inverse = opposite(position);
        const inverseStyle = styleFor(inverse);
        const s = space(inverse, inverseStyle);
        if (s > d) {
            picked = {
                position: inverse,
                style: inverseStyle
            };
            best = s;
        }
        if (d < 0 && s < 0) {
            const side = picked.position;
            const overlapping = horizontal({
                [side]: 0
            });
            const t = space(opposite(side), overlapping);
            if (t > best) {
                picked = {
                    position: side,
                    style: overlapping
                };
                best = t;
            }
        }
    }

    if (best < 0 && Math.abs(best) < elementHeight) {
        const key = picked.position === "top" ? "bottom" : "top";
        picked.style[key] = (picked.style[key] ?? 0) + best;
    }

    return picked;
}

/**
 * Discord's tooltip for a button: shown on mouseenter, hidden on mouseleave, click and Escape,
 * centered above it.
 */
function createPipTooltip(container, button) {
    const GAP = 11;
    const BORDER = 8;

    const CONFIG = {
        tension: 2400,
        friction: 52,
        mass: 1
    };

    let current = null;
    const reducedMotion = () => document.documentElement.classList.contains("reduce-motion");

    const roundToDevicePixel = value => {
        const dpr = devicePixelRatio || 1;
        return Math.round(value * dpr) / dpr;
    };

    const place = t => {
        const ref = button.getBoundingClientRect();
        const width = t.tip.offsetWidth;
        const height = t.tip.offsetHeight;
        let side = "top";
        let y = ref.top - GAP - height;
        const yBelow = ref.bottom + GAP;
        const spaceAbove = y - BORDER;
        const spaceBelow = innerHeight - BORDER - (yBelow + height);

        if (spaceAbove < 0 && spaceBelow > spaceAbove) {
            side = "bottom";
            y = yBelow;
        }

        const xCenter = ref.left + ref.width / 2 - width / 2;
        let x = Math.min(Math.max(xCenter, BORDER), innerWidth - BORDER - width);
        x = Math.min(Math.max(x, ref.left - width), ref.right);
        const shift = x - xCenter;
        t.layer.style.transform = "translate(" + roundToDevicePixel(x) + "px, " + roundToDevicePixel(y) + "px)";
        t.tip.setAttribute("data-position", side);
        t.arrow.classList.toggle("caret--bottom__0b5f9", side === "top");
        t.arrow.classList.toggle("caret--top__0b5f9", side === "bottom");
        const offCenter = Math.abs(shift) >= 0.5;
        t.arrow.classList.toggle("caret--center__0b5f9", !offCenter);
        t.arrow.classList.toggle("caret--custom__0b5f9", offCenter);

        if (offCenter) t.arrow.style.setProperty("--custom-caret-offset-x", -shift + "px");
        else t.arrow.style.removeProperty("--custom-caret-offset-x");
    };

    const apply = t => {
        t.inv.style.opacity = String(t.o.value);
        t.inv.style.transform = "scale(" + t.s.value + ")";
    };

    const animate = (t, target, onEnd) => {
        for (const key of ["s", "o"]) {
            const axis = t[key];
            axis.spring?.stop();
            axis.stopped = false;
            axis.spring = reactSpring({
                from: axis.value,
                to: target[key],
                velocity: axis.vel,
                config: CONFIG,
                onChange: (p, v) => {
                    axis.value = p;
                    axis.vel = v;
                    if (!t.layer.isConnected) return;
                    apply(t);
                    place(t);
                },
                onStop: () => {
                    axis.stopped = true;
                    if (t.s.stopped && t.o.stopped) onEnd?.();
                }
            });
        }
    };

    const onKeyDown = event => {
        if (event.key === "Escape" || event.key === "Esc") hide();
    };

    const show = () => {
        const text = button.getAttribute("aria-label") || "";
        if (!text) return;

        if (!current) {
            const template = document.createElement("template");
            template.innerHTML = CAPTURED_TOOLTIP_HTML;
            const layer = template.content.firstElementChild;
            const t = {
                layer: layer,
                inv: layer.firstElementChild,
                tip: layer.querySelector('[role="tooltip"]'),
                arrow: layer.querySelector('[class*="caret__0b5f9"]'),
                s: {
                    value: reducedMotion() ? 1 : 0.95,
                    vel: 0
                },
                o: {
                    value: 0,
                    vel: 0
                },
                leaving: false
            };
            if (!t.tip || !t.arrow) return;
            const label = layer.querySelector('[class*="tooltipContent_fa450d"] [data-text-variant]');
            if (label) label.textContent = text;
            container.appendChild(layer);
            apply(t);
            place(t);
            current = t;
            document.addEventListener("keydown", onKeyDown, true);
        }

        current.leaving = false;

        animate(current, {
            s: 1,
            o: 1
        });
    };

    function hide() {
        if (!current || current.leaving) return;
        const t = current;
        t.leaving = true;

        animate(
            t,
            {
                s: reducedMotion() ? 1 : 0.95,
                o: 0
            },
            () => {
                if (!t.leaving) return;
                t.layer.remove();

                if (current === t) {
                    current = null;
                    document.removeEventListener("keydown", onKeyDown, true);
                }
            }
        );
    }

    button.addEventListener("mouseenter", show);
    button.addEventListener("mouseleave", hide);
    button.addEventListener("click", hide);
}
