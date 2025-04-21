import { Response, Request, NextFunction } from "express"
import resgisterSchema from '../validations/user'
import { ZodError } from "zod"
import { ApiError } from '../utils/ApiError'
import status from "http-status"; 

export const registerMiddlerware = (request: Request,response: Response, next: NextFunction) => {
  try {
    resgisterSchema.parse(request.body)
    next()
  }catch(error) {
    if(error instanceof ZodError) {
      const messages = error.errors.map((item) => item.message).join(',')
      next(new ApiError(status.BAD_REQUEST, messages))
    }else {
      next(error)
    }
  }
}

 