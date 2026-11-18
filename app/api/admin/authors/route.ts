import { NextRequest, NextResponse } from "next/server";
import { createAuthor, getAuthorBySlug } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }

    if (body.slug) {
      const existing = await getAuthorBySlug(body.slug);
      if (existing) {
        return NextResponse.json({ error: "An author with this slug already exists" }, { status: 409 });
      }
    }

    const author = await createAuthor(body);
    revalidatePath("/authors");
    return NextResponse.json({ success: true, author }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 });
  }
}
