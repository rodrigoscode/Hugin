/**
 * Paths, the debug switch and the browser partition shared by every window we create.
 */

const { appendFileSync, writeFileSync, readFileSync, existsSync, mkdirSync, statSync } = require("fs");
const { join } = require("path");
const Module = require("module");
const { execFile, spawn } = require("child_process");
const electron = require("electron");
const ORIGINAL_ASAR = join(__dirname, "..", "_app.asar");
const DATA_DIR = join(process.env.APPDATA || process.env.HOME, "Hugin");
const LOG_FILE = join(DATA_DIR, "log.txt");
const DEBUG_MARKER = join(DATA_DIR, "debug");
const CONFIG_FILE = join(DATA_DIR, "config.json");
const HELPER_EXE = join(DATA_DIR, "Hugin.exe");

const DEBUG_MODE = existsSync(DEBUG_MARKER);

if (DEBUG_MODE) {
    electron.app.commandLine.appendSwitch("remote-debugging-port", "9222");
}

const PARTITION = "persist:hugin";
