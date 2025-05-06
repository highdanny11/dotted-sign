import Axios from "../instance";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  confirm : string;
}) => {
  return await Axios({
    method: 'post',
    url: '/api/users/signup',
    data
  })
}