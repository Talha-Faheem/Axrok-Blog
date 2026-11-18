import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page || page.status !== "published") {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}
