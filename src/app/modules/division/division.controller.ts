import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";
import { divisionServices } from "./division.service";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body.data, req.file?.path);
    const payload = {
      ...JSON.parse(req.body.data),
      thumbnail: req.file?.path,
    };
    const result = await divisionServices.createDivision(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division Created Done",
      data: result,
    });
  }
);
const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionServices.getAllDivision(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Division Getted Done",
      data: result,
    });
  }
);

export const divisionControllers = { createDivision, getAllDivisions };
