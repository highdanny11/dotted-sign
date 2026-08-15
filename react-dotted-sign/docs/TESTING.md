# TESTING

本文件說明本專案的測試現況、如何撰寫新測試、以及需要注意的陷阱。

## 現況

**本專案目前沒有自動化測試**：
- `package.json` 沒有 `test` script。
- `devDependencies` 未包含 Vitest、Jest、Testing Library、Playwright、Cypress 等測試框架。
- `src/` 底下沒有 `*.test.ts(x)` 或 `__tests__/` 目錄。

換句話說，目前**只依賴手動測試 + `npm run build` 的型別檢查 + `npm run lint`** 作為品質守門。以下規劃是「若要導入測試，建議走的方向」，並非既成事實。

## 建議測試框架

| 用途 | 建議工具 | 理由 |
| --- | --- | --- |
| Unit / Component | **Vitest** + `@testing-library/react` + `@testing-library/jest-dom` | 與 Vite 原生整合，共用 config；React 19 相容 |
| E2E | Playwright | 對 Fabric.js/pdfjs canvas 互動、drag & drop 支援較穩定 |
| Fabric / Canvas 相關 | 建議 E2E 為主；unit test 中若需要，透過 `jsdom` + `canvas` polyfill（`canvas` npm package） | jsdom 預設沒有實作 `<canvas>` 2D context |

## 目錄與命名建議

若導入 Vitest：

- 單元測試：於原始檔旁邊建 `Foo.test.ts` / `Foo.test.tsx`。
- 整合測試：`src/__tests__/<feature>.test.tsx`。
- Playwright：新增 `e2e/` 目錄，內含 `*.spec.ts`；`playwright.config.ts` 於根目錄。
- 命名規則：測試檔名與被測檔名同 slug，加 `.test.` / `.spec.` 副檔中綴。

## 測試檔案表（規劃）

以下為建議的「首要覆蓋」清單，依風險由高至低：

| 檔案 | 測試範疇 | 類型 |
| --- | --- | --- |
| `utils/fileToBase64.ts` | 讀取正常 file、error/abort 情境 | Unit（用 `Blob` + `Object.defineProperty(reader, 'result', ...)`） |
| `utils/isAllowedFileType.ts` | 白名單與大小寫、無副檔名情境 | Unit（純函式，最簡單） |
| `utils/PDFUtils.ts` | atob 失敗、pdfjs error path | Unit（需 mock `pdfjs-dist`） |
| `utils/setFabricDeleteControl.ts` | render/mouseUpHandler 行為 | Unit + jsdom（需 canvas polyfill） |
| `store/useSign.tsx` | `setCanvasList` 只覆蓋指定 index、`addSignature` 新增到指定頁、`resetSignState` 不重置 `activeStep` | Unit（直接呼叫 zustand store） |
| `store/useUser.tsx` | `setToken` 同步寫入 sessionStorage；初始值來自 sessionStorage | Unit（jsdom 已提供 sessionStorage） |
| `hook/useDrag.tsx` | dragenter/leave/drop 順序、`isDragging=false` 時 drop 不觸發 callback | Unit + testing-library |
| `component/form/Button.tsx` | theme × size 產生正確 class、disabled 時樣式 | Unit + testing-library |
| `component/step/index.tsx` | `activeStep` 變化時各 li 的 class 狀態 | Unit + testing-library + mock store |
| `views/home/HomePage.tsx` | 上傳 >10MB / 非 PDF → 導 `/file-error`；正常導 `/sign` 並 setFileName/setFile | Component test + `MemoryRouter` |
| `views/login/Login.tsx` | Zod 驗證錯誤訊息顯示、成功後寫 token 並導首頁 | Component test + mock `api/users` |
| `views/register/Register.tsx` | 密碼 refine 規則、`confirm` 自動填入 | 同上 |
| `main.tsx` | `?token=` query 時寫入 sessionStorage 並 replace | Unit（可切分成一支獨立 helper 再測試） |
| **E2E**：完整簽署流程 | 上傳 → 加簽 → 下一步 → 下載 | Playwright |
| **E2E**：登入 → 抓 user info → 登出 | 需 mock 後端或 test 環境 | Playwright |

## 執行順序與依賴

若導入 Vitest：

- Unit 測試沒有相互依賴，可平行執行（Vitest 預設）。
- Store 測試若共用 zustand store，需在 `beforeEach` 呼叫對應的 reset action（如 `useSignStore.getState().resetSignState()`）避免污染。
- Component 測試若用 `MemoryRouter` 包裝，router state 於每個 `render()` 獨立。
- sessionStorage 測試在每個 case 前 `sessionStorage.clear()`。

E2E：

- 依賴 dev server 或 preview server。可用 `webServer` 於 `playwright.config.ts` 自動啟 `npm run dev`。
- 需要一份 PDF fixture（放 `e2e/fixtures/sample.pdf`）。

## 撰寫新測試的建議步驟

1. **選定被測目標**：優先選純函式（`utils/*`），成本最低、回報最高。
2. **建 test 檔**：與被測檔同目錄，命名 `<name>.test.ts(x)`。
3. **Arrange / Act / Assert 三段式**：
   ```ts
   import { describe, it, expect } from 'vitest';
   import { isAllowedFileType } from './isAllowedFileType';

   describe('isAllowedFileType', () => {
     it('接受白名單副檔名（含大小寫）', () => {
       expect(isAllowedFileType('a.PDF')).toBe(true);
       expect(isAllowedFileType('a.jpeg')).toBe(true);
     });
     it('拒絕不在白名單者', () => {
       expect(isAllowedFileType('a.exe')).toBe(false);
     });
     it('無副檔名時回傳 false', () => {
       expect(isAllowedFileType('README')).toBe(false);
     });
   });
   ```
4. **對元件**：使用 `render(<Foo />)` + `screen.getBy...` + `userEvent.setup()`。
5. **對 store**：直接呼叫 `useSignStore.getState()` / `useSignStore.setState(...)`；`renderHook` 也可以。
6. **Mock**：
   - Router：`MemoryRouter initialEntries={['/']}`。
   - API：`vi.mock('@/api/users', () => ({ login: vi.fn().mockResolvedValue({ data: { user: { token: 'x' } } }) }))`。
   - Storage：`beforeEach(() => sessionStorage.clear())`。
7. **加到 CI**：在 `package.json` 補：
   ```json
   "scripts": {
     "test": "vitest run",
     "test:watch": "vitest",
     "e2e": "playwright test"
   }
   ```

## 常見陷阱

- **Auto-import 造成測試檔看似「用了但沒 import」**：因 `unplugin-auto-import` 只在 Vite build 生效，Vitest 若不掛同一 plugin，需明確 `import { useState } from 'react'` 於測試檔內；或於 `vitest.config.ts` 加入相同 `AutoImport` plugin。
- **jsdom 無 canvas 2D context**：測試 `SignaturePad` 或 `PDFBox` 時，`getContext('2d')` 回 `null`。解法：
  - 用 Playwright 做 E2E。
  - 或安裝 `canvas` npm 套件並在 `vitest.config.ts` 設 `test.environmentOptions.jsdom.resources = 'usable'`。
- **`pdfjs-dist` 用 ESM worker**：測試環境需 mock 或改為 `import 'pdfjs-dist/legacy/build/pdf'`。
- **`sessionStorage` 於 zustand 初始化時被讀取**：`useUser.tsx` 建立時就讀 `sessionStorage`；測試若要換值，需在 `import { useUserStore }` 之前 `sessionStorage.setItem`。可透過 `vi.resetModules()` 重新載入模組。
- **antd `Modal` 掛在 `document.body`**：測試 assert 時要對 `screen`（全域）查詢，而非 `container`。
- **Fabric.js on jsdom**：`fabric.Canvas` 依賴 DOM canvas API；unit 測試多會失敗；建議走 E2E。
- **拖曳事件無法用 `fireEvent`**：`DataTransfer` 在 jsdom 沒有；用 `userEvent.upload` 測 `<input type="file">` 較穩。

## 手動測試 checklist（現況替代方案）

在導入自動化測試前，PR 前建議手動走過：

1. `npm run lint` 無錯。
2. `npm run build` 通過（含 tsc 型別檢查）。
3. `npm run dev` 開瀏覽器 http://localhost:5173：
   - [ ] 拖曳 10 MB 內的 PDF，可進 `/sign`。
   - [ ] 拖曳 >10 MB 或非 PDF，導向 `/file-error`。
   - [ ] `/sign` 內能加入文字、手寫、上傳三種簽名。
   - [ ] 簽名可拖曳、縮放、點左上角刪除。
   - [ ] 換頁按鈕運作正常。
   - [ ] 點「下一步」→ 勾「我不是機器人」→ 「確認」進 `/finish-file`。
   - [ ] 「下載檔案」下載成功且檔名 = 原檔名。
   - [ ] `/login`、`/register` 表單 Zod 驗證運作。
   - [ ] `/register` 送出後 token 寫入 sessionStorage。
   - [ ] 首頁登入態顯示頭像、Popconfirm 登出可清 token 並回首頁。
