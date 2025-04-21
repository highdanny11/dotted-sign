export function InputSign() {
  return (
    <>
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            className="border-grey rounded border px-2 py-1">
            思源黑體
          </button>
          <button
            type="button"
            className="border-grey rounded border px-2 py-1">
            思源宋體
          </button>
          <button
            type="button"
            className="border-brand rounded border px-2 py-1">
            辰魚落雁體
          </button>
        </div>
        <label className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
          <div className="mx-auto w-[80%]">
            <input
              type="text"
              placeholder="請在這裡輸入您的簽名"
              className="w-full appearance-none border-0 bg-transparent p-0 text-center align-middle text-[80px] leading-0 placeholder:h-[20px] placeholder:text-center placeholder:text-sm focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-[#000]"></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-blue-600"></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-red-600"></button>
          </div>
        </label>
      </div>
    </>
  );
}
