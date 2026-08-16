import { v2 as cloudinary } from "cloudinary";
import { type UploadInput } from "./upload-input";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async ({
  buffer,
  key,
}: UploadInput): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: key },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFile = async (key: string): Promise<void> => {
  await cloudinary.uploader.destroy(key);
};
