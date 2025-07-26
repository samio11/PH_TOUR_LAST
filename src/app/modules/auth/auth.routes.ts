import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import passport from "passport";
import config from "../../config";

const router = Router();

router.post("/login", authControllers.credentialsLogin);
router.post("/logout", authControllers.logout);
router.post("/refreshToken", authControllers.getNewAccessToken);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req.query.redirectTo || "";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirectTo as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.FRONTEND_URL}/login`,
    session: false,
  }),
  authControllers.googleCallBack
);

export const authRoutes = router;
