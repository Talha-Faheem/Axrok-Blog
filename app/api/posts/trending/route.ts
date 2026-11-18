import { NextResponse } from "next/server";
import { getPosts, getHomepageSettings, getPostBySlug } from "@/lib/db/repository";

export async function GET() {
  try {
    const settings = await getHomepageSettings();
    if (settings.trendingPostSlugs && settings.trendingPostSlugs.length > 0) {
      const posts = await Promise.all(
        settings.trendingPostSlugs.map((s: string) => getPostBySlug(s, false))
      );
      return NextResponse.json({ posts: posts.filter(Boolean) });
    }

    const result = await getPosts({ trending: true, limit: 6, status: "published" });
    return NextResponse.json({ posts: result.posts });
  } catch (error) {
    console.error("[Trending Posts API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch trending articles" }, { status: 500 });
  }
}
