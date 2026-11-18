import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const author = searchParams.get("author") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const result = await getPosts({
      page,
      limit,
      category,
      tag,
      author,
      search,
      sort,
      status: "published", // Public API strictly filters to published only
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Posts API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
