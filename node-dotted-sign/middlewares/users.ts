import { Response, Request, NextFunction } from "express";
import { reigsterSchema, loginSchema } from "../validations/user";
import { ZodError, ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";
import status from "http-status";

const schemaMiddlerware =
  (Schema: ZodTypeAny) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      Schema.parse(request.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((item) => item.message).join(",");
        next(new ApiError(status.BAD_REQUEST, messages));
      } else {
        next(error);
      }
    }
  };

export const registerMiddlerware = schemaMiddlerware(reigsterSchema);
export const loginMiddlerware = schemaMiddlerware(loginSchema);
