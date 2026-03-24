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

    // --- Parse body ----------------------------------------------------------
    const { priceId } = (await request.json()) as { priceId?: string };
    if (!priceId) {
      return Response.json({ error: "priceId is required" }, { status: 400 });
    }

    // --- Look up or create Stripe Customer -----------------------------------
    const userRef = getAdminDb().collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    let customerId: string;

    if (userData?.stripeCustomerId) {
      customerId = userData.stripeCustomerId;
    } else {
      const customer = await getStripeServer().customers.create({
        email: decoded.email ?? undefined,
        metadata: { firebaseUid: uid },
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    // --- Create Checkout Session ---------------------------------------------
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripeServer().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { firebaseUid: uid },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[create-checkout]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
