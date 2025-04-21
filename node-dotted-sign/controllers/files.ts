import { catchAsync } from '../utils/catchAsync'
import { createUser } from '../services/users'
import status from "http-status"; 
import { addFiles } from '../services/files'

export const createFiles = catchAsync( async(req, res) => {
  const body = req.body
  const save = await addFiles(req.body)
  res.status(status.CREATED).json({
    status: 'success',
    data: {
      user: save
    }
  })
})

