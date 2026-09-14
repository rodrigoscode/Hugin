/**
 * Rect conversion and the CSP change that lets Discord frame VDO.Ninja.
 */

/**
 * Converts renderer CSS pixels to device pixels.
 */
function toRect(bounds) {
    return {
        x: Math.round(bounds?.x ?? 0),
        y: Math.round(bounds?.y ?? 0),
        width: Math.max(1, Math.round(bounds?.width ?? 1)),
        height: Math.max(1, Math.round(bounds?.height ?? 1))
    };
}

/**
 * Adds vdo.ninja to Discord's frame-src content security policy.
 */
function allowVdoFraming(win) {
    const target = "https://vdo.ninja";

    try {
        win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
            const headers = details.responseHeaders || {};

            for (const name of Object.keys(headers)) {
                if (name.toLowerCase() !== "content-security-policy") continue;
                headers[name] = headers[name].map(value =>
                    value.includes("frame-src") && !value.includes(target)
                        ? value.replace(/frame-src /, `frame-src ${target} `)
                        : value
                );
            }

            callback({
                responseHeaders: headers
            });
        });
        log("CSP: vdo.ninja allowed in frame-src");
    } catch (err) {
        log("CSP: could not adjust frame-src:", String(err));
    }
}
