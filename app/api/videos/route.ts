import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("/api/videos error:", error);
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
