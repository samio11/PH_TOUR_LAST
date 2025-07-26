import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { AppError } from "../errors/AppError";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const createUserToken = async (userData: Partial<IUser>) => {
  const payload = {
    userId: userData?._id,
    email: userData?.email,
    role: userData?.role,
  };
  const accessToken = generateToken(
    payload,
    config.JWT_ACCESS_TOKEN as string,
    config.JWT_ACCESS_EXPIRES as string
  );
  const refreshToken = generateToken(
    payload,
    config.JWT_REFRESH_TOKEN as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenViaRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    config.JWT_REFRESH_TOKEN as string
  ) as JwtPayload;
  const existUser = await User.findOne({ email: verifyRefreshToken.email });
  if (!existUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (existUser.isActive === "INACTIVE" || existUser.isActive === "BLOCKED") {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${existUser.isActive}`);
  }
  if (existUser.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  const payload = {
    userId: existUser?._id,
    email: existUser?.email,
    role: existUser?.role,
  };
  const accessToken = generateToken(
    payload,
    config.JWT_ACCESS_TOKEN as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  return accessToken;
};
