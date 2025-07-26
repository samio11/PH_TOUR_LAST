import { AppError } from "../../errors/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existTour = await Tour.findOne({ title: payload.title });
  if (existTour) {
    throw new AppError(400, "Tour Is Already Exists");
  }
  const tourData = await Tour.create(payload);
  return tourData;
};
const createTourType = async (payload: ITourType) => {
  const tourType = await TourType.create(payload);
  return tourType;
};

export const tourServices = { createTour, createTourType };
