/**
 * After OpenNext build:
 * 1) Bridge OpenNext worker for Cloudflare Pages (expects /functions and/or _worker.js).
 * 2) Copy public/_redirects, public/_routes.json into .open-next (and under assets when present).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outRoot = join(root, ".open-next");
const workerEntry = join(outRoot, "worker.js");
const assetsDir = join(outRoot, "assets");

const bridgeExport = `export { default } from "../worker.js";
`;

if (!existsSync(outRoot)) {
  console.error("scripts/ensure-open-next-pages: .open-next not found. Run opennextjs-cloudflare build first.");
  process.exit(1);
}
if (!existsSync(workerEntry)) {
  console.error("scripts/ensure-open-next-pages: .open-next/worker.js not found.");
  process.exit(1);
}

// Pages: single-file worker entry at deploy root
writeFileSync(join(outRoot, "_worker.js"), `export { default } from "./worker.js";
`, "utf8");
console.log("Wrote .open-next/_worker.js (re-exports ./worker.js)");

// Pages: /functions directory so the platform detects Functions-style layout
const functionsDir = join(outRoot, "functions");
mkdirSync(functionsDir, { recursive: true });
writeFileSync(join(functionsDir, "[[path]].js"), bridgeExport, "utf8");
console.log("Wrote .open-next/functions/[[path]].js (re-exports ../worker.js)");

const files = ["_redirects", "_routes.json"];

for (const name of files) {
  const src = join(root, "public", name);
  if (!existsSync(src)) {
    console.warn(`scripts/ensure-open-next-pages: public/${name} missing, skip`);
    continue;
  }
  const content = readFileSync(src, "utf8");
  writeFileSync(join(outRoot, name), content, "utf8");
  if (existsSync(assetsDir)) {
    writeFileSync(join(assetsDir, name), content, "utf8");
  }
  console.log(`Copied public/${name} -> .open-next/${name}` + (existsSync(assetsDir) ? ` and .open-next/assets/${name}` : ""));
}
