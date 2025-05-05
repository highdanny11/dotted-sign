import Google from '@/assets/Google.svg';
import Facebook from '@/assets/Facebook.svg';
import Logo from '@/assets/Logo.svg';
import LoginImg from '@/assets/LoginImg.svg';
import { Link } from 'react-router';
import { Input } from '@/component/form/Input';

export function Login() {
  const facebookLogin = () => {
    window.open('http://localhost:8080/api/users/facebook', '_self');
  };
  return (
    <div className="items-center justify-between gap-4 md:flex">
      <div className="flex-grow md:pt-10 lg:max-w-[416px]">
        <img className="mx-auto mb-8" src={Logo} alt="logo" />
        <ul className="mb-6 flex items-center gap-4">
          <li className="w-1/2">
            <button
              type="button"
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Google} alt="GoogleIcon" />
              透過 Google 登入
            </button>
          </li>
          <li className="w-1/2">
            <button
              type="button"
              onClick={facebookLogin}
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Facebook} alt="FacebookIcon" />
              透過 facebook 登入
            </button>
          </li>
        </ul>
        <form className="border-grey border-t pt-6 text-center">
          <Input
            className="border-grey mb-3 w-full rounded border p-3 text-sm leading-0"
            type="text"
            placeholder="請輸入電子郵件" 
          />
          <Input
            className="border-grey mb-3 w-full rounded border p-3 text-sm leading-0"
            type="password"
            placeholder="請輸入密碼" 
          />
          <Link className="text-brand mb-6 inline-block text-sm" to="/">
            忘記密碼
          </Link>
          <button
            className="bg-brand mb-4 flex min-h-[38px] w-full items-center justify-center rounded text-white"
            type="button">
            登入
          </button>
          <p className="text-center text-sm">
            還沒有帳戶?
            <Link className="text-brand pl-2 text-sm underline" to="/register">
              註冊
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden flex-grow md:block lg:max-w-[416px]">
        <h3 className="text-center text-xl font-bold">登入至您的檔案總管</h3>
        <img src={LoginImg} alt="LoginImg" />
      </div>
    </div>
  );
}
