import mongoose from "mongoose";
import { TErrorSources, TGenericError } from "../interfaces/error";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericError => {
  const errorSources: TErrorSources = Object.values(err?.errors).map(
    (x: mongoose.Error.CastError | mongoose.Error.ValidatorError) => {
      return {
        path: x.path,
        message: x?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};
