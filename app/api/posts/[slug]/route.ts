import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, getAuthorBySlug, getCategoryBySlug, getPosts } from "@/lib/db/repository";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug, false);

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const [author, category, relatedResult] = await Promise.all([
      getAuthorBySlug(post.author),
      getCategoryBySlug(post.category),
      getPosts({ category: post.category, limit: 4 }),
    ]);

    const relatedPosts = relatedResult.posts.filter((p) => p.slug !== post.slug).slice(0, 3);

    return NextResponse.json({
      post,
      author,
      category,
      relatedPosts,
    });
  } catch (error) {
    console.error("[Post by slug API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
