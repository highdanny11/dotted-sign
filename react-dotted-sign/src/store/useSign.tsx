import { create } from 'zustand';

type SignState = {
  file: File | null;
  fileName: string;
};
type SignActions = {
  setFile: (file: File) => void;
  setFileName: (fileName: string) => void;
};

export const useSignStore = create<SignState & SignActions>((set) => ({
  file: null,
  fileName: '',
  setFile: (file: File) => set(() => ({ file: file })),
  setFileName: (fileName: string) => set(() => ({ fileName: fileName })), // 設定檔案名稱
}));
