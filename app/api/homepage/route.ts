import { NextResponse } from "next/server";
import {
  getHomepageSettings,
  getPostBySlug,
  getPosts,
  getCategories,
} from "@/lib/db/repository";

export async function GET() {
  try {
    const settings = await getHomepageSettings();

    // Fetch hero post
    const heroPost = settings.heroPostSlug
      ? await getPostBySlug(settings.heroPostSlug, false)
      : null;

    // Fetch featured posts
    const featuredPosts = await Promise.all(
      (settings.featuredPostSlugs || []).map((slug: string) => getPostBySlug(slug, false))
    );

    // Fetch trending posts
    const trendingPosts = await Promise.all(
      (settings.trendingPostSlugs || []).map((slug: string) => getPostBySlug(slug, false))
    );

    // Fetch spotlight post
    const spotlightPost = settings.spotlightPostSlug
      ? await getPostBySlug(settings.spotlightPostSlug, false)
      : null;

    // Fetch latest intelligence
    const latestResult = await getPosts({ limit: 6, status: "published" });

    // Fetch categories for topic grid
    const categories = await getCategories(true);

    return NextResponse.json({
      settings,
      heroPost,
      featuredPosts: featuredPosts.filter(Boolean),
      trendingPosts: trendingPosts.filter(Boolean),
      spotlightPost,
      latestIntelligence: latestResult.posts,
      categories,
    });
  } catch (error) {
    console.error("[Homepage API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch homepage data" }, { status: 500 });
  }
}
