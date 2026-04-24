<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cloudflare 託管（本專案固定事實）

- **生產部署只有 [Cloudflare Pages](https://developers.cloudflare.com/pages/)**：`wrangler pages deploy` 上傳 `.open-next`（見 `package.json` 的 `deploy:cf`），或儀表板接 Git 建置。
- **不要** 為本倉庫加入或改用 **`wrangler deploy`**、**`opennextjs-cloudflare deploy`**、**`opennextjs-cloudflare upload`** 等針對 **「獨立 Workers 專案 / Workers 版本上傳」** 的流程；與本專從始即為 **Pages** 的設定衝突，也會在含 `pages_build_output_dir` 的 `wrangler.json` 上失敗或誤導。
- `wrangler.json` 僅作 **Pages** 的 `pages_build_output_dir` 與執行相容層，**不要** 在同檔加入 Workers 的 `main` 與 `pages_build_output_dir` 併寫。細節見 `docs/ARCHITECTURE_REVIEW.md` §2.1。
- `preview:cf` 僅本機預覽用（OpenNext 建置後 `wrangler dev`），**不是** 生產佈署；上線仍只走 **Git → Pages** 或 `deploy:cf`（`wrangler pages deploy`）。
