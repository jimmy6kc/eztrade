import type { Tier } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Feature matrix — simplified: Free + Pro ($9.99/mo)
// ---------------------------------------------------------------------------

export const TIER_FEATURES = {
  free: {
    maxTrades: 2,
    maxCalcsPerDay: 5,
    cloudSync: false,
    templates: false,
    livePrices: false,
    tradingView: false,
  },
  pro: {
    maxTrades: Infinity,
    maxCalcsPerDay: Infinity,
    cloudSync: true,
    templates: true,
    livePrices: true,
    tradingView: true,
  },
  // Keep premium as alias for pro (backward compatibility)
  premium: {
    maxTrades: Infinity,
    maxCalcsPerDay: Infinity,
    cloudSync: true,
    templates: true,
    livePrices: true,
    tradingView: true,
  },
} as const satisfies Record<Tier, unknown>;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/** Free users limited to 2 saved trades. Pro unlimited. */
export function canUseTrade(tier: Tier, tradeCount: number): boolean {
  return tradeCount < TIER_FEATURES[tier].maxTrades;
}

/** Free users limited to 5 calculations per day. Pro unlimited. */
export function canUseCalc(tier: Tier, calcCount: number): boolean {
  return calcCount < TIER_FEATURES[tier].maxCalcsPerDay;
}

/** Cloud sync is Pro only. */
export function canUseCloudSync(tier: Tier): boolean {
  return TIER_FEATURES[tier].cloudSync;
}

/** Templates are Pro only. */
export function canUseTemplates(tier: Tier): boolean {
  return TIER_FEATURES[tier].templates;
}

/** Live price feeds are Pro only. */
export function canUseLivePrices(tier: Tier): boolean {
  return TIER_FEATURES[tier].livePrices;
}

/** TradingView integration is Pro only. */
export function canUseTradingView(tier: Tier): boolean {
  return TIER_FEATURES[tier].tradingView;
}
