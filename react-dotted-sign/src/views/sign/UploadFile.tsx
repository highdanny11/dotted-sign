export function UploadFile() {
  return (
    <div className="px-6 pb-4">
      <div className="mb-2 flex items-center justify-end gap-2">
        <a href="#" className="text-brand">
          更改
        </a>
        <a href="#" className="text-brand">
          清除
        </a>
      </div>
      <div className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
        <div className="text-center">
          <button
            type="button"
            className="border-grey mb-10 inline-flex h-[38px] w-[102px] items-center justify-center rounded border">
            上傳檔案
          </button>
          <p className="text-brand text-xs">
            檔案大小10 MB以內，檔案格式JPG, PNG, BMP
          </p>
        </div>
      </div>
    </div>
  );
}
