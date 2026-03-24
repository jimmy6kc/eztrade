"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";

// ── Types ─────────────────────────────────────────────────────

interface Strategy {
  id: string;
  name: string;
  direction: "long" | "short";
  risk: number;
  slPct: number;
  tps: { label: string; pricePct: number; pct: number }[];
}

const DEFAULT_STRATEGIES: Strategy[] = [
  {
    id: "default-breakout",
    name: "Breakout",
    direction: "long",
    risk: 200,
    slPct: 1.5,
    tps: [
      { label: "T1", pricePct: 2, pct: 40 },
      { label: "T2", pricePct: 4, pct: 35 },
      { label: "T3", pricePct: 6, pct: 25 },
    ],
  },
  {
    id: "default-scalp",
    name: "Scalp",
    direction: "long",
    risk: 100,
    slPct: 0.5,
    tps: [
      { label: "T1", pricePct: 0.5, pct: 50 },
      { label: "T2", pricePct: 1, pct: 50 },
    ],
  },
  {
    id: "default-swing",
    name: "Swing",
    direction: "long",
    risk: 300,
    slPct: 3,
    tps: [
      { label: "T1", pricePct: 4, pct: 30 },
      { label: "T2", pricePct: 7, pct: 30 },
      { label: "T3", pricePct: 10, pct: 25 },
      { label: "T4", pricePct: 15, pct: 15 },
    ],
  },
];

const STORAGE_KEY = "eztrade_strategies";

// ── Component ─────────────────────────────────────────────────

export default function StrategiesPage() {
  const { T } = useI18n();
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [risk, setRisk] = useState(100);
  const [slPct, setSlPct] = useState(1);
  const [tpInputs, setTpInputs] = useState([
    { pricePct: 2, pct: 40 },
    { pricePct: 4, pct: 35 },
    { pricePct: 6, pct: 25 },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setStrategies(parsed.length > 0 ? parsed : DEFAULT_STRATEGIES);
      } catch {
        setStrategies(DEFAULT_STRATEGIES);
      }
    } else {
      setStrategies(DEFAULT_STRATEGIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STRATEGIES));
    }
  }, []);

  const persist = (updated: Strategy[]) => {
    setStrategies(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addStrategy = () => {
    if (!name.trim()) return;
    const s: Strategy = {
      id: Date.now().toString(),
      name: name.trim(),
      direction,
      risk,
      slPct,
      tps: tpInputs.map((t, i) => ({ label: `T${i + 1}`, ...t })),
    };
    persist([s, ...strategies]);
    setShowForm(false);
    setName("");
  };

  const deleteStrategy = (id: string) => {
    if (!confirm("Delete this strategy?")) return;
    persist(strategies.filter((s) => s.id !== id));
  };

  const useStrategy = (s: Strategy) => {
    // Store strategy params for the calculator to pick up
    localStorage.setItem(
      "eztrade_apply_strategy",
      JSON.stringify({
        direction: s.direction,
        risk: s.risk,
        slPct: s.slPct,
        tps: s.tps,
      })
    );
    router.push("/");
  };

  return (
    <div className="flex-1 pb-nav">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            {T("templates")}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {showForm ? T("cancel") : T("save_as_template")}
          </button>
        </div>

        {/* New strategy form */}
        {showForm && (
          <div
            className="rounded-xl p-4 space-y-3 animate-fade-in"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={T("tpl_name")}
              className="w-full"
            />
            <div className="flex gap-2">
              {(["long", "short"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    background: direction === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--input-bg)",
                    color: direction === d ? "#fff" : "var(--text)",
                    border: `1px solid ${direction === d ? "transparent" : "var(--border)"}`,
                  }}
                >
                  {d === "long" ? T("long") : T("short")}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>{T("risk_amount")}</label>
                <input
                  type="number"
                  value={risk}
                  onChange={(e) => setRisk(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>{T("sl_pct")}</label>
                <input
                  type="number"
                  value={slPct}
                  onChange={(e) => setSlPct(Number(e.target.value))}
                  className="w-full mt-1"
                  step="0.1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs" style={{ color: "var(--muted)" }}>{T("tp_targets")}</label>
              {tpInputs.map((tp, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs font-bold w-6" style={{ color: "var(--profit)" }}>
                    T{i + 1}
                  </span>
                  <input
                    type="number"
                    value={tp.pricePct}
                    onChange={(e) => {
                      const next = [...tpInputs];
                      next[i] = { ...next[i], pricePct: Number(e.target.value) };
                      setTpInputs(next);
                    }}
                    placeholder="% away"
                    className="flex-1"
                    step="0.1"
                  />
                  <input
                    type="number"
                    value={tp.pct}
                    onChange={(e) => {
                      const next = [...tpInputs];
                      next[i] = { ...next[i], pct: Number(e.target.value) };
                      setTpInputs(next);
                    }}
                    placeholder="Sell %"
                    className="w-16"
                  />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>%</span>
                </div>
              ))}
              <div className="flex gap-2">
                {tpInputs.length < 5 && (
                  <button
                    onClick={() => setTpInputs([...tpInputs, { pricePct: 0, pct: 0 }])}
                    className="text-xs"
                    style={{ color: "var(--accent)" }}
                  >
                    {T("add_tp")}
                  </button>
                )}
                {tpInputs.length > 1 && (
                  <button
                    onClick={() => setTpInputs(tpInputs.slice(0, -1))}
                    className="text-xs"
                    style={{ color: "var(--loss)" }}
                  >
                    {T("remove_tp")}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={addStrategy}
              className="w-full py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {T("create_tpl")}
            </button>
          </div>
        )}

        {/* Strategy list */}
        {strategies.length === 0 && !showForm && (
          <div className="text-center py-12" style={{ color: "var(--muted)" }}>
            <p className="text-sm">{T("no_templates")}</p>
          </div>
        )}

        <div className="space-y-2">
          {strategies.map((s) => (
            <div
              key={s.id}
              className="rounded-xl p-4 animate-fade-in"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{s.name}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background:
                        s.direction === "long" ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)",
                      color: s.direction === "long" ? "var(--profit)" : "var(--loss)",
                    }}
                  >
                    {s.direction === "long" ? T("long") : T("short")}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  Risk: ${s.risk}
                </span>
              </div>

              <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--muted)" }}>
                <span>SL: {s.slPct}%</span>
                <span>
                  TPs:{" "}
                  {s.tps
                    .map((t) => `${t.pricePct}%`)
                    .join(", ")}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => useStrategy(s)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {T("use_template")}
                </button>
                <button
                  onClick={() => deleteStrategy(s.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: "rgba(244,67,54,0.15)", color: "var(--loss)" }}
                >
                  {T("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
