import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const charity = mockDb.getCharityById(id);
  if (!charity) {
    return NextResponse.json({ success: false, error: "Charity not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, charity });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updated = mockDb.updateCharity(id, body);
    return NextResponse.json({ success: true, charity: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = mockDb.deleteCharity(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
