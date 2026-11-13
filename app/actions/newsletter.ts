"use server";

import { z } from "zod";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .max(254, "Email address is too long"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ActionState = {
  success: boolean;
  message: string;
};

// In-memory rate limiting map for demonstration (in production would use Redis / Cloudflare Rate Limiter)
const rateLimitMap = new Map<string, number>();

export async function subscribeToNewsletter(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      email: formData.get("email"),
      honeypot: formData.get("website") || "",
    };

    const parsed = newsletterSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid email address.",
      };
    }

    const { email } = parsed.data;

    // Rate limiting check: 1 request per 10 seconds per email
    const now = Date.now();
    const lastRequest = rateLimitMap.get(email.toLowerCase());
    if (lastRequest && now - lastRequest < 10000) {
      return {
        success: false,
        message: "You are submitting too fast. Please wait a moment.",
      };
    }
    rateLimitMap.set(email.toLowerCase(), now);

    // If Brevo API key is configured, invoke Brevo API:
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_NEWSLETTER_LIST_ID;

    if (brevoApiKey && brevoListId) {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          listIds: [parseInt(brevoListId, 10)],
          updateEnabled: true,
        }),
      });

      if (!response.ok && response.status !== 409) {
        return {
          success: false,
          message: "Unable to complete subscription. Please try again later.",
        };
      }
    }

    return {
      success: true,
      message: "Subscription confirmed! Welcome to Xroack Security Intelligence.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

