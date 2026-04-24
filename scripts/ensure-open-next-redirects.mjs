/**
 * After OpenNext build: copy edge files from public/ into .open-next output.
 *
 * Do NOT add a tiny _worker.js that only re-exports worker.js (that pattern triggers
 * a second esbuild and fails). We copy the prebuilt .open-next/worker.js byte-for-byte
 * to _worker.js so Cloudflare Pages can pick up the same bundle as the SSR entry.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outRoot = join(root, ".open-next");
const assetsDir = join(outRoot, "assets");

if (!existsSync(outRoot)) {
  console.error("scripts/ensure-open-next-pages: .open-next not found. Run opennextjs-cloudflare build first.");
  process.exit(1);
}
if (!existsSync(join(outRoot, "worker.js"))) {
  console.error("scripts/ensure-open-next-pages: .open-next/worker.js not found.");
  process.exit(1);
}

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

const workerPath = join(outRoot, "worker.js");
const underscoreWorkerPath = join(outRoot, "_worker.js");
if (existsSync(workerPath)) {
  copyFileSync(workerPath, underscoreWorkerPath);
  console.log("Copied .open-next/worker.js -> .open-next/_worker.js");
}

const routesRoot = join(outRoot, "_routes.json");
const routesInAssets = join(assetsDir, "_routes.json");
if (!existsSync(routesRoot) && existsSync(routesInAssets)) {
  copyFileSync(routesInAssets, routesRoot);
  console.log("Copied .open-next/assets/_routes.json -> .open-next/_routes.json");
}
