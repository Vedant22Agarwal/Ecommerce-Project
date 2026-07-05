import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js"; // Change the path if needed

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "Local file path is missing");
    }

    console.log("Uploading file:", localFilePath);
    console.log("File exists:", fs.existsSync(localFilePath));

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    console.log("Cloudinary Upload Success:", response.secure_url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw new ApiError(
      error.http_code || 500,
      error.message || "Failed to upload image to Cloudinary"
    );
  }
};

export { uploadOnCloudinary };