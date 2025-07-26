import { v2 as cloudinary } from "cloudinary";
import config from ".";
import { AppError } from "../errors/AppError";

cloudinary.config({
  cloud_name: config.CLOUDNARY_NAME as string,
  api_key: config.CLOUDNARY_API_KEY as string,
  api_secret: config.CLOUDNARY_API_SECRET as string,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted Successfully`);
    }
  } catch (err) {
    throw new AppError(401, "File Deleted Failed");
  }
};

export const cloudinaryUpload = cloudinary;
