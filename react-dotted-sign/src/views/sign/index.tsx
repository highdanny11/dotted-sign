import { Step } from '@/component/step';
import { Button } from '@/component/form/Button';
import { SignSettingSection } from './SignSettingSection';
import { useSignStore } from '@/store/useSign';
import { fileToBase64 } from '@/utils/fileToBase64';
import { PDFUtils } from '@/utils/PDFUtils';
import { Image } from 'antd';
import { useNavigate } from 'react-router';
import { Spin } from "antd";
// https://github.com/ChangChiao/f2e-2022-sign/blob/main/src/components/PDFItem.tsx
// https://eminent-temple-cd0.notion.site/PDF-da0347f450af4f67975e2c2d699c6c3e
import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdDeleteOutline,
  MdHighlightAlt,
  MdMenuOpen,
  MdClose,
} from 'react-icons/md';
import { PDFBox } from './PDFBox';

export function Sign() {
  const file = useSignStore((state) => state.file);
  const canvasList = useSignStore((state) => state.canvasList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cavasPdf, setCavasPdf] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFileChange = async (file: File) => {
      try {
        const base64String = await fileToBase64(file);
        const canvas = await PDFUtils(base64String);
        setCavasPdf(canvas);
      }catch(e) {
        console.log('Error converting file to base64:', e);
      }finally {
        setLoading(false);
      }
    };

    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  const openImage = async () => {
    const base64 = canvasList[currentPage].toDataURL();
    setCurrentImage(base64);
    setVisible(true);
  };

  const finishSignPDF = () => {
    navigate('/finish-file')
  };

  return (
    <>
      <Step />
      <div className="border-grey overflow-hidden border-t">
        <div className="relative lg:container lg:flex">
          <main className="bg-ui-grey lg:flex-grow-1 ">
            <div className='h-[calc(100vh-240px)] lg:h-[calc(100vh-135px)] overflow-auto relative p-6 xl:px-12'>
              {!loading && cavasPdf.map((canvas, index) => (
                <PDFBox
                  key={index}
                  pdfCanvas={canvas}
                  index={index}
                  currentPage={currentPage}
                />
              ))}
              {loading && (
                <div className="bg-grey h-[1000px] flex items-center justify-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
            {/* 功能列 */}
            <div className="absolute bottom-[120px] left-12 lg:bottom-10 lg:left-[9%] z-20">
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
                    onClick={openImage}
                    className="border-grey rounded border bg-white p-1">
                    <MdHighlightAlt className="text-dark-grey text-xl" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev < cavasPdf.length - 1 ? prev + 1 : prev - 1
                      )
                    }
                    className="border-grey rounded border bg-white p-1">
                    <MdArrowBackIosNew className="text-dark-grey text-xl" />
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev + 1))
                    }
                    className="border-grey rounded border bg-white p-1">
                    <MdArrowForwardIos className="text-dark-grey text-xl" />
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
              <SignSettingSection currentPage={currentPage} />
            </div>
            <Button
              type="button"
              onClick={finishSignPDF}
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
              <SignSettingSection currentPage={currentPage} />
            </div>
          </div>
          {currentImage && (
            <Image
              style={{
                display: 'none',
              }}
              preview={{
                visible,
                onVisibleChange: (vis) => {
                  setVisible(vis);
                },
              }}
              src={currentImage}
            />
          )}
        </div>
      </div>
    </>
  );
}
