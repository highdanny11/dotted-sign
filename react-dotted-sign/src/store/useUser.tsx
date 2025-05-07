import { create } from 'zustand';
import { UserInfo } from '../type/users';

type UserState = {
  token: string;
  user: UserInfo;
};
type UserActions = {
  setToken: (token: string) => void; // 設定 token
  setUser: (user: UserInfo) => void; // 設定使用者資訊
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  token: sessionStorage.getItem('token') || '', // 預設值為空字串
  user: {
    email: '',
    name: '',
    file: [],
  },
  setToken: (token) =>
    set(() => {
      sessionStorage.setItem('token', token);
      return { token: token };
    }), // 設定 token
  setUser: (user) =>
    set(() => {
      return { user };
    }), // 設定使用者資訊
}));
