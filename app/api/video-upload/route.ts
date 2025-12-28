import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure Cloudinary for Admin API access
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Request body type for video metadata
interface VideoMetadataRequest {
  url: string;
  publicId: string;
  duration: number;
  format: string;
  compressedSize: number;
  title: string;
  description: string;
  originalSize: number;
}

// Get compressed video size using Cloudinary's explicit API
async function getCompressedSize(publicId: string): Promise<number> {
  try {
    // Use explicit API to generate the compressed transformation and get its size
    const result = await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      resource_type: "video",
      eager: [{ quality: "auto", format: "mp4" }],
      eager_async: false, // Wait for transformation to complete
    });

    // The eager array contains the transformation results with bytes
    if (result.eager && result.eager[0] && result.eager[0].bytes) {
      return result.eager[0].bytes;
    }

    // Fallback: return the original bytes if eager transformation failed
    return result.bytes || 0;
  } catch (error) {
    console.error("Failed to get compressed size:", error);
    return 0;
  }
}
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Cloudinary credentials for fetching compressed size
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured" },
        { status: 500 }
      );
    }

    // Parse JSON body (no file handling - video uploaded directly to Cloudinary from browser)
    const body: VideoMetadataRequest = await request.json();

    const { publicId, duration, title, description, originalSize } = body;

    // Validate required fields
    if (!publicId || !title) {
      return NextResponse.json(
        {
          error: "Missing required fields: publicId and title are required",
        },
        { status: 400 }
      );
    }

    // Fetch the actual compressed size from Cloudinary
    const compressedSize = await getCompressedSize(publicId);

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        title,
        description: description || "",
        publicId,
        originalSize: String(originalSize),
        compressedSize: String(compressedSize || originalSize), // Fallback to original if compression fetch fails
        duration: duration || 0,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error("Failed to save video metadata:", error);
    return NextResponse.json(
      { error: "Failed to save video metadata" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
