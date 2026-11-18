import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db/repository";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
