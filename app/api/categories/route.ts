import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const onlyActive = req.nextUrl.searchParams.get("all") !== "true";
    const categories = await getCategories(onlyActive);
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
