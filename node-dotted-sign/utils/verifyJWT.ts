import * as jwt from "jsonwebtoken";

export const verifyJWT = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};
