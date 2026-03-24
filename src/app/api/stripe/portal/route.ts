import { type NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getStripeServer } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // --- Authenticate --------------------------------------------------------
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Missing auth token" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // --- Look up Stripe Customer ---------------------------------------------
    const userSnap = await getAdminDb().collection("users").doc(uid).get();
    const stripeCustomerId = userSnap.data()?.stripeCustomerId as
      | string
      | undefined;

    if (!stripeCustomerId) {
      return Response.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // --- Create Billing Portal Session ---------------------------------------
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripeServer().billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[stripe-portal]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
