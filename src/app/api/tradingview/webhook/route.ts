import { type NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// TradingView alert webhook
//
// TradingView sends a POST with a JSON body.  The user's unique webhook token
// is passed as a query parameter: ?token=xxx
// ---------------------------------------------------------------------------

interface TradingViewPayload {
  ticker: string;
  action: "buy" | "sell";
  price: number;
  sl?: number;
  tp?: number;
  qty?: number;
}

export async function POST(request: NextRequest) {
  try {
    // --- Authenticate via webhook token --------------------------------------
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return Response.json(
        { error: "Missing webhook token" },
        { status: 401 }
      );
    }

    // Look up the user by their webhookToken field
    const usersRef = getAdminDb().collection("users");
    const snap = await usersRef
      .where("webhookToken", "==", token)
      .limit(1)
      .get();

    if (snap.empty) {
      return Response.json(
        { error: "Invalid webhook token" },
        { status: 401 }
      );
    }

    const userDoc = snap.docs[0];
    const uid = userDoc.id;
    const userData = userDoc.data();

    // --- Verify Premium tier -------------------------------------------------
    if (userData.tier !== "premium") {
      return Response.json(
        { error: "TradingView integration requires Premium tier" },
        { status: 403 }
      );
    }

    // --- Parse request body --------------------------------------------------
    const body = (await request.json()) as TradingViewPayload;

    if (!body.ticker || !body.action || body.price == null) {
      return Response.json(
        { error: "Missing required fields: ticker, action, price" },
        { status: 400 }
      );
    }

    // --- Create trade document -----------------------------------------------
    const tradeRef = getAdminDb().collection("users").doc(uid).collection("trades").doc();

    await tradeRef.set({
      id: tradeRef.id,
      symbol: body.ticker.toUpperCase(),
      direction: body.action === "buy" ? "long" : "short",
      entryPrice: body.price,
      quantity: body.qty ?? 1,
      stopLoss: body.sl ?? null,
      takeProfit: body.tp ?? null,
      entryDate: new Date().toISOString(),
      status: "open",
      source: "tradingview",
      notes: `Auto-created from TradingView alert: ${body.action} ${body.ticker}`,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return Response.json({
      success: true,
      tradeId: tradeRef.id,
      message: `Trade created: ${body.action} ${body.ticker} @ ${body.price}`,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[tradingview-webhook]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
