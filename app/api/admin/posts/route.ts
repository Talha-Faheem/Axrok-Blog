import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPost, getPostBySlug } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const result = await getPosts({
      page,
      limit,
      status: status || undefined, // empty string allows all statuses
      category,
      search,
      sort,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Posts GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Article title is required" }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (!body.author) {
      return NextResponse.json({ error: "Author is required" }, { status: 400 });
    }

    if (body.slug) {
      const existing = await getPostBySlug(body.slug, true);
      if (existing) {
        return NextResponse.json({ error: "An article with this URL slug already exists" }, { status: 409 });
      }
    }

    const post = await createPost(body);

    revalidatePath("/");
    revalidatePath("/news");
    if (post.category) revalidatePath(`/category/${post.category}`);

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("[Admin Posts POST] Error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
