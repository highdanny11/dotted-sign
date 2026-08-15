# 快點簽 Fast-Sign — 前端專案文件

`react-dotted-sign` 是「快點簽 Fast-Sign」的前端 Web 應用，源自 The F2E 4th「點簽」設計題目。專案提供一個可在瀏覽器內完成的 PDF 簽署流程：從上傳 PDF → 加入手寫/文字/圖檔簽名 → 逐頁確認 → 匯出已簽署 PDF。此文件提供項目介紹、技術棧、快速開始步驟、以及其他文件的入口索引。

## 專案介紹

### 目的

- 提供無需下載安裝、任何裝置皆可使用的線上 PDF 簽署體驗。
- 未註冊使用者亦能完成單次簽署與下載；註冊會員後可保存簽名檔（此部分為第二階段功能，目前尚未開放，見 `FEATURES.md`）。

### 使用者流程

1. 首頁上傳或拖曳一份 PDF（限制 10 MB、副檔名 `.pdf`）。
2. 進入 `/sign` 頁面，PDF 每頁會被轉為 canvas 顯示，並以 Fabric.js 覆蓋一層可編輯畫布。
3. 使用者於右側面板加入簽名（三種模式：文字輸入 / 手寫 / 上傳圖檔），簽名以 fabric object 加入當前頁 canvas，可拖曳、縮放、點左上角刪除。
4. 「下一步」→ 勾選「我不是機器人」的 UI（僅前端 checkbox，無真實驗證）→ 進入 `/finish-file`。
5. 於 `/finish-file` 點「下載檔案」，使用 jsPDF 將所有 canvas 逐頁 `addImage` 組成 PDF，以先前的檔名下載。

## 技術棧

### 執行環境

- **Node.js 20**（Dockerfile 基底）；本機建議使用 20.x 或以上 LTS。
- **npm**（`package-lock.json` 已提交）。

### 主要 dependencies

| 套件 | 版本 | 說明 |
| --- | --- | --- |
| `react` / `react-dom` | ^19.0.0 | UI 框架 |
| `react-router-dom` | ^7.4.0 | Client-side routing；程式內同時 import `react-router` 與 `react-router-dom`（v7 兩者等價） |
| `zustand` | ^5.0.3 | Global state（3 個 store） |
| `axios` | ^1.9.0 | HTTP client；`src/api/instance.ts` 統一封裝 |
| `react-hook-form` + `@hookform/resolvers` | ^7.56 / ^5.0 | 表單狀態管理 |
| `zod` | ^3.24.4 | 表單 schema 驗證 |
| `antd` | ^5.24.7 | 使用 `Modal`、`Popconfirm`、`Image`、`Spin`、`ConfigProvider` |
| `fabric` | ^5.2.4 | Canvas 上的簽名物件操控 |
| `@types/fabric` | ^4.5.2 | Fabric 5 型別（社群 typings） |
| `pdfjs-dist` | ^5.0.375 | PDF → canvas 渲染（worker 由 cdnjs 載入） |
| `jspdf` | ^3.0.1 | 匯出 PDF |
| `tailwindcss` + `@tailwindcss/vite` | ^4.0.15 | 樣式；透過 Vite plugin，非 PostCSS |
| `tailwind-merge` + `clsx` | 常用於 `Button`、`Input` 動態組合 class |
| `react-icons` | ^5.5.0 | 使用 `react-icons/md` 系列 |
| `react-html-props` | ^2.0.10 | 元件 props 型別（`ButtonProps`、`InputProps`） |
| `unplugin-auto-import` | ^19.1.1 | 自動 import React hooks |

### 主要 devDependencies

| 套件 | 版本 |
| --- | --- |
| `vite` | ^6.2.0 |
| `@vitejs/plugin-react` | ^4.3.4 |
| `typescript` | ~5.7.2 |
| `typescript-eslint` | ^8.24.1 |
| `eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | ^9 / ^5 / ^0.4 |
| `prettier-plugin-tailwindcss` | ^0.6.11 |
| `@types/node` / `@types/react` / `@types/react-dom` | ^22 / ^19 / ^19 |

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動 dev server（http://localhost:5173）
npm run dev

# 3. （選用）先啟動後端 API 於 http://localhost:8080
#    Vite 已設定 /api → http://localhost:8080 的 proxy
#    若不啟動，登入 / 註冊會失敗，但首頁上傳 PDF 到下載的流程仍可完整跑通

# 4. 產出正式版
npm run build     # 產物在 dist/

# 5. 本機預覽正式版
npm run preview
```

Docker：

```bash
docker build -t react-dotted-sign .
# 目前 Dockerfile 僅執行 build，未內建靜態伺服器。
# 若需部署，可再多一層 nginx stage，把 /app/dist 拷貝到 nginx html 目錄。
```

## 常用指令表

| 指令 | 用途 | 備註 |
| --- | --- | --- |
| `npm run dev` | 啟動 dev server | Host `0.0.0.0`、Port `5173`、HMR、`/api` proxy |
| `npm run build` | Type-check + 建置 | 先 `tsc -b` 再 `vite build` |
| `npm run preview` | 本機預覽 build 產物 | 需先 `npm run build` |
| `npm run lint` | ESLint 檢查 | 使用 flat config，`ignores: ['dist']` |
| `npm run prettier` | Prettier 全專案格式化 | 含 Tailwind class 排序 |

## 文件索引

| 文件 | 內容 |
| --- | --- |
| `docs/README.md` | 本檔 — 項目介紹、技術棧、快速開始 |
| `docs/ARCHITECTURE.md` | 目錄結構、啟動流程、路由總覽、Store/API 資料流、Fabric+PDF 整合細節 |
| `docs/DEVELOPMENT.md` | 命名規則、auto-import 使用方式、新增頁面/API/Store 步驟、環境變數表、JSDoc 樣式、計畫歸檔流程 |
| `docs/FEATURES.md` | 功能清單與完成狀態、每個功能的行為描述、錯誤情境 |
| `docs/TESTING.md` | 目前測試現況與未來測試指南 |
| `docs/CHANGELOG.md` | 更新日誌 |
| `CLAUDE.md`（根目錄） | AI 助理速查：關鍵規則與文件索引 |
