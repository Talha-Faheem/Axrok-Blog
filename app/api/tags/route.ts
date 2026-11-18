import { NextResponse } from "next/server";
import { getTags } from "@/lib/db/repository";

export async function GET() {
  try {
    const tags = await getTags();
    return NextResponse.json({ tags });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
