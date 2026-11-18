import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, TokenPayload } from "./jwt";

export function requireAdmin(req: NextRequest): { user: TokenPayload } | { errorResponse: NextResponse } {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 }
      ),
    };
  }
  return { user };
}
