import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost, getPostBySlug } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve article" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();

    if (body.slug) {
      const existing = await getPostBySlug(body.slug, true);
      if (existing && existing.id !== id && (existing as any)._id !== id) {
        return NextResponse.json({ error: "Another article already uses this slug" }, { status: 409 });
      }
    }

    const updated = await updatePost(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/blog/${updated.slug}`);
    if (updated.category) revalidatePath(`/category/${updated.category}`);

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const existing = await getPostById(id);
    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/news");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
