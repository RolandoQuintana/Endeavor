import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

const { version, name, description } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
    // can only contain digits, dots, or dash
    .replace(/[^\d.-]+/g, "")
    // split into version parts
    .split(/[.-]/);

export default defineManifest(async (env) => ({
    manifest_version: 3,
    name: name,
    description: description,
    version: `${major}.${minor}.${patch}`,
    version_name: version,
    icons: {
        "16": "src/assets/icons/icon-16.png",
        "32": "src/assets/icons/icon-32.png",
        "48": "src/assets/icons/icon-48.png",
        "128": "src/assets/icons/icon-128.png",
    },
    content_scripts: [
        {
            matches: ["https://*/*"],
            js: ["src/content/index.ts"],
        },
        {
            matches: ["*://calendar.google.com/calendar/u/0/r/*"],
            js: ["src/content/createEvent_2.js"],
        },
        {
            matches: ["*://calendar.google.com/calendar/u/0/r/*"],
            js: ["src/content/tagEvents.js"],
        },
        {
            matches: ["*://calendar.google.com/calendar/u/0/r/*"],
            js: ["src/content/tagTasks.js"],
        },
        {
            matches: ["*://calendar.google.com/calendar/u/0/r/*"],
            js: ["src/content/editEvent.js"],
        },
        {
            matches: ["*://calendar.google.com/calendar/u/0/r/*"],
            js: ["src/content/createEventFromTask.js"],
        },
    ],
    background: {
        service_worker: "src/background/index.ts",
    },
    options_ui: {
        page: "src/background/app.html",
        open_in_tab: true,
    },
    side_panel: {
        default_path: "src/sidepanel/sidepanel.html",
    },
    action: {
        default_popup: "src/popup/popup.html",
        default_icon: {
            "16": "src/assets/icons/icon-16.png",
            "32": "src/assets/icons/icon-32.png",
            "48": "src/assets/icons/icon-48.png",
            "128": "src/assets/icons/icon-128.png",
        },
    },
    permissions: ["storage", "sidePanel", "identity", "activeTab", "scripting", "webRequest"] as chrome.runtime.ManifestPermissions[],
    web_accessible_resources: [
        {
            resources: ["src/background/app.html"],
            matches: ["<all_urls>"],
        },
    ],
    oauth2: {
      "client_id": "601515777099-7u9ncs8vdjs0p7dq523aqh7pdksgsn6f.apps.googleusercontent.com",
      "scopes": ["https://www.googleapis.com/auth/calendar","https://www.googleapis.com/auth/directory.readonly"]
    },
}));
