// import { Outlet, useLocation } from 'react-router-dom';
import AddFile from '@/assets/AddFile.svg';
import Step1 from '@/assets/Step1.svg';
import Step2 from '@/assets/Step2.svg';
import Step3 from '@/assets/Step3.svg';
import { useDrag } from '@/hook/useDrag';

export function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const { dragDom } = useDrag<HTMLLabelElement>({
    dragIntoDomEvent: (e: DragEvent) => {
      const filesList = [...e.dataTransfer!.files];
      setFiles((prevFiles) => [...prevFiles, ...filesList]);
    },
  });
  useEffect(() => {
    console.log('files (useEffect):', files);
  }, [files]);

  return (
    <div className="container">
      <div className="border-brand bg-primary relative mt-10 flex h-[440px] flex-col items-center justify-center border-2 border-dashed px-12">
        <img
          src={AddFile}
          className="mb-6 w-[80px] xl:w-[120px]"
          alt="addfile"
        />
        <span className="mb-2 hidden xl:block">將檔案拖曳至這裡，或</span>
        <button
          type="button"
          className="bg-brand mb-4 flex min-h-[48px] w-full max-w-[144px] items-center justify-center rounded text-white xl:max-w-[144px]">
          選擇檔案
        </button>
        <p className="h5 text-brand-hover text-center font-bold">
          檔案大小10MB以內，檔案格式為PDF、JPG 或 PNG
        </p>
        <label htmlFor="file" className="absolute inset-0" ref={dragDom}>
          <input type="file" id="file" className="hidden" />
        </label>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-center text-xl font-bold">
          輕鬆幾步驟，完成您的簽署
        </h2>
        <ul className="justify-between sm:flex sm:gap-1 md:gap-6">
          <li className="mb-8 text-center sm:mb-0">
            <span className="border-brand text-brand mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2">
              1
            </span>
            <h4 className="h4 mb-1 font-bold">上傳檔案</h4>
            <p className="mb-1 inline-block text-sm leading-[1.58]">
              選擇PDF檔或是IMG檔
            </p>
            <img src={Step1} className="mx-auto" alt="Step1" />
          </li>
          <li className="mb-8 text-center sm:mb-0">
            <span className="border-brand text-brand mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2">
              2
            </span>
            <h4 className="h4 mb-1 font-bold">加入簽名檔</h4>
            <p className="mb-1 inline-block text-sm leading-[1.58]">
              手寫、輸入或是上傳簽名檔
            </p>
            <img src={Step2} className="mx-auto" alt="Step2" />
          </li>
          <li className="text-center">
            <span className="border-brand text-brand mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2">
              3
            </span>
            <h4 className="h4 mb-1 font-bold">下載與傳送</h4>
            <p className="mb-1 inline-block text-sm leading-[1.58]">
              完成簽署可立即傳送檔案給對方
            </p>
            <img src={Step3} className="mx-auto" alt="Step3" />
          </li>
        </ul>
      </div>
    </div>
  );
}
