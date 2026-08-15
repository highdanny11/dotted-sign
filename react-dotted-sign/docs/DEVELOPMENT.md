# DEVELOPMENT

本文件記錄本專案的命名慣例、模組系統、開發規範，以及新增各種模組（頁面、Store、API、Utility）時的建議步驟。

## 命名規則對照表

| 對象 | 慣例 | 範例 |
| --- | --- | --- |
| 目錄 | 全小寫、名詞 | `views/register/`、`component/form/`、`hook/`、`store/` |
| 頁面元件檔案 | PascalCase `.tsx` | `HomePage.tsx`、`Login.tsx`、`Error404.tsx` |
| 複合 View 目錄 | 若含多子元件，主檔命名 `index.tsx` | `views/sign/index.tsx`（其他子檔如 `PDFBox.tsx`、`SignaturePad.tsx` 平行擺放） |
| 共用元件 | PascalCase 檔名 = 元件名 | `Button.tsx` → `export function Button()` |
| Layout | PascalCase | `Layout.tsx`、`RegisterLayout.tsx` |
| Zustand store | `useXxx.tsx`（含副檔 tsx，即使無 JSX） | `useLayout.tsx`、`useSign.tsx`、`useUser.tsx` |
| Store 匯出名 | `useXxxStore` | `useLayoutStore`、`useSignStore`、`useUserStore` |
| Custom hook | `useXxx.tsx` | `useDrag.tsx` |
| Util | camelCase `.ts` | `fileToBase64.ts`、`isAllowedFileType.ts`、`setFabricDeleteControl.ts` |
| API 目錄 | 資源名（小寫） | `api/users/index.ts` |
| API 函式名 | camelCase 動詞 | `signup`、`login`、`getUserInfo` |
| 型別檔 | 全小寫 `.ts` | `type/common.ts`、`type/users.ts` |
| 型別名稱 | PascalCase | `SignupRequest`、`LoginApi`、`GenerateApiFunction` |
| Component 內部函式 | camelCase，事件多用「動詞（+名詞）」 | `handleMouseDown`、`onSubmit`、`googleLogin`、`finishFile`、`backHome` |
| Zustand action | `set + PascalCase` | `setFileName`、`setCanvasList`、`setActiveStep` |
| 圖片 asset | PascalCase | `Logo.svg`、`Step1.svg`、`FinishFile.svg`、`Cycle.png` |

**已知拼字問題**（既有代碼保留，重構請通盤修改）：
- `useLayoutStore` state key 為 `hearder`（少 e）。
- `views/sign/index.tsx` 局部變數 `cavasPdf`（應為 `canvasPdf`）。
- `SignaturePad.tsx` 局部變數 `storkesRef`（應為 `strokesRef`）。

## 模組系統

- **ESM only**：`package.json` 宣告 `"type": "module"`；所有 `.ts`/`.tsx` 使用 `import`/`export`。
- **Alias `@` = `src/`**：
  - 定義位置：`vite.config.ts` 的 `resolve.alias` 與 `tsconfig.app.json` 的 `paths`。
  - 使用範例：`import { Button } from '@/component/form/Button'`。
  - 慣例：只要不是同目錄檔案，一律用 `@/...`；避免長串 `../../..`。
- **`react-router` vs `react-router-dom`**：v7 起兩者是同一個套件的兩個 entry。既有代碼混用（`App.tsx` 用 `react-router-dom`；`HomeHeader.tsx` 等其他檔案多用 `react-router`）。兩者等價，維持與該檔既有寫法一致即可。
- **Auto import（React hooks）**：
  - `vite.config.ts` 的 `AutoImport({ imports: ['react'] })` 會自動注入所有 React hooks，型別定義寫入 `src/auto-imports.d.ts`。
  - 支援：`useState`、`useEffect`、`useCallback`、`useRef`、`useMemo`、`useContext`、`useReducer`、`useLayoutEffect`、`useImperativeHandle`、`useTransition`、`useDeferredValue`、`startTransition`、`memo`、`forwardRef`、`lazy`、`createRef` 等。
  - **請勿手動 `import { useState } from 'react'`**；既有元件全數不寫 import，多寫反而造成 ESLint 警告或型別衝突。
  - 型別（`ChangeEvent`、`MouseEvent` 等）仍需明確 import from `react`；auto-import 只處理 runtime。

## 開發環境設定

### 必要工具

- Node.js 20+
- npm 10+
- 建議搭配 VS Code + Prettier plugin，`.vscode/` 目錄已存在（未在此文件展開）。

### 環境變數

**目前 `.env` 未在專案內出現**（`.gitignore` 亦未列 `.env*`；`vite.config.ts` 亦未使用 `import.meta.env`）。目前所有外部端點皆為硬編碼：

| 位置 | 硬編碼值 | 用途 | 建議動作 |
| --- | --- | --- | --- |
| `src/api/instance.ts:4` | `baseURL: '.'` | Axios base URL | 若需接入不同環境的後端，可改為 `import.meta.env.VITE_API_BASE` |
| `vite.config.ts:14` | `target: 'http://localhost:8080'` | dev proxy 目標 | 可改為讀 `process.env.VITE_PROXY_TARGET` |
| `src/views/login/Login.tsx:39`、`register/Register.tsx:41` | `https://sign.sideproject.website/api/users/google` | Google OAuth 進入點 | 建議抽出為 `VITE_OAUTH_GOOGLE_URL` |
| `src/utils/PDFUtils.ts:2` | `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs` | pdfjs worker | 若部署環境無法連外，複製 worker 到 `public/` 並改為相對路徑 |

若日後導入 `.env`：

| 變數 | 用途 | 必要性 | 預設值 |
| --- | --- | --- | --- |
| `VITE_API_BASE` | Axios baseURL | 選用 | `.` |
| `VITE_PROXY_TARGET` | dev proxy 目標 | 選用（僅 dev） | `http://localhost:8080` |
| `VITE_OAUTH_GOOGLE_URL` | Google 登入 redirect URL | 建議 | 現行硬編碼值 |
| `VITE_PDFJS_WORKER_SRC` | pdfjs worker URL | 選用 | 現行 CDN URL |

Vite 讀取 `.env` 慣例：只有以 `VITE_` 為前綴的變數才會 expose 給前端。

## 新增功能的標準步驟

### 新增一個「頁面」

1. 於 `src/views/<featureName>/` 建立目錄。
2. 若為單一元件，直接 `FeatureName.tsx`；若為複合結構，用 `index.tsx` 為入口，子元件平行擺放。
3. 於 `src/App.tsx` `<Routes>` 內加 `<Route path="/xxx" element={<... />} />`。
   - 若需要 header + footer，包在既有 `<Route path="/" element={<Layout />}>` 底下。
   - 若為登入/註冊型頁面，包在 `<RegisterLayout>` 內。
   - 若需要獨立版面（如 `Error404`、`FinishSign`），與 `Layout` 平行。
4. Header 呈現：若頁面需要顯示 SignHeader（返回箭頭 + 檔名），在進入頁面時 `useLayoutStore.setHeader('SignHeader')`；離開時（回首頁）由 `HomeHeader` 的 `useEffect` 監聽 `location.pathname === '/'` 自動 reset。

### 新增一個 Store

1. 於 `src/store/useXxx.tsx` 建檔（副檔名固定 `.tsx`）。
2. 型別分兩段：`type XxxState` + `type XxxActions`。
3. `export const useXxxStore = create<XxxState & XxxActions>((set) => ({ ... }))`。
4. 對於需要持久化的欄位（例如 token），在 setter 內同時寫入 sessionStorage / localStorage；並在初始值處讀取（範例：`useUser.tsx:14`）。
5. 於呼叫端使用 selector 訂閱，避免整個 store 重渲染：`const value = useXxxStore(s => s.value)`。

### 新增一個 API 端點

1. 於 `src/type/<resource>.ts` 定義：
   - `SomeRequest` / `SomeResponse` 型別。
   - `SomeApi = GenerateApiFunction<SomeRequest, SomeResponse>`。
2. 於 `src/api/<resource>/index.ts` 實作：
   ```ts
   export const someApi: SomeApi = async (data) => {
     return await Axios({
       method: 'post',
       url: '/api/<resource>/<action>',
       data,
       // 需認證時：
       headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
     });
   };
   ```
3. **注意**：`instance.ts` 的 response interceptor 已回傳 `response.data`；但型別 `GenerateApiFunction` 宣告回傳 `Promise<AxiosResponse<R>>`。既有呼叫端仍以 `res.data.user` 存取，等於 payload 內再存取 `data` 欄位。若後端不回 `data` 包裝，需要用 `as unknown as R` 轉型或修改型別。

### 新增一個 Middleware

前端目前**沒有 middleware / interceptor 邏輯**（`src/api/instance.ts` 內的 request interceptor 為空實作）。若要加入：

- 全域行為（如自動注入 Authorization）：改 `src/api/instance.ts:13-22`。
  ```ts
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
  加入後可以移除 `getUserInfo` 內手動塞 header 的程式碼。
- 錯誤集中處理：擴充 response interceptor 的 error 分支，例如 401 時 clear token + redirect `/login`。

### 新增一個 Utility

1. 檔名 camelCase，放 `src/utils/`。
2. 匯出具名 export，函式或常數。
3. 只做「純」邏輯；DOM 操作也可，但避免直接依賴 store（讓 caller 自行處理副作用）。

### 新增一個共用元件

1. 依語意放到 `src/component/<group>/<Name>.tsx`。目前 groups：`footer`、`form`、`header`、`step`。
2. 若接受 HTML 原生 props，可 extend `react-html-props` 的 `ButtonProps` / `InputProps` 等。
3. Class 合併用 `twMerge(clsx(...))`：`clsx` 處理條件式，`twMerge` 解 Tailwind 衝突。

## 撰寫慣例

### JSDoc

專案目前**未使用 JSDoc 註解**。若日後需要，建議格式如下：

```ts
/**
 * 將 File 轉為純 Base64 字串（去除 `data:*;base64,` 前綴）。
 *
 * @param file - 使用者上傳的 File 物件
 * @returns Base64 payload（不含 data URI 前綴）
 * @throws 讀取失敗或被中止時 reject Error
 */
export const fileToBase64 = (file: File): Promise<string> => { ... }
```

原則：
- **只寫 WHY，不重述 WHAT**：TypeScript signature 已表達 what；註解應補充非顯而易見的情境、限制、hidden invariant。
- 對外匯出的函式與型別優先加註；內部 helper 除非有特殊 gotcha 否則省略。
- 中文為主（既有 UI/文案為繁中）。

### TypeScript 設定

- `tsconfig.app.json` 開啟 `strict`、`noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch`、`noUncheckedSideEffectImports`。
- **不使用未定義變數**：因此如需暫時捨棄參數，改用底線前綴：`(_e: MouseEvent) => ...`（見 `setFabricDeleteControl.ts:23`、`SignaturePad.tsx:138`）。
- `moduleResolution: bundler` + `allowImportingTsExtensions: true`：可以 `import './x.ts'`。

### 樣式撰寫

- **Tailwind 為主**；只有極少數共用 class（`.h2`、`.h4`、`.h5`、`.custom-modal`）寫在 `index.css`。
- 品牌色請用 `bg-brand`、`text-brand`、`border-primary` 等 semantic class，勿直接寫 `#0B7D77`。
- Class 排序由 `prettier-plugin-tailwindcss` 自動處理，跑 `npm run prettier` 即可。
- 響應式斷點：`sm`、`md`、`lg`、`xl`；`container` utility 已客製 padding。

### ESLint

- 使用 flat config，位於 `eslint.config.js`。
- 只警告：`react-refresh/only-export-components`（`allowConstantExport: true`）。
- 全繼承 `js.configs.recommended` + `typescript-eslint.configs.recommended` + `react-hooks.configs.recommended.rules`。
- 忽略 `dist`。

### 提交前檢查

```bash
npm run lint
npm run build      # 型別檢查 + build
npm run prettier   # 格式化
```

目前 repo 未設 pre-commit hook / husky。若導入 lint-staged，建議至少跑 `eslint` + `prettier` 對變更檔。

## 計畫歸檔流程

1. **命名格式**：`docs/plans/YYYY-MM-DD-<feature-name>.md`（英文小寫、hyphen 分隔）。
   - 範例：`docs/plans/2026-08-15-refresh-token.md`。
2. **計畫文件結構**（三段式）：
   ```markdown
   # <feature-name>

   ## User Story
   身為 <角色>，我想要 <行為>，以便 <效益>。
   （必要時加多條 story；亦可補上 Acceptance Criteria）

   ## Spec
   - 前端規格、UI/UX 描述、API 合約、資料流圖等
   - 相依模組、風險、Migration 需求

   ## Tasks
   - [ ] Task 1：xxx（含影響範圍、關鍵檔案）
   - [ ] Task 2：xxx
   - [ ] Task 3：xxx
   ```
3. **完成後**：
   - 將檔案移動至 `docs/plans/archive/`（保留原檔名、原內容；不改副檔）。
   - 於 `docs/FEATURES.md` 對應功能列表勾選 ✅ 並補上完成狀態。
   - 於 `docs/CHANGELOG.md` 頂端加入一筆條目（日期、版本、摘要）。
   - Commit 訊息前綴建議：`feature/first`、`fixed/view` 等，沿用既有 git log 風格（見 `git log --oneline`）。
4. **廢棄或延後**的計畫：於檔案頂端加註 `**Status: Deferred**` 或 `**Status: Cancelled**`，仍移動到 `archive/` 但保留備查。
