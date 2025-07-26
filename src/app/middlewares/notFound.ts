import { NextFunction, Request, Response } from "express";

export const notFound = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND",
    error: "",
  });
};
