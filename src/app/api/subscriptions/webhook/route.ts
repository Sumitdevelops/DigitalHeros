import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = event.type || "customer.subscription.created";
    const dataObject = event.data?.object || {};

    console.log(`[Stripe Webhook] Received event: ${eventType}`);

    switch (eventType) {
      case "customer.subscription.created":
      case "invoice.payment_succeeded": {
        const customerId = dataObject.customer;
        // In live mode with database, lookup user by customerId
        break;
      }
      case "customer.subscription.deleted": {
        const customerId = dataObject.customer;
        // In live mode, set subscription status = 'lapsed'
        break;
      }
      case "payment_intent.payment_failed": {
        console.warn("[Stripe Webhook] Payment failed for customer:", dataObject.customer);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
