import Logo from '@/assets/Logo.svg';
import { MdOutlineArrowBack, MdOutlineCreate } from 'react-icons/md';
import { useLayoutStore } from '@/store/useLayout';
import { useSignStore } from '@/store/useSign';
import { useNavigate, useLocation } from 'react-router';
import { Modal } from 'antd';
import { Input } from '../form/Input';
import { Button } from '@/component/form/Button';

export function HomeHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hearder = useLayoutStore((state) => state.hearder);
  const fileName = useSignStore((state) => state.fileName);
  const setFileName = useSignStore((state) => state.setFileName);
  const [acitveFileName, setActiveFileName] = useState(fileName);
  const navigate = useNavigate();
  let location = useLocation();
  const backHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname === '/') {
      useLayoutStore.setState({ hearder: 'HomeHeader' });
    }
  }, [location]);
  return (
    <>
      <header className="border-grey border-b py-[15px]">
        <div className="relative container flex items-center justify-between">
          {hearder === 'HomeHeader' ? (
            <>
              <img src={Logo} alt="logo" />
              <h1 className="h2 text-dark-grey absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                快速省時的電子工具
              </h1>
            </>
          ) : (
            <div className="flex h-12 items-center">
              <button type="button" onClick={backHome}>
                <MdOutlineArrowBack className="mr-4 text-xl" />
              </button>
              <p className="text-sm font-bold">{fileName}</p>
              <button type="button" onClick={() => setIsModalOpen(true)}>
                <MdOutlineCreate className="ml-2 text-lg" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="border-brand text-brand flex min-h-[38px] w-[86px] cursor-pointer items-center justify-center rounded border"
              type="button">
              登入
            </button>
            <button
              className="bg-brand flex min-h-[38px] w-[86px] cursor-pointer items-center justify-center rounded text-white"
              type="button">
              註冊
            </button>
          </div>
        </div>
      </header>
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
        <h2 className="text-brand border-brand border-b py-3 text-center text-sm">
          重新命名檔案
        </h2>
        <div className="px-6 py-4">
          <label htmlFor="fileName" className="mb-1 block">
            檔案
          </label>
          <Input
            className="w-full"
            type="text"
            id="fileName"
            placeholder="請輸入檔案名稱"
            value={acitveFileName}
            onChange={(e) => {
              setActiveFileName(e.target.value);
            }}
          />
        </div>
        <Button
          type="button"
          size="lg"
          theme="primary"
          disabled={!acitveFileName}
          onClick={() => {
            setFileName(acitveFileName);
            setIsModalOpen(false);
          }}
          className="mx-auto flex items-center justify-center">
          儲存
        </Button>
      </Modal>
    </>
  );
}
