import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";
import { tourServices } from "./tour.service";

const createTour = catchAsync(async (req, res, next) => {
  const payload = {
    ...JSON.parse(req.body.data),
    images: (req.files as Express.Multer.File[]).map((x) => x.path),
  };
  const result = await tourServices.createTour(payload);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Tour Created Done",
    data: result,
  });
});
const createTourType = catchAsync(async (req, res, next) => {
  const result = await tourServices.createTourType(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Tour Type Created Done",
    data: result,
  });
});

export const tourControllers = { createTour, createTourType };
