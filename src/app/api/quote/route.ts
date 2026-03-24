import { type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Yahoo Finance v8 Quote API
//
// Fetches the current price for a given stock/ETF symbol using the Yahoo
// Finance chart endpoint.  Returns a normalised JSON payload with price,
// previous close, change, and market state.
// ---------------------------------------------------------------------------

interface YahooChartResponse {
  chart: {
    result: {
      meta: {
        regularMarketPrice: number;
        chartPreviousClose: number;
        regularMarketTime: number;
        currency: string;
        exchangeTimezoneName: string;
      };
      indicators: {
        quote: { close: (number | null)[] }[];
      };
    }[] | null;
    error: { code: string; description: string } | null;
  };
}

// Simple in-memory rate-limit tracker (per-symbol, per 5 s)
const rateMap = new Map<string, number>();
const RATE_LIMIT_MS = 5_000;

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return Response.json(
      { error: "Missing required query parameter: symbol" },
      { status: 400 }
    );
  }

  // Validate symbol format — alphanumeric, dots, dashes, equals, max 10 chars
  if (!/^[A-Z0-9.\-=]{1,10}$/.test(symbol)) {
    return Response.json(
      { error: "Invalid symbol format" },
      { status: 400 }
    );
  }

  // Rate-limit check
  const now = Date.now();
  const lastFetch = rateMap.get(symbol) ?? 0;
  if (now - lastFetch < RATE_LIMIT_MS) {
    return Response.json(
      { error: "Rate limited — try again in a few seconds" },
      {
        status: 429,
        headers: { "Retry-After": "5" },
      }
    );
  }
  rateMap.set(symbol, now);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 15 }, // ISR cache for 15 seconds
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 422) {
        return Response.json(
          { error: `Unknown symbol: ${symbol}` },
          { status: 404 }
        );
      }
      return Response.json(
        { error: `Yahoo Finance returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as YahooChartResponse;

    if (data.chart.error) {
      return Response.json(
        { error: data.chart.error.description ?? "Yahoo Finance error" },
        { status: 502 }
      );
    }

    const result = data.chart.result?.[0];
    if (!result) {
      return Response.json(
        { error: `No data returned for ${symbol}` },
        { status: 404 }
      );
    }

    const { meta } = result;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    // Determine market state from the market time
    // Yahoo doesn't expose marketState in chart v8 — we infer from exchange TZ
    const marketTime = meta.regularMarketTime * 1000;
    const marketDate = new Date(marketTime);
    const nowDate = new Date();
    const diffMin = (nowDate.getTime() - marketDate.getTime()) / 60_000;

    let marketState: "pre" | "regular" | "post" | "closed" = "closed";
    const hour = new Date().toLocaleString("en-US", {
      timeZone: meta.exchangeTimezoneName || "America/New_York",
      hour: "numeric",
      hour12: false,
    });
    const h = parseInt(hour, 10);
    const day = new Date().toLocaleString("en-US", {
      timeZone: meta.exchangeTimezoneName || "America/New_York",
      weekday: "short",
    });

    if (["Sat", "Sun"].includes(day)) {
      marketState = "closed";
    } else if (h >= 4 && h < 9.5) {
      marketState = "pre";
    } else if (h >= 9.5 && h < 16) {
      marketState = "regular";
    } else if (h >= 16 && h < 20) {
      marketState = "post";
    }

    return Response.json({
      symbol,
      price: Math.round(price * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      marketState,
      currency: meta.currency ?? "USD",
      updatedAt: new Date(marketTime).toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[quote]", message);
    return Response.json(
      { error: "Failed to fetch quote", details: message },
      { status: 500 }
    );
  }
}
