/**
 * After OpenNext build, ensure public/_redirects is at the deploy root.
 * Cloudflare Pages may read _redirects from the output root (.open-next/) and/or assets.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "_redirects");
const outRoot = join(root, ".open-next", "_redirects");
const outAssets = join(root, ".open-next", "assets", "_redirects");

if (!existsSync(src)) {
  console.warn("scripts/ensure-open-next-redirects: public/_redirects missing, skip");
  process.exit(0);
}

const content = readFileSync(src, "utf8");
writeFileSync(outRoot, content, "utf8");
const assetsDir = join(root, ".open-next", "assets");
if (existsSync(assetsDir)) {
  writeFileSync(outAssets, content, "utf8");
}
console.log("Copied public/_redirects -> .open-next/_redirects" + (existsSync(assetsDir) ? " and .open-next/assets/_redirects" : ""));
