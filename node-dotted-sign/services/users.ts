import { dataSource } from '../db/data-source'
import { ApiError } from 'utils/ApiError'
import status from "http-status"; 
import bcrypt from "bcryptjs";
import { Users } from 'entities/Users';
import { Files } from 'entities/Files'

export const createUser = async (form: {name: string, email: string, password: string}) => {
  const { name, email, password } = form
  const userRepository = dataSource.getRepository('Users')
  const exist = await userRepository.exists({ where: { email: email } })
  if (exist) throw new ApiError(status.BAD_REQUEST, '信箱重複')
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  const newUser = new Users()
  newUser.name = name
  newUser.email = email
  newUser.password = hashPassword
  const files = new Files()
  files.name = '共用資料夾'
  newUser.files = [files]
  const savedUser = await userRepository.save(newUser)
  return savedUser
}

export const getUserInfo = async (id: string) => {
  const userRepository = dataSource.getRepository('Users')
  const user = await userRepository.findOne({
    where: { id: id },
    relations: { files: true }
  })
  return user
}