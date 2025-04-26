import { create } from 'zustand';
import { Canvas, Textbox, Image } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

type SignState = {
  file: File | null;
  fileName: string;
  currentPage: number;
  totalPage: number;
  canvasList: fabric.Canvas[];
  signature: Sign[][]; // 新增 signature 屬性
};
type SignActions = {
  setFile: (file: File) => void;
  setFileName: (fileName: string) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPage: (totalPage: number) => void;
  setCanvasList: (canvasList: fabric.Canvas[]) => void;
  setSignature: (signature: Sign[][]) => void; // 新增 setSignature 方法
  addSignature: (pageIndex: number, signature: Sign) => void; // 新增 addSignature 方法
};

type Sign = Textbox | Image;

export const useSignStore = create<SignState & SignActions>((set) => ({
  file: null,
  fileName: '',
  currentPage: 0,
  totalPage: 0,
  canvasList: [],
  signature: [], // 初始化 signature 為空陣列
  setFile: (file: File) => set(() => ({ file: file })),
  setFileName: (fileName: string) => set(() => ({ fileName: fileName })), // 設定檔案名稱
  setCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
  setTotalPage: (totalPage: number) => set(() => ({ totalPage })), // 設定總頁數
  setCanvasList: (canvasList: fabric.Canvas[]) => set(() => ({ canvasList })), // 設定 canvasList
  setSignature: (signature: Sign[][]) => set(() => ({ signature })), // 設定 signature
  addSignature: (pageIndex: number, signature: Sign) =>
    set((state) => {
      const newSignature = [...state.signature];
      if (!newSignature[pageIndex]) {
        newSignature[pageIndex] = []; // 初始化該頁的簽名陣列
      }
      newSignature[pageIndex].push(signature); // 將簽名加入該頁的簽名陣列
      return { signature: newSignature };
    }),
}));

const deleteObject = (
  eventData: MouseEvent,
  transformData: fabric.Transform
) => {
  const target = transformData.target;
  if (target) {
    target.canvas?.remove(target);
    target.canvas?.requestRenderAll();
  }

  return true;
};

const renderCloseBtn = (
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  _styleOverride: any,
  faricObject: fabric.Object
) => {
  const img = document.createElement('img');

  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  img.src = deleteIcon;
  const size = 30;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(faricObject.angle!));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};

const fakeSign = () => {
  const text = new fabric.Textbox('請簽名', {
    top: 400,
    fill: 'back',
    fontFamily: 'Noto Sans TC',
  });
  fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderCloseBtn,
  });
  return text;
};
