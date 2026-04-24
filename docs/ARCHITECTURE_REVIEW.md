# gstack 技能與 hkfac-consultants 全局架構審查

> 產生日期：以計畫「gstack 與全局設計審查」為依據；**未修改**同目錄下的 `*.plan.md` 原檔。

## 1. gstack 技能掛載（`locate-gstack` 結論）

- **本倉庫**與 **`~/.cursor/skills-cursor`** 內**未內建**名為 `gstack-*` 的 `SKILL.md`（已搜尋）。
- 其他專案常見名稱：`gstack-investigate`、`gstack-plan-design-review`、`gstack-plan-eng-review`、`gstack-qa-only`。
- **若需嚴格依官方步驟執行**：請將任一 `gstack-*/SKILL.md` 複製到本機可讀路徑（例：`%USERPROFILE%\.cursor\skills-cursor\gstack-plan-design-review\SKILL.md`），或在 Cursor 規則中直接 `@` 該文件。
- 下文本節為**不依賴**該 `SKILL.md` 全文的**等效全局審查摘要**，可與 gstack 原文補讀併用。

## 2. 全局架構與邊界（`run-skill-steps` 等效）

```mermaid
flowchart LR
  Browser[Browser]
  MW[middleware]
  App[app locale pages]
  API[Route Handlers]
  Anon[Supabase anon RLS]
  Svc[Supabase service role]
  Browser --> MW
  MW --> App
  Browser --> API
  API -->|leads team read contact| Anon
  API -->|admin users sessions team crud| Svc
```

| 層 | 要點 |
|----|------|
| **i18n** | `next-intl`，`localePrefix: "always"`；根路徑 `pathname === "/"` 在 [`middleware.ts`](../middleware.ts) 內**固定** `redirect` 至 `/en`（與行銷「預設英文」策略一致，非每請求做 `Accept-Language` 協商）。 |
| **託管** | **僅** Cloudflare **Pages** + OpenNext（[`open-next.config.ts`](../open-next.config.ts)）；倉內以單一 [`wrangler.json`](../wrangler.json) 聲明 `pages_build_output_dir` 與執行相容層。`public/_headers` 靜態快取等。 |
| **公開讀/寫** | Anon + RLS：前台讀 `team_members`（活躍行）、聯絡寫入 `leads`（`app/api/contact` + `lib/contact-rate-limit` 進程內限流）。 |
| **後台** | `admin_session` Cookie + 路由內邏輯 + **僅服務端** `SUPABASE_SERVICE_ROLE_KEY` 寫庫。RLS 無法讀 Cookie；敏感表依「無 public policy + service 繞過」收斂。 |
| **密碼** | `bcryptjs`（`lib/password.ts`）；`admin_users.password_hash` 應只存 bcrypt；可用 `npm run hash:admin-password` 產生哈希。 |

## 2.1 Cloudflare 託管與邊緣層（僅 Pages，對齊 gstack）

**生產託管決策：** 本專案**只**使用 **Cloudflare Pages**（Repository 連線建置 + `pages.dev` / 自訂網域），**不**在倉庫內維護與生產並行的 **獨立 `wrangler deploy` Workers** 管線（歷史曾用 `wrangler.deploy.json` / `deploy:worker` 的作法已從倉庫移除，避免雙重來源與與你方流程衝突）。

| 檔案 | 用途 |
|------|------|
| [`wrangler.json`](../wrangler.json) | 給 **Cloudflare Pages** 作為專案級設定之憑據：至少含 `name`（與儀表板專案名一致）、`pages_build_output_dir: ".open-next"`。另含 **`compatibility_date`** 與 **`compatibility_flags`**（含 `nodejs_compat`），與 [官方 Pages 說明](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) 一致。 |
| 禁與併寫 | **勿**在同一檔內同時寫 `main` 與 `pages_build_output_dir`（[Cloudflare 驗證會失敗](https://developers.cloudflare.com/pages/platform/changelog)）；**勿**在 Pages 用帶有 `ASSETS` 的 `assets` 綁定名導致保留名衝突。 |

**HTML / 404 與 OpenNext：** 建置命令須產生完整 **`.open-next`**（含 `worker.js` 與靜態產物），在 Pages 上應當以 OpenNext 適配層**處理** HTML，而非單有靜態。若歷史曾見 `/_next/static/...` 有檔而 `/en` 等退回 404，屬**邊緣掛載與儀表板**問題；請在 Pages 專案核對建置/執行 **nodejs_compat**、**Build 命令** 為 `npm run pages:build` 或 `build:cf`、以及變量是否完整。

**勿在產出內**自造只 `re-export` 的 `_worker.js`：曾導致 Pages 對其**二次 esbuild**、內建 Node 模組解析失敗。

| 實作檢查 |
|----------|
| 建置：`opennextjs-cloudflare build --config wrangler.json`（[package.json](../package.json) 內 `build:cf` / `pages:build`），讓 OpenNext 與 Wrangler 讀取根目錄 [`wrangler.json`](../wrangler.json) 的 `compatibility_*`（含 `nodejs_compat`）。 |
| 佈署：由 **Git 推送觸發 Pages 建置** 即可；不提交 `.open-next/`。 |
| 不建議：在倉庫內**另開**一條僅 `wrangler deploy` 的生產腳本與專屬 `wrangler.deploy.*`，與本節「僅 Pages」衝突。 |

## 3. 風險與缺口（精簡）

| 主題 | 說明 |
|------|------|
| 限流 | 聯絡表單已加 **郵件 + 客戶端 IP** 的滾動 1h 次數；**非分佈式**，多實例下應在 **Cloudflare 儀表板** 加 **Rate rules / WAF** 作為權威。 |
| 會話 | `ADMIN_SESSION_SECRET` 在示例有、**尚未**用於簽名 Cookie；若需降低 middleware 內部對 `verify-session` 的 `fetch` 次數，可另行設計簽名會話（屬行為變更）。 |
| 可觀測性 | 多處 `console.*`；上線排障以 **Cloudflare / Supabase 日誌** 為主。 |
| 邊緣 HTML | 生產應**僅**透過 **Pages + 完整 `build:cf` 產出**；儀表板建置/執行設定錯位時，HTML 與 RSC 可表現為 404；見 §2.1。 |

## 4. 生產運維驗證清單（`ops-verify`）

請在佈署環境**逐項手動**勾選（自動化帳密無法代填）。

- [ ] **Cloudflare**（**Pages** 建置/執行變量）：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`RESEND_API_KEY`（如用郵件）、`NODE_VERSION` 與 `engines` 一致。  
- [ ] **生產 HTML**：`curl -I https://<你的站>/en` 應 **非** 404；OpenNext 由 **Pages 建置** 掛上（見 §2.1 與 [`wrangler.json`](../wrangler.json) 相容層）。  
- [ ] **嚴禁** 將 `SUPABASE_SERVICE_ROLE_KEY` 設成 `NEXT_PUBLIC_*` 或客戶端讀取。  
- [ ] **Supabase SQL Editor**：已執行倉內 `supabase-rls-hardening.sql`（及既有 `leads` 的 anon insert 策略需仍存在）。  
- [ ] **登入**：`/en/admin/login`（或 `zh-HK` / `zh-CN`）+ 帳密，後台導向正常；登出清 Cookie。  
- [ ] **顧問 API**：`GET/POST/PATCH/DELETE` `api/admin/team*`，在已登入 Cookie 下成功。  
- [ ] **前台**：多語首頁、`team_members` 展示、聯絡表單一筆寫入 `leads`（Supabase 表內可見）。  

## 5. 可選加固本輪實作（`optional-hardening` 之一）

- **聯絡表單**：新增 [`lib/contact-rate-limit.ts`](../lib/contact-rate-limit.ts)（每 email 每小時最多 5 次、每客戶端 IP 每小時最多 20 次，滾動窗），[`app/api/contact/route.ts`](../app/api/contact/route.ts) 已改為使用該邏輯。邊緣層補防仍建議在 Cloudflare 配額。  

- **分佈式限流、會話簽名、middleware 去 `fetch` 驗證** 屬架構變更，**未**在本輪一併改寫，僅在本節記錄後續選項。  

## 6. 本地釋出前命令（工程師自檢）

在倉庫根目錄執行：

```bash
npm run build
npm run build:cf
```

（`build:cf` 需能解析 Cloudflare 建置產物；Windows 上 OpenNext 或提示建議用 WSL，屬上游提示。）  

**生產佈署**由 **Cloudflare Pages**（與遠端 Git 連線）在推送後執行 `pages:build` / `build:cf` 路徑；參考 §2.1 的 `wrangler.json` 與環境變量清單。
