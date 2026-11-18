import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve statistics" }, { status: 500 });
  }
}
