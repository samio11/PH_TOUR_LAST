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

export const divisionServices = { createDivision, getAllDivision };
