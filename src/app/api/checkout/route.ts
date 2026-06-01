import { NextResponse } from "next/server";
import { getStripe, getAppUrl } from "@/lib/stripe";
import { getVisitorId, getOrCreateUser } from "@/lib/visitor";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const visitorId = await getVisitorId();
  if (!visitorId) {
    return NextResponse.json({ error: "No visitor session" }, { status: 400 });
  }

  const user = await getOrCreateUser(visitorId);
  if (!user) {
    return NextResponse.json({ error: "Could not create user" }, { status: 500 });
  }

  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/unlock?success=1`,
    cancel_url: `${appUrl}/unlock?canceled=1`,
    metadata: { user_id: user.id, visitor_id: visitorId },
    customer_email: undefined,
  });

  const admin = createAdminClient();
  if (admin && session.id) {
    await admin.from("payments").insert({
      user_id: user.id,
      stripe_checkout_session_id: session.id,
      amount_cents: 500,
      currency: "eur",
      status: "pending",
    });
  }

  return NextResponse.json({ url: session.url });
}
