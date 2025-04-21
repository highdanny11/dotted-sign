import Logo from '@/assets/Logo.svg';
import ForgetImg from '@/assets/ForgotImg.svg';

export function Forget() {
  return (
    <div className="justify-between gap-4 md:flex">
      <div className="flex-grow md:pt-10 lg:max-w-[416px]">
        <img className="mx-auto mb-8" src={Logo} alt="logo" />
        <p className="mb-6 text-center text-xs leading-[20px]">
          輸入你的電子郵箱,
          然後檢查你的收件箱，以查看我們發送的說明。如果沒有收到確認郵件，請檢查你的垃圾郵件。
        </p>
        <form className="border-grey border-t pt-6 text-center">
          <input
            className="border-grey mb-3 w-full rounded border p-3 text-sm leading-0"
            type="text"
            placeholder="請輸入電子郵件"
          />
          <button
            className="bg-brand mb-4 flex min-h-[38px] w-full items-center justify-center rounded text-white"
            type="button">
            註冊
          </button>
        </form>
      </div>
      <div className="hidden flex-grow md:block lg:max-w-[416px]">
        <h3 className="text-center text-xl font-bold">重新設定您的密碼</h3>
        <img src={ForgetImg} alt="ForgetImg" />
      </div>
    </div>
  );
}
