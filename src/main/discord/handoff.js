/**
 * Hands control over to the original Discord app.
 */

const pkg = require(join(ORIGINAL_ASAR, "package.json"));
require.main.filename = join(ORIGINAL_ASAR, pkg.main);
electron.app.setAppPath(ORIGINAL_ASAR);
electron.app.name = pkg.name;
log("loading original Discord:", pkg.main);
Module._load(require.main.filename, null, true);
