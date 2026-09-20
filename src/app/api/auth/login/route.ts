import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-service";
import { mockDb } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email address and password are required." },
        { status: 400 }
      );
    }

    const authResult = await authenticateUser(email, password);

    if (!authResult.success) {
      const statusCode = authResult.code === "EMAIL_NOT_REGISTERED" ? 404 : 401;
      return NextResponse.json(
        { success: false, error: authResult.error, code: authResult.code },
        { status: statusCode }
      );
    }

    const user = authResult.user!;
    // Sync to mockDb session so client dashboard state works consistently
    mockDb.syncUser(user);
    mockDb.setCurrentUser(user.id);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
