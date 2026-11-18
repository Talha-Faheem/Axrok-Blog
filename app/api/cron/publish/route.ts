import { NextResponse } from "next/server";
import { checkScheduledPosts } from "@/lib/db/repository";

export async function GET() {
  try {
    const publishedCount = await checkScheduledPosts();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      publishedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to run scheduled publish job" }, { status: 500 });
  }
}
