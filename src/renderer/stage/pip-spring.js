/**
 * Spring animation for the PiP window: the react-spring "origami" integrator Discord's PiP uses.
 */

/**
 * Converts an origami tension/friction pair into spring stiffness (k) and damping (c).
 */
function origamiSpring(tension, friction) {
    return {
        k: (tension - 30) * 3.62 + 194,
        c: (friction - 8) * 3 + 25
    };
}

function newSpringAxis() {
    return {
        value: 0,
        pos: 0,
        vel: 0,
        last: 0,
        target: 0,
        k: 0,
        c: 0,
        active: false,
        happened: false
    };
}

/**
 * Advances one axis up to now in 1 ms Runge-Kutta steps, catching up at most 64 ms per frame.
 */
function stepSpringAxis(axis, now) {
    let position = axis.pos;
    let velocity = axis.vel;
    let tempPosition = axis.pos;
    let tempVelocity = axis.vel;
    let time = now;
    if (time > axis.last + 64) time = axis.last + 64;
    const steps = Math.floor(time - axis.last);

    for (let s = 0; s < steps; ++s) {
        const v1 = velocity;
        const a1 = axis.k * (axis.target - tempPosition) - axis.c * tempVelocity;
        tempPosition = position + (0.001 * v1) / 2;
        tempVelocity = velocity + (0.001 * a1) / 2;
        const v2 = tempVelocity;
        const a2 = axis.k * (axis.target - tempPosition) - axis.c * tempVelocity;
        tempPosition = position + (0.001 * v2) / 2;
        tempVelocity = velocity + (0.001 * a2) / 2;
        const v3 = tempVelocity;
        const a3 = axis.k * (axis.target - tempPosition) - axis.c * tempVelocity;
        tempPosition = position + (0.001 * v3) / 2;
        tempVelocity = velocity + (0.001 * a3) / 2;
        const v4 = tempVelocity;
        const a4 = axis.k * (axis.target - tempPosition) - axis.c * tempVelocity;
        tempPosition = position + (0.001 * v3) / 2;
        tempVelocity = velocity + (0.001 * a3) / 2;
        const acceleration = (a1 + 2 * (a2 + a3) + a4) / 6;
        position += ((v1 + 2 * (v2 + v3) + v4) / 6) * 0.001;
        velocity += 0.001 * acceleration;
    }

    axis.last = time;
    axis.pos = position;
    axis.vel = velocity;
    axis.value = position;
    const stopped = Math.abs(velocity) <= 0.001 && (axis.k === 0 || Math.abs(axis.target - position) <= 0.001);

    if (stopped) {
        if (axis.k !== 0) axis.value = axis.target;
        axis.active = false;
    }
}

/**
 * A two-axis spring that calls render(x, y) on every animation frame.
 */
function createPipSpring(render) {
    const spring = {
        x: newSpringAxis(),
        y: newSpringAxis(),
        frame: 0,
        onEnd: null
    };

    const apply = () => render(spring.x.value, spring.y.value);

    const frameStep = () => {
        spring.frame = 0;
        const now = Date.now();
        for (const axis of [spring.x, spring.y]) if (axis.active) stepSpringAxis(axis, now);
        apply();

        if (spring.x.active || spring.y.active) {
            spring.frame = requestAnimationFrame(frameStep);
            return;
        }

        const finished = spring.onEnd;
        spring.onEnd = null;
        finished?.();
    };

    return {
        get x() {
            return spring.x.value;
        },

        get y() {
            return spring.y.value;
        },

        animate(targetX, targetY, config, onEnd) {
            const { k, c } = origamiSpring(config.tension ?? 40, config.friction ?? 7);
            const now = Date.now();

            for (const [axis, target] of [
                [spring.x, targetX],
                [spring.y, targetY]
            ]) {
                if (!axis.happened) {
                    axis.pos = axis.value;
                    axis.vel = 0;
                    axis.last = now;
                    axis.happened = true;
                }
                axis.target = target;
                axis.k = k;
                axis.c = c;
                axis.active = true;
            }

            spring.onEnd = onEnd || null;
            if (spring.frame) cancelAnimationFrame(spring.frame);
            frameStep();
        },

        jump(x, y) {
            if (spring.frame) cancelAnimationFrame(spring.frame);
            spring.frame = 0;
            spring.onEnd = null;
            spring.x.active = false;
            spring.y.active = false;
            spring.x.value = x;
            spring.y.value = y;
            apply();
        },

        stop() {
            if (spring.frame) cancelAnimationFrame(spring.frame);
        }
    };
}
