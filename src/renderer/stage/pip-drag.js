/**
 * Dragging the PiP window and snapping it to a corner of the app, like Discord's.
 */

let pipCorner = "top-right";

const PIP_MARGIN = {
    top: 80,
    base: 132,
    left: 80,
    right: 80
};

const PIP_HANDLE_CLASS = {
    "top-left": "resizeHandleTopLeft__6341f",
    "top-right": "resizeHandleTopRight__6341f",
    "bottom-left": "resizeHandleBottomLeft__6341f",
    "bottom-right": "resizeHandleBottomRight__6341f"
};

/**
 * Where the window sits in a corner, given the element whose size counts.
 */
function pipCornerPosition(element, corner) {
    const box = element.getBoundingClientRect();
    const top = Math.round(PIP_MARGIN.top);
    const bottom = Math.round(innerHeight - PIP_MARGIN.base - box.height);
    const left = Math.round(PIP_MARGIN.left);
    const right = Math.round(innerWidth - PIP_MARGIN.right - box.width);

    return {
        x: corner.endsWith("left") ? left : right,
        y: corner.startsWith("top") ? top : bottom
    };
}

function constrainPipWindow(pipWindow, x, y) {
    const width = pipWindow.clientWidth;
    const height = pipWindow.clientHeight;

    return {
        x: x < 0 ? 0 : x > innerWidth - width ? innerWidth - width : x,
        y: y < 0 ? 0 : y > innerHeight - height ? innerHeight - height : y
    };
}

/**
 * The corner of the quadrant a point falls in.
 */
function pipCornerToward(x, y) {
    const right = x > innerWidth / 2;
    const below = y > innerHeight / 2;
    return below ? (right ? "bottom-right" : "bottom-left") : right ? "top-right" : "top-left";
}

/**
 * Makes the PiP window draggable: it follows the pointer on a spring and, on release, springs to the
 * corner the throw points at. Returns whether a drag is in progress and the cleanup.
 */
function bindPipDrag({ host, rootElement, pipWindow }) {
    const inner = pipWindow.firstElementChild;
    const handle = pipWindow.querySelector('[class*="resizeHandle__6341f"]');
    let corner = pipCorner;
    let drag = null;
    let velX = 0;
    let velY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const spring = createPipSpring((x, y) => {
        pipWindow.style.transform = "translateX(" + x + "px) translateY(" + y + "px) translateZ(0px)";
    });

    const updateHandle = () => {
        if (!handle) return;
        for (const cls of Object.values(PIP_HANDLE_CLASS)) handle.classList.remove(cls);
        handle.classList.add(PIP_HANDLE_CLASS[corner]);
    };

    const cornerTarget = () => {
        const p = pipCornerPosition(inner || pipWindow, corner);
        return constrainPipWindow(pipWindow, p.x, p.y);
    };

    const ensurePosition = () => {
        const target = cornerTarget();
        spring.jump(target.x, target.y);
    };

    const markDrag = enabled => {
        rootElement.classList.toggle("dragging__6341f", enabled);
        host.style.width = enabled ? "100vw" : "0";
        host.style.height = enabled ? "100vh" : "0";
        pipWindow.style.pointerEvents = enabled ? "none" : "auto";
        pipWindow.style.cursor = enabled ? "grabbing" : "grab";
    };

    const onMove = event => {
        event.preventDefault();
        if (!drag) return;
        let dragging = drag.dragging;

        if (!dragging) {
            const dx = drag.originX - event.clientX;
            const dy = drag.originY - event.clientY;
            if (dx * dx + dy * dy > 9) dragging = true;
        }

        if (!dragging) return;
        const target = constrainPipWindow(pipWindow, event.clientX - drag.offsetX, event.clientY - drag.offsetY);

        spring.animate(
            target.x,
            target.y,
            {
                tension: 80,
                friction: 8
            },
            null
        );

        const now = Date.now();

        if (!drag.dragging) {
            drag.dragging = true;
            markDrag(true);
            velX = 0;
            velY = 0;
            lastX = event.clientX;
            lastY = event.clientY;
            lastT = now;
        }

        const dt = now - lastT;

        if (dt !== 0) {
            velX = (event.clientX - lastX) / dt;
            velY = (event.clientY - lastY) / dt;
            lastX = event.clientX;
            lastY = event.clientY;
            lastT = now;
        }
    };

    const onRelease = event => {
        removeEventListener("mousemove", onMove);
        removeEventListener("mouseup", onRelease);
        const dragged = Boolean(drag?.dragging);
        drag = null;
        if (!dragged) return;
        markDrag(false);
        corner = pipCornerToward(event.clientX + 200 * velX, event.clientY + 200 * velY);
        pipCorner = corner;
        updateHandle();
        const destination = cornerTarget();
        spring.animate(destination.x, destination.y, {}, ensurePosition);
    };

    pipWindow.addEventListener("mousedown", event => {
        if (event.button !== 0) return;

        drag = {
            originX: event.clientX,
            originY: event.clientY,
            offsetX: event.clientX - spring.x,
            offsetY: event.clientY - spring.y,
            dragging: false
        };

        removeEventListener("mousemove", onMove);
        removeEventListener("mouseup", onRelease);
        addEventListener("mousemove", onMove);
        addEventListener("mouseup", onRelease);
    });

    pipWindow.addEventListener("dragstart", event => event.preventDefault());
    updateHandle();
    ensurePosition();
    addEventListener("resize", ensurePosition);
    const sizeObserver = typeof ResizeObserver === "function" && inner ? new ResizeObserver(ensurePosition) : null;
    sizeObserver?.observe(inner);

    return {
        isDragging: () => Boolean(drag),

        unmount: () => {
            spring.stop();
            removeEventListener("mousemove", onMove);
            removeEventListener("mouseup", onRelease);
            removeEventListener("resize", ensurePosition);
            sizeObserver?.disconnect();
        }
    };
}
