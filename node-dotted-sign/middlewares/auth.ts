import { Response, Request, NextFunction } from "express";
import { verifyJWT } from "../utils/verifyJWT";
import { getBaseUserInfo } from "../services/users";
import status from "http-status";

export const authMiddlerware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    const res = await verifyJWT(token!, process.env.JWT_SECRET!);
    const user = await getBaseUserInfo(res.id);
    request.body = user;
    next();
  } catch (error) {
    next(error);
  }
};
