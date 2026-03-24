import { type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// IBKR Client Portal Gateway — Auth Status
//
// Proxies to the IBKR Client Portal API to check whether the gateway session
// is authenticated.  The gateway runs locally or on a server and exposes a
// REST API over HTTPS (self-signed cert by default).
// ---------------------------------------------------------------------------

const IBKR_GATEWAY_URL =
  process.env.IBKR_GATEWAY_URL ?? "https://localhost:5000";

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(
      `${IBKR_GATEWAY_URL}/v1/api/iserver/auth/status`,
      {
        method: "POST", // IBKR auth/status is actually a POST endpoint
        headers: { "Content-Type": "application/json" },
        // The IBKR gateway uses a self-signed certificate in local dev
        // @ts-expect-error — Node fetch option not in the Web API types
        rejectUnauthorized: false,
      }
    );

    if (!response.ok) {
      return Response.json(
        {
          connected: false,
          error: `Gateway returned ${response.status}`,
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      authenticated: boolean;
      competing: boolean;
      connected: boolean;
      message?: string;
    };

    return Response.json({
      connected: data.authenticated && data.connected,
      authenticated: data.authenticated,
      competing: data.competing,
      message: data.message ?? null,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[ibkr-auth]", message);
    return Response.json(
      {
        connected: false,
        error: "Unable to reach IBKR gateway",
        details: message,
      },
      { status: 502 }
    );
  }
}
