import { type NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

// ---------------------------------------------------------------------------
// IBKR Client Portal Gateway — Place Order
// ---------------------------------------------------------------------------

const IBKR_GATEWAY_URL =
  process.env.IBKR_GATEWAY_URL ?? "https://localhost:5000";
const IBKR_ACCOUNT_ID = process.env.IBKR_ACCOUNT_ID ?? "";

interface OrderRequest {
  ticker: string;
  qty: number;
  price?: number;
  sl?: number;
  tp?: number;
  side: "buy" | "sell";
}

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

    // --- Verify Premium tier -------------------------------------------------
    const userSnap = await getAdminDb().collection("users").doc(uid).get();
    const userData = userSnap.data();

    if (userData?.tier !== "premium") {
      return Response.json(
        { error: "IBKR integration requires Premium tier" },
        { status: 403 }
      );
    }

    // --- Parse body ----------------------------------------------------------
    const body = (await request.json()) as OrderRequest;

    if (!body.ticker || !body.qty || !body.side) {
      return Response.json(
        { error: "Missing required fields: ticker, qty, side" },
        { status: 400 }
      );
    }

    const accountId = userData.ibkrAccountId ?? IBKR_ACCOUNT_ID;
    if (!accountId) {
      return Response.json(
        { error: "IBKR account ID not configured" },
        { status: 400 }
      );
    }

    // --- Build IBKR order payload --------------------------------------------
    // The Client Portal API expects a specific order structure.
    // Reference: https://ibkrcampus.com/ibkr-api-page/cpapi-v1/#place-orders
    const orderPayload = {
      orders: [
        {
          acctId: accountId,
          conid: 0, // Will be resolved below via symbol lookup
          secType: `${body.ticker}:STK`,
          orderType: body.price ? "LMT" : "MKT",
          side: body.side.toUpperCase(),
          quantity: body.qty,
          price: body.price ?? undefined,
          tif: "DAY",
          outsideRTH: false,
        },
      ],
    };

    // --- Resolve conid from ticker symbol ------------------------------------
    const searchRes = await fetch(
      `${IBKR_GATEWAY_URL}/v1/api/iserver/secdef/search`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: body.ticker, secType: "STK" }),
        // @ts-expect-error — Node fetch option
        rejectUnauthorized: false,
      }
    );

    if (searchRes.ok) {
      const searchData = (await searchRes.json()) as Array<{
        conid: number;
        companyName: string;
      }>;
      if (searchData.length > 0) {
        orderPayload.orders[0].conid = searchData[0].conid;
      }
    }

    if (orderPayload.orders[0].conid === 0) {
      return Response.json(
        { error: `Unable to resolve contract for ${body.ticker}` },
        { status: 400 }
      );
    }

    // --- Place order via IBKR gateway ----------------------------------------
    const orderRes = await fetch(
      `${IBKR_GATEWAY_URL}/v1/api/iserver/account/${accountId}/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
        // @ts-expect-error — Node fetch option
        rejectUnauthorized: false,
      }
    );

    if (!orderRes.ok) {
      const errBody = await orderRes.text();
      console.error("[ibkr-orders] Gateway error:", errBody);
      return Response.json(
        { error: "Order rejected by IBKR gateway", details: errBody },
        { status: 502 }
      );
    }

    const orderResult = await orderRes.json();

    // --- Bracket orders (stop-loss / take-profit) ----------------------------
    // IBKR bracket orders are placed as separate child orders linked via
    // parentId.  For simplicity we note SL/TP in metadata; a production
    // implementation would submit OCA groups.

    return Response.json({
      success: true,
      order: orderResult,
      meta: {
        ticker: body.ticker,
        side: body.side,
        qty: body.qty,
        price: body.price ?? "MKT",
        sl: body.sl ?? null,
        tp: body.tp ?? null,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[ibkr-orders]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
