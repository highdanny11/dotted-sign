import NotFound from "@/assets/NotFound.svg";
import Reload from "@/assets/Reload.svg";

export function Error404() {
  return (
    <div className="min-h-[100vh] flex items-center justify-center flex-col container md:flex-row md:gap-10">
      <img className="mb-10" src={NotFound} alt="NotFound" />
      <div>
        <h2 className="text-lg leading-[32px] text-brand w-full text-left font-bold mb-[70px]">
          您的網址輸入不正確
        </h2>
        <button
          className="bg-brand w-full text-white min-h-[48px] flex justify-center items-center rounded md:max-w-[191px]"
          type="button"
        >
          <img className="mr-2" src={Reload} alt="Reload" />
          回首頁
        </button>
      </div>
    </div>
  );
}
