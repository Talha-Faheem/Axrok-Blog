import { NextRequest, NextResponse } from "next/server";
import { updatePost } from "@/lib/db/repository";
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
    const { status, scheduledAt } = await req.json();

    if (!["draft", "published", "scheduled", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "scheduled" && scheduledAt) {
      updateData.scheduledAt = scheduledAt;
    }
    if (status === "published") {
      updateData.publishedAt = new Date().toISOString();
    }

    const updated = await updatePost(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article status" }, { status: 500 });
  }
}
