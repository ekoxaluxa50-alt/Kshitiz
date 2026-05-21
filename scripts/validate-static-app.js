const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = ["index.html", "styles.css", "script.js"];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");

const requiredHtml = [
  "<title>Pursuit of Jade</title>",
  'id="route-list"',
  'id="launch-expedition"',
  'id="scan-relic"',
  'id="clue-log"',
  'script src="script.js"',
];

const requiredCss = [".hero-grid", ".route-card", ".jade-core", "@media (max-width: 640px)"];
const requiredJs = ["const routes", "advanceExpedition", "scanRelic", "render()"];

for (const snippet of requiredHtml) {
  if (!html.includes(snippet)) {
    throw new Error(`index.html is missing expected markup: ${snippet}`);
  }
}

for (const snippet of requiredCss) {
  if (!css.includes(snippet)) {
    throw new Error(`styles.css is missing expected rule: ${snippet}`);
  }
}

for (const snippet of requiredJs) {
  if (!js.includes(snippet)) {
    throw new Error(`script.js is missing expected behavior: ${snippet}`);
  }
}

const routeCount = (js.match(/id: "/g) || []).length;
if (routeCount < 3) {
  throw new Error("Expected at least three expedition routes.");
}

console.log("Static app validation passed.");
