import { Step } from '@/component/step';
import { InputSign } from './InputSign';
import { SignaturePad } from './SignaturePad';
import { UploadFile } from './UploadFile';
import { Input } from '@/component/form/Input';
import { Button } from '@/component/form/Button';
import { SignSettingSection } from './SignSettingSection';
import { useSignStore } from '@/store/useSign';
import { fileToBase64 } from '@/utils/fileToBase64';
import { PDFUtils } from '@/utils/PDFUtils';
import { fabric } from 'fabric';
// https://github.com/ChangChiao/f2e-2022-sign/blob/main/src/components/PDFItem.tsx
// https://eminent-temple-cd0.notion.site/PDF-da0347f450af4f67975e2c2d699c6c3e
import {
  MdDragIndicator,
  MdDeleteOutline,
  MdHighlightAlt,
  MdMenuOpen,
  MdClose,
} from 'react-icons/md';
import { PDFBox } from './PDFBox';

export function Sign() {
  const file = useSignStore((state) => state.file);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cavasPdf, setCavasPdf] = useState<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const handleFileChange = async (file: File) => {
      const base64String = await fileToBase64(file);
      const canvasList = await PDFUtils(base64String);
      setCavasPdf(canvasList);
    };

    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  return (
    <>
      <Step />
      <div className="border-grey overflow-hidden border-t">
        <div className="relative lg:container lg:flex">
          <main className="bg-ui-grey h-[calc(100vh-240px)] overflow-auto p-6 lg:h-[calc(100vh-135px)] lg:flex-grow-1 xl:px-12">
            {cavasPdf.map((canvas, index) => (
              <PDFBox key={index} pdfCanvas={canvas} />
            ))}
            {/* <div className="bg-grey h-[1200px]"></div> */}
            <div className="absolute bottom-[120px] left-12 lg:bottom-10 lg:left-[9%]">
              <ul className="flex items-center gap-2">
                <li>
                  <button
                    type="button"
                    className="border-grey rounded border bg-white p-1">
                    <MdDeleteOutline className="text-dark-grey text-xl" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="border-grey rounded border bg-white p-1">
                    <MdHighlightAlt className="text-dark-grey text-xl" />
                  </button>
                </li>
              </ul>
            </div>
            {!isModalOpen && (
              <div className="absolute top-5 right-5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="border-grey rounded border bg-white p-1">
                  <MdMenuOpen className="text-dark-grey text-2xl" />
                </button>
              </div>
            )}
          </main>
          <div className="border-grey border-t bg-white p-6 lg:flex lg:max-h-[calc(100vh-135px)] lg:basis-[300px] lg:flex-col lg:justify-between lg:border-none xl:basis-[402px]">
            <div className="hidden h-[200px] lg:block">
              <SignSettingSection />
            </div>
            <Button
              type="button"
              className="w-full"
              theme="primary-outline"
              size="lg">
              下一步
            </Button>
          </div>
          <div
            className={`fixed top-[144px] right-0 h-[calc(100vh-240px)] w-[calc(100vw-32px)] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.36)] duration-400 ease-in-out md:w-2/3 ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6">
              <button
                type="button"
                className="ml-auto block"
                onClick={() => setIsModalOpen(false)}>
                <MdClose className="text-xl" />
              </button>
              <SignSettingSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
