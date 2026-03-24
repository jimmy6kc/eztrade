import type { Tier } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Feature matrix
// ---------------------------------------------------------------------------

export const TIER_FEATURES = {
  free: {
    maxTrades: 5,
    cloudSync: false,
    templates: false,
    livePrices: false,
    tradingView: false,
    ibkr: false,
  },
  pro: {
    maxTrades: Infinity,
    cloudSync: true,
    templates: true,
    livePrices: false,
    tradingView: false,
    ibkr: false,
  },
  premium: {
    maxTrades: Infinity,
    cloudSync: true,
    templates: true,
    livePrices: true,
    tradingView: true,
    ibkr: true,
  },
} as const satisfies Record<Tier, unknown>;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/** Free users are limited to 5 trades. Pro and Premium are unlimited. */
export function canUseTrade(tier: Tier, tradeCount: number): boolean {
  return tradeCount < TIER_FEATURES[tier].maxTrades;
}

/** Cloud sync is available for Pro and Premium tiers. */
export function canUseCloudSync(tier: Tier): boolean {
  return TIER_FEATURES[tier].cloudSync;
}

/** Templates are available for Pro and Premium tiers. */
export function canUseTemplates(tier: Tier): boolean {
  return TIER_FEATURES[tier].templates;
}

/** Live price feeds are a Premium-only feature. */
export function canUseLivePrices(tier: Tier): boolean {
  return TIER_FEATURES[tier].livePrices;
}

/** TradingView integration is a Premium-only feature. */
export function canUseTradingView(tier: Tier): boolean {
  return TIER_FEATURES[tier].tradingView;
}

/** Interactive Brokers integration is a Premium-only feature. */
export function canUseIBKR(tier: Tier): boolean {
  return TIER_FEATURES[tier].ibkr;
}
