import { fabric } from 'fabric';
import { useSignStore } from '@/store/useSign';


interface PDFBoxProps {
  pdfCanvas: HTMLCanvasElement;
  index: number;
  currentPage: number;
}

export function PDFBox({ pdfCanvas, index, currentPage }: PDFBoxProps) {
  const pdfWrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const setCanvasList = useSignStore((state) => state.setCanvasList);

  async function pdfToImage(pdfData: HTMLCanvasElement) {
    const data = pdfData as unknown as HTMLImageElement;
    // 設定 PDF 轉為圖片時的比例
    const { width } = pdfWrap.current?.getBoundingClientRect()!;
    // 回傳圖片
    let scale = width / data.width;
    scale = scale > 1 ? 1 : scale;
    return new fabric.Image(data, {
      scaleX: scale,
      scaleY: scale,
    });
  }

  useEffect(() => {
    async function renderPDF() {
      try {
        if (!canvasRef.current) {
          canvasRef.current = new fabric.Canvas(`PDF-${index}`);
        }
        canvasRef.current.requestRenderAll();
        const img = await pdfToImage(pdfCanvas);
        canvasRef.current.setWidth(img.width! * img.scaleX!);
        canvasRef.current.setHeight(img.height! * img.scaleY!);
        canvasRef.current.setBackgroundImage(
          img,
          canvasRef.current.renderAll.bind(canvasRef.current)
        );
        setCanvasList(canvasRef.current!, index);
      }catch (error) {
        console.error('Error rendering PDF:', error);
      }
      
    }
    renderPDF();
  }, [pdfCanvas, currentPage]);

  return (
    <>
      <div
        ref={pdfWrap}
        className={`w-full absolute justify-center flex top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 ${index === currentPage ? ' z-10' : ''}`}>
          <div className='py-10'>
            <canvas id={`PDF-${index}`}></canvas>
          </div>
      </div>
    </>
  );
}
