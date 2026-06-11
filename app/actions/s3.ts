"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function getPresignedUploadUrl(
  filename: string,
  fileType: string,
) {
  // 🔒 Keep the auth gate here so ONLY logged-in users can execute uploads!
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const fileKey = `uploads/${session.user.id}/${Date.now()}-${filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.GARAGE_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    // Generate the write signature token (expires in 15 mins)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      success: true,
      uploadUrl,
      // 🟢 Pointing to your working catch-all asset path
      publicUrl: `/api/media/${fileKey}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
