import { NextRequest, NextResponse } from "next/server";
import { createCategory, getCategoryBySlug } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    if (body.slug) {
      const existing = await getCategoryBySlug(body.slug);
      if (existing) {
        return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
      }
    }

    const category = await createCategory(body);
    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
