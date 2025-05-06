import * as jwt from "jsonwebtoken";

export const generateJWT = (data: any, secret:string, option: Record<string, string>) => {
  return new Promise((resolve, reject) => {
    jwt.sign(data, secret, option, (err: any, token?: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}
