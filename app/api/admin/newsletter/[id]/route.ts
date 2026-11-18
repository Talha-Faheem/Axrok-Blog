import { NextRequest, NextResponse } from "next/server";
import { deleteNewsletterSubscriber, unsubscribeNewsletter } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const success = await unsubscribeNewsletter(id);
    if (!success) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Subscriber status updated to unsubscribed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
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
    const success = await deleteNewsletterSubscriber(id);
    if (!success) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Subscriber removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
