import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { useSignStore } from '@/store/useSign';

interface PDFBoxProps {
  pdfCanvas: HTMLCanvasElement;
  index: number;
  currentPage: number;
}

export function PDFBox(
  { pdfCanvas, index, currentPage }: PDFBoxProps) {
  const pdfWrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const signature = useSignStore((state) => state.signature);
  
  

  async function pdfToImage(pdfData: HTMLCanvasElement) {
    const data = pdfData as unknown as HTMLImageElement;
    // 設定 PDF 轉為圖片時的比例
    const { width } = pdfWrap.current?.getBoundingClientRect()!;
    // 回傳圖片
    let scale = width / data.width;
    scale = scale > 1 ? 1 : scale;
    return new fabric.Image(data, {
      // @ts-ignore
      id: 'danny',
      scaleX: scale,
      scaleY: scale,
    });
  }

  useEffect(() => {
    async function renderPDF() {
      if (index !== currentPage ) return;
      if (!canvasRef.current) {
        canvasRef.current = new fabric.Canvas(`PDF-${index}`);
      }
      canvasRef.current.requestRenderAll();
      const img = await pdfToImage(pdfCanvas);
      canvasRef.current.setWidth(img.width! * img.scaleX!);
      canvasRef.current.setHeight(img.height! * img.scaleY!);
      canvasRef.current.setBackgroundImage(img, canvasRef.current.renderAll.bind(canvasRef.current));
    }
    renderPDF();    
  }, [pdfCanvas, currentPage]);

  useEffect(() => {
    canvasRef.current?.renderAll(); 
    if (signature[index]?.length === 0) return;
    signature[index]?.forEach((item) => {
      if (canvasRef.current) {
        canvasRef.current.add(item);
        canvasRef.current.renderAll();
      }
    });
  }, [signature])
  return (
    <>
      <div ref={pdfWrap} className={`w-full justify-center relative ${index === currentPage ? 'flex' : 'hidden'}`}>
        <canvas id={`PDF-${index}`} ></canvas>
      </div>
    </>
  );
}
