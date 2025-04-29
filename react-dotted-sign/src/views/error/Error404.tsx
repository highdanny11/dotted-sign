import NotFound from '@/assets/NotFound.svg';
import Reload from '@/assets/Reload.svg';
import { useNavigate } from 'react-router';

export function Error404({
  title = '您的網址輸入不正確',
  description = '',
} = {}) {
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/');
  };
  return (
    <div className="container flex min-h-[100vh] flex-col items-center justify-center md:flex-row md:gap-10">
      <img className="mb-10" src={NotFound} alt="NotFound" />
      <div className="max-w-[437px]">
        <h2 className="text-brand w-full text-left text-lg leading-[32px] font-bold">
          {title}
        </h2>
        <p className="mb-10 text-sm">{description}</p>
        <button
          onClick={backHome}
          className="bg-brand flex min-h-[48px] w-full items-center justify-center rounded text-white md:max-w-[191px]"
          type="button">
          <img className="mr-2" src={Reload} alt="Reload" />
          回首頁
        </button>
      </div>
    </div>
  );
}
