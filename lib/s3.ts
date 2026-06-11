import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.GARAGE_ACCESS_KEY_ID ||
  !process.env.GARAGE_SECRET_ACCESS_KEY
) {
  throw new Error("Missing Garage S3 environmental configurations.");
}

export const s3Client = new S3Client({
  endpoint: process.env.GARAGE_ENDPOINT, // 🟢 Points directly to s3.kiseki-miracle.dev
  region: "garage", // Garage doesn't strictly use AWS regions, any placeholder string works
  credentials: {
    accessKeyId: process.env.GARAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.GARAGE_SECRET_ACCESS_KEY,
  },
  // Essential for self-hosted instances so it appends the bucket name as a path prefix
  forcePathStyle: true,
});
