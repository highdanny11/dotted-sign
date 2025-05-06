import { catchAsync } from '../utils/catchAsync'
import { createUser, getUserInfo } from '../services/users'
import status from "http-status";
import { generateJWT } from '../utils/generateJWT'
import { verifyJWT } from '../utils/verifyJWT'

export const regsiter = catchAsync(async (req, res, next) => {
  const form = req.body
  const saver = await createUser(form)
  const token = await generateJWT({ id: saver.id }, process.env.JWT_SECRET!, { expiresIn: `${process.env.JWT_EXPIRES_DAY!}` })
  res.status(status.CREATED).json({
    status: 'success',
    data: {
      user: {
        token
      }
    }
  })
})

export const info = catchAsync(async (req, res, next) => {
  console.log(req.headers.authorization)
  //  這段註解是處理 token 後面要放到 middleware
  // if (!req.headers ||
  //   !req.headers.authorization ||
  //   !req.headers.authorization.startsWith('Bearer')) {

  // }
  // const [, token] = req.headers.authorization!.split(' ')
  // const data = await verifyJWT(token, process.env.JWT_SECRET!)
  const user = await getUserInfo(req.body.id)
  res.status(status.CREATED).json({
    status: 'success',
    data: {
      user: user
    }
  })
})