import { Input } from '@/component/form/Input';
import { Button } from '@/component/form/Button';
import { Modal } from 'antd';
import { InputSign } from './InputSign';
import { SignaturePad } from './SignaturePad';
import { UploadFile } from './UploadFile';
import { useSignStore } from '@/store/useSign';
import { MdDragIndicator } from 'react-icons/md';
import { fabric } from 'fabric';
import { setFabricDeleteControl } from '@/utils/setFabricDeleteControl'

type TabKey = 'InputSign' | 'SignaturePad' | 'UploadFile';

export function SignSettingSection({currentPage}: {currentPage: number}) {
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

  const saveSignaturePadAndInputSign = () => {
    const img = document.createElement('img');
    img.src = currentSign;
    img.onload = () => {
      const data = new fabric.Image(img, {
        top: 400,
        width: img.width,
        height: img.height,
      });

      data.controls.deleteControl = setFabricDeleteControl()
      canvasList[currentPage].add(data);
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
    text.controls.deleteControl = setFabricDeleteControl()
    canvasList[currentPage].add(text);
  };

  const save = () => {
    if (!currentSign) return;
    switch (key) {
      case 'InputSign':
        saveInputSign();
        break;
      case 'SignaturePad':
        saveSignaturePadAndInputSign();
        break;
      case 'UploadFile':
        saveSignaturePadAndInputSign();
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
        className="w-full mb-2"
        onClick={() => setIsModalOpen(true)}>
        加入簽名
      </Button>
      <div className="mt-2">
        {/* 此列表是有註冊會員才能使用的功能 */}
        {/* <ul>
          <li className="group flex h-[72px] items-center">
            <MdDragIndicator className="text-grey group-hover:text-brand mr-2 duration-200" />
          </li>
        </ul> */}
      </div>
      <Modal
        title=""
        open={isModalOpen}
        footer={null}
        className="custom-modal"
        onOk={() => setIsModalOpen(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '500px',
          xl: '500px',
          xxl: '500px',
        }}
        onCancel={() => setIsModalOpen(false)}>
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
          <Button
            onClick={save}
            type="button"
            size="lg"
            theme="primary"
            disabled={!currentSign}
            className='mx-auto flex items-center justify-center'>
            儲存
          </Button>
        </div>
      </Modal>
    </>
  );
}
