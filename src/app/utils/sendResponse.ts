import { Response } from "express";

export type TSendResponse<T> = {
  statusCode: number;
  success: true;
  message: string;
  data: T | T[] | null;
};

export const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    totalData: data?.data,
  });
};
