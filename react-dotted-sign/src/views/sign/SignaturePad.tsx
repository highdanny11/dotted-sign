export function SignaturePad({
  setCurrentSign,
  currentSign,
}: {
  setCurrentSign: (sign: string) => void;
  currentSign: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const storkesRef = useRef<
    { color: string; points: { x: number; y: number }[] }[]
  >([]);
  const canvasOptions = {
    lineWidth: 4,
    lineCap: 'round',
    strokeStyle: '#000000',
    fillStyle: '#fff',
  };
  let currentStroke: {
    color: string;
    points: { x: number; y: number }[];
  } | null = null;
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
    Object.assign(ctx, canvasOptions);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const reDraw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    for (const stroke of storkesRef.current) {
      stroke.color = canvasOptions.strokeStyle;
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const updateSign = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = 'transparent';
    setCurrentSign(canvasRef.current?.toDataURL() || '');
    ctx.fillStyle = '#fff';
  };

  const getClientXY = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    } else if ('clientX' in e) {
      return {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }
    return { clientX: 0, clientY: 0 };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = getClientXY(e);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    currentStroke = {
      color: ctx.strokeStyle as string,
      points: [{ x, y }],
    };
    ctx.beginPath();
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (!isDrawing) return;
    const canvasSize = canvas.getBoundingClientRect();
    const { clientX, clientY } = getClientXY(e);
    ctx.lineTo(clientX - canvasSize.left, clientY - canvasSize.top);
    currentStroke!.points.push({
      x: clientX - canvasSize.left,
      y: clientY - canvasSize.top,
    });
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    isDrawing = false;
    if (!ctxRef.current) return;
    currentStroke && storkesRef.current.push(currentStroke);
    currentStroke = null;
    ctxRef.current.fillStyle = 'transparent';
    setCurrentSign(canvasRef.current?.toDataURL() || '');
  };

  const mouseDown = useCallback(handleMouseDown, []);
  const mouseMove = useCallback(handleMouseMove, []);
  const mouseup = useCallback(handleMouseUp, []);

  const clear = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!canvasRef.current || !ctxRef.current) return;
    const { width, height } = canvasRef.current;
    ctxRef.current.clearRect(0, 0, width, height);
    storkesRef.current = [];
  };

  const changeColor = (color: string, e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, rect.width, rect.height);
    canvasOptions.strokeStyle = color;
    Object.assign(ctx, canvasOptions);

    reDraw();
    updateSign();
  };
  const undo = (e: React.MouseEvent) => {
    if (storkesRef.current.length > 0) {
      storkesRef.current.pop();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      reDraw();
      updateSign();
    }
  };

  useEffect(() => {
    initCanvas();
  }, []);
  useEffect(() => {
    if (!currentSign) {
      clear();
    }
  }, [currentSign]);

  return (
    <>
      <div className="px-6 pb-4">
        <div className="mb-2 flex items-center justify-end gap-2">
          <a href="#" onClick={(e) => undo(e)} className="text-brand">
            回上一步
          </a>
          <a href="#" onClick={(e) => clear(e)} className="text-brand">
            清除
          </a>
        </div>
        <div className="border-ui-grey relative flex h-[180px] cursor-pointer items-center justify-center rounded border py-3">
          <canvas
            onMouseDown={(e) => mouseDown(e)}
            onMouseMove={(e) => mouseMove(e)}
            onMouseUp={() => mouseup()}
            onMouseLeave={() => mouseup()}
            onTouchStart={(e) => mouseDown(e)}
            onTouchMove={(e) => mouseMove(e)}
            onTouchEnd={() => mouseup()}
            ref={canvasRef}
            className="h-[156px] w-full"></canvas>
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-[#000]"
              onClick={(e) => changeColor('#000', e)}></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-blue-600"
              onClick={(e) => changeColor('#155dfc', e)}></button>
            <button
              type="button"
              className="h-3 w-3 rounded-full bg-red-600"
              onClick={(e) => changeColor('#e7000b', e)}></button>
          </div>
        </div>
      </div>
    </>
  );
}
