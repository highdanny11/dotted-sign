type signOptions = {
  fontfamily: string;
  color: string;
};
export function InputSign({
  setCurrentSign,
  setSignOptions,
  signOptions,
}: {
  setCurrentSign: (sign: string) => void;
  setSignOptions: (font: signOptions) => void;
  signOptions: signOptions;
}) {
  const [text, setText] = useState('');
  useEffect(() => {
    setCurrentSign(text);
  }, [text]);
  return (
    <>
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setSignOptions({
                fontfamily: 'Noto Sans TC',
                color: signOptions.color,
              })
            }
            className={`rounded border px-2 py-1 ${signOptions.fontfamily === 'Noto Sans TC' ? 'border-brand bg-primary' : 'border-grey'}`}>
            思源黑體
          </button>
          <button
            type="button"
            onClick={() =>
              setSignOptions({
                fontfamily: 'Noto Serif TC',
                color: signOptions.color,
              })
            }
            className={`rounded border px-2 py-1 ${signOptions.fontfamily === 'Noto Serif TC' ? 'border-brand bg-primary' : 'border-grey'}`}>
            思源宋體
          </button>
        </div>
        <label className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
          <div className="mx-auto w-[80%]">
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="請在這裡輸入您的簽名"
              style={{
                fontFamily: signOptions.fontfamily,
                color: signOptions.color,
              }}
              className="w-full appearance-none border-0 bg-transparent p-0 text-center align-middle text-[80px] leading-0 placeholder:h-[20px] placeholder:text-center placeholder:text-sm focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSignOptions({
                  fontfamily: signOptions.fontfamily,
                  color: '#000',
                })
              }
              className="h-3 w-3 rounded-full bg-[#000]"></button>
            <button
              type="button"
              onClick={() =>
                setSignOptions({
                  fontfamily: signOptions.fontfamily,
                  color: '#155dfc',
                })
              }
              className="h-3 w-3 rounded-full bg-blue-600"></button>
            <button
              type="button"
              onClick={() =>
                setSignOptions({
                  fontfamily: signOptions.fontfamily,
                  color: '#e7000b',
                })
              }
              className="h-3 w-3 rounded-full bg-red-600"></button>
          </div>
        </label>
      </div>
    </>
  );
}
