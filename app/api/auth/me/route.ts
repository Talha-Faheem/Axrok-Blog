import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/db/repository";

export async function GET(req: NextRequest) {
  const tokenUser = getUserFromRequest(req);
  if (!tokenUser) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await getUserById(tokenUser.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
}
