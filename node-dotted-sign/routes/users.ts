import express from "express";
import { registerMiddlerware, loginMiddlerware } from "../middlewares/users";
import { authMiddlerware } from "../middlewares/auth";
import { regsiter, info, login } from "../controllers/users";
import { findOrCreateUser } from "../services/users";
import { generateJWT } from "../utils/generateJWT";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();
const passport = require("passport");
const GooleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
passport.use(
  new GooleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: { id: string; displayName: string; emails: { value: string }[] },
      cb: (err: any, user: any) => void
    ) {
      try {
        const user = await findOrCreateUser({
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        cb(null, user);
      } catch (error) {
        cb(null, {});
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_AUTH_CLIENTID,
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: { id: string; displayName: string; email: string[] },
      cb: (err: any, user: any) => void
    ) {
      try {
        cb(null, profile);
      } catch (error) {
        cb(null, {});
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  catchAsync(async (req: any, res: any) => {
    console.log("req", req.user);
    const user = req.user;
    const token = await generateJWT({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: `${process.env.JWT_EXPIRES_DAY!}`,
    });
    res.redirect("https://sign.sideproject.website/?token=" + token);
  })
);
// router.get("/facebook", passport.authenticate("facebook"), (req, res) => {
//   res.status(200).json({
//     status: "success",
//     data: {
//       user: "req.user",
//     },
//   });
// });
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     session: false,
//   }),
//   (req, res) => {
//     res.redirect("https://sign.sideproject.website/");
//   }
// );
router.post("/signup", registerMiddlerware, regsiter);
router.post("/login", loginMiddlerware, login);
router.get("/info", authMiddlerware, info);

export default router;
