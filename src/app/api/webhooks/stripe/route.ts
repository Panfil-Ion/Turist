import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { passExpiresAtFromNow } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (userId) {
      const expiresAt = passExpiresAtFromNow();
      const admin = createAdminClient();

      if (admin) {
        await admin
          .from("users")
          .update({
            pass_purchased_at: new Date().toISOString(),
            pass_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
            stripe_customer_id:
              typeof session.customer === "string"
                ? session.customer
                : null,
          })
          .eq("id", userId);

        if (session.id) {
          await admin
            .from("payments")
            .update({
              status: "succeeded",
              stripe_payment_intent_id:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
            })
            .eq("stripe_checkout_session_id", session.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
