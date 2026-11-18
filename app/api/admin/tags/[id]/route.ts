import { NextRequest, NextResponse } from "next/server";
import { updateTag, deleteTag } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateTag(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tag: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
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
    const success = await deleteTag(id);

    if (!success) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Tag deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
