import { fileToBase64 } from '@/utils/fileToBase64';
export function UploadFile({
  setCurrentSign,
  currentSign,
}: {
  setCurrentSign: (sign: string) => void;
  currentSign: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadSignFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64File = await fileToBase64(file);
    setCurrentSign(`data:image/${file.type};base64,${base64File}`);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSign('');
  };

  useEffect(() => {
    if (!currentSign) {
      if (!fileRef.current) return;
      fileRef.current.type = 'text';
      fileRef.current.type = 'file';
    }
  }, [currentSign]);

  return (
    <div className="px-6 pb-4">
      <div className="mb-2 flex items-center justify-end gap-2">
        <a
          href="#"
          className="text-brand"
          onClick={(e) => {
            e.preventDefault();
            fileRef.current?.click();
          }}>
          更改
        </a>
        <a href="#" className="text-brand" onClick={clearFile}>
          清除
        </a>
      </div>
      <label
        htmlFor="signFile"
        className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
        <div className="text-center">
          {currentSign ? (
            <img src={currentSign} className='h-[180px] w-full' />
          ) : (
            <>
              <div className="border-grey mb-10 inline-flex h-[38px] w-[102px] items-center justify-center rounded border">
                上傳檔案
              </div>
              <p className="text-brand text-xs">
                檔案大小10 MB以內，檔案格式JPG, PNG, BMP
              </p>
            </>
          )}
          <input
            type="file"
            id="signFile"
            ref={fileRef}
            hidden
            onChange={uploadSignFile}
          />
        </div>
      </label>
    </div>
  );
}
