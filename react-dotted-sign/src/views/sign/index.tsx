import { Step } from '@/component/step';
import { Button } from '@/component/form/Button';
import Cycle from '@/assets/Cycle.png';
import { SignSettingSection } from './SignSettingSection';
import { useSignStore } from '@/store/useSign';
import { fileToBase64 } from '@/utils/fileToBase64';
import { PDFUtils } from '@/utils/PDFUtils';
import { Image } from 'antd';
import { useNavigate } from 'react-router';
import { Spin, Modal } from 'antd';

import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdHighlightAlt,
  MdMenuOpen,
  MdClose,
} from 'react-icons/md';
import { PDFBox } from './PDFBox';

export function Sign() {
  const file = useSignStore((state) => state.file);
  const canvasList = useSignStore((state) => state.canvasList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [checkFile, setCheckFile] = useState(false);
  const [cavasPdf, setCavasPdf] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const setActiveStep = useSignStore((state) => state.setActiveStep);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFileChange = async (file: File) => {
      try {
        const base64String = await fileToBase64(file);
        const canvas = await PDFUtils(base64String);
        setCavasPdf(canvas);
      } catch (e) {
        console.log('Error converting file to base64:', e);
      } finally {
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
    navigate('/finish-file');
  };
  useEffect(() => {
    if (checkModal) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  }, [checkModal]);

  return (
    <>
      <Step />
      <div className="border-grey overflow-hidden border-t">
        <div className="relative lg:container lg:flex">
          <main className="bg-ui-grey lg:flex-grow-1">
            <div className="relative h-[calc(100vh-240px)] overflow-auto p-6 lg:h-[calc(100vh-135px)] xl:px-12">
              {!loading &&
                cavasPdf.map((canvas, index) => (
                  <PDFBox
                    key={index}
                    pdfCanvas={canvas}
                    index={index}
                    currentPage={currentPage}
                  />
                ))}
              {loading && (
                <div className="bg-grey flex h-[1000px] items-center justify-center">
                  <Spin size="large" />
                </div>
              )}
            </div>
            {/* 功能列 */}
            <div className="absolute bottom-[120px] left-12 z-20 lg:bottom-10 lg:left-[9%]">
              <ul className="flex items-center gap-2">
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
              <div className="absolute top-5 right-5 lg:hidden z-20">
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
              onClick={() => setCheckModal(true)}
              className="w-full"
              theme="primary-outline"
              size="lg">
              下一步
            </Button>
          </div>
          <div
            className={`fixed top-[135px] z-20 right-0 h-[calc(100vh-240px)] w-[calc(100vw-32px)] bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.36)] duration-400 ease-in-out md:w-2/3 ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
      <Modal
        title=""
        open={checkModal}
        footer={null}
        closeIcon={false}
        className="custom-modal"
        onOk={() => setCheckModal(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '400px',
          xl: '400px',
          xxl: '400px',
        }}
        onCancel={() => setCheckModal(false)}>
        <h2 className="text-brand py-3 text-center text-xl font-bold">
          請確認您的檔案
        </h2>
        <h3 className="mb-8 text-center">確認後將無法修改。</h3>
        <div className="flex items-center justify-between px-24 py-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="checkRobot"
              checked={checkFile}
              onChange={() => setCheckFile(!checkFile)}
            />
            <label htmlFor="checkRobot" className="ml-2 block cursor-pointer">
              我不是機器人
            </label>
          </div>
          <img src={Cycle} width="80" alt="checkRobot" />
        </div>
        <Button
          type="button"
          size="lg"
          theme="primary"
          disabled={!checkFile}
          onClick={finishSignPDF}
          className="mx-auto mb-2 flex w-[226px] items-center justify-center">
          確認
        </Button>
        <Button
          type="button"
          size="lg"
          theme="primary-inline"
          onClick={() => setCheckModal(false)}
          className="mx-auto flex w-[226px] items-center justify-center">
          返回
        </Button>
      </Modal>
    </>
  );
}
