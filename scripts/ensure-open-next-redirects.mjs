/**
 * After OpenNext build, copy Cloudflare Pages edge files from public/ into .open-next output:
 * - _redirects, _routes.json
 * Pages may read these from the deploy root (.open-next/) and/or under assets.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outRoot = join(root, ".open-next");
const assetsDir = join(root, ".open-next", "assets");

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
