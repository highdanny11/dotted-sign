import { Input } from '@/component/form/Input';
import { Button } from '@/component/form/Button';
import { Modal } from 'antd';
import { InputSign } from './InputSign';
import { SignaturePad } from './SignaturePad';
import { UploadFile } from './UploadFile';
import { useSignStore } from '@/store/useSign';
import { MdDragIndicator } from 'react-icons/md';
import { fabric } from 'fabric';

type TabKey = 'InputSign' | 'SignaturePad' | 'UploadFile';

const renderCloseBtn = (
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  _styleOverride: any,
  faricObject: fabric.Object
) => {
  const img = document.createElement('img');

  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  img.src = deleteIcon;
  const size = 30;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(faricObject.angle!));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};

export function SignSettingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signOptions, setSignOptions] = useState({
    fontfamily: 'Noto Sans TC',
    color: '#000',
  });
  const [key, setKey] = useState<TabKey>('InputSign');
  const [currentSign, setCurrentSign] = useState<string>('');
  const canvasList = useSignStore((state) => state.canvasList);
  const setSign = useCallback((sign: string) => {
    setCurrentSign(sign);
  }, []);

  const deleteObject = (
    _eventData: MouseEvent,
    transformData: fabric.Transform
  ) => {
    const target = transformData.target;
    if (target) {
      target.canvas?.remove(target);
      target.canvas?.requestRenderAll();
    }

    return true;
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectTab = (key: TabKey) => {
    setCurrentSign('');
    setKey(key);
  };
  const changeTab = (key: string) => {
    switch (key) {
      case 'InputSign':
        return 'translate-x-0';
      case 'SignaturePad':
        return 'translate-x-full';
      case 'UploadFile':
        return 'translate-x-[200%]';
    }
  };

  const saveSignaturePad = () => {
    const img = document.createElement('img');
    img.src = currentSign;
    img.onload = () => {
      const data = new fabric.Image(img, {
        top: 400,
        width: img.width,
        height: img.height,
      });

      data.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderCloseBtn,
      });
      canvasList[0].add(data);
    };
  };
  const saveInputSign = () => {
    const text = new fabric.IText(currentSign, {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: signOptions.color,
      fontFamily: signOptions.fontfamily,
    });
    text.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderCloseBtn,
    });
    canvasList[0].add(text);
  };
  const saveUploadFile = () => {
    const img = document.createElement('img');
    img.src = currentSign;
    img.onload = () => {
      const data = new fabric.Image(img, {
        top: 400,
        width: img.width,
        height: img.height,
      });

      data.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderCloseBtn,
      });
      canvasList[0].add(data);
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  };

  const save = () => {
    switch (key) {
      case 'InputSign':
        saveInputSign();
        break;
      case 'SignaturePad':
        saveSignaturePad();
        break;
      case 'UploadFile':
        saveUploadFile();
        break;
    }
    setSign('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCurrentSign('');
  }, [isModalOpen]);

  return (
    <>
      <form className="mb-10">
        <h2 className="mb-2 text-sm font-bold">基本資料</h2>
        <Input className="mb-2 w-full" placeholder="請輸入您的姓名" />
        <Input className="w-full" placeholder="請輸入您的電子信箱" />
      </form>
      <h2 className="mb-2 text-sm font-bold">我的簽名</h2>
      <Button
        theme="primary-outline"
        size="lg"
        className="w-full"
        onClick={showModal}>
        創建簽名檔
      </Button>
      <div className="mt-2">
        <ul>
          <li className="group flex h-[72px] items-center">
            <MdDragIndicator className="text-grey group-hover:text-brand mr-2 duration-200" />
          </li>
        </ul>
      </div>
      <Modal
        title=""
        open={isModalOpen}
        footer={null}
        className="custom-modal"
        onOk={handleOk}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '500px',
          xl: '500px',
          xxl: '500px',
        }}
        onCancel={handleCancel}>
        <div className="relative mb-4 pt-5">
          <button
            onClick={() => selectTab('InputSign')}
            className="border-grey text-brand inline-block w-1/3 border-b py-2 text-center"
            type="button">
            輸入
          </button>
          <button
            onClick={() => selectTab('SignaturePad')}
            className="border-grey inline-block w-1/3 border-b py-2 text-center"
            type="button">
            手寫
          </button>
          <button
            onClick={() => selectTab('UploadFile')}
            className="border-grey inline-block w-1/3 border-b py-2 text-center"
            type="button">
            上傳
          </button>
          <span
            className={`bg-brand absolute bottom-0 left-0 inline-block h-[2px] w-1/3 translate-y-1/2 duration-200 ${changeTab(key)}`}></span>
        </div>
        {key === 'InputSign' && (
          <InputSign
            setCurrentSign={setSign}
            setSignOptions={setSignOptions}
            signOptions={signOptions}
            currentSign={currentSign}
          />
        )}
        {key === 'SignaturePad' && (
          <SignaturePad setCurrentSign={setSign} currentSign={currentSign} />
        )}
        {key === 'UploadFile' && (
          <UploadFile setCurrentSign={setSign} currentSign={currentSign} />
        )}
        <div>
          <p className="text-dark-grey mb-2 text-center text-xs">
            我了解這是一個具法律效力的本人簽名
          </p>
          <button
            onClick={save}
            type="button"
            className="bg-brand mx-auto flex h-[38px] w-[102px] items-center justify-center rounded text-white">
            儲存
          </button>
        </div>
      </Modal>
    </>
  );
}
