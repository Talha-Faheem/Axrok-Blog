import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug, getPosts } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const postsResult = await getPosts({
      category: category.slug,
      page,
      limit,
      status: "published",
    });

    return NextResponse.json({
      category,
      ...postsResult,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}
