import { v2 as cloudinary, UploadStream } from "cloudinary";
import { error } from "console";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
  if (!file) return null;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || null);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

export default uploadOnCloudinary;
