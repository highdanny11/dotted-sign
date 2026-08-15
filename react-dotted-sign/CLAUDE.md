# CLAUDE.md

本文件提供給 Claude Code（或其他 AI 助理）在此專案內工作時的重要規則與快速索引。詳細內容請至 `docs/` 目錄。

## 專案概述

**快點簽 Fast-Sign（react-dotted-sign）** — 一個線上 PDF 簽署工具的前端應用。使用者可上傳 PDF、於畫面上加入手寫、輸入或上傳圖片簽名、預覽並下載已簽署的 PDF。

技術棧摘要：
- React 19 + TypeScript 5.7
- Vite 6 + `@vitejs/plugin-react`
- Tailwind CSS v4（透過 `@tailwindcss/vite`）
- Ant Design 5（Modal、Popconfirm、Image、Spin、ConfigProvider）
- Zustand 5（`useLayout`、`useSign`、`useUser` 三個 store）
- React Router 7（`BrowserRouter`）
- react-hook-form + Zod 3（表單驗證）
- Axios 1.9（實例封裝，responseInterceptor 直接回傳 `response.data`）
- Fabric.js 5.2（PDF 覆蓋層畫布，處理簽名物件的拖曳、縮放、刪除）
- pdfjs-dist 5.0（將 PDF 每頁轉為 HTMLCanvasElement）
- jsPDF 3.0（把畫好簽名的 canvas 重新組合輸出 PDF）
- unplugin-auto-import（自動注入 React hooks，見 `src/auto-imports.d.ts`）

## 常用指令

從 `package.json` 偵測到的 scripts：

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動 Vite dev server（`0.0.0.0:5173`，`/api` 反向代理到 `http://localhost:8080`） |
| `npm run build` | 先執行 `tsc -b` 型別檢查，再 `vite build` 產生 `dist/` |
| `npm run preview` | 於本機預覽已編譯的產物 |
| `npm run lint` | 執行 ESLint（flat config，`eslint.config.js`） |
| `npm run prettier` | 對整個專案套用 Prettier（含 Tailwind class 排序 plugin） |

Docker：

```bash
docker build -t react-dotted-sign .
```

Dockerfile 使用 `node:20-alpine`，並在映像檔內執行 `npm install` 與 `npm run build`（未內建靜態伺服器，僅產出構建產物）。

## 關鍵規則

1. **不要手動 import React hooks**（`useState`、`useEffect`、`useCallback`、`useRef`、`useMemo` 等）。專案透過 `unplugin-auto-import` 自動注入，型別定義位於 `src/auto-imports.d.ts`。既有元件都遵循此慣例，多寫 import 反而造成 ESLint 警告與型別碰撞。
2. **Token 統一存放在 `sessionStorage`**，key 為 `'token'`。並由 `useUserStore` 的 `setToken` 同步更新 in-memory 與 sessionStorage。切勿把它換成 `localStorage`，因為 Google OAuth callback 依賴 `sessionStorage.setItem('token', ...)`（見 `src/main.tsx` 對 `?token=` query string 的處理）。
3. **路徑別名 `@` 對應 `src/`**（定義在 `vite.config.ts` 與 `tsconfig.app.json`），import 一律使用 `@/xxx` 而非相對路徑。
4. **Fabric.js 版本鎖在 5.x**（型別包 `@types/fabric`），不要升級到 6.x — 目前程式碼使用 `new fabric.Image(...)`、`setBackgroundImage(img, cb)` 等 5.x API。
5. **Zustand store 檔名採 `useXxx.tsx`**（副檔名為 `.tsx`，即便沒有 JSX），放在 `src/store/`。既有三個：`useLayout`、`useSign`、`useUser`。
6. 功能開發使用 `docs/plans/` 記錄計畫；完成後移至 `docs/plans/archive/`。詳見 `docs/DEVELOPMENT.md` 的「計畫歸檔流程」。

## 詳細文件

- ./docs/README.md — 項目介紹與快速開始
- ./docs/ARCHITECTURE.md — 架構、目錄結構、資料流
- ./docs/DEVELOPMENT.md — 開發規範、命名規則
- ./docs/FEATURES.md — 功能列表與完成狀態
- ./docs/TESTING.md — 測試規範與指南
- ./docs/CHANGELOG.md — 更新日誌
