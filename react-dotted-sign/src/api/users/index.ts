import Axios from "../instance";
import { SignupApi, LoginApi, UserInfoApi } from "@/type/users";

export const signup:SignupApi = async (data)=> {
  return await Axios({
    method: 'post',
    url: '/api/users/signup',
    data
  })
}

export const login:LoginApi = async (data)=> {
  return await Axios({
    method: 'post',
    url: '/api/users/login',
    data
  })
}

export const getUserInfo:UserInfoApi = async () => {
  return await Axios({
    method: 'get',
    url: '/api/users/info',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
}