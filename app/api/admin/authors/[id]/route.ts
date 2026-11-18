import { NextRequest, NextResponse } from "next/server";
import { updateAuthor, deleteAuthor } from "@/lib/db/repository";
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

    const updated = await updateAuthor(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    revalidatePath("/authors");
    return NextResponse.json({ success: true, author: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update author" }, { status: 500 });
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
    const success = await deleteAuthor(id);

    if (!success) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    revalidatePath("/authors");
    return NextResponse.json({ success: true, message: "Author deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete author" }, { status: 500 });
  }
}
