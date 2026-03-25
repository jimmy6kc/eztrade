"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { calculate, type CalcInput, type CalcResult, type TpInput } from "@/lib/calculate";
import { CONTRACTS, type ContractSymbol } from "@/lib/contracts";

/* ── Helpers ───────────────────────────────────────────────────── */

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => "$" + fmt(n);

const RISK_PRESETS = [50, 100, 150, 200, 300, 500];
const DEFAULT_TP_PCTS = [40, 25, 20, 10, 5];

/* ── Component ─────────────────────────────────────────────────── */

export default function CalcDemoPage() {
  // Mode
  const [mode, setMode] = useState<"stock" | "futures">("stock");
  const [dir, setDir] = useState<"long" | "short">("long");

  // Core fields
  const [riskAmount, setRiskAmount] = useState(100);
  const [entry, setEntry] = useState<string>("");
  const [sl, setSl] = useState<string>("");
  const [contract, setContract] = useState<ContractSymbol>("MNQ");

  // TPs
  const [tpCount, setTpCount] = useState(3);
  const [tpPrices, setTpPrices] = useState<string[]>(["", "", "", "", ""]);
  const [tpPcts, setTpPcts] = useState<number[]>([...DEFAULT_TP_PCTS]);

  // Results
  const [result, setResult] = useState<CalcResult | null>(null);

  // ── TP auto-distribution ────────────────────────────────────
  const adjustTpPcts = useCallback((count: number) => {
    const pcts = [0, 0, 0, 0, 0];
    const base = Math.floor(100 / count);
    const sumOfFirst = base * (count - 1);
    for (let i = 0; i < 5; i++) {
      if (i < count - 1) pcts[i] = base;
      else if (i === count - 1) pcts[i] = 100 - sumOfFirst;
      else pcts[i] = 0;
    }
    setTpPcts(pcts);
  }, []);

  // ── Calculate ─────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
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
        activeTps.push({ label: `T${i + 1}`, price: p, pct: tpPcts[i] });
      }
    }

    const input: CalcInput = {
      type: mode,
      dir,
      entry: entryNum,
      sl: slNum,
      riskAmount,
      fee: 0,
      tps: activeTps,
      ...(mode === "futures" ? { contract } : {}),
    };

    setResult(calculate(input));
  }, [entry, sl, tpCount, tpPrices, tpPcts, mode, dir, riskAmount, contract]);

  // ── TP helpers ────────────────────────────────────────────
  const setTpPrice = (i: number, v: string) => {
    const next = [...tpPrices];
    next[i] = v;
    setTpPrices(next);
  };

  const setTpPct = (i: number, v: number) => {
    const next = [...tpPcts];
    next[i] = Math.max(0, Math.min(100, v));
    const lastIdx = tpCount - 1;
    if (tpCount > 1) {
      let sumExceptLast = 0;
      for (let j = 0; j < lastIdx; j++) sumExceptLast += next[j];
      next[lastIdx] = sumExceptLast > 100 ? 0 : 100 - sumExceptLast;
    }
    setTpPcts(next);
  };

  // ── Copy result ─────────────────────────────────────────
  const copyResult = () => {
    if (!result) return;
    const lines = [
      `${dir.toUpperCase()} | ${mode === "futures" ? contract : "Stock"}`,
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(15,25,35,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "var(--accent)", fontSize: 18, fontWeight: 800, textDecoration: "none", letterSpacing: "-0.02em" }}>
            EZtrade
          </Link>
          <Link
            href="/login"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 8,
            }}
          >
            Sign In
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 80px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.02em" }}>
          Position Size Calculator
        </h1>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
          Free demo &mdash; no account required. Calculate position size and R:R instantly.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["stock", "futures"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  background: mode === m ? "var(--accent)" : "var(--card)",
                  color: mode === m ? "#fff" : "var(--text)",
                  border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {m === "stock" ? "Stocks" : "Futures"}
              </button>
            ))}
          </div>

          {/* Direction */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>Direction</label>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {(["long", "short"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDir(d)}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: dir === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--card)",
                    color: dir === d ? "#fff" : "var(--text)",
                    border: `1px solid ${dir === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--border)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
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
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>Contract</label>
              <select
                value={contract}
                onChange={(e) => setContract(e.target.value as ContractSymbol)}
                style={{ width: "100%", marginTop: 4 }}
              >
                {Object.keys(CONTRACTS).map((sym) => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
            </div>
          )}

          {/* Risk presets */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
              Risk ($) <span style={{ color: "var(--loss)" }}>*</span>
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {RISK_PRESETS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskAmount(r)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: riskAmount === r ? "var(--accent)" : "var(--card)",
                    color: riskAmount === r ? "#fff" : "var(--text)",
                    border: `1px solid ${riskAmount === r ? "var(--accent)" : "var(--border)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
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
              style={{ width: "100%", marginTop: 8 }}
              min={1}
            />
          </div>

          {/* Entry / SL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
                Entry Price ($) <span style={{ color: "var(--loss)" }}>*</span>
              </label>
              <input
                type="number"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", marginTop: 4 }}
                step="any"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
                SL Price ($) <span style={{ color: "var(--loss)" }}>*</span>
              </label>
              <input
                type="number"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", marginTop: 4 }}
                step="any"
              />
            </div>
          </div>

          {/* TP Targets */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
                TP Targets (optional)
              </label>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setTpCount(n);
                      adjustTpPcts(n);
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      background: tpCount === n ? "var(--accent)" : "var(--card)",
                      color: tpCount === n ? "#fff" : "var(--text)",
                      border: `1px solid ${tpCount === n ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {Array.from({ length: tpCount }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, width: 24, color: "var(--profit)" }}>
                    T{i + 1}
                  </span>
                  <input
                    type="number"
                    value={tpPrices[i]}
                    onChange={(e) => setTpPrice(i, e.target.value)}
                    placeholder="Price"
                    style={{ flex: 1 }}
                    step="any"
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="number"
                      value={tpPcts[i]}
                      onChange={(e) => setTpPct(i, Number(e.target.value))}
                      style={{
                        width: 56,
                        textAlign: "center",
                        ...(tpCount > 1 && i === tpCount - 1 ? { opacity: 0.6, fontStyle: "italic" } : {}),
                      }}
                      min={0}
                      max={100}
                      disabled={tpCount > 1 && i === tpCount - 1}
                    />
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s, transform 0.15s",
            }}
          >
            Calculate
          </button>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        {result && (
          <div className="animate-fade-in" style={{ marginTop: 20 }}>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Results</span>
                <button
                  onClick={copyResult}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {mode === "futures" ? "Contracts" : "Shares"}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{result.qty}</div>
                </div>
                <div style={{ background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Overall R:R</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
                    {fmt(result.overallRR, 2)}R
                  </div>
                </div>
                <div style={{ background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Potential Profit</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--profit)" }}>
                    {fmtUsd(result.potentialProfit)}
                  </div>
                </div>
                <div style={{ background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Actual Risk</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--loss)" }}>
                    {fmtUsd(result.actualRisk)}
                  </div>
                </div>
              </div>

              {mode === "stock" && (
                <div style={{ marginTop: 10, background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Total Cost</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{fmtUsd(result.totalCost)}</div>
                </div>
              )}

              {mode === "futures" && result.marginNeeded && (
                <div style={{ marginTop: 10, background: "var(--input-bg)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Margin Needed</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{fmtUsd(result.marginNeeded)}</div>
                </div>
              )}

              {/* TP breakdown */}
              {result.tpAnalysis.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
                    Take Profit Breakdown
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {result.tpAnalysis.map((tp) => (
                      <div
                        key={tp.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "var(--input-bg)",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 12,
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "var(--profit)" }}>{tp.label}</span>
                        <span style={{ color: "var(--muted)" }}>
                          ${fmt(tp.price)} ({tp.pct}%) &mdash; {tp.shares} {mode === "futures" ? "ct" : "sh"}
                        </span>
                        <span style={{ fontWeight: 700 }}>
                          {fmtUsd(tp.profit)} <span style={{ color: "var(--accent)", fontSize: 10 }}>{fmt(tp.rr, 1)}R</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.breakevenAfterTp1 && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--profit)",
                        background: "rgba(76,175,80,0.1)",
                        padding: "6px 10px",
                        borderRadius: 6,
                        textAlign: "center",
                      }}
                    >
                      Breakeven after T1 hit
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                padding: "20px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Want to save your trades?
              </p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
                Sign up free to save trades, track stats, get live prices, and sync across devices.
              </p>
              <Link
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "10px 28px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  background: "var(--accent)",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
              >
                Sign up free &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
