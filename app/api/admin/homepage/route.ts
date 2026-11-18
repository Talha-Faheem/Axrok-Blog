import { NextRequest, NextResponse } from "next/server";
import { updateHomepageSettings } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const updated = await updateHomepageSettings(body);

    revalidatePath("/");
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update homepage settings" }, { status: 500 });
  }
}
