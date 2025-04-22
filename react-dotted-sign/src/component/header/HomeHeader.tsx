import Logo from '@/assets/Logo.svg';
import { MdOutlineArrowBack, MdOutlineCreate } from 'react-icons/md';
import { useLayoutStore } from '@/store/useLayout';
import { useSignStore } from '@/store/useSign';
import { useNavigate } from 'react-router';

export function HomeHeader() {
  const hearder = useLayoutStore((state) => state.hearder);
  const fileName = useSignStore((state) => state.fileName);
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/');
    useLayoutStore.setState({ hearder: 'HomeHeader' });
  };
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
              <button type="button">
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
    </>
  );
}
