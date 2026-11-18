import { NextRequest, NextResponse } from "next/server";
import { updatePost, getPostById } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const { publish } = await req.json();

    const current = await getPostById(id);
    if (!current) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const newStatus = publish ? "published" : "draft";
    const updateData: any = { status: newStatus };
    if (publish && !current.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }

    const updated = await updatePost(id, updateData);

    revalidatePath("/");
    revalidatePath("/news");
    if (updated?.slug) revalidatePath(`/blog/${updated.slug}`);

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update publication status" }, { status: 500 });
  }
}
