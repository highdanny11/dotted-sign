import { catchAsync } from "../utils/catchAsync";
import { createUser, getUserInfo, getUserloginInfo } from "../services/users";
import status from "http-status";
import { generateJWT } from "../utils/generateJWT";

export const regsiter = catchAsync(async (req, res, next) => {
  const form = req.body;
  const saver = await createUser(form);
  const token = await generateJWT({ id: saver.id }, process.env.JWT_SECRET!, {
    expiresIn: `${process.env.JWT_EXPIRES_DAY!}`,
  });
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user: {
        token,
      },
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const exist = await getUserloginInfo(email, password);
  const token = await generateJWT({ id: exist.id }, process.env.JWT_SECRET!, {
    expiresIn: `${process.env.JWT_EXPIRES_DAY!}`,
  });
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user: {
        token,
      },
    },
  });
});

export const info = catchAsync(async (req, res, next) => {
  const user = await getUserInfo(req.body.id);
  const files = user.files.map((item: typeof user.files) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));
  res.status(status.CREATED).json({
    status: "success",
    data: {
      user: {
        name: user.name,
        email: user.email,
        files: files,
      },
    },
  });
});
