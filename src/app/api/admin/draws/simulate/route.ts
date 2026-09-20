import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { drawId, drawType } = body;

    const simulation = mockDb.simulateDraw(drawId, drawType);
    return NextResponse.json({ success: true, simulation });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
