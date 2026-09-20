import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || mockDb.getCurrentUser()?.id || "a1111111-1111-1111-1111-111111111111";
  const subscription = mockDb.getUserSubscription(userId);
  return NextResponse.json({ success: true, subscription });
}
