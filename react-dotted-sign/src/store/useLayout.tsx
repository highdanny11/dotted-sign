import { create } from 'zustand';

type LayoutState = {
  hearder: string;
};
type LayoutActions = {
  setHeader: (header: string) => void; // 設定 header
};

export const useLayoutStore = create<LayoutState & LayoutActions>((set) => ({
  hearder: 'HomeHeader',
  setHeader: (header: string) => set(() => ({ hearder: header })), // 設定 header
}));
