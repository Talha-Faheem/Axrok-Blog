import { NextRequest, NextResponse } from "next/server";
import { updatePage, deletePage } from "@/lib/db/repository";
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

    const updated = await updatePage(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    revalidatePath(`/${updated.slug}`);
    return NextResponse.json({ success: true, page: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
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
    const success = await deletePage(id);
    if (!success) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Page deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
