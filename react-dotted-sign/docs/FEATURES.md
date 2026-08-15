# FEATURES

本文件列出「快點簽 Fast-Sign」前端目前提供的功能、行為細節、以及尚未完成的部分。每個功能區塊都盡量描述業務邏輯、參數、錯誤情境。

## 完成狀態總覽

| 分區 | 功能 | 狀態 | 位置 |
| --- | --- | --- | --- |
| 首頁 | PDF 拖曳/選檔上傳 | ✅ | `views/home/HomePage.tsx` |
| 首頁 | 檔案大小/型別驗證 → 錯誤頁 | ✅ | `views/home/HomePage.tsx`、`views/error/Error404.tsx` |
| 首頁 | 三步驟說明區塊 | ✅ | `views/home/HomePage.tsx` |
| 首頁 | 已登入時自動抓 user info | ✅ | `views/home/HomePage.tsx`、`api/users/getUserInfo` |
| Header | Home / Sign 兩種模式切換 | ✅ | `component/header/HomeHeader.tsx`、`store/useLayout` |
| Header | 檔名重新命名 Modal | ✅ | `component/header/HomeHeader.tsx` |
| Header | 登入 / 註冊按鈕 | ✅ | 同上 |
| Header | 登出（Popconfirm） | ✅ | 同上 |
| 簽署頁 | PDF → canvas 分頁渲染 | ✅ | `views/sign/index.tsx`、`utils/PDFUtils.ts`、`views/sign/PDFBox.tsx` |
| 簽署頁 | 手寫簽名（含 undo / clear / 換色） | ✅ | `views/sign/SignaturePad.tsx` |
| 簽署頁 | 文字簽名（字體 + 顏色） | ✅ | `views/sign/InputSign.tsx` |
| 簽署頁 | 上傳圖檔簽名 | ✅ | `views/sign/UploadFile.tsx` |
| 簽署頁 | Fabric 物件拖曳 / 縮放 / 刪除 | ✅ | `utils/setFabricDeleteControl.ts` |
| 簽署頁 | 頁面切換 / 放大檢視 | ✅ | `views/sign/index.tsx` |
| 簽署頁 | 「確認」Modal + 「我不是機器人」勾選 | ⚠️ 僅前端 UI | `views/sign/index.tsx` |
| 完成頁 | jsPDF 匯出 & 下載 | ✅ | `views/sign/FinishSign.tsx` |
| 完成頁 | 重新上傳（reset store） | ✅ | 同上 |
| 認證 | Email/Password 註冊 + Zod 驗證 | ✅ | `views/register/Register.tsx` |
| 認證 | Email/Password 登入 + Zod 驗證 | ✅ | `views/login/Login.tsx` |
| 認證 | Google OAuth 進入點 | ✅ | `Login.tsx`、`Register.tsx`、`main.tsx` |
| 認證 | 忘記密碼 | 🚧 UI-only（無提交邏輯） | `views/forget/Forget.tsx` |
| 認證 | 路由守衛 / route guard | ❌ 尚未實作 | — |
| 認證 | Refresh token / 過期處理 | ❌ 尚未實作 | — |
| 會員 | 保存簽名檔列表 | ❌ 第二階段（見 `SignSettingSection.tsx:103-108` 註解） | — |
| 錯誤 | 404 頁面 | ✅ | `views/error/Error404.tsx` |
| 錯誤 | 上傳失敗頁 `/file-error` | ✅ | 同上 |
| 錯誤 | 表單 API 失敗 UX | ❌ 目前僅 `console.error` | — |
| 國際化 | 語系切換 | 🚧 Footer 有註解掉的按鈕 | `component/footer/Footer.tsx` |

Legend：✅ 完成、🚧 部分／UI-only、⚠️ 有實作但不完整、❌ 未實作。

## 功能行為詳述

### 1. 首頁上傳 PDF

**路徑**：`/`  
**元件**：`HomePage`

**行為**：
- 進入頁面時：
  1. `setHeader` 由 store 拿；`useEffect` 監聽 `sessionStorage.getItem('token')`，有 token 就呼叫 `getUserInfo()` 並 `setUser(res.data.user)`；失敗時 `setToken('')` 並 `console.error`。
  2. 掛載一個大面積 `<label>` 覆蓋整個上傳區，內含隱藏的 `<input type="file">`，同時透過 `useDrag` hook 綁 `dragenter/leave/over/drop`。
- 選檔或拖檔皆呼叫 `finishFile(file)`：
  1. **驗證**：`file.size > 10 * 1024 * 1024` 或 `file.type !== 'application/pdf'` → `navigate('/file-error')`，該頁顯示「您的檔案無法上傳」+「請重新上傳檔案。確認檔案大小在10Mb以內，檔案格式為PDF。」
  2. **通過**：`setFileName(file.name)`、`setFile(file)`、`setHeader('SignHeader')`、`navigate('/sign')`。
- 頁面下方另有靜態「輕鬆幾步驟」說明，顯示 Step1/2/3 三張圖與文案。

**必填 / 選填**：只接受 PDF；副檔名檢查依 `file.type`（MIME）而非副檔名字串。副檔名檢查 `isAllowedFileType` 目前只在其他地方定義為 `png/jpg/jpeg/pdf`，但此上傳流程沒實際呼叫。

**錯誤情境**：
- 檔案 > 10 MB → 導 `/file-error`。
- 非 `application/pdf`（如 `.pdf` 但 MIME 錯，或使用者選其他檔案）→ `/file-error`。
- Drag 事件 `dataTransfer.files` 為空 → useDrag 內部忽略（`return`）。

### 2. Header（HomeHeader）

**元件**：`component/header/HomeHeader.tsx`

**行為**：
- 從 `useLayoutStore` 讀 `hearder`（是 store 的 key 拼寫，非 typo）：
  - `'HomeHeader'` → 顯示 Logo；`md` 以上顯示中央 slogan 「快速省時的電子工具」。
  - 其他值（實務上為 `'SignHeader'`）→ 顯示返回按鈕 + `useSignStore.fileName` + 編輯圖示。
- **編輯檔名**：點編輯圖示開 Modal，本地 state `acitveFileName`（拼字如此）預填當前 `fileName`；`disabled={!acitveFileName}`；「儲存」寫回 `setFileName` 並關閉。
- **登入/註冊 vs. 頭像**：以 `useUserStore.token` 判斷；
  - 無 token：顯示「登入」（outline）+「註冊」（filled）兩顆按鈕。
  - 有 token：顯示 `Large.svg` 頭像；點擊後 antd `Popconfirm`「確定要登出嗎？」；Yes → `setToken('')` + `setState({ user: {...空值} })` + `navigate('/')`。
- **路徑監聽**：當 `location.pathname === '/'` 時，強制把 `hearder` 重置為 `'HomeHeader'` 並清空 `acitveFileName`。

### 3. 簽署頁 `/sign`

**元件**：`views/sign/index.tsx`（Sign）+ `PDFBox` + `SignSettingSection` + `InputSign` / `SignaturePad` / `UploadFile`

#### 3.1 PDF 渲染

- `useEffect` 監聽 `file`（來自 `useSignStore`）：
  1. `fileToBase64(file)` → 純 base64 payload。
  2. `PDFUtils(base64)` → `atob` 解碼 → `pdfjs-dist getDocument({ data })` → 逐頁 `page.render` 到 HTMLCanvasElement，回傳 canvas 陣列。
  3. 過程中 `loading = true` 顯示 `<Spin size="large" />`；結束後 `setCavasPdf(canvas)`。
- 每個 canvas 由 `PDFBox` 包裝：
  - `useRef` 建 `fabric.Canvas('PDF-{index}')`，只建立一次。
  - 依父容器寬度計算 `scale`（`min(1, containerWidth / pdfWidth)`）；設為 `fabric.Image` 的 `scaleX/Y`。
  - `setBackgroundImage(img, renderAll)`，將 fabric canvas 尺寸設為縮放後的 image 寬高。
  - 將 fabric canvas 存入 `useSignStore.canvasList[index]`。
- 顯示：所有 PDFBox 疊在同一個絕對定位容器內，只有 `index === currentPage` 加上 `z-10` 讓其顯示於最上層。

#### 3.2 頁面工具列（左下角）

- **放大鏡**：`openImage` 把 `canvasList[currentPage].toDataURL()` 傳給 antd `Image` 的 preview，開啟大圖檢視。
- **上一頁 / 下一頁**：`setCurrentPage((prev) => prev < len - 1 ? prev + 1 : prev - 1)`（達邊界則反向 -1，非典型循環，源自既有邏輯）。
- **右側面板開關（`<lg` 隱藏面板）**：`<lg` 螢幕右上角出現漢堡按鈕 `MdMenuOpen`，開啟 slide-in 面板（`translate-x-full` → `translate-x-0`），面板內含 `SignSettingSection`。

#### 3.3 右側設定面板 `SignSettingSection`

- **基本資料**：靜態表單，兩個 Input：姓名、電子信箱。目前為 UI-only（不含 form state 與提交）。
- **加入簽名**：按「加入簽名」開 Modal。Modal 內三個 tab（輸入 / 手寫 / 上傳）；tab 切換有底線動畫（`translate-x-{0, full, 200%}`）。
  - **InputSign**：
    - 字體切換：`Noto Sans TC`（思源黑體） / `Noto Serif TC`（思源宋體）。
    - 顏色：黑 `#000` / 藍 `#155dfc` / 紅 `#e7000b`。
    - `<input type="text">` 直接以 80px 大字顯示；`setCurrentSign(text)`。
    - 儲存時建立 `fabric.IText(text, { left:100, top:100, fontSize:40, fill, fontFamily })`。
  - **SignaturePad**：
    - `<canvas>` 依 `devicePixelRatio` 放大實際像素、再 `ctx.scale(ratio, ratio)`，避免 HiDPI 模糊。
    - 初始筆刷：`lineWidth: 4, lineCap: 'round', strokeStyle: '#000', fillStyle: '#fff'`。
    - 支援滑鼠 + 觸控（`onTouchStart/Move/End`）。
    - **回上一步**（undo）：`storkesRef` 陣列 `pop()` 後全部 `clearRect` + `reDraw`。
    - **清除**：整張 `clearRect` + `storkesRef = []`。
    - **換色**：清空 canvas → 更新 `strokeStyle` → 依 `storkesRef` 重繪（重繪時所有 stroke 都被改成新色，非「新筆畫用新色、舊筆畫保留原色」的行為 — 這是既有實作）。
    - 儲存時：`toDataURL()` 塞給 `setCurrentSign`；`SignSettingSection` 再以此 dataURL 建 `new fabric.Image(<img>)`，`top:400` 加入當前頁 canvas。
  - **UploadFile**：
    - `<input type="file">` → `fileToBase64` → 拼 `data:image/${file.type};base64,${base64}` → `setCurrentSign`。
    - 「更改」→ 觸發 hidden input click；「清除」→ `setCurrentSign('')`。
    - **注意**：`file.type` 是完整 MIME（如 `image/png`），此處直接串接會產出 `data:image/image/png;base64,...`，實務上 fabric 仍能載入（多數瀏覽器容忍），但屬既有 bug。
    - 儲存與 SignaturePad 相同：建 fabric.Image 塞到當前頁。
  - **共同**：儲存後 `data.controls.deleteControl = setFabricDeleteControl()`（於左上方顯示品牌色刪除按鈕，點擊即從 canvas 移除該物件）；`setSign('')` 並關 Modal。

- **會員專屬簽名清單**：目前註解掉（`SignSettingSection.tsx:103-108`），為第二階段功能。

#### 3.4 「下一步」按鈕與確認 Modal

- 點「下一步」→ `checkModal` 開啟，同時 `useEffect` 監聽 `checkModal`，開啟時 `setActiveStep(2)`，關閉時 `setActiveStep(1)`。
- Modal 內容：「請確認您的檔案」+「確認後將無法修改。」+「我不是機器人」checkbox（本地 state，僅前端 UI，無驗證）+ 圖示。
- 「確認」`disabled={!checkFile}`；點下去 `navigate('/finish-file')`。
- 「返回」關閉 Modal。

### 4. Step 元件

**元件**：`component/step/index.tsx`

**四步驟**：
1. 成功上傳檔案
2. 加入簽名檔
3. 確認檔案
4. 下載檔案

**行為**：
- 讀 `useSignStore.activeStep`；`useEffect` 依 index 分派 state：`< activeStep` → `finish`（顯示 Finish icon），`=== activeStep` → `active`（品牌色底 + 白色數字），`> activeStep` → `default`（灰色 border）。
- 步驟間有連接線（`::after`），最後一項無連接線（走 `lastStateStyle`）。
- 響應式：`md` 以下只顯示 active 的文字，其他隱藏。

### 5. 完成頁 `/finish-file`

**元件**：`FinishSign`

**行為**：
- 進入時 `useEffect` 若 `canvasList.length === 0`（例如直接輸入 URL 進來，或已 reset），自動 `resetSignState()` + `navigate('/')`。
- 「下載檔案」：
  - `new jsPDF()`（預設 A4 直式）。
  - 對每個 fabric canvas：`toDataURL()`（PNG）；`pdf.internal.pageSize.getWidth()` 取 PDF 頁寬；依原 canvas 比例計算 height；第一頁直接 `addImage`，後續 `addPage()` 再 `addImage`。
  - `pdf.save(fileName)` 觸發下載，檔名即 `useSignStore.fileName`。
- 「重新上傳」：`navigate('/')` + `resetSignState()`。

**注意**：`FinishSign` 不會把 header 切回 `HomeHeader`；因為 `/finish-file` 無 `Layout`（無 Header），下次回到 `/` 時 `HomeHeader` 的 useEffect 會自動 reset。

### 6. 登入 `/login`

**元件**：`views/login/Login.tsx`

**Schema**（Zod）：
- `email`: 必為 email。
- `password`: `min(6, '密碼至少6個字元')` + `regex /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/`。

**行為**：
- 表單使用 `react-hook-form` + `zodResolver`。
- 「透過 Google 登入」→ `window.open('https://sign.sideproject.website/api/users/google', '_self')`；後端 OAuth 完成後 redirect 回本站帶 `?token=...`，由 `main.tsx` 攔截寫入 sessionStorage。
- Submit → `login(data)` → `sessionStorage.setItem('token', res.data.user.token)` → `navigate('/')`；`loading` state 控制按鈕 disabled。
- 錯誤：僅 `console.error`，前端不顯示錯誤訊息（見 `FEATURES.md` 已知未實作項）。
- 「忘記密碼」連結指向 `/`（原始碼即如此，非 `/forget`）。可能是既有 bug 或未完成。

### 7. 註冊 `/register`

**元件**：`views/register/Register.tsx`

**Schema**（Zod）：
- `name`: `min(1, '姓名必填')`。
- `email`: 必為 email。
- `password`: `min(6)` + `refine (?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}`（訊息為「需要包含英文數字大小寫，最短8個字，最長16個字」）。

**行為**：
- Submit 時把 `password` 同時當 `confirm` 送出（後端合約需要 `confirm` 欄位）；`await signup({ ...data, confirm: data.password })`。
- 成功後同 `Login` 流程存 token + 導首頁。

### 8. 忘記密碼 `/forget`

**元件**：`views/forget/Forget.tsx`

**行為**：純 UI，`<input>` 未接 form；按鈕文字為「註冊」（既有代碼，未修正），未觸發任何 API。屬未完成功能。

### 9. 錯誤頁 / 404

**元件**：`views/error/Error404.tsx`

**行為**：
- 預設 title `'您的網址輸入不正確'`，description `''`。
- 支援自訂 title/description（App.tsx 對 `/file-error` 傳入自訂文字）。
- 「回首頁」按鈕 `navigate('/')`。

## API 對應

| 端點 | 呼叫元件 | Body / Header | 錯誤處理 |
| --- | --- | --- | --- |
| POST `/api/users/signup` | `Register.onSubmit` | `{ name, email, password, confirm }` | 僅 `console.error`；無 UX 提示 |
| POST `/api/users/login` | `Login.onSubmit` | `{ email, password }` | 僅 `console.error` |
| GET `/api/users/info` | `HomePage.useEffect` | Header `Authorization: Bearer <sessionStorage.token>` | 失敗時 `setToken('')` + `console.error` |
| GET `https://sign.sideproject.website/api/users/google` | `googleLogin`（Login/Register） | — | 由後端做 redirect；前端不處理 |

## 已知未完成 / 待改善項目

1. **表單 API 失敗無 UX 提示**：Login/Register 皆只 `console.error`；建議加 antd `message.error` 或表單 inline 錯誤。
2. **忘記密碼未接 API**；且 UI 上按鈕文字「註冊」與情境不符。
3. **登入頁「忘記密碼」連結指向 `/` 而非 `/forget`**。
4. **UploadFile 產出的 dataURL 前綴重複 `image/`**（`data:image/image/png;...`）。
5. **`SignaturePad` 換色會把所有 stroke 都改成新色**，而非只影響後續筆畫。
6. **`resetSignState` 未重置 `activeStep`**。
7. **PDF worker 由 CDN 載入**，離線環境無法使用。
8. **無 route guard**，任何人可直接開 `/sign`、`/finish-file`（進去後靠 store 空值判斷跳走）。
9. **hardcoded API host**（`https://sign.sideproject.website`）散落在多個檔案，應抽為環境變數。
10. **會員專屬保存簽名檔清單** 為第二階段；`SignSettingSection` 有預留但註解掉的 UI。
11. **Footer 語系切換按鈕** 已註解，i18n 尚未導入。
