export const STRIPE_CONFIG = {
  monthlyPriceId: "price_monthly_29",
  yearlyPriceId: "price_yearly_290",
  monthlyPrice: 29.00,
  yearlyPrice: 290.00,
};

export interface RevenueSplitBreakdown {
  subscriptionPrice: number;
  charityPercentage: number;
  charityAmount: number;
  grossPrizePool: number;
  tier5Pool: number; // 40%
  tier4Pool: number; // 35%
  tier3Pool: number; // 25%
}

/**
 * Calculates the exact split of a subscription payment:
 * Charity contribution (10-50%) + remaining revenue split into 40/35/25 prize pool tiers.
 */
export function calculateRevenueSplit(
  price: number,
  charityPercentage: number
): RevenueSplitBreakdown {
  const charityAmount = Math.round((price * (charityPercentage / 100)) * 100) / 100;
  const grossPrizePool = Math.round((price - charityAmount) * 100) / 100;
  
  const tier5Pool = Math.round(grossPrizePool * 0.40 * 100) / 100;
  const tier4Pool = Math.round(grossPrizePool * 0.35 * 100) / 100;
  const tier3Pool = Math.round(grossPrizePool * 0.25 * 100) / 100;

  return {
    subscriptionPrice: price,
    charityPercentage,
    charityAmount,
    grossPrizePool,
    tier5Pool,
    tier4Pool,
    tier3Pool,
  };
}

/**
 * Simulates or executes Stripe Checkout session creation.
 */
export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  planType: "monthly" | "yearly";
  charityId: string;
  charityPercentage: number;
}) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const isStripeConfigured = Boolean(
    secretKey &&
    secretKey.startsWith("sk_") &&
    secretKey.length > 20
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (isStripeConfigured) {
    try {
      const unitAmount = params.planType === "monthly" ? 2900 : 29000;
      const interval = params.planType === "monthly" ? "month" : "year";
      const planName = params.planType === "monthly" ? "Digital Heroes Monthly Membership" : "Digital Heroes Annual Membership";

      const body = new URLSearchParams();
      body.append("payment_method_types[0]", "card");
      body.append("mode", "subscription");
      body.append("line_items[0][price_data][currency]", "usd");
      body.append("line_items[0][price_data][product_data][name]", planName);
      body.append("line_items[0][price_data][product_data][description]", `[TEST PAYMENT - No real money charged] Golf Performance & Charity Draw Platform (${params.charityPercentage}% Charity Tithe)`);
      body.append("line_items[0][price_data][unit_amount]", String(unitAmount));
      body.append("line_items[0][price_data][recurring][interval]", interval);
      body.append("line_items[0][quantity]", "1");
      body.append("success_url", `${baseUrl}/dashboard?checkout_success=true&plan=${params.planType}&charity=${params.charityId}&session_id={CHECKOUT_SESSION_ID}`);
      body.append("cancel_url", `${baseUrl}/onboarding/plan-selection?charity=${params.charityId}`);
      if (params.email && params.email.includes("@")) {
        body.append("customer_email", params.email);
      }
      body.append("metadata[user_id]", params.userId);
      body.append("metadata[charity_id]", params.charityId);
      body.append("metadata[charity_percentage]", String(params.charityPercentage));

      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const session = await stripeRes.json();
      if (session.url) {
        return {
          success: true,
          sessionId: session.id,
          url: session.url,
        };
      }
      console.warn("Stripe session creation returned error:", session.error);
    } catch (err: any) {
      console.error("Failed to create Stripe session:", err);
    }
  }

  // Fallback to instant simulated checkout for demo
  return {
    success: true,
    sessionId: `cs_simulated_${Date.now()}`,
    url: `/dashboard?checkout_success=true&plan=${params.planType}&charity=${params.charityId}`,
  };
}
