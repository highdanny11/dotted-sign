import { GenerateApiFunction } from "./common";
export type Register = {
  user: {
    token: string
  }
}
export type Login = Register
export type LoginRequest = {
  email: string;
  password: string;
}
export type SignupRequest = LoginRequest & {
  name: string;
  confirm : string;
}
export type UserInfo = {
  email: string;
  name: string;
  file: {
    name: string;
    id: number;
    createdAt: string;
  }[];
}

export type SignupApi = GenerateApiFunction<SignupRequest,Register>;
export type LoginApi = GenerateApiFunction<LoginRequest,Login>;
export type UserInfoApi = GenerateApiFunction<null,{user: UserInfo}>