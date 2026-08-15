# CHANGELOG

本檔記錄「快點簽 Fast-Sign」前端 (`react-dotted-sign`) 的顯著變更。條目由新到舊排列。日期格式 `YYYY-MM-DD`。

## Unreleased

### Fixed
- **`openImage` 於邊界翻頁後崩潰**（`src/views/sign/index.tsx`）：加入 `if (!canvas) return` 防呆，避免對 `undefined` 呼叫 `.toDataURL()` 拋出 `TypeError: Cannot read properties of undefined (reading 'toDataURL')`。
- **翻頁按鈕在首/末頁越界**（`src/views/sign/index.tsx`）：兩顆按鈕的「反向 ±1」改為 `Math.max(0, prev - 1)` / `Math.min(cavasPdf.length - 1, prev + 1)` clamp，並交換圖示位置讓 `MdArrowBackIosNew` 對應上一頁、`MdArrowForwardIos` 對應下一頁，語意一致。
- **多頁 PDF 切換頁面延遲**（`src/views/sign/PDFBox.tsx`）：`useEffect` 的 dep 由 `[pdfCanvas, currentPage]` 縮減為 `[pdfCanvas]`。原本每按一次翻頁會觸發全部 PDFBox 重跑 `renderPDF`（重建 fabric.Image、setBackgroundImage、setCanvasList），10 頁 PDF 就是 10 次全頁重繪；修正後只在首次 mount / 換檔時渲染一次。
- **多頁 PDF 出現 `Added non-passive event listener to a scroll-blocking …` 警告**（`src/index.css`、`src/views/sign/SignaturePad.tsx`）：對 Fabric 產出的 `.canvas-container` / `.upper-canvas` / `.lower-canvas` 套 `touch-action: none`，讓瀏覽器知道該元素不接管 scroll 手勢，Fabric 內部的 touchmove 監聽是否 passive 就不再影響效能提示；`SignaturePad` 的自繪 canvas 加 `touch-none`，順便解決手機端手寫時誤觸捲動的問題。

### Added
- `CLAUDE.md`（根目錄）：AI 助理速查表、專案概述、常用指令、關鍵規則、文件索引。
- `docs/README.md`：專案介紹、技術棧、快速開始、常用指令表、文件索引。
- `docs/ARCHITECTURE.md`：目錄結構、啟動流程、路由總覽、API 表、Zustand store 資料流、Fabric+PDF 整合流程、雙模式認證說明。
- `docs/DEVELOPMENT.md`：命名規則、auto-import 使用方式、環境變數表、新增頁面/store/api/middleware/util 步驟、計畫歸檔流程。
- `docs/FEATURES.md`：完成狀態總覽、每個功能行為描述、已知未完成項目。
- `docs/TESTING.md`：測試現況、建議框架、規劃檔案表、常見陷阱、手動測試 checklist。
- `docs/CHANGELOG.md`：本檔。
- `docs/plans/` 與 `docs/plans/archive/`：計畫文件與歸檔目錄。

## 2026-01-18 — 第一階段告一段落

以下條目依 `git log` 反推專案主要里程碑（詳細請見 `git log`）：

### Added
- **簽署流程**（HomePage → Sign → FinishSign）：PDF 拖曳上傳、pdfjs 逐頁渲染、Fabric.js 疊層畫布、手寫 / 輸入 / 上傳圖檔三種簽名、jsPDF 下載。
- **簽名操作**：`setFabricDeleteControl` 提供左上刪除鈕；SignaturePad 支援 DPR 修正、undo、clear、換色；InputSign 支援字體與顏色切換；UploadFile 支援圖檔匯入。
- **表單認證**：`/login`、`/register` 使用 `react-hook-form` + `zod` 驗證；成功後 token 存 sessionStorage。
- **Google 第三方登入**：`window.open` 到後端 OAuth 端點；`main.tsx` 攔截 `?token=` query 存入 sessionStorage 後 replace URL。
- **使用者資訊**：`getUserInfo` 於首頁自動觸發，`useUserStore` 保存。
- **Layout**：`Layout`（HomeHeader + Footer）、`RegisterLayout`（登入/註冊/忘記密碼共用）。
- **Header**：Home/Sign 兩種模式；SignHeader 支援檔名重新命名 Modal；登入態顯示頭像 + Popconfirm 登出。
- **Step 元件**：四步驟進度指示，依 `useSignStore.activeStep` 高亮。
- **Utility**：`fileToBase64`、`isAllowedFileType`、`PDFUtils`、`setFabricDeleteControl`。
- **Store**：`useLayoutStore`、`useSignStore`、`useUserStore`。
- **樣式系統**：Tailwind v4 + 品牌色 tokens；antd `ConfigProvider` 覆寫 Modal 遮罩色。

### Fixed
- 首頁 iPad footer 未置底。
- 簽名預覽垃圾桶按鈕沒作用。
- Google 登入手機快取造成 token 尚未寫入即跳轉（`main.tsx` 加入 300ms delay）。
- Step 元件狀態計算與檔名帶入問題。

### Infrastructure
- Dockerfile 建置（`node:20-alpine`），CI/CD 於 GitHub Actions；相關流程調整多次（詳見 git log `feature/action` / `fixed/action` 系列）。

---

以下版本結構為未來 release 時可沿用的建議格式：

```markdown
## <version> — <YYYY-MM-DD>

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...

### Security
- ...
```
