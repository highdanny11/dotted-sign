# ARCHITECTURE

本文件記錄 `react-dotted-sign` 的整體架構、目錄結構、啟動流程、路由與 API、Store 資料流、以及 PDF/簽名畫布的整合細節。這些內容在讀 code 前先讀能少走很多冤枉路。

## 應用形態

- **純前端 SPA**（Single Page Application）。
- 由 `Vite` 打包，`react-router-dom` v7 做客戶端路由。
- 開發時透過 Vite proxy 呼叫後端 `/api/*`（`http://localhost:8080`），生產時打包後與後端同源部署（`axios` baseURL 設為 `.`）。

## 目錄結構

```
react-dotted-sign/
├── CLAUDE.md                 # AI 助理速查（本次新建）
├── Dockerfile                # node:20-alpine，安裝依賴 + build
├── README.md                 # Vite 範本原文（未刪除）
├── docs/                     # 本文件目錄
├── eslint.config.js          # ESLint flat config（含 react-hooks / react-refresh）
├── index.html                # 入口 HTML，title = 快點簽 Fast-Sign
├── package.json              # scripts + dependencies
├── package-lock.json
├── public/
│   ├── ico.ico               # favicon
│   └── vite.svg
├── tsconfig.json             # references app/node
├── tsconfig.app.json         # 應用型別設定（含 @/* → ./src/*）
├── tsconfig.node.json        # Vite config 用
├── vite.config.ts            # React + Tailwind + AutoImport + @ alias + /api proxy
└── src/
    ├── App.tsx               # 路由組裝，含 antd ConfigProvider 主題
    ├── main.tsx              # createRoot + BrowserRouter + Google OAuth token 接收
    ├── index.css             # Tailwind v4 @import + @theme 變數 + 少量 layer components
    ├── vite-env.d.ts         # vite/client 型別
    ├── auto-imports.d.ts     # unplugin-auto-import 產生（勿手動編輯）
    ├── api/
    │   ├── index.ts          # 空檔（保留擴充用）
    │   ├── instance.ts       # Axios 實例：baseURL='.', timeout=5000, resp 攔截後回傳 data
    │   └── users/
    │       └── index.ts      # signup / login / getUserInfo
    ├── assets/               # SVG / PNG 圖檔（Logo、Step1~3、NotFound、Google、Facebook…）
    ├── component/
    │   ├── footer/Footer.tsx        # 版權列
    │   ├── form/Button.tsx          # 3 theme × 3 size 的樣式按鈕
    │   ├── form/Input.tsx           # 通用 input，套 Tailwind class
    │   ├── header/HomeHeader.tsx    # 依 useLayoutStore 切換 Home/Sign 兩種樣式
    │   └── step/index.tsx           # 四步驟進度條，讀 useSignStore.activeStep
    ├── hook/
    │   └── useDrag.tsx       # 泛型 hook：對 ref 綁 dragenter/leave/over/drop
    ├── layout/
    │   ├── Layout.tsx        # HomeHeader + <Outlet/> + Footer；min-h calc
    │   └── RegisterLayout.tsx# 登入/註冊/忘記密碼共用的簡化排版
    ├── store/                 # Zustand
    │   ├── useLayout.tsx     # header 型別（'HomeHeader' | 'SignHeader'）
    │   ├── useSign.tsx       # 檔案 / 頁碼 / canvas 陣列 / 簽名 / 步驟
    │   └── useUser.tsx       # token + user info（token 同步寫入 sessionStorage）
    ├── type/
    │   ├── common.ts         # GenerateApiFunction 泛型
    │   └── users.ts          # Register/Login/SignupRequest/UserInfo/*Api 型別
    ├── utils/
    │   ├── fileToBase64.ts   # File → Base64 純字串（去掉 `data:*;base64,` 前綴）
    │   ├── isAllowedFileType.ts  # ext 白名單：png/jpg/jpeg/pdf
    │   ├── PDFUtils.ts       # Base64 → pdfjs → HTMLCanvasElement[]
    │   └── setFabricDeleteControl.ts  # Fabric Control：左上刪除按鈕
    └── views/
        ├── error/Error404.tsx
        ├── forget/Forget.tsx
        ├── home/HomePage.tsx
        ├── login/Login.tsx
        ├── register/Register.tsx
        └── sign/
            ├── index.tsx             # 簽署主頁：Step + PDFBox 列表 + Side Panel + 檢查 Modal
            ├── PDFBox.tsx            # 單頁 fabric.Canvas 容器，setBackgroundImage
            ├── SignSettingSection.tsx# 右側設定：基本資料 + 「加入簽名」開 Modal
            ├── InputSign.tsx         # Tab: 文字輸入 + 字體 + 顏色
            ├── SignaturePad.tsx      # Tab: 手寫（含 undo/clear/change color/DPR 修正）
            ├── UploadFile.tsx        # Tab: 上傳圖檔
            └── FinishSign.tsx        # 完成頁：canvasList → jsPDF 下載
```

### 每個檔案的用途摘要

- `src/main.tsx`：
  - 若 URL 含 `#`（hash），開新視窗到 `location.origin`（處理 hash-mode 反相容）。
  - 若 URL 含 `token=`（Google OAuth callback），把 `token` 寫入 `sessionStorage`，300ms 後 `replace` 到 `location.origin` — 這是雙模式認證（OAuth redirect vs. email/password）的黏合機制。
  - `createRoot` 掛載 `<BrowserRouter><App /></BrowserRouter>`。
- `src/App.tsx`：宣告全部 6 條路由，並用 `antd` 的 `ConfigProvider` 覆寫 `colorBgMask`（Modal 遮罩改為半透明淡青）與 `boxShadow`。
- `src/index.css`：
  - `@import` 兩組 Google Fonts（Noto Sans TC + Noto Serif TC）。
  - `@import "tailwindcss"`（Tailwind v4 CSS-first 設定）。
  - `@theme` 定義品牌色階（primary/brand/brand-hover/dark/dark-grey/grey/ui-grey/light-grey/negative/positive/general/black）與字級（`text-2xl` 到 `text-sx`）。
  - `@utility container`：手動實作 `container`，並於 `md` / `xl` 覆寫左右 padding。
  - `.custom-modal` 覆寫 antd Modal 內距。
- `src/auto-imports.d.ts`：由 `unplugin-auto-import` 自動產出，宣告 React hooks 全域可用；勿手改。

## 啟動流程

### 開發模式（`npm run dev`）

1. Vite 讀 `vite.config.ts`：
   - 掛 `@vitejs/plugin-react`（Fast Refresh）。
   - 掛 `@tailwindcss/vite`（Tailwind v4，非 PostCSS）。
   - 掛 `unplugin-auto-import`，把 React hooks 注入全域，並寫回 `src/auto-imports.d.ts`。
   - 設定 alias：`@` → `<repo>/src`。
   - dev server：host `0.0.0.0`、port `5173`、`/api` → `http://localhost:8080`（`changeOrigin: true`）。
2. 瀏覽器載入 `index.html`（title `快點簽 Fast-Sign`）→ 執行 `/src/main.tsx`。
3. `main.tsx` 檢查 URL：
   - 有 `#` → 開 `location.origin`（等同重整）；避免使用者殘留舊 hash router 連結。
   - 有 `token=` → 存 sessionStorage、`setTimeout(..., 300)` 後 `location.replace(origin)`。
4. `App.tsx` 組裝路由。首頁 `HomePage` 在 `useEffect` 中若 `sessionStorage.token` 存在，會呼叫 `getUserInfo()` 抓使用者資料。

### 生產模式（`npm run build`）

1. `tsc -b` 逐專案型別檢查（`tsconfig.app.json` + `tsconfig.node.json`）。
2. `vite build` 產出 `dist/`。
3. Dockerfile 目前僅停在 `RUN npm run build`；如需部署需自行接 nginx 或其他靜態伺服器。

## 路由總覽表

Routes 定義於 `src/App.tsx`。前綴無版本化，全部由 `BrowserRouter` 承接。

| Path | Layout | Component | 認證 | 說明 |
| --- | --- | --- | --- | --- |
| `/` | `Layout`（HomeHeader + Footer） | `HomePage` | 選用（有 token 會抓 user info） | 拖曳/選擇 PDF；<10MB、application/pdf；成功後 `setFile`、`setFileName`、`setHeader('SignHeader')` 然後導 `/sign` |
| `/sign` | `Layout` | `Sign` | 選用 | PDF 分頁渲染 + Fabric 覆蓋層；右側面板加簽名；「下一步」開檢查 Modal |
| `/login` | `RegisterLayout` | `Login` | 匿名 | email/password 表單（Zod 驗證）；Google 按鈕 → `window.open('https://sign.sideproject.website/api/users/google', '_self')` |
| `/register` | `RegisterLayout` | `Register` | 匿名 | 註冊；密碼 refine 規則需含大小寫與數字，長度 8~16 |
| `/forget` | `RegisterLayout` | `Forget` | 匿名 | UI-only；無 submit 邏輯 |
| `/finish-file` | 無 Layout | `FinishSign` | 選用 | 讀 `canvasList` → jsPDF 匯出；若 `canvasList` 為空自動 reset 並導回 `/` |
| `/file-error` | 無 Layout | `Error404`（帶自訂 title/desc） | — | 上傳失敗導向 |
| `*` | 無 Layout | `Error404`（預設文案） | — | 404 |

### 已定義後端 API 路由（前端 axios 呼叫）

| 方法 | 路徑 | 對應函式 | 認證 | 備註 |
| --- | --- | --- | --- | --- |
| POST | `/api/users/signup` | `signup(data)` | 無 | body: `{ name, email, password, confirm }`；回傳 `{ user: { token } }` |
| POST | `/api/users/login` | `login(data)` | 無 | body: `{ email, password }`；回傳 `{ user: { token } }` |
| GET | `/api/users/info` | `getUserInfo()` | Bearer | header 由呼叫端手動塞入 `Authorization: Bearer <sessionStorage.token>` |
| GET（外部連結） | `https://sign.sideproject.website/api/users/google` | Google 登入按鈕 | 無 | 由後端做 OAuth，成功後 redirect 回前端並附 `?token=xxx` |

`instance.ts` 的 response interceptor 直接回傳 `response.data`，因此業務代碼看到的 `res` 已是 payload；型別 `GenerateApiFunction<T,R>` 卻宣告回傳 `Promise<AxiosResponse<R>>`，實務使用時仍以 `res.data.user` 存取（見 `HomePage.tsx:53`、`Login.tsx:45`）。這種型別與實際回傳的落差是既有現象，若要改應同步調整所有呼叫端。

## 統一回應格式

後端回傳格式（觀察 `Login/Register` 對回應的解構）：

```json
{
  "user": {
    "token": "<jwt>"
  }
}
```

`getUserInfo` 回傳：

```json
{
  "user": {
    "email": "...",
    "name": "...",
    "file": [
      { "name": "...", "id": 1, "createdAt": "..." }
    ]
  }
}
```

未觀察到全域 `code`/`message` 欄位；錯誤僅以 HTTP 狀態碼處理，前端 `catch` 到後 `console.error` 並不顯示訊息（尚無 UX 錯誤呈現，見 `FEATURES.md`）。

## 認證與授權

### Token 儲存

- **儲存位置**：`sessionStorage`，key = `'token'`（分頁關閉即失效）。
- **寫入時機**：
  1. `Login.onSubmit`：`sessionStorage.setItem('token', res.data.user.token)`。
  2. `Register.onSubmit`：同上。
  3. `main.tsx`：Google OAuth callback 帶 `?token=` 時直接寫入並 replace。
  4. `useUserStore.setToken`：同步寫入 sessionStorage 與 in-memory state。
- **讀取時機**：
  - `getUserInfo` 直接 `sessionStorage.getItem('token')` 建 Authorization header。
  - `HomePage` 首次載入時檢查 sessionStorage，有值則呼叫 `getUserInfo` 並 setUser。
  - `useUserStore` 建立時以 sessionStorage 值初始化 `token`。
- **清除時機**：`HomeHeader` 登出按鈕 → `Popconfirm` 確認 → `setToken('')` 並清空 user info。

### 雙模式認證流程

1. **Email/Password**：`Login.tsx` 使用 `react-hook-form` + Zod schema，成功後把 token 塞入 sessionStorage，`navigate('/')`。
2. **Google OAuth（redirect flow）**：
   - 按鈕呼叫 `window.open('https://sign.sideproject.website/api/users/google', '_self')`。
   - 後端完成 OAuth 後，將使用者導回前端（原則上為前端 origin），並在 query string 帶 `token=<jwt>`。
   - `main.tsx` 在 mount 之前偵測 `window.location.search.indexOf('token') > 0`，寫入 sessionStorage，300ms 後 `location.replace(location.origin)`。此 300ms delay 是為了給 `sessionStorage.setItem` 完成的緩衝；勿隨意移除。

### 未實作項目

- 沒有前端路由守衛（route guard）。所有頁面理論上任何人都能開啟。
- 沒有 refresh token 機制。sessionStorage 過期或關閉分頁後 token 即消失。
- `axios` request interceptor 為空，未自動注入 Authorization。需要驗證的 API 必須在呼叫處手動塞 header（如 `getUserInfo`）。
- 忘記密碼頁 `/forget` 尚未接後端。

## Store（Zustand）資料流

三個 store，皆位於 `src/store/`，皆為 `.tsx`（即使無 JSX）。

### `useLayoutStore`（`useLayout.tsx`）

| 欄位 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `hearder`（原始碼即拼字 `hearder`，非 typo 修正） | `string` | `'HomeHeader'` | header 呈現模式 |
| `setHeader(header)` | action | — | 更新 `hearder` |

**注意**：state 的 key 是 `hearder`（少了 e），action 是 `setHeader`。既有元件全部沿用此拼寫，重構前請通盤修改。

`HomeHeader` 根據 `hearder === 'HomeHeader'` 顯示 Logo；否則顯示「返回」+ 檔名 + 編輯圖示。`HomePage` mount 且 `location.pathname === '/'` 時會強制重置為 `'HomeHeader'`。

### `useSignStore`（`useSign.tsx`）

| 欄位 | 型別 | 用途 |
| --- | --- | --- |
| `file` | `File \| null` | 使用者上傳的原始 PDF File |
| `fileName` | `string` | 顯示於 header 與最終下載檔名 |
| `currentPage` | `number` | 目前頁碼（0-based） |
| `totalPage` | `number` | 總頁數（目前僅預留欄位，並未在渲染流程使用） |
| `canvasList` | `fabric.Canvas[]` | 每頁對應一個 fabric.Canvas；由 `PDFBox` 建立後 `setCanvasList(canvas, index)` |
| `signature` | `Sign[][]` | 每頁的簽名物件陣列（`Textbox \| Image`）；`addSignature(pageIndex, sign)` 追加 |
| `activeStep` | `number` | `Step` 元件的高亮索引（0~3） |

Actions：`setFile`、`setFileName`、`setCurrentPage`、`setTotalPage`、`setCanvasList(canvas, index)`（會 shallow-copy 陣列後替換該 index）、`setSignature`、`addSignature`、`setActiveStep`、`resetSignState`（重置除 `activeStep` 以外的全部欄位）。

`resetSignState` 於 `FinishSign` 完成或首頁跳轉時觸發。**注意**：`resetSignState` 並未重置 `activeStep`（見 `useSign.tsx:56-64`），若需完整 reset 應手動 `setActiveStep(0)`。

### `useUserStore`（`useUser.tsx`）

| 欄位 | 型別 | 預設 |
| --- | --- | --- |
| `token` | `string` | `sessionStorage.getItem('token') \|\| ''` |
| `user` | `UserInfo` | `{ email: '', name: '', file: [] }` |
| `setToken(token)` | action | 同步寫入 sessionStorage + state |
| `setUser(user)` | action | 只更新 state |

登出流程（`HomeHeader.confirmLogout`）：`setToken('')` → 直接 `useUserStore.setState({ user: { ... 空值 } })` → `navigate('/')`。這裡直接呼叫 `setState` 而非 action，是既有寫法，保留即可。

## 簽署流程資料流

以下為 `HomePage` 上傳到 `FinishSign` 下載的完整訊號路徑，是本專案最複雜的部分：

1. **上傳** `HomePage.finishFile(file)`
   - 檢查 `file.size <= 10 * 1024 * 1024 && file.type === 'application/pdf'`；否則 `navigate('/file-error')`。
   - `setFileName(file.name)`、`setFile(file)`（存進 `useSignStore`）。
   - `setHeader('SignHeader')`，`navigate('/sign')`。
2. **PDF → canvas 陣列** `Sign` useEffect（`views/sign/index.tsx:35`）
   - `fileToBase64(file)` 去掉 `data:*;base64,` 前綴，回傳純 base64 字串。
   - `PDFUtils(base64)`：
     - `atob(base64)` 解碼成 binary string。
     - `PDFLib.getDocument({ data: atobData }).promise` 讀取 PDF。
     - 迴圈每頁 → 建 `<canvas>` → `page.render({ canvasContext, viewport })`，viewport `scale = 1`。
     - 回傳 `HTMLCanvasElement[]`。
     - PDF.js worker 從 CDN 載入：`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs`（離線環境會失敗，見 `DEVELOPMENT.md`）。
   - 結果放進本地 `useState<HTMLCanvasElement[]>` 的 `cavasPdf`（拼字如此，非 typo）。
3. **Fabric 覆蓋層** `PDFBox`（每頁一個實例）
   - 建立 `new fabric.Canvas('PDF-{index}')`。
   - 依父層 `<div ref={pdfWrap}>` 寬度計算縮放：`scale = min(1, containerWidth / pdfCanvasWidth)`。
   - 把 PDF canvas 當作 `fabric.Image` 設為背景 `setBackgroundImage(img, requestRenderAll)`。
   - 呼叫 `setCanvasList(fabricCanvas, index)` 存入 store。
4. **加入簽名** `SignSettingSection`
   - 「加入簽名」開 Modal，Modal 內三個 Tab：
     - **InputSign**：文字 → `new fabric.IText(text, { left:100, top:100, fontSize:40, fill, fontFamily })`。
     - **SignaturePad**：手寫 → `<canvas>` → `toDataURL()` → `new fabric.Image(<img>)`，`top:400`。
     - **UploadFile**：圖檔 → `fileToBase64` → 前置 `data:image/${type};base64,${base64}` → `new fabric.Image(<img>)`。
   - 每個新增物件都會 `data.controls.deleteControl = setFabricDeleteControl()`：於左上方（`x:-0.5, y:-0.5, offsetY:-20`）新增一個 30px 的自訂 Control，點擊即從 canvas 移除自身（`setFabricDeleteControl.ts:23-33`）。
5. **確認** `Sign` 的「下一步」按鈕開 `checkModal`（Step 進到 2 = 「確認檔案」）。
   - 使用者勾「我不是機器人」`checkFile`（純 UI，無驗證機制），點「確認」→ `navigate('/finish-file')`。
6. **匯出** `FinishSign.finishSignPDF`
   - `new jsPDF()`；預設 A4 直式。
   - 對每個 canvas：`toDataURL()`、`pdf.internal.pageSize.getWidth()` 取寬、按 canvas 原始長寬比推 `height = canvas.height * width / canvas.width`。
   - 第一頁直接 add，第二頁起 `pdf.addPage()`。
   - `pdf.save(fileName)` 觸發下載。
7. **返回** `FinishSign.backHome` → `navigate('/')` + `resetSignState()`；若進入時 `canvasList` 已空亦會自動 reset 並返回。

## Fabric 版本相依細節

- `@types/fabric@^4.5.2` + `fabric@^5.2.4`。程式碼使用：
  - `new fabric.Canvas(id)`
  - `new fabric.Image(imgElement, options)`（fabric 5 用 constructor；fabric 6 已改用 `fabric.Image.fromURL(...)` 為主）
  - `canvas.setBackgroundImage(img, callback)`（fabric 6 移除 callback 形式）
  - `new fabric.IText(text, options)` 匯入未實際使用時仍有需求
  - `new fabric.Control({ x, y, offsetY, cursorStyle, mouseUpHandler, render })`
  - `fabric.util.degreesToRadians`
- **升級 fabric 到 6.x 會全面破壞**，遷移需重寫這幾個 API 呼叫。

## PDF 工作端點

- `pdfjs-dist` 的 worker 由 CDN 載入。在無網路 / CSP 嚴格的部署環境會失敗；解法為把 worker 檔複製到 `public/` 並改設 `GlobalWorkerOptions.workerSrc` 為本地相對路徑。目前寫死於 `src/utils/PDFUtils.ts:2`。

## 樣式系統

- Tailwind v4 CSS-first 設定於 `src/index.css`：
  - 品牌主色 `--color-brand: rgba(11,125,119,1)`（深青綠），`hover` 版本、`primary` 淡青、`ui-grey`、`light-grey` 等由 `@theme static` 宣告。
  - 字型：Google Fonts 的 `Noto Sans TC` 為主，設在 `--font-sans`；`InputSign` 額外提供 `Noto Serif TC`。
- 元件層級：
  - `Button`：`theme` × `size` 各 3 種 = 9 種組合，皆走 `twMerge(clsx(...))`。
  - `Input`：預設 h-10、rounded、border-grey、focus border-brand。
- Antd `ConfigProvider` 在 `App.tsx` 覆寫 `colorBgMask`、`boxShadow`；Modal 元件另有 `.custom-modal` CSS 覆寫內距。

## 資料庫 schema

此專案為純前端，不直接接觸資料庫。相關 schema 屬於後端 repository（`sign.sideproject.website`），本 repo 只透過 `POST /api/users/signup`、`POST /api/users/login`、`GET /api/users/info` 三個端點與其溝通。若需擴充，請先確認後端合約。

## 金流／第三方整合

- **Google OAuth**：外部連結導向 `https://sign.sideproject.website/api/users/google`，callback 由後端把 token 以 query string 送回前端。前端不管 client_id、scope 等設定。
- **CDN 資源**：Google Fonts、pdfjs worker。皆為 runtime 依賴，離線環境會受影響。
- 未整合任何金流／付費機制。
