import { catchAsync } from '../utils/catchAsync'
import { createUser, getUserInfo } from '../services/users'
import status from "http-status"; 

export const regsiter = catchAsync( async(req, res, next) => {
  const form = req.body
  const saver = await createUser(form)
  res.status(status.CREATED).json({
    status: 'success',
    data: {
      user: saver
    }
  })
})

export const info = catchAsync(async(req, res, next) => {
  const user = await getUserInfo(req.body.id)
  res.status(status.CREATED).json({
    status: 'success',
    data: {
      user: user
    }
  })
})