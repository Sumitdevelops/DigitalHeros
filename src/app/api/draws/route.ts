import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  const draws = mockDb.getDraws();
  return NextResponse.json({ success: true, draws });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { drawDate, drawType, totalPool, rolloverAmount } = body;

    const newDraw = mockDb.createDraw({
      draw_date: drawDate,
      draw_type: drawType,
      total_pool: totalPool,
      rollover_amount: rolloverAmount,
    });

    return NextResponse.json({ success: true, draw: newDraw });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
