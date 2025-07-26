import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.NOT_FOUND, "Token Not Given...");
      }
      const verifyAccessToken = verifyToken(
        accessToken,
        config.JWT_ACCESS_TOKEN as string
      ) as JwtPayload;
      const existUser = await User.findOne({ email: verifyAccessToken.email });
      if (!existUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (
        existUser.isActive === "INACTIVE" ||
        existUser.isActive === "BLOCKED"
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${existUser.isActive}`
        );
      }
      if (existUser.isDeleted === true) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
      }

      if (!authRoles.includes(verifyAccessToken.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You Dont Have Access...");
      }

      req.user = verifyAccessToken;
      next();
    } catch (err) {
      next(err);
    }
  };
