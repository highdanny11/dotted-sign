import FinishFile from '@/assets/FinishFile.svg';
import { useNavigate } from 'react-router';
import { Button } from '@/component/form/Button';
import { jsPDF } from 'jspdf';
import { useSignStore } from '@/store/useSign';

export function FinishSign({
  title = '恭喜您！檔案已就緒 ',
  description = '現在您可以下載檔案或註冊會員，以體驗更多功能。',
} = {}) {
  const navigate = useNavigate();
  const canvasList = useSignStore((state) => state.canvasList);
  const resetSignState = useSignStore((state) => state.resetSignState);
  const fileName = useSignStore((state) => state.fileName);

  const backHome = () => {
    navigate('/');
    resetSignState();
  };
  const finishSignPDF = () => {
    const pdf = new jsPDF();
    canvasList.forEach((canvas, index) => {
      const base64 = canvas.toDataURL();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height! * width) / canvas.width!;
      if (index > 0) {
        pdf.addPage();
      }
      pdf.addImage(base64, 'png', 0, 0, width, height);
    });

    pdf.save(fileName);
  };

  useEffect(() => {
    if (canvasList.length === 0) {
      resetSignState();
      navigate('/');
    }
  }, []);

  return (
    <div className="bg-[rgba(206,229,228,0.2)]">
      <div className="container flex min-h-[100vh] flex-col items-center justify-center md:flex-row md:gap-10">
        <img className="mb-10" src={FinishFile} alt="FinishFile" />
        <div className="max-w-[437px]">
          <h2 className="text-brand w-full text-left text-lg leading-[32px] font-bold">
            {title}
          </h2>
          <p className="mb-10 text-sm">{description}</p>
          <Button
            onClick={finishSignPDF}
            theme="primary"
            size="lg"
            type="button"
            className="mb-2 min-h-[48px] w-full items-center justify-center rounded md:max-w-[191px]">
            下載檔案
          </Button>
          <Button
            onClick={backHome}
            theme="primary-inline"
            size="lg"
            type="button"
            className="mb-2 min-h-[48px] w-full items-center justify-center rounded md:max-w-[191px]">
            重新上傳
          </Button>
        </div>
      </div>
    </div>
  );
}
