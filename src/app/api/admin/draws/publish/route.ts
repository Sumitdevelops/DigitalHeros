import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { drawId, simulation } = body;

    const publishedDraw = mockDb.publishDraw(drawId, simulation);
    return NextResponse.json({ success: true, draw: publishedDraw });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
