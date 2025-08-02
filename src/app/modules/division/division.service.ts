import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { AppError } from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchableFields } from "./divisiion.contant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const existDivision = await Division.findOne({ name: payload.name });
  if (existDivision) {
    throw new AppError(400, "Division is already Exists");
  }
  const division = await Division.create(payload);
  return division;
};

const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const divisionData = queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const divisions = await divisionData.build();
  return divisions;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existDivision = await Division.findById(id);
  if (!existDivision) {
    throw new AppError(401, "Division not exist");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new AppError(401, "Division Name already exists");
  }

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (payload.thumbnail && existDivision.thumbnail) {
    await deleteImageFromCloudinary(existDivision.thumbnail);
  }

  return updateDivision;
};

export const divisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
};
