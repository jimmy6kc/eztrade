"use client";

import { useState, useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n-context";

// ── Types ─────────────────────────────────────────────────────

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
  slPrice?: number;
  risk?: number;
  rr?: number;
  pnl?: number;
  tps?: { label: string; price: number; pct: number }[];
  mode?: string;
  contract?: string;
  notes?: string;
  tags?: string[];
}

type Filter = "all" | "open" | "closed";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => "$" + fmt(n);

const PREDEFINED_TAGS = ["Breakout", "Scalp", "Swing", "Earnings", "Reversal", "Momentum", "Gap", "Custom"];

const TAG_COLORS: Record<string, string> = {
  Breakout: "#2196F3",
  Scalp: "#9C27B0",
  Swing: "#FF9800",
  Earnings: "#4CAF50",
  Reversal: "#F44336",
  Momentum: "#00BCD4",
  Gap: "#FF5722",
  Custom: "#607D8B",
};

// ── Component ─────────────────────────────────────────────────

export default function LogPage() {
  const { T } = useI18n();
  const [trades, setTrades] = useState<LocalTrade[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [closeModal, setCloseModal] = useState<string | null>(null);
  const [exitPrice, setExitPrice] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  // Edit modal state
  const [editModal, setEditModal] = useState<string | null>(null);
  const [editSymbol, setEditSymbol] = useState("");
  const [editDirection, setEditDirection] = useState<"long" | "short">("long");
  const [editEntry, setEditEntry] = useState("");
  const [editSl, setEditSl] = useState("");
  const [editExit, setEditExit] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<"open" | "closed">("open");

  // Load trades from localStorage
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

  // Persist
  const persist = (updated: LocalTrade[]) => {
    setTrades(updated);
    localStorage.setItem("eztrade_trades", JSON.stringify(updated));
  };

  // Filter
  const filtered = useMemo(() => {
    let result = trades;
    if (filter !== "all") {
      result = result.filter((t) => t.status === filter);
    }
    if (tagFilter) {
      result = result.filter((t) => t.tags?.includes(tagFilter));
    }
    return result;
  }, [trades, filter, tagFilter]);

  // All unique tags present on trades
  const allUsedTags = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => t.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [trades]);

  // Toggle note expansion
  const toggleNotes = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Open edit modal
  const openEditModal = (t: LocalTrade) => {
    setEditModal(t.id);
    setEditSymbol(t.symbol);
    setEditDirection(t.direction);
    setEditEntry(String(t.entryPrice));
    setEditSl(t.slPrice ? String(t.slPrice) : "");
    setEditExit(t.exitPrice ? String(t.exitPrice) : "");
    setEditQty(String(t.quantity));
    setEditNotes(t.notes || "");
    setEditTags(t.tags ? [...t.tags] : []);
    setEditStatus(t.status);
  };

  // Save edit
  const saveEdit = () => {
    if (!editModal) return;
    const entryNum = parseFloat(editEntry);
    const qtyNum = parseFloat(editQty);
    if (!entryNum || !qtyNum) return;

    const exitNum = parseFloat(editExit) || undefined;
    const slNum = parseFloat(editSl) || undefined;

    const updated = trades.map((t) => {
      if (t.id !== editModal) return t;

      let pnl = t.pnl;
      if (editStatus === "closed" && exitNum) {
        pnl =
          editDirection === "long"
            ? (exitNum - entryNum) * qtyNum
            : (entryNum - exitNum) * qtyNum;
      } else if (editStatus === "open") {
        pnl = undefined;
      }

      return {
        ...t,
        symbol: editSymbol,
        direction: editDirection,
        entryPrice: entryNum,
        exitPrice: editStatus === "closed" ? exitNum : undefined,
        quantity: qtyNum,
        slPrice: slNum,
        notes: editNotes.trim() || undefined,
        tags: editTags.length > 0 ? editTags : undefined,
        status: editStatus,
        pnl,
        exitDate: editStatus === "closed" && exitNum ? (t.exitDate || new Date().toISOString().slice(0, 10)) : undefined,
      };
    });
    persist(updated);
    setEditModal(null);
  };

  // Toggle edit tag
  const toggleEditTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Close trade
  const closeTrade = () => {
    if (!closeModal) return;
    const ep = parseFloat(exitPrice);
    if (!ep) return;

    const updated = trades.map((t) => {
      if (t.id !== closeModal) return t;
      const rawPnl =
        t.direction === "long"
          ? (ep - t.entryPrice) * t.quantity
          : (t.entryPrice - ep) * t.quantity;
      return {
        ...t,
        exitPrice: ep,
        exitDate: new Date().toISOString().slice(0, 10),
        status: "closed" as const,
        pnl: rawPnl,
      };
    });
    persist(updated);
    setCloseModal(null);
    setExitPrice("");
  };

  // Delete trade
  const deleteTrade = (id: string) => {
    if (!confirm("Delete this trade?")) return;
    persist(trades.filter((t) => t.id !== id));
  };

  // CSV export
  const exportCSV = () => {
    const headers = ["Symbol", "Direction", "Entry", "Exit", "Qty", "Date", "Status", "P&L", "Tags", "Notes"];
    const rows = trades.map((t) => [
      t.symbol,
      t.direction,
      t.entryPrice,
      t.exitPrice ?? "",
      t.quantity,
      t.entryDate,
      t.status,
      t.pnl ?? "",
      (t.tags || []).join(";"),
      (t.notes || "").replace(/,/g, " "),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eztrade_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Backup
  const backup = () => {
    const data = localStorage.getItem("eztrade_trades") || "[]";
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eztrade_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import
  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result as string);
          if (Array.isArray(imported)) {
            persist([...imported, ...trades]);
          }
        } catch {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Status badge
  const getStatus = (t: LocalTrade) => {
    if (t.status === "open") return "open";
    if (t.pnl !== undefined) {
      if (t.pnl > 0) return "win";
      if (t.pnl < 0) return "loss";
      return "be";
    }
    return "closed";
  };

  return (
    <div className="flex-1 pb-nav">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            {T("trade_log")}
          </h1>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {trades.length} trades
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {(["all", "open", "closed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                background: filter === f ? "var(--accent)" : "var(--card)",
                color: filter === f ? "#fff" : "var(--text)",
                border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {f === "all" ? T("filter_all") : f === "open" ? T("filter_open") : T("filter_closed")}
            </button>
          ))}
          {/* Tag filter divider */}
          {allUsedTags.length > 0 && (
            <span
              className="self-center mx-1"
              style={{ color: "var(--border)", fontSize: "16px" }}
            >
              |
            </span>
          )}
          {allUsedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
              style={{
                background: tagFilter === tag ? (TAG_COLORS[tag] || "var(--accent)") : "var(--card)",
                color: tagFilter === tag ? "#fff" : TAG_COLORS[tag] || "var(--text)",
                border: `1px solid ${tagFilter === tag ? (TAG_COLORS[tag] || "var(--accent)") : "var(--border)"}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Trade cards */}
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--muted)" }}>
            <p className="text-sm">{T("no_trades")}</p>
            <p className="text-xs mt-1">{T("no_trades_hint")}</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((t) => {
            const status = getStatus(t);
            const hasNotes = !!t.notes;
            const isNotesExpanded = expandedNotes.has(t.id);
            return (
              <div
                key={t.id}
                className="rounded-xl p-3 animate-fade-in"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{t.symbol || "\u2014"}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: t.direction === "long" ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)",
                        color: t.direction === "long" ? "var(--profit)" : "var(--loss)",
                      }}
                    >
                      {t.direction === "long" ? T("long") : T("short")}
                    </span>
                  </div>
                  <span className={`badge badge-${status}`}>
                    {status === "open" ? T("status_open") : status === "win" ? T("status_win") : status === "loss" ? T("status_loss") : status === "be" ? T("status_be") : T("filter_closed")}
                  </span>
                </div>

                {/* Tags */}
                {t.tags && t.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${TAG_COLORS[tag] || "var(--accent)"}20`,
                          color: TAG_COLORS[tag] || "var(--accent)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>
                    <span style={{ color: "var(--muted)" }}>{T("date")}</span>
                    <div className="font-medium">{t.entryDate}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{T("qty")}</span>
                    <div className="font-medium">{t.quantity}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>{T("entry_price")}</span>
                    <div className="font-medium">{fmt(t.entryPrice)}</div>
                  </div>
                  {t.slPrice && (
                    <div>
                      <span style={{ color: "var(--muted)" }}>{T("sl_price")}</span>
                      <div className="font-medium">{fmt(t.slPrice)}</div>
                    </div>
                  )}
                  {t.risk && (
                    <div>
                      <span style={{ color: "var(--muted)" }}>{T("risk_amount")}</span>
                      <div className="font-medium">{fmtUsd(t.risk)}</div>
                    </div>
                  )}
                  {t.rr && (
                    <div>
                      <span style={{ color: "var(--muted)" }}>{T("rr_ratio")}</span>
                      <div className="font-medium">{fmt(t.rr, 1)}</div>
                    </div>
                  )}
                </div>

                {/* P&L for closed trades */}
                {t.status === "closed" && t.pnl !== undefined && (
                  <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        Exit: {fmt(t.exitPrice!)}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: t.pnl >= 0 ? "var(--profit)" : "var(--loss)" }}
                      >
                        {t.pnl >= 0 ? "+" : ""}
                        {fmtUsd(t.pnl)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes (collapsed by default) */}
                {hasNotes && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleNotes(t.id)}
                      className="flex items-center gap-1 text-[11px] font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-3 h-3 transition-transform ${isNotesExpanded ? "rotate-180" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {T("notes")}
                    </button>
                    {isNotesExpanded && (
                      <div
                        className="mt-1 text-xs p-2 rounded-lg animate-fade-in"
                        style={{
                          background: "var(--input-bg)",
                          color: "var(--text)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {t.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  {t.status === "open" && (
                    <button
                      onClick={() => {
                        setCloseModal(t.id);
                        setExitPrice("");
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      {T("close_trade")}
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(t)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(74,144,217,0.15)", color: "var(--accent)" }}
                  >
                    {T("edit")}
                  </button>
                  <button
                    onClick={() => deleteTrade(t.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(244,67,54,0.15)", color: "var(--loss)" }}
                  >
                    {T("delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            {T("export_csv")}
          </button>
          <button
            onClick={backup}
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            {T("backup_now")}
          </button>
          <button
            onClick={importData}
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            {T("import_data")}
          </button>
        </div>
      </div>

      {/* Close trade modal */}
      {closeModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "var(--overlay)" }}
          onClick={() => setCloseModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl p-5 space-y-4 animate-slide-up"
            style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              {T("close_trade")}
            </h3>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {T("exit_price")}
              </label>
              <input
                type="number"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="0.00"
                className="w-full mt-1"
                step="any"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeTrade}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {T("confirm")}
              </button>
              <button
                onClick={() => setCloseModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                {T("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit trade modal */}
      {editModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "var(--overlay)" }}
          onClick={() => setEditModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl p-5 space-y-3 animate-slide-up overflow-y-auto"
            style={{ background: "var(--card)", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              {T("edit_trade")}
            </h3>

            {/* Symbol */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {T("ticker")}
              </label>
              <input
                type="text"
                value={editSymbol}
                onChange={(e) => setEditSymbol(e.target.value.toUpperCase())}
                className="w-full mt-1"
                autoFocus
              />
            </div>

            {/* Direction */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {T("direction")}
              </label>
              <div className="flex gap-2 mt-1">
                {(["long", "short"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setEditDirection(d)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: editDirection === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--input-bg)",
                      color: editDirection === d ? "#fff" : "var(--text)",
                      border: `1px solid ${editDirection === d ? (d === "long" ? "var(--profit)" : "var(--loss)") : "var(--border)"}`,
                    }}
                  >
                    {d === "long" ? T("long") : T("short")}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry / SL / Exit / Qty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {T("entry_price")}
                </label>
                <input
                  type="number"
                  value={editEntry}
                  onChange={(e) => setEditEntry(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1"
                  step="any"
                />
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {T("sl_price")}
                </label>
                <input
                  type="number"
                  value={editSl}
                  onChange={(e) => setEditSl(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1"
                  step="any"
                />
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {T("exit_price")}
                </label>
                <input
                  type="number"
                  value={editExit}
                  onChange={(e) => setEditExit(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1"
                  step="any"
                />
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {T("qty")}
                </label>
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  placeholder="0"
                  className="w-full mt-1"
                  step="any"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {T("status")}
              </label>
              <div className="flex gap-2 mt-1">
                {(["open", "closed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setEditStatus(s)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: editStatus === s ? "var(--accent)" : "var(--input-bg)",
                      color: editStatus === s ? "#fff" : "var(--text)",
                      border: `1px solid ${editStatus === s ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {s === "open" ? T("filter_open") : T("filter_closed")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {T("tags")}
              </label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PREDEFINED_TAGS.map((tag) => {
                  const active = editTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleEditTag(tag)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
                      style={{
                        background: active ? (TAG_COLORS[tag] || "var(--accent)") : "var(--input-bg)",
                        color: active ? "#fff" : "var(--text)",
                        border: `1px solid ${active ? (TAG_COLORS[tag] || "var(--accent)") : "var(--border)"}`,
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
                {T("notes")}
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
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
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {T("save_changes")}
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                {T("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
