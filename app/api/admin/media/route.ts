import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const media = await getMedia();
    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
