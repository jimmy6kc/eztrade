"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { TIER_FEATURES } from "@/lib/membership";
import type { Tier } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

const PRO_MONTHLY_PRICE = 9.99;
const PRO_YEARLY_PRICE = 94.95;
const PRO_YEARLY_MONTHLY_EQUIV = PRO_YEARLY_PRICE / 12; // ~7.91

const FREE_FEATURES = [
  "Position size calculator",
  "Up to 5 saved trades",
  "Basic stats dashboard",
  "Local storage only",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited trades",
  "Cloud sync across devices",
  "Live price feeds",
  "Strategy templates",
  "Advanced analytics (equity curve, heatmap)",
  "TradingView integration",
  "CSV export",
  "Priority support",
];

const CHECK_FEATURES = [
  { label: "Position Calculator", free: true, pro: true },
  { label: "Saved Trades", free: "5", pro: "Unlimited" },
  { label: "Cloud Sync", free: false, pro: true },
  { label: "Live Prices", free: false, pro: true },
  { label: "Strategy Templates", free: false, pro: true },
  { label: "Advanced Analytics", free: false, pro: true },
  { label: "TradingView", free: false, pro: true },
  { label: "CSV Export", free: false, pro: true },
];

export default function PricingPage() {
  const { user, tier } = useAuth();
  const [yearly, setYearly] = useState(true);

  const handleSubscribe = async (planTier: Tier) => {
    if (planTier === "free") return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        window.location.href = "/login";
        return;
      }
      const priceId = yearly
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || ""
        : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Failed to start checkout. Please try again.");
    }
  };

  return (
    <div className="flex-1 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-xs" style={{ color: "var(--muted)" }}>
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold mt-2" style={{ color: "var(--accent)" }}>
            Choose Your Plan
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Unlock powerful trading tools
          </p>
        </div>

        {/* Urgency banner */}
        <div className="text-center mb-3">
          <span
            className="inline-block text-[13px] font-bold px-4 py-1.5 rounded-full"
            style={{
              color: "var(--warn)",
              background: "rgba(249,168,37,0.1)",
              animation: "pulseLabel 2s ease-in-out infinite",
            }}
          >
            {"\uD83D\uDD25"} Limited time: Save 21% with annual billing
          </span>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3">
          <span
            className="text-xs font-semibold"
            style={{ color: yearly ? "var(--muted)" : "var(--text)" }}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly((v) => !v)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{
              background: yearly ? "var(--profit)" : "var(--border)",
            }}
            aria-label="Toggle yearly billing"
          >
            <span
              className="inline-block h-4 w-4 rounded-full transition-transform"
              style={{
                background: "#fff",
                transform: yearly ? "translateX(24px)" : "translateX(4px)",
              }}
            />
          </button>
          <span
            className="text-xs font-semibold"
            style={{ color: yearly ? "var(--text)" : "var(--muted)" }}
          >
            Yearly
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(76,175,80,0.15)",
              color: "var(--profit)",
            }}
          >
            Get 2 months free!
          </span>
        </div>

        {/* Plan cards */}
        <div className="space-y-3">
          {/* Free plan */}
          <div
            className="rounded-xl p-4 relative"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Free</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                    $0
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    forever
                  </span>
                </div>
              </div>

              {user && tier === "free" ? (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
                >
                  Current
                </span>
              ) : (
                <button
                  onClick={() => handleSubscribe("free")}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Free
                </button>
              )}
            </div>

            <ul className="mt-3 space-y-1.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "var(--profit)" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro plan */}
          <div
            className={`rounded-xl p-4 relative${yearly ? " yearly-glow" : ""}`}
            style={{
              background: "var(--card)",
              border: yearly ? "2px solid var(--profit)" : "2px solid var(--accent)",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: yearly ? "var(--profit)" : "var(--accent)",
                color: "#fff",
                transition: "background 0.3s",
              }}
            >
              {yearly ? "BEST VALUE" : "POPULAR"}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Pro</h3>
                {yearly ? (
                  <>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm font-medium" style={{ color: "var(--muted)", textDecoration: "line-through" }}>
                        $9.99/mo
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                        style={{
                          background: "rgba(76,175,80,0.15)",
                          color: "var(--profit)",
                        }}
                      >
                        SAVE 21%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold" style={{ color: "var(--profit)", transition: "font-size 0.3s" }}>
                        ${PRO_YEARLY_MONTHLY_EQUIV.toFixed(2)}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        /month
                      </span>
                    </div>
                    <p className="text-[13px] mt-1" style={{ color: "var(--muted)" }}>
                      Billed annually at $94.95
                    </p>
                    <p className="text-xs font-bold mt-1" style={{ color: "var(--profit)" }}>
                      You save $24.93/year
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold" style={{ color: "var(--accent)", opacity: 0.85 }}>
                        $9.99
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        /month
                      </span>
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: "var(--warn)" }}>
                      {"\u2191"} Switch to yearly and save 21%
                    </p>
                  </>
                )}
              </div>

              {user && tier === "pro" ? (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
                >
                  Current
                </span>
              ) : (
                <button
                  onClick={() => handleSubscribe("pro")}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: yearly ? "var(--profit)" : "var(--accent)",
                    color: "#fff",
                    transition: "background 0.3s",
                  }}
                >
                  {yearly ? "Get 2 Months Free" : "Subscribe"}
                </button>
              )}
            </div>

            <ul className="mt-3 space-y-1.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "var(--profit)" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund guarantee badge */}
        <div
          className="rounded-xl p-3 text-center mt-3"
          style={{
            background: "rgba(76,175,80,0.08)",
            border: "1px solid rgba(76,175,80,0.2)",
          }}
        >
          <p className="text-[13px] font-semibold" style={{ color: "var(--profit)", margin: 0, lineHeight: 1.5 }}>
            {"\u2705"} 7-Day Money-Back Guarantee
          </p>
          <p className="text-[11px] mt-1" style={{ color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
            No questions asked. Just email{" "}
            <a href="mailto:support@eztradeapp.com" style={{ color: "var(--profit)", textDecoration: "underline" }}>
              support@eztradeapp.com
            </a>{" "}
            within 7 days for a full refund.
          </p>
        </div>

        {/* Feature comparison table */}
        <div
          className="rounded-xl p-4 overflow-x-auto"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h3 className="text-sm font-bold mb-3">Feature Comparison</h3>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th className="text-left py-1">Feature</th>
                <th className="text-center py-1">Free</th>
                <th className="text-center py-1">Pro</th>
              </tr>
            </thead>
            <tbody>
              {CHECK_FEATURES.map((f) => (
                <tr key={f.label} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-2">{f.label}</td>
                  <td className="text-center py-2">
                    <CellValue val={f.free} />
                  </td>
                  <td className="text-center py-2">
                    <CellValue val={f.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "string")
    return <span className="font-medium">{val}</span>;
  if (val)
    return (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 inline"
        style={{ color: "var(--profit)" }}
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  return <span style={{ color: "var(--muted)" }}>--</span>;
}
