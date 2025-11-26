//route.ts api->videos->route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const {userId} = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const videos = await prisma.video.findMany({
      where:{userId},
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
