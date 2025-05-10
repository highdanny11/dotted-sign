import { create } from 'zustand';
import { Textbox, Image } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

type SignState = {
  file: File | null;
  fileName: string;
  currentPage: number;
  totalPage: number;
  canvasList: fabric.Canvas[];
  signature: Sign[][]; // 新增 signature 屬性
  activeStep: number;
};
type SignActions = {
  setFile: (file: File) => void;
  setActiveStep: (activeStep: number) => void;
  setFileName: (fileName: string) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalPage: (totalPage: number) => void;
  setCanvasList: (canvasList: fabric.Canvas, index: number) => void;
  setSignature: (signature: Sign[][]) => void; // 新增 setSignature 方法
  addSignature: (pageIndex: number, signature: Sign) => void; // 新增 addSignature 方法
  resetSignState: () => void;
};

type Sign = Textbox | Image;

export const useSignStore = create<SignState & SignActions>((set) => ({
  file: null,
  fileName: '',
  currentPage: 0,
  totalPage: 0,
  canvasList: [],
  signature: [], // 初始化 signature 為空陣列
  activeStep: 0,
  setFile: (file: File) => set(() => ({ file: file })),
  setFileName: (fileName: string) => set(() => ({ fileName: fileName })), // 設定檔案名稱
  setCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
  setTotalPage: (totalPage: number) => set(() => ({ totalPage })), // 設定總頁數
  setCanvasList: (canvas: fabric.Canvas, index: number) =>
    set((state) => {
      const newCanvasList = [...state.canvasList];
      newCanvasList[index] = canvas; // 更新指定索引的 canvas
      return { canvasList: newCanvasList };
    }), // 設定 canvasList
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
  resetSignState: () =>
    set(() => ({
      file: null,
      fileName: '',
      currentPage: 0,
      totalPage: 0,
      canvasList: [],
      signature: [], // 重置 signature 為空陣列
    })),
  setActiveStep: (activeStep: number) => set(() => ({ activeStep })), // 設定當前步驟
}));
