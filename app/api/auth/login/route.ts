import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body.user ?? body;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await setSession();
  return NextResponse.json({ user: { id: 1, email: "admin" } });
}
