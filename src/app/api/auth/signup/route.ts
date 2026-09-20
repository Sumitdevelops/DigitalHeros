import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-service";
import { mockDb } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, password } = body;

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { success: false, error: "Email, full name, and password are required." },
        { status: 400 }
      );
    }

    const regResult = await registerUser(email, fullName, password);

    if (!regResult.success) {
      return NextResponse.json(
        { success: false, error: regResult.error, code: regResult.code },
        { status: 400 }
      );
    }

    const user = regResult.user!;
    // Also sync to local mock store so client works synchronously
    mockDb.syncUser(user);
    mockDb.setCurrentUser(user.id);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
