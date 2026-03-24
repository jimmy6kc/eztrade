"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { calculate, type CalcInput, type CalcResult, type TpInput } from "@/lib/calculate";
import { CONTRACTS, type ContractSymbol } from "@/lib/contracts";
import { US_STOCKS, type StockTuple } from "@/lib/stocks";
import { useQuote } from "@/hooks/useQuote";
import { useAuth } from "@/lib/auth";
import { canUseLivePrices } from "@/lib/membership";
import BottomNav from "@/components/BottomNav";

// ── Helpers ───────────────────────────────────────────────────

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => "$" + fmt(n);

const RISK_PRESETS = [50, 100, 150, 200, 300, 500];

const DEFAULT_TP_PCTS = [40, 25, 20, 10, 5];

const PREDEFINED_TAGS = ["Breakout", "Scalp", "Swing", "Earnings", "Reversal", "Momentum", "Gap", "Custom"];

function Tip({ text }: { text: string }) {
  return <span className="field-tip" data-tip={text}>?</span>;
}

// ── Component ─────────────────────────────────────────────────

export default function CalculatorPage() {
  // Mode
  const [mode, setMode] = useState<"stock" | "futures">("stock");
  const [dir, setDir] = useState<"long" | "short">("long");

  // Ticker
  const [ticker, setTicker] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [ddIndex, setDdIndex] = useState(-1);
  const tickerRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Core fields
  const [riskAmount, setRiskAmount] = useState(100);
  const [entry, setEntry] = useState<string>("");
  const [sl, setSl] = useState<string>("");
  const [fee, setFee] = useState<string>("0");
  const [contract, setContract] = useState<ContractSymbol>("MNQ");

  // TPs
  const [tpCount, setTpCount] = useState(3);
  const [tpPrices, setTpPrices] = useState<string[]>(["", "", "", "", ""]);
  const [tpPcts, setTpPcts] = useState<number[]>([...DEFAULT_TP_PCTS]);

  // Notes & Tags
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Results
  const [result, setResult] = useState<CalcResult | null>(null);

  // Live price
  const { tier } = useAuth();
  const isPremium = canUseLivePrices(tier);
  const { price: quoteData, loading: quoteLoading } = useQuote(
    isPremium && ticker ? ticker : ""
  );

  // ── Ticker autocomplete ─────────────────────────────────────

  const filteredStocks = useMemo<StockTuple[]>(() => {
    if (!ticker.trim()) return [];
    const q = ticker.toUpperCase();
    return US_STOCKS.filter(
      ([sym, name]) => sym.includes(q) || name.toUpperCase().includes(q)
    ).slice(0, 30);
  }, [ticker]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        tickerRef.current &&
        !tickerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectTicker = useCallback((sym: string) => {
    setTicker(sym);
    setShowDropdown(false);
    setDdIndex(-1);
  }, []);

  // ── TP auto-distribution ────────────────────────────────────

  const adjustTpPcts = useCallback(
    (count: number) => {
      const pcts = [...tpPcts];
      // simple even distribution
      const base = Math.floor(100 / count);
      const remainder = 100 - base * count;
      for (let i = 0; i < 5; i++) {
        if (i < count) {
          pcts[i] = base + (i === 0 ? remainder : 0);
        } else {
          pcts[i] = 0;
        }
      }
      setTpPcts(pcts);
    },
    [tpPcts]
  );

  // ── Auto-calculate ──────────────────────────────────────────

  useEffect(() => {
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(sl);
    if (!entryNum || isNaN(slNum)) {
      setResult(null);
      return;
    }

    const activeTps: TpInput[] = [];
    for (let i = 0; i < tpCount; i++) {
      const p = parseFloat(tpPrices[i]);
      if (p) {
        activeTps.push({
          label: `T${i + 1}`,
          price: p,
          pct: tpPcts[i],
        });
      }
    }

    const input: CalcInput = {
      type: mode,
      dir,
      entry: entryNum,
      sl: slNum,
      riskAmount,
      fee: parseFloat(fee) || 0,
      tps: activeTps,
      ...(mode === "futures" ? { contract } : {}),
    };

    setResult(calculate(input));
  }, [mode, dir, entry, sl, riskAmount, fee, contract, tpCount, tpPrices, tpPcts]);

  // ── TP price setters ────────────────────────────────────────

  const setTpPrice = (i: number, v: string) => {
    const next = [...tpPrices];
    next[i] = v;
    setTpPrices(next);
  };

  const setTpPct = (i: number, v: number) => {
    const next = [...tpPcts];
    next[i] = v;
    // Auto-adjust: last active TP always gets the remainder to total 100%
    const lastIdx = tpCount - 1;
    if (i !== lastIdx && tpCount > 1) {
      let used = 0;
      for (let j = 0; j < lastIdx; j++) {
        used += j === i ? v : next[j];
      }
      next[lastIdx] = Math.max(0, 100 - used);
    }
    setTpPcts(next);
  };

  // ── Tag toggle ─────────────────────────────────────────────

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ── Copy result ─────────────────────────────────────────────

  const copyResult = () => {
    if (!result) return;
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(sl);
    const lines = [
      `${ticker || "---"} | ${dir.toUpperCase()} | ${mode === "futures" ? contract : "Stock"}`,
      `Entry: ${entry} | SL: ${sl} | Risk: ${fmtUsd(riskAmount)}`,
      `Qty: ${result.qty} | R:R ${fmt(result.overallRR, 1)}`,
      `Potential Profit: ${fmtUsd(result.potentialProfit)}`,
      "",
      ...result.tpAnalysis.map(
        (tp) => `${tp.label}: ${fmt(tp.price)} (${tp.pct}%) = ${fmtUsd(tp.profit)} [${fmt(tp.rr, 1)}R]`
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  };

  // ── Save trade to localStorage ──────────────────────────────

  const saveTrade = () => {
    if (!result) return;
    const trade = {
      id: Date.now().toString(),
      symbol: ticker || "---",
      direction: dir,
      entryPrice: parseFloat(entry),
      quantity: result.qty,
      entryDate: new Date().toISOString().slice(0, 10),
      status: "open" as const,
      slPrice: parseFloat(sl),
      risk: result.actualRisk,
      rr: result.overallRR,
      tps: result.tpAnalysis.map((tp) => ({ label: tp.label, price: tp.price, pct: tp.pct })),
      mode,
      contract: mode === "futures" ? contract : undefined,
      notes: notes.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };
    const existing = JSON.parse(localStorage.getItem("eztrade_trades") || "[]");
    existing.unshift(trade);
    localStorage.setItem("eztrade_trades", JSON.stringify(existing));
    setNotes("");
    setSelectedTags([]);
    alert("Trade saved!");
  };

  // ── Price bar visualization ─────────────────────────────────

  const priceBar = useMemo(() => {
    if (!result || !result.tpAnalysis.length) return null;
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(sl);
    const tpMax = Math.max(...result.tpAnalysis.map((t) => t.price));
    const allPrices = [entryNum, slNum, tpMax];
    const lo = Math.min(...allPrices);
    const hi = Math.max(...allPrices);
    if (hi === lo) return null;
    const range = hi - lo;
    const pad = range * 0.05;
    const min = lo - pad;
    const total = range + 2 * pad;

    const pct = (p: number) => ((p - min) / total) * 100;

    const isLong = dir === "long";
    const slPct = pct(slNum);
    const entryPct = pct(entryNum);
    const tpPctPos = pct(tpMax);

    const zones = isLong
      ? [
          { left: slPct, width: entryPct - slPct, color: "var(--loss)", label: "SL" },
          { left: entryPct, width: tpPctPos - entryPct, color: "var(--profit)", label: "TP" },
        ]
      : [
          { left: entryPct, width: slPct - entryPct, color: "var(--loss)", label: "SL" },
          { left: tpPctPos, width: entryPct - tpPctPos, color: "var(--profit)", label: "TP" },
        ];

    return (
      <div className="price-bar mt-3">
        {zones.map((z, i) => (
          <div
            key={i}
            className="price-bar-zone"
            style={{ left: `${z.left}%`, width: `${Math.abs(z.width)}%`, background: z.color }}
          >
            {Math.abs(z.width) > 8 ? z.label : ""}
          </div>
        ))}
        {/* Entry marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{ left: `${entryPct}%`, background: "var(--accent)" }}
        />
      </div>
    );
  }, [result, entry, sl, dir]);

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="flex-1 pb-nav">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["stock", "futures"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: mode === m ? "var(--accent)" : "var(--card)",
                color: mode === m ? "#fff" : "var(--text)",
                border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {m === "stock" ? "Stock" : "Futures"}
            </button>
          ))}
        </div>

        {/* Direction */}
        <div>
          <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Direction <Tip text="Long = buy low, sell high. Short = sell high, buy low." />
          </label>
          <div className="flex gap-2 mt-1">
            {(["long", "short"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDir(d)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: dir === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--card)",
                  color: dir === d ? "#fff" : "var(--text)",
                  border: `1px solid ${dir === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--border)"}`,
                }}
              >
                {d === "long" ? "Long" : "Short"}
              </button>
            ))}
          </div>
        </div>

        {/* Contract selector (futures) */}
        {mode === "futures" && (
          <div>
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Contract <Tip text="Select the futures contract you are trading." />
            </label>
            <select
              value={contract}
              onChange={(e) => setContract(e.target.value as ContractSymbol)}
              className="w-full mt-1"
            >
              {Object.keys(CONTRACTS).map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Ticker */}
        <div className="relative">
          <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Ticker <Tip text="Search for a stock symbol or name." />
          </label>
          <input
            ref={tickerRef}
            type="text"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
              setShowDropdown(true);
              setDdIndex(-1);
            }}
            onFocus={() => ticker && setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setDdIndex((p) => Math.min(p + 1, filteredStocks.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setDdIndex((p) => Math.max(p - 1, 0));
              } else if (e.key === "Enter" && ddIndex >= 0) {
                e.preventDefault();
                selectTicker(filteredStocks[ddIndex][0]);
              } else if (e.key === "Escape") {
                setShowDropdown(false);
              }
            }}
            placeholder="e.g. AAPL, TSLA..."
            className="w-full mt-1"
            autoComplete="off"
          />
          {showDropdown && filteredStocks.length > 0 && (
            <div ref={dropdownRef} className="ticker-dropdown">
              {filteredStocks.map(([sym, name], i) => (
                <div
                  key={sym}
                  className={`ticker-dropdown-item ${i === ddIndex ? "active" : ""}`}
                  onMouseDown={() => selectTicker(sym)}
                >
                  <span className="symbol">{sym}</span>
                  <span className="name">{name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Live price badge */}
          {ticker && (
            <div className="mt-2">
              {isPremium ? (
                <>
                  {quoteLoading && (
                    <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: "var(--input-bg)", color: "var(--muted)" }}>
                      Loading...
                    </span>
                  )}
                  {quoteData && !quoteLoading && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-md inline-flex items-center gap-1"
                        style={{
                          background: quoteData.change >= 0
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: quoteData.change >= 0 ? "var(--profit)" : "var(--loss)",
                        }}
                      >
                        {quoteData.symbol} ${quoteData.price.toFixed(2)}{" "}
                        {quoteData.change >= 0 ? "\u25B2" : "\u25BC"}
                        {quoteData.changePercent >= 0 ? "+" : ""}
                        {quoteData.changePercent.toFixed(2)}%
                      </span>
                      <button
                        onClick={() => setEntry(String(quoteData.price))}
                        className="text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        Use current price
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <span
                  className="text-[10px] px-2 py-1 rounded-md inline-flex items-center gap-1"
                  style={{ background: "var(--input-bg)", color: "var(--muted)" }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Live prices — Premium only
                </span>
              )}
            </div>
          )}
        </div>

        {/* Risk presets */}
        <div>
          <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Risk Amount <span style={{ color: "var(--loss)" }}>*</span> <Tip text="Maximum dollar amount you are willing to lose on this trade." />
          </label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {RISK_PRESETS.map((r) => (
              <button
                key={r}
                onClick={() => setRiskAmount(r)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: riskAmount === r ? "var(--accent)" : "var(--card)",
                  color: riskAmount === r ? "#fff" : "var(--text)",
                  border: `1px solid ${riskAmount === r ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                ${r}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={riskAmount}
            onChange={(e) => setRiskAmount(Number(e.target.value))}
            className="w-full mt-2"
            min={1}
          />
        </div>

        {/* Entry / SL */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Entry Price <span style={{ color: "var(--loss)" }}>*</span> <Tip text="Your planned entry price." />
            </label>
            <input
              type="number"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1"
              step="any"
            />
          </div>
          <div>
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Stop Loss <span style={{ color: "var(--loss)" }}>*</span> <Tip text="Your stop loss price. Position size is calculated from this." />
            </label>
            <input
              type="number"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1"
              step="any"
            />
          </div>
        </div>

        {/* TP Targets */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Take Profit Targets <Tip text="Set up to 5 TP targets with % allocation." />
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setTpCount(n);
                    adjustTpPcts(n);
                  }}
                  className="w-7 h-7 rounded text-xs font-bold transition-colors"
                  style={{
                    background: tpCount === n ? "var(--accent)" : "var(--card)",
                    color: tpCount === n ? "#fff" : "var(--text)",
                    border: `1px solid ${tpCount === n ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {Array.from({ length: tpCount }).map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-bold w-6" style={{ color: "var(--profit)" }}>
                  T{i + 1}
                </span>
                <input
                  type="number"
                  value={tpPrices[i]}
                  onChange={(e) => setTpPrice(i, e.target.value)}
                  placeholder="Price"
                  className="flex-1"
                  step="any"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tpPcts[i]}
                    onChange={(e) => setTpPct(i, Number(e.target.value))}
                    className="w-14 text-center"
                    min={0}
                    max={100}
                  />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: "var(--accent)" }}
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Options
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {showAdvanced && (
          <div className="animate-fade-in">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Commission / Fees <Tip text="Total round-trip commission cost." />
            </label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1"
              step="any"
            />
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────── */}

        {result && (
          <div
            className="rounded-xl p-4 space-y-3 animate-fade-in"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              Results
            </h2>

            {/* Key stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Position Size" value={`${result.qty} ${mode === "futures" ? "contracts" : "shares"}`} />
              <StatBox label="Actual Risk" value={fmtUsd(result.actualRisk)} color="var(--loss)" />
              <StatBox label="Total Cost" value={fmtUsd(result.totalCost)} />
              <StatBox label="Overall R:R" value={`${fmt(result.overallRR, 2)}R`} color="var(--accent)" />
              <StatBox
                label="Potential Profit"
                value={fmtUsd(result.potentialProfit)}
                color="var(--profit)"
              />
              <StatBox label="SL Loss" value={fmtUsd(result.slLoss)} color="var(--loss)" />
              {mode === "futures" && result.marginNeeded !== undefined && (
                <>
                  <StatBox label="Margin Needed" value={fmtUsd(result.marginNeeded)} />
                  <StatBox
                    label="Loss/Contract"
                    value={fmtUsd(result.lossPerContract ?? 0)}
                    color="var(--loss)"
                  />
                </>
              )}
            </div>

            {/* Breakeven note */}
            {result.breakevenAfterTp1 && (
              <div
                className="text-xs px-3 py-2 rounded-lg font-medium"
                style={{ background: "rgba(74, 144, 217, 0.15)", color: "var(--accent)" }}
              >
                Breakeven after TP1 — TP1 profit covers your full risk.
              </div>
            )}

            {/* TP Analysis table */}
            {result.tpAnalysis.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="text-left py-1 pr-2">Target</th>
                      <th className="text-right py-1 px-2">Price</th>
                      <th className="text-right py-1 px-2">Qty</th>
                      <th className="text-right py-1 px-2">Profit</th>
                      <th className="text-right py-1 px-2">Cum.</th>
                      <th className="text-right py-1 pl-2">R:R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.tpAnalysis.map((tp) => (
                      <tr key={tp.label} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="py-1.5 pr-2 font-semibold" style={{ color: "var(--profit)" }}>
                          {tp.label}
                        </td>
                        <td className="text-right py-1.5 px-2">{fmt(tp.price)}</td>
                        <td className="text-right py-1.5 px-2">{tp.shares}</td>
                        <td className="text-right py-1.5 px-2" style={{ color: "var(--profit)" }}>
                          {fmtUsd(tp.profit)}
                        </td>
                        <td className="text-right py-1.5 px-2" style={{ color: "var(--profit)" }}>
                          {fmtUsd(tp.cumProfit)}
                        </td>
                        <td className="text-right py-1.5 pl-2">{fmt(tp.rr, 1)}R</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Price bar */}
            {priceBar}

            {/* Tags */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PREDEFINED_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
                      style={{
                        background: active ? "var(--accent)" : "var(--input-bg)",
                        color: active ? "#fff" : "var(--text)",
                        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Why did you take this trade? What's your thesis?"
                className="w-full mt-1 rounded-lg p-2.5 text-sm resize-none"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  minHeight: "80px",
                }}
                rows={3}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={copyResult}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Copy
              </button>
              <button
                onClick={saveTrade}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: "var(--profit)", color: "#fff" }}
              >
                Save Trade
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// ── StatBox sub-component ───────────────────────────────────

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: "var(--input-bg)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="text-sm font-bold mt-0.5" style={{ color: color || "var(--text)" }}>
        {value}
      </div>
    </div>
  );
}
