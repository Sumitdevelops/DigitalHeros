import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { proofUrl } = body;

    const winner = mockDb.uploadProof(id, proofUrl);
    if (!winner) {
      return NextResponse.json({ success: false, error: "Winner record not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, winner });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
