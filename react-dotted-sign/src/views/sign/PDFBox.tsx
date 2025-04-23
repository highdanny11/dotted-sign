import { fabric } from 'fabric';

export function PDFBox({ pdfCanvas }: { pdfCanvas: HTMLCanvasElement }) {
  const pdfWrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = new fabric.Canvas('render-PDF');
  canvas.requestRenderAll();

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
      const img = await pdfToImage(pdfCanvas);
      canvas.setWidth(img.width! * img.scaleX!);
      canvas.setHeight(img.height! * img.scaleY!);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      const text = new fabric.Textbox('請簽名', {
        top: 400,
        fill: 'back',
        fontFamily: 'Noto Sans TC',
      });
      canvas.add(text);
    }

    renderPDF();
  }, [pdfCanvas]);
  return (
    <>
      <div ref={pdfWrap} className="flex w-full justify-center">
        <canvas id="render-PDF" ref={canvasRef}></canvas>
      </div>
    </>
  );
}
