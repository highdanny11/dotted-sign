import express from "express";
import { registerMiddlerware } from "../middlewares/users";

const router = express.Router();
import { regsiter, info } from "../controllers/users";
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
      profile: { id: string; displayName: string; email: string[] },
      cb: (err: any, user: any) => void
    ) {
      console.log("測試");
      console.log(profile);
      try {
        cb(null, profile);
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
      console.log("測試");
      console.log(profile);
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
  function (req: any, res: any) {
    console.log(req.user);
    res.status(200).json({
      status: "success",
      data: {
        user: "req.user",
      },
    });
  }
);
router.get("/facebook", passport.authenticate("facebook"), (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "req.user",
    },
  });
});
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
  }),
  (req, res) => {
    console.log(req);
    res.redirect("http://localhost:5173/#");
    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     user: "req.user",
    //   },
    // });
  }
);
router.post("/signup", registerMiddlerware, regsiter);
router.post("/info", info);

export default router;
