import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || undefined;
  const winners = mockDb.getWinners(userId);
  return NextResponse.json({ success: true, winners });
}
