import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }, // Catch-all arrays are typed as string[]
) {
  try {
    // 1. Await the dynamic catch-all route parameters safely
    const resolvedParams = await params;

    // Join the dynamic segments back together (e.g., ["uploads", "userId", "file.png"] -> "uploads/userId/file.png")
    const fileKey = Array.isArray(resolvedParams?.key)
      ? resolvedParams.key.join("/")
      : resolvedParams?.key;

    if (!fileKey) {
      return new NextResponse("Missing file key", { status: 400 });
    }

    // 2. Stream directly from Garage using your backend's admin credentials
    const command = new GetObjectCommand({
      Bucket: "sweetroll-forums",
      Key: fileKey,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      return new NextResponse("File body empty", { status: 404 });
    }

    const dataStream = s3Response.Body as ReadableStream;

    return new NextResponse(dataStream, {
      headers: {
        "Content-Type": s3Response.ContentType || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable", // Ensures guest browsers hold onto it!
      },
    });
  } catch (error: any) {
    console.error("Next.js Media Proxy Error:", error.message);
    return new NextResponse("Image asset not found", { status: 404 });
  }
}
