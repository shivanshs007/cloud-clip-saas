import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // can be public
  api_key: process.env.CLOUDINARY_API_KEY,                    // keep these server-side
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResult {
  public_id: string;
  
  [key: string]: any;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file ) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await (file as File).arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads", // change folder if you want
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as CloudinaryUploadResult);
          }
        );

        uploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        publicId: result.public_id,
       
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("upload image failed", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? String(error)
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
