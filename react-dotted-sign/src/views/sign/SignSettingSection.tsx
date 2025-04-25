import { Input } from '@/component/form/Input';
import { Button } from '@/component/form/Button';
import { Modal } from 'antd';
import { InputSign } from './InputSign';
import { SignaturePad } from './SignaturePad';
import { UploadFile } from './UploadFile';
import {
  MdDragIndicator,
} from 'react-icons/md';

type TabKey = 'InputSign' | 'SignaturePad' | 'UploadFile';
export function SignSettingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState<TabKey>('InputSign');
  const components = {
    InputSign: <InputSign />,
    SignaturePad: <SignaturePad key={key} />,
    UploadFile: <UploadFile />,
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
            onClick={() => setKey('InputSign')}
            className="border-grey text-brand inline-block w-1/3 border-b py-2 text-center"
            type="button">
            輸入
          </button>
          <button
            onClick={() => setKey('SignaturePad')}
            className="border-grey inline-block w-1/3 border-b py-2 text-center"
            type="button">
            手寫
          </button>
          <button
            onClick={() => setKey('UploadFile')}
            className="border-grey inline-block w-1/3 border-b py-2 text-center"
            type="button">
            上傳
          </button>
          <span
            className={`bg-brand absolute bottom-0 left-0 inline-block h-[2px] w-1/3 translate-y-1/2 duration-200 ${changeTab(key)}`}></span>
        </div>
        {components[key]}
        <div>
          <p className="text-dark-grey mb-2 text-center text-xs">
            我了解這是一個具法律效力的本人簽名
          </p>
          <button
            type="button"
            className="bg-brand mx-auto flex h-[38px] w-[102px] items-center justify-center rounded text-white">
            儲存
          </button>
        </div>
      </Modal>
    </>
  );
}
