import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/news");
    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
    const res = await deleteCategory(id);

    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/news");
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
