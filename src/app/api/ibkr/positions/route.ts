import { type NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

// ---------------------------------------------------------------------------
// IBKR Client Portal Gateway — Positions
// ---------------------------------------------------------------------------

const IBKR_GATEWAY_URL =
  process.env.IBKR_GATEWAY_URL ?? "https://localhost:5000";
const IBKR_ACCOUNT_ID = process.env.IBKR_ACCOUNT_ID ?? "";

export async function GET(request: NextRequest) {
  try {
    // --- Authenticate --------------------------------------------------------
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Missing auth token" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // --- Verify Pro tier -----------------------------------------------------
    const userSnap = await getAdminDb().collection("users").doc(uid).get();
    const userData = userSnap.data();

    if (userData?.tier !== "pro" && userData?.tier !== "premium") {
      return Response.json(
        { error: "IBKR integration requires Pro tier" },
        { status: 403 }
      );
    }

    const accountId = userData.ibkrAccountId ?? IBKR_ACCOUNT_ID;
    if (!accountId) {
      return Response.json(
        { error: "IBKR account ID not configured" },
        { status: 400 }
      );
    }

    // --- Fetch positions from IBKR gateway -----------------------------------
    const response = await fetch(
      `${IBKR_GATEWAY_URL}/v1/api/portfolio/${accountId}/positions/0`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // @ts-expect-error — Node fetch option
        rejectUnauthorized: false,
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[ibkr-positions] Gateway error:", errBody);
      return Response.json(
        { error: "Failed to fetch positions from IBKR gateway" },
        { status: 502 }
      );
    }

    const positions = (await response.json()) as Array<{
      conid: number;
      contractDesc: string;
      position: number;
      mktPrice: number;
      mktValue: number;
      avgCost: number;
      unrealizedPnl: number;
      realizedPnl: number;
      currency: string;
    }>;

    // Map to a cleaner shape for the frontend
    const mapped = positions.map((p) => ({
      conid: p.conid,
      symbol: p.contractDesc,
      position: p.position,
      marketPrice: p.mktPrice,
      marketValue: p.mktValue,
      avgCost: p.avgCost,
      unrealizedPnl: p.unrealizedPnl,
      realizedPnl: p.realizedPnl,
      currency: p.currency,
    }));

    return Response.json({ positions: mapped });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[ibkr-positions]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
