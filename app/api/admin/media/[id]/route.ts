import { NextRequest, NextResponse } from "next/server";
import { deleteMedia } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const success = await deleteMedia(id);
    if (!success) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
