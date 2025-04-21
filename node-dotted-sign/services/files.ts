import { dataSource } from '../db/data-source'
import { ApiError } from 'utils/ApiError'
import status from "http-status"; 
import { Users } from 'entities/Users';

export const addFiles = async (form: {name: string, user_id: string}) => {
  const userRepository = dataSource.getRepository('Users')
  const exist = await userRepository.exists({ where: { id: form.user_id } })
  if (!exist) throw new ApiError(status.BAD_REQUEST, '帳號不存在')
  const user = await userRepository.findOneBy({ id: form.user_id })
  const filesRepository = dataSource.getRepository('Files')
  const save = await filesRepository.save({
    name: form.name,
    users: user
  })  
  return save
}