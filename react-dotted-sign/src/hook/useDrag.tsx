export function useDrag<T extends HTMLElement>({
  dragIntoDomEvent,
}: {
  dragIntoDomEvent: (e: DragEvent) => void;
}) {
  console.log('useDrag');
  const dragDom = useRef<T>(null);
  const [isDragging, setDrag] = useState(false);

  const stopEventDefault = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const enter = useCallback((e: DragEvent) => {
    stopEventDefault(e);
    setDrag(true);
  }, []);
  const leave = useCallback((e: DragEvent) => {
    stopEventDefault(e);
    setDrag(false);
  }, []);
  const drop = useCallback(
    (e: DragEvent) => {
      stopEventDefault(e);
      if (!isDragging) return;
      if (!e.dataTransfer || e.dataTransfer.files.length === 0) return;

      dragIntoDomEvent(e);
      setDrag(false);
      e.dataTransfer.clearData();
    },
    [dragIntoDomEvent]
  );
  const dragover = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const dom = dragDom.current;
    if (!dom) return;
    dom.addEventListener('dragenter', enter);
    dom.addEventListener('drop', drop);
    dom.addEventListener('dragover', dragover);
    dom.addEventListener('dragleave', leave);

    return () => {
      dom.removeEventListener('dragenter', enter);
      dom.removeEventListener('drop', drop);
      dom.removeEventListener('dragover', dragover);
      dom.removeEventListener('dragleave', leave);
    };
  }, [leave, drop, enter, dragover]);

  return {
    dragDom,
  };
}
