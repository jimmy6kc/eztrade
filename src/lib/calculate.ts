import { CONTRACTS, type ContractSymbol } from './contracts';

// ── Input / Output interfaces ──────────────────────────────────

export interface TpInput {
  label: string;
  price: number;
  /** Percentage of position to sell at this target (0-100) */
  pct: number;
}

export interface CalcInput {
  type: 'stock' | 'futures';
  dir: 'long' | 'short';
  entry: number;
  sl: number;
  riskAmount: number;
  fee: number;
  tps: TpInput[];
  /** Required when type is 'futures' */
  contract?: ContractSymbol;
}

export interface TpAnalysis {
  label: string;
  price: number;
  pct: number;
  shares: number;
  profit: number;
  cumProfit: number;
  rr: number;
}

export interface CalcResult {
  qty: number;
  actualRisk: number;
  totalCost: number;
  riskPerShare: number;
  overallRR: number;
  tpAnalysis: TpAnalysis[];
  potentialProfit: number;
  slLoss: number;
  /** Futures-only fields */
  lossPerContract?: number;
  marginNeeded?: number;
  /** True when TP1 profit >= actualRisk and there are multiple TPs */
  breakevenAfterTp1: boolean;
}

// ── Pure calculation ───────────────────────────────────────────

export function calculate(input: CalcInput): CalcResult | null {
  const { type, dir, entry, sl, riskAmount, fee, tps } = input;

  if (!riskAmount || !entry || isNaN(sl)) return null;

  const isFutures = type === 'futures';
  let qty: number;
  let actualRisk: number;
  let totalCost = 0;
  let riskPerShare = 0;
  let lossPerContract: number | undefined;
  let marginNeeded: number | undefined;

  if (isFutures) {
    const sym = input.contract;
    if (!sym || !(sym in CONTRACTS)) return null;
    const c = CONTRACTS[sym];
    const ptDiff = Math.abs(entry - sl);
    lossPerContract = ptDiff * c.multiplier;
    qty = Math.floor(riskAmount / lossPerContract);
    actualRisk = qty * lossPerContract + fee;
    marginNeeded = qty * c.margin;
    riskPerShare = lossPerContract;
    totalCost = marginNeeded;
  } else {
    riskPerShare = Math.abs(entry - sl);
    qty = Math.floor(riskAmount / riskPerShare);
    totalCost = qty * entry;
    actualRisk = qty * riskPerShare + fee;
  }

  if (qty === 0) return null;

  // ── TP Analysis ──

  const tpAnalysis: TpAnalysis[] = [];
  let overallRR = 0;
  let cumProfit = 0;
  let breakevenAfterTp1 = false;

  if (tps.length > 0) {
    let remain = qty;
    const mult = isFutures && input.contract ? CONTRACTS[input.contract].multiplier : 1;

    tps.forEach((tp, i) => {
      const tpDiff = dir === 'long' ? (tp.price - entry) : (entry - tp.price);
      let sell =
        i === tps.length - 1
          ? remain
          : Math.max(1, Math.round(qty * tp.pct / 100));
      if (sell > remain) sell = remain;

      const profit = tpDiff * mult * sell;
      cumProfit += profit;
      const rr = actualRisk > 0 ? cumProfit / actualRisk : 0;
      remain -= sell;

      tpAnalysis.push({
        label: tp.label,
        price: tp.price,
        pct: tp.pct,
        shares: sell,
        profit,
        cumProfit,
        rr,
      });

      // Breakeven-after-TP1 logic
      if (i === 0 && tps.length > 1 && profit >= actualRisk) {
        breakevenAfterTp1 = true;
      }
    });

    overallRR = actualRisk > 0 ? cumProfit / actualRisk : 0;
  }

  return {
    qty,
    actualRisk,
    totalCost,
    riskPerShare,
    overallRR,
    tpAnalysis,
    potentialProfit: cumProfit,
    slLoss: actualRisk,
    lossPerContract,
    marginNeeded,
    breakevenAfterTp1,
  };
}
