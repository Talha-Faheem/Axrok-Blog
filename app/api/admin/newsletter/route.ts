import { NextRequest, NextResponse } from "next/server";
import { getNewsletterSubscribers } from "@/lib/db/repository";
import { requireAdmin } from "@/lib/auth/require-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const status = req.nextUrl.searchParams.get("status") || undefined;
    const format = req.nextUrl.searchParams.get("format");

    const subscribers = await getNewsletterSubscribers({ search, status });

    if (format === "csv") {
      const csvHeader = "ID,Email,Status,SubscribedAt\n";
      const csvRows = subscribers
        .map(
          (s) =>
            `"${s.id || s._id}","${s.email}","${s.status}","${s.subscribedAt}"`
        )
        .join("\n");
      const csv = csvHeader + csvRows;

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="axrok-subscribers.csv"',
        },
      });
    }

    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
