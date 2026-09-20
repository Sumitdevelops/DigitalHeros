import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const draw = mockDb.getDrawById(id);
  if (!draw) {
    return NextResponse.json({ success: false, error: "Draw not found" }, { status: 404 });
  }

  const results = mockDb.getDrawResults(id);
  return NextResponse.json({ success: true, draw, results });
}
