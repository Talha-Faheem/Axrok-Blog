import { NextRequest, NextResponse } from "next/server";
import { getAuthorBySlug, getPosts } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const { posts } = await getPosts({
      author: author.slug,
      limit: 20,
      status: "published",
    });

    return NextResponse.json({ author, posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch author" }, { status: 500 });
  }
}
