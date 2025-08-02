import config from "../../config";
import { AppError } from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createAccessTokenViaRefreshToken } from "../../utils/userToken";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenViaRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

const forgetPassword = async (email: string) => {
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new AppError(401, "User Not Exists");
  }
  if (
    existUser.isActive === IsActive.BLOCKED ||
    existUser.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(401, `User is ${existUser.isActive}`);
  }
  if (existUser.isDeleted) {
    throw new AppError(401, "User is deleted");
  }
  const jwtPayload = {
    userId: existUser._id,
    email: existUser.email,
    role: existUser.role,
  };

  const resetToken = jwt.sign(jwtPayload, config.JWT_ACCESS_TOKEN as string, {
    expiresIn: "10m",
  });

  const resetUILink = `${config.FRONTEND_URL}/reset-password?id=${existUser._id}&token=${resetToken}`;

  sendEmail({
    to: existUser.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: existUser.name,
      resetUILink,
    },
  });
};

export const authServices = {
  getNewAccessToken,
  forgetPassword,
};
