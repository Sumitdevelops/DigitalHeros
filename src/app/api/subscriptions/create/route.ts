import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planType, charityId, charityPercentage } = body;

    const targetUser = mockDb.getCurrentUser();
    const session = await createCheckoutSession({
      userId: userId || targetUser?.id || "a1111111-1111-1111-1111-111111111111",
      email: targetUser?.email || "player@digitalheroes.golf",
      planType,
      charityId,
      charityPercentage,
    });

    // Also update mockDb
    mockDb.createOrUpdateSubscription({
      userId,
      planType,
      charityId,
      charityPercentage,
    });

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
