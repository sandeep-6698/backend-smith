import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { type UploadInput } from "./upload-input";

const region = process.env.AWS_REGION ?? "";
const bucket = process.env.AWS_S3_BUCKET ?? "";

const client = new S3Client({ region });

export const uploadFile = async ({
  buffer,
  key,
  contentType,
}: UploadInput): Promise<string> => {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const deleteFile = async (key: string): Promise<void> => {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};
