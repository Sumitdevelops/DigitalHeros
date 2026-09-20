import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || mockDb.getCurrentUser()?.id || "a1111111-1111-1111-1111-111111111111";
  const scores = mockDb.getUserScores(userId);
  return NextResponse.json({ success: true, scores });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { score, scoreDate, courseName, userId } = body;

    const result = mockDb.addScore(score, scoreDate, courseName, userId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, score: result.score });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
