import { NextRequest, NextResponse } from "next/server";
import { createTag, getTagBySlug } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    if (body.slug) {
      const existing = await getTagBySlug(body.slug);
      if (existing) {
        return NextResponse.json({ error: "A tag with this slug already exists" }, { status: 409 });
      }
    }

    const tag = await createTag(body);
    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
