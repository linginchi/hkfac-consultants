/**
 * After OpenNext build: copy edge files from public/ into .open-next output.
 *
 * Do NOT write .open-next/_worker.js or functions/[[path]].js that re-export worker.js:
 * Cloudflare Pages will run a second esbuild (Pages Functions / wrangler 3) on _worker.js,
 * which cannot bundle the prebuilt OpenNext worker (Node built-ins → build failure).
 * The real entry is OpenNext's .open-next/worker.js; pair with root wrangler.json pages_build_output_dir.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
