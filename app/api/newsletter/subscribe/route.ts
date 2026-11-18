import { NextRequest, NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/db/repository";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const subscriber = await addNewsletterSubscriber(email);

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed! Welcome to AXROK Security Intelligence.",
      subscriber,
    });
  } catch (error) {
    console.error("[Newsletter Subscribe API] Error:", error);
    return NextResponse.json({ error: "Failed to process subscription" }, { status: 500 });
  }
}
