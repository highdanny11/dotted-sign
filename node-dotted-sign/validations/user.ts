import { z } from "zod";

export const reigsterSchema = z
  .object({
    name: z
      .string({ required_error: "name 為必填欄位" })
      .min(1, { message: "name 為必填欄位" }),
    email: z
      .string({ required_error: "email 為必填欄位" })
      .email({ message: "email 格式不正確" }),
    password: z
      .string()
      .refine((val) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/.test(val), {
        message:
          "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
      }),
    confirm: z
      .string({ required_error: "confirm 為必填欄位" })
      .min(1, { message: "confirm 為必填欄位" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "與密碼不相符",
    path: ["cofirm"],
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "email 為必填欄位" })
    .email({ message: "email 格式不正確" }),
  password: z
    .string()
    .refine((val) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/.test(val), {
      message: "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
    }),
});
