import { type NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getStripeServer } from "@/lib/stripe";
import type Stripe from "stripe";

// ---------------------------------------------------------------------------
// Price-to-tier mapping
// ---------------------------------------------------------------------------

function tierForPriceId(priceId: string): "pro" | "premium" | "free" {
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return "premium";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function updateUserTier(
  customerId: string,
  tier: string,
  extra?: Record<string, unknown>
) {
  const usersRef = getAdminDb().collection("users");
  const snap = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (snap.empty) {
    console.warn("[stripe-webhook] No user found for customer", customerId);
    return;
  }

  const userDoc = snap.docs[0];
  await userDoc.ref.update({ tier, ...extra });
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripeServer().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe-webhook] Signature verification failed:", message);
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      // ----- Checkout completed ------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Retrieve the subscription to get the price ID
        const subscription =
          await getStripeServer().subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? "";
        const tier = tierForPriceId(priceId);

        await updateUserTier(customerId, tier, {
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: "active",
        });
        break;
      }

      // ----- Subscription updated (plan change, renewal, etc.) -----------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id ?? "";
        const tier = tierForPriceId(priceId);

        await updateUserTier(customerId, tier, {
          subscriptionStatus: subscription.status,
        });
        break;
      }

      // ----- Subscription cancelled / deleted ----------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await updateUserTier(customerId, "free", {
          subscriptionStatus: "canceled",
        });
        break;
      }

      // ----- Payment failed ----------------------------------------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // We intentionally do NOT downgrade the tier on a single failed
        // payment.  Stripe will retry.  We just mark the status so the UI can
        // prompt the user to update their payment method.
        const usersRef = getAdminDb().collection("users");
        const snap = await usersRef
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snap.empty) {
          await snap.docs[0].ref.update({ subscriptionStatus: "past_due" });
        }
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt.
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe-webhook] Handler error:", message);
    return new Response(`Webhook handler error: ${message}`, { status: 500 });
  }

  return Response.json({ received: true });
}
