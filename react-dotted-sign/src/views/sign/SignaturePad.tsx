export function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const storkesRef = useRef<{color: string, points: {x: number, y:number}[]}[]>([]);
  let currentStroke: {color: string, points: {x: number, y:number}[]} | null = null
  let isDrawing = false;

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();

    // 設定 canvas 實際像素尺寸（很重要！）
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // 將繪圖上下文放大，這樣畫出來不會模糊
    ctx.scale(ratio, ratio);

    ctxRef.current = ctx;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const mouseDown = useCallback((e: React.MouseEvent) => {
    handleMouseDown(e);
  }, [])
  const mouseMove = useCallback((e: React.MouseEvent) => {
    handleMouseMove(e)
  }, [])
  const mouseup = useCallback(() => {
    handleMouseUp()
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('mousedown')
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!ctxRef.current) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentStroke = {
      color: ctxRef.current.strokeStyle as string,
      points: [{ x, y }],
    };
    ctxRef.current.beginPath();
  }
  

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasSize = canvas.getBoundingClientRect();
    if (!ctxRef.current) return;
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.clientX - canvasSize.left ,e.clientY - canvasSize.top);
    currentStroke!.points.push({ x:e.clientX - canvasSize.left, y: e.clientY - canvasSize.top });
    ctxRef.current.stroke();
  }
  const handleMouseUp = () => {
    isDrawing = false;
    if (!ctxRef.current) return;
    currentStroke && storkesRef.current.push(currentStroke);
    currentStroke = null;
    ctxRef.current.beginPath();
  }

  const clearRect = () => {
    ctxRef.current?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    storkesRef.current = [];
  }
  const changeColor = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx ||!ctxRef.current) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (const stroke of storkesRef.current) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.closePath();
    }
    }

  useEffect(() => {
    initCanvas()
  }, [])

  useEffect(() => {
    clearRect()
  })

  
  return (
    <>
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center justify-end gap-2">
          <a href="#" className="text-brand">
            回上一步
          </a>
          <a href="javascript:;" onClick={clearRect} className="text-brand">
            清除
          </a>
        </div>
        <div className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
          <canvas
            onMouseDown={(e) => mouseDown(e)}
            onMouseMove={(e) => mouseMove(e)}
            onMouseUp={() => mouseup()}
            onMouseLeave={() => mouseup()}
            ref={canvasRef}
            className="w-full h-[156px]">
          </canvas>
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-[#000]" onClick={(e) => changeColor('#000', e)}></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-blue-600"  onClick={(e) => changeColor('#155dfc',e)}></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-red-600" onClick={(e) => changeColor('#e7000b', e)}></button>
          </div>
        </div>
      </div>
    </>
  );
}
