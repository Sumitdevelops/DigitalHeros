import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET() {
  const charities = mockDb.getCharities();
  return NextResponse.json({ success: true, charities });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = mockDb.createCharity(body);
    return NextResponse.json({ success: true, charity: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
