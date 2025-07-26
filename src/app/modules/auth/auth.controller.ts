import passport from "passport";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import { createUserToken } from "../../utils/userToken";
import { setCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { authServices } from "./auth.services";

const credentialsLogin = catchAsync(async (req, res, next) => {
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      return next(new AppError(401, err));
    }
    if (!user) {
      return next(new AppError(401, info?.message));
    }
    const userToken = await createUserToken(user);
    const { password: pass, ...rest } = user.toObject();
    setCookie(res, userToken);
    sendResponse(res, {
      statusCode: 200,
      message: "User Login Done!!",
      success: true,
      data: {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        userData: rest,
      },
    });
  })(req, res, next);
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Logout Done",
    data: {},
  });
});

const googleCallBack = catchAsync(async (req, res, next) => {
  let redirectTo = req?.query?.state ? (req.query?.state as string) : "";
  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }
  const user = req.user;
  if (!user) {
    throw new AppError(404, "User Not Found");
  }
  const tokenInfo = await createUserToken(user);
  setCookie(res, tokenInfo);
  res.redirect(`${config.FRONTEND_URL as string}/${redirectTo}`);
});

const getNewAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(404, "Refresh Token Not Found");
  }
  const tokenInfo = await authServices.getNewAccessToken(refreshToken);
  setCookie(res, tokenInfo);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "AccessToken Getted",
    data: tokenInfo,
  });
});

export const authControllers = {
  credentialsLogin,
  logout,
  googleCallBack,
  getNewAccessToken,
};
