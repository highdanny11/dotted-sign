export function SignaturePad() {
  return (
    <>
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center justify-end gap-2">
          <a href="#" className="text-brand">
            回上一步
          </a>
          <a href="#" className="text-brand">
            清除
          </a>
        </div>
        <div className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
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
        </div>
      </div>
    </>
  );
}
