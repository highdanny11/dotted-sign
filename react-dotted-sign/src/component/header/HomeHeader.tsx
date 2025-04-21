import Logo from '@/assets/Logo.svg';
export function HomeHeader() {
  const add = () => {
    console.log('123');
  };
  return (
    <>
      <header className="border-grey border-b py-[15px]">
        <div className="relative container flex items-center justify-between">
          <img src={Logo} alt="logo" />
          <h1 className="h2 text-dark-grey absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            快速省時的電子工具
          </h1>
          <div className="flex gap-2">
            <button
              onClick={add}
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
