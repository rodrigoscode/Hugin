const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

const browser = process.env.HUGIN_TEST_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const run = spawnSync(browser, [
    "--headless", "--disable-gpu", "--no-first-run", "--allow-file-access-from-files",
    "--virtual-time-budget=3000", "--dump-dom",
    pathToFileURL(path.join(__dirname, "test-stage.html")).href
], { encoding: "utf8", timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
const result = run.stdout?.match(/<pre id="result" data-status="([^"]+)">([\s\S]*?)<\/pre>/);
if (result) console.log(result[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
else console.error(run.error || run.stderr || "Stage test result missing");
process.exitCode = result?.[1] === "pass" && run.status === 0 ? 0 : 1;
