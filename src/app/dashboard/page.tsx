"use client";

import { useState, useEffect, useMemo } from "react";
import BottomNav from "@/components/BottomNav";

interface LocalTrade {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  status: "open" | "closed";
  pnl?: number;
  risk?: number;
  rr?: number;
  tags?: string[];
}

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => (n >= 0 ? "+$" : "-$") + fmt(Math.abs(n));

export default function DashboardPage() {
  const [trades, setTrades] = useState<LocalTrade[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("eztrade_trades");
    if (raw) {
      try {
        setTrades(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const closed = useMemo(() => trades.filter((t) => t.status === "closed" && t.pnl !== undefined), [trades]);

  const stats = useMemo(() => {
    const wins = closed.filter((t) => (t.pnl ?? 0) > 0);
    const losses = closed.filter((t) => (t.pnl ?? 0) < 0);
    const breakevens = closed.filter((t) => (t.pnl ?? 0) === 0);
    const totalPnl = closed.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    const avgRR =
      closed.length > 0
        ? closed.reduce((sum, t) => sum + (t.rr ?? 0), 0) / closed.length
        : 0;
    const avgWin =
      wins.length > 0 ? wins.reduce((s, t) => s + (t.pnl ?? 0), 0) / wins.length : 0;
    const avgLoss =
      losses.length > 0
        ? losses.reduce((s, t) => s + (t.pnl ?? 0), 0) / losses.length
        : 0;
    const bestWin = wins.length > 0 ? Math.max(...wins.map((t) => t.pnl ?? 0)) : 0;
    const worstLoss =
      losses.length > 0 ? Math.min(...losses.map((t) => t.pnl ?? 0)) : 0;

    let streak = 0;
    let streakType: "W" | "L" | "" = "";
    for (const t of closed) {
      const pnl = t.pnl ?? 0;
      if (pnl === 0) continue;
      const type = pnl > 0 ? "W" : "L";
      if (!streakType) {
        streakType = type;
        streak = 1;
      } else if (type === streakType) {
        streak++;
      } else {
        break;
      }
    }

    return {
      total: trades.length,
      open: trades.filter((t) => t.status === "open").length,
      closedCount: closed.length,
      wins: wins.length,
      losses: losses.length,
      breakevens: breakevens.length,
      totalPnl,
      winRate,
      avgRR,
      avgWin,
      avgLoss,
      bestWin,
      worstLoss,
      streak,
      streakType,
    };
  }, [trades, closed]);

  return (
    <div className="flex-1 pb-nav">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <h1 className="text-lg font-bold" style={{ color: "var(--accent)" }}>
          Dashboard
        </h1>

        {trades.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--muted)" }}>
            <p className="text-sm">No stats yet</p>
            <p className="text-xs mt-1">Close some trades to see your performance.</p>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card label="Total Trades" value={String(stats.total)} />
              <Card
                label="Win Rate"
                value={`${fmt(stats.winRate, 1)}%`}
                color={stats.winRate >= 50 ? "var(--profit)" : "var(--loss)"}
              />
              <Card
                label="Total P&L"
                value={fmtUsd(stats.totalPnl)}
                color={stats.totalPnl >= 0 ? "var(--profit)" : "var(--loss)"}
              />
              <Card label="Avg R:R" value={`${fmt(stats.avgRR, 1)}R`} color="var(--accent)" />
            </div>

            {/* Wins / Losses / BE */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
                Trade Outcomes
              </div>
              <div className="flex gap-4">
                <OutcomeBox label="Wins" count={stats.wins} color="var(--profit)" />
                <OutcomeBox label="Losses" count={stats.losses} color="var(--loss)" />
                <OutcomeBox label="B/E" count={stats.breakevens} color="var(--warn)" />
                <OutcomeBox label="Open" count={stats.open} color="var(--accent)" />
              </div>
              {stats.closedCount > 0 && (
                <div className="mt-3 h-3 rounded-full overflow-hidden flex" style={{ background: "var(--input-bg)" }}>
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${(stats.wins / stats.closedCount) * 100}%`,
                      background: "var(--profit)",
                    }}
                  />
                  <div
                    className="h-full"
                    style={{
                      width: `${(stats.breakevens / stats.closedCount) * 100}%`,
                      background: "var(--warn)",
                    }}
                  />
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${(stats.losses / stats.closedCount) * 100}%`,
                      background: "var(--loss)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Streak */}
            {stats.streak > 0 && (
              <div
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  Recent Streak
                </span>
                <span
                  className="text-lg font-bold"
                  style={{
                    color: stats.streakType === "W" ? "var(--profit)" : "var(--loss)",
                  }}
                >
                  {stats.streak}{stats.streakType}
                </span>
              </div>
            )}

            {/* Detailed stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card
                label="Best Win"
                value={stats.bestWin > 0 ? fmtUsd(stats.bestWin) : "--"}
                color="var(--profit)"
              />
              <Card
                label="Worst Loss"
                value={stats.worstLoss < 0 ? fmtUsd(stats.worstLoss) : "--"}
                color="var(--loss)"
              />
              <Card
                label="Avg Win"
                value={stats.avgWin > 0 ? fmtUsd(stats.avgWin) : "--"}
                color="var(--profit)"
              />
              <Card
                label="Avg Loss"
                value={stats.avgLoss < 0 ? fmtUsd(stats.avgLoss) : "--"}
                color="var(--loss)"
              />
            </div>

            {/* ── Equity Curve ──────────────────────────────────── */}
            <EquityCurve trades={closed} />

            {/* ── Calendar Heatmap ─────────────────────────────── */}
            <CalendarHeatmap trades={closed} />

            {/* ── Performance by Tag ───────────────────────────── */}
            <PerformanceByTag trades={closed} />

            {/* ── R-Multiple Distribution ──────────────────────── */}
            <RMultipleDistribution trades={closed} />
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

// ── Equity Curve ─────────────────────────────────────────────────────────────

function EquityCurve({ trades }: { trades: LocalTrade[] }) {
  const data = useMemo(() => {
    if (trades.length === 0) return null;

    // Sort closed trades by exit date (or entry date) ascending
    const sorted = [...trades].sort((a, b) => {
      const da = a.exitDate || a.entryDate;
      const db = b.exitDate || b.entryDate;
      return da.localeCompare(db);
    });

    let cumPnl = 0;
    const points = sorted.map((t, i) => {
      cumPnl += t.pnl ?? 0;
      return {
        x: i,
        y: cumPnl,
        date: t.exitDate || t.entryDate,
        pnl: t.pnl ?? 0,
      };
    });

    return points;
  }, [trades]);

  if (!data || data.length < 2) return null;

  const W = 320;
  const H = 140;
  const PAD_X = 35;
  const PAD_Y = 15;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_Y * 2;

  const minY = Math.min(0, ...data.map((d) => d.y));
  const maxY = Math.max(0, ...data.map((d) => d.y));
  const rangeY = maxY - minY || 1;

  const scaleX = (i: number) => PAD_X + (i / (data.length - 1)) * plotW;
  const scaleY = (v: number) => PAD_Y + plotH - ((v - minY) / rangeY) * plotH;

  // Build path
  const pathParts = data.map((d, i) => {
    const x = scaleX(i).toFixed(1);
    const y = scaleY(d.y).toFixed(1);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  });
  const linePath = pathParts.join(" ");

  // Area fill — close path to the zero line
  const zeroY = scaleY(0);
  const areaPath = `${linePath} L${scaleX(data.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${scaleX(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

  const finalPnl = data[data.length - 1].y;
  const lineColor = finalPnl >= 0 ? "var(--profit)" : "var(--loss)";
  const fillOpacity = 0.15;

  // Y axis labels
  const yLabels = [maxY, (maxY + minY) / 2, minY].map((v) => ({
    v,
    y: scaleY(v),
    label: `$${Math.round(v)}`,
  }));

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
        Equity Curve
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {/* Zero line */}
        <line
          x1={PAD_X}
          y1={zeroY}
          x2={W - PAD_X}
          y2={zeroY}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        {/* Y labels */}
        {yLabels.map((l, i) => (
          <text
            key={i}
            x={PAD_X - 4}
            y={l.y + 3}
            textAnchor="end"
            fontSize="8"
            fill="var(--muted)"
          >
            {l.label}
          </text>
        ))}
        {/* Area fill */}
        <path d={areaPath} fill={lineColor} opacity={fillOpacity} />
        {/* Line */}
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* End dot */}
        <circle
          cx={scaleX(data.length - 1)}
          cy={scaleY(finalPnl)}
          r="3"
          fill={lineColor}
        />
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          {data[0].date}
        </span>
        <span className="text-[10px] font-semibold" style={{ color: lineColor }}>
          {fmtUsd(finalPnl)}
        </span>
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          {data[data.length - 1].date}
        </span>
      </div>
    </div>
  );
}

// ── Calendar Heatmap ─────────────────────────────────────────────────────────

function CalendarHeatmap({ trades }: { trades: LocalTrade[] }) {
  const { days, months } = useMemo(() => {
    // Build a map: date string -> daily P&L
    const dailyPnl = new Map<string, number>();
    for (const t of trades) {
      const d = t.exitDate || t.entryDate;
      dailyPnl.set(d, (dailyPnl.get(d) ?? 0) + (t.pnl ?? 0));
    }

    const today = new Date();
    const daysList: { date: string; pnl: number | null; isFuture: boolean }[] = [];
    const monthSet = new Map<string, number>(); // month label -> first column index

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const isFuture = d > today;
      const pnl = dailyPnl.get(dateStr) ?? null;
      daysList.push({ date: dateStr, pnl, isFuture });

      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      const col = Math.floor((89 - i) / 7);
      if (!monthSet.has(monthLabel)) {
        monthSet.set(monthLabel, col);
      }
    }

    return {
      days: daysList,
      months: Array.from(monthSet.entries()),
    };
  }, [trades]);

  if (trades.length === 0) return null;

  const CELL = 10;
  const GAP = 2;
  const COLS = Math.ceil(90 / 7);
  const ROWS = 7;
  const svgW = COLS * (CELL + GAP) + 10;
  const svgH = ROWS * (CELL + GAP) + 18;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
        90-Day Calendar
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
        {/* Month labels */}
        {months.map(([label, col]) => (
          <text
            key={label + col}
            x={col * (CELL + GAP)}
            y={8}
            fontSize="7"
            fill="var(--muted)"
          >
            {label}
          </text>
        ))}
        {/* Day cells */}
        {days.map((day, i) => {
          const col = Math.floor(i / 7);
          const row = i % 7;
          const x = col * (CELL + GAP);
          const y = 12 + row * (CELL + GAP);

          let fill = "var(--input-bg)"; // no trades (gray)
          if (day.isFuture) {
            fill = "var(--border)"; // future (dark)
          } else if (day.pnl !== null) {
            if (day.pnl > 0) fill = "var(--profit)";
            else if (day.pnl < 0) fill = "var(--loss)";
            else fill = "var(--warn)";
          }

          return (
            <rect
              key={day.date}
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              rx={2}
              fill={fill}
              opacity={day.isFuture ? 0.3 : day.pnl !== null ? 0.85 : 0.3}
            >
              <title>{`${day.date}: ${day.pnl !== null ? fmtUsd(day.pnl) : "No trades"}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="flex gap-3 mt-1 justify-end">
        <Legend color="var(--profit)" label="Profit" />
        <Legend color="var(--loss)" label="Loss" />
        <Legend color="var(--input-bg)" label="None" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-sm" style={{ background: color, opacity: 0.85 }} />
      <span className="text-[9px]" style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

// ── Performance by Tag ───────────────────────────────────────────────────────

function PerformanceByTag({ trades }: { trades: LocalTrade[] }) {
  const tagStats = useMemo(() => {
    const map = new Map<string, { wins: number; total: number; totalPnl: number }>();

    for (const t of trades) {
      const tags = t.tags && t.tags.length > 0 ? t.tags : ["Untagged"];
      for (const tag of tags) {
        const existing = map.get(tag) ?? { wins: 0, total: 0, totalPnl: 0 };
        existing.total++;
        if ((t.pnl ?? 0) > 0) existing.wins++;
        existing.totalPnl += t.pnl ?? 0;
        map.set(tag, existing);
      }
    }

    return Array.from(map.entries())
      .map(([tag, s]) => ({
        tag,
        winRate: s.total > 0 ? (s.wins / s.total) * 100 : 0,
        avgPnl: s.total > 0 ? s.totalPnl / s.total : 0,
        count: s.total,
      }))
      .sort((a, b) => b.count - a.count);
  }, [trades]);

  // Only show if there are tagged trades (more than just "Untagged")
  const hasTags = tagStats.some((s) => s.tag !== "Untagged");
  if (!hasTags && tagStats.length <= 1) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
        Performance by Tag
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="text-left py-1 pr-2">Tag</th>
              <th className="text-right py-1 px-2">Trades</th>
              <th className="text-right py-1 px-2">Win %</th>
              <th className="text-right py-1 pl-2">Avg P&L</th>
            </tr>
          </thead>
          <tbody>
            {tagStats.map((s) => (
              <tr key={s.tag} style={{ borderTop: "1px solid var(--border)" }}>
                <td className="py-1.5 pr-2 font-semibold">{s.tag}</td>
                <td className="text-right py-1.5 px-2">{s.count}</td>
                <td
                  className="text-right py-1.5 px-2"
                  style={{ color: s.winRate >= 50 ? "var(--profit)" : "var(--loss)" }}
                >
                  {fmt(s.winRate, 1)}%
                </td>
                <td
                  className="text-right py-1.5 pl-2"
                  style={{ color: s.avgPnl >= 0 ? "var(--profit)" : "var(--loss)" }}
                >
                  {fmtUsd(s.avgPnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── R-Multiple Distribution ──────────────────────────────────────────────────

function RMultipleDistribution({ trades }: { trades: LocalTrade[] }) {
  const buckets = useMemo(() => {
    const ranges = [
      { label: "< 0R", min: -Infinity, max: 0, count: 0, color: "var(--loss)" },
      { label: "0-1R", min: 0, max: 1, count: 0, color: "var(--warn)" },
      { label: "1-2R", min: 1, max: 2, count: 0, color: "var(--profit)" },
      { label: "2-3R", min: 2, max: 3, count: 0, color: "var(--profit)" },
      { label: "3R+", min: 3, max: Infinity, count: 0, color: "var(--accent)" },
    ];

    for (const t of trades) {
      const r = t.rr ?? 0;
      for (const b of ranges) {
        if (r >= b.min && r < b.max) {
          b.count++;
          break;
        }
      }
    }

    // Special case: trades with exactly 0R go to the 0-1R bucket, not < 0R
    // Already handled since 0 >= 0 and 0 < 1

    return ranges;
  }, [trades]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  if (trades.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>
        R-Multiple Distribution
      </div>
      <div className="space-y-2">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-[10px] font-semibold w-8 text-right" style={{ color: "var(--muted)" }}>
              {b.label}
            </span>
            <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: "var(--input-bg)" }}>
              <div
                className="h-full rounded flex items-center pl-1.5"
                style={{
                  width: `${Math.max((b.count / maxCount) * 100, b.count > 0 ? 8 : 0)}%`,
                  background: b.color,
                  opacity: 0.85,
                  transition: "width 0.3s ease",
                }}
              >
                {b.count > 0 && (
                  <span className="text-[9px] font-bold text-white">{b.count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Card({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="text-base font-bold mt-0.5" style={{ color: color || "var(--text)" }}>
        {value}
      </div>
    </div>
  );
}

function OutcomeBox({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex-1 text-center">
      <div className="text-xl font-bold" style={{ color }}>
        {count}
      </div>
      <div className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
