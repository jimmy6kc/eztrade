import Stripe from "stripe";
import { loadStripe, type Stripe as StripeClient } from "@stripe/stripe-js";

// ---------------------------------------------------------------------------
// Server-side Stripe instance (lazy init — avoids build-time crash)
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// ---------------------------------------------------------------------------
// Client-side Stripe.js (used in React components)
// ---------------------------------------------------------------------------

let stripePromise: Promise<StripeClient | null> | null = null;

export function getStripe(): Promise<StripeClient | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
}
