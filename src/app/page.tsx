"use client";

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* SVG icons                                                           */
/* ------------------------------------------------------------------ */

function IconCalc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="14" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: "var(--profit)" }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: "#f9a825" }}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: <IconCalc />, title: "Position Calculator", desc: "Enter risk, entry, and stop loss. Instantly get your ideal position size and total cost." },
  { icon: <IconTarget />, title: "R:R Analysis", desc: "Set up to 5 take-profit targets with percentage allocation and see your risk-reward at every level." },
  { icon: <IconBook />, title: "Trade Journal", desc: "Save every trade with tags, notes, and P&L tracking. Review your history and learn from it." },
  { icon: <IconCloud />, title: "Cloud Sync", desc: "Sign in once and your trades, strategies, and settings follow you across all your devices." },
  { icon: <IconGlobe />, title: "12 Languages", desc: "From English to Japanese, Chinese, Korean, Spanish, French, and more. Trade in your language." },
  { icon: <IconBolt />, title: "Live Prices", desc: "Real-time stock quotes with one-tap fill. No more switching between apps for the latest price." },
];

const STEPS = [
  { num: "1", title: "Sign Up Free", desc: "Create your account in seconds. No credit card required. Get a full 3-day free trial of all Pro features." },
  { num: "2", title: "Calculate Your Position", desc: "Enter your risk amount, entry price, and stop loss. EZtrade tells you exactly how many shares or contracts to buy." },
  { num: "3", title: "Track & Improve", desc: "Log every trade, review your stats, and refine your edge. Watch your win rate climb over time." },
];

const TESTIMONIALS = [
  { name: "Jason M.", role: "Day Trader, NYC", quote: "I used to spend 5 minutes on every trade just doing math. Now it takes me 10 seconds. EZtrade is the best money I've ever spent on a trading tool.", stars: 5 },
  { name: "Sarah L.", role: "Swing Trader, London", quote: "The multi-target take profit feature is incredible. I can plan my exits before I even enter the trade. My R:R has improved dramatically since I started using this.", stars: 5 },
  { name: "Kevin T.", role: "Futures Trader, Singapore", quote: "Finally a position calculator that handles futures contracts properly. The cloud sync means I can plan on my laptop and execute on my phone seamlessly.", stars: 5 },
];

const FREE_FEATURES = [
  "3-day free trial with full Pro access",
  "Position size calculator",
  "Up to 5 saved trades",
  "Basic stats dashboard",
  "3 strategy templates",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited trades & calculations",
  "Cloud sync across devices",
  "Live price feeds",
  "Unlimited strategies",
  "Advanced analytics & CSV export",
  "Priority support",
];

/* ------------------------------------------------------------------ */
/* Landing Page                                                        */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="landing-root">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <h1 className="landing-hero-title">
              <span style={{ color: "var(--accent)" }}>EZtrade</span>
            </h1>
            <p className="landing-hero-subtitle">
              The Smartest Way to Size Your Trades
            </p>
            <p className="landing-hero-desc">
              Professional position-size calculator for stocks and futures.
              Manage risk, set multi-target take profits, log trades, and track
              your performance &mdash; all in one beautiful app.
            </p>
            <div className="landing-hero-actions">
              <Link
                href="/login"
                className="landing-btn-primary"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Start Free Trial
              </Link>
              <Link
                href="#how-it-works"
                className="landing-btn-secondary"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                See How It Works
              </Link>
            </div>
          </div>
          <div className="landing-hero-visual">
            <CalcMockup />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Everything you need to trade smarter
          </h2>
          <p className="landing-section-sub">
            Built by traders, for traders. Every feature is designed to help you
            manage risk and stay disciplined.
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing-feature-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="landing-feature-icon-wrap" style={{ color: "var(--accent)" }}>
                  {f.icon}
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc" style={{ color: "var(--muted)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="how-it-works">
        <div className="landing-container">
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-sub">
            Get from zero to your first trade in under a minute.
          </p>
          <div className="landing-steps-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="landing-step-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div
                  className="landing-step-num"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {s.num}
                </div>
                <h3 className="landing-feature-title">{s.title}</h3>
                <p className="landing-feature-desc" style={{ color: "var(--muted)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section className="landing-section" id="pricing">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Simple, transparent pricing
          </h2>
          <p className="landing-section-sub">
            Start with a 3-day free trial. Upgrade when you&#39;re ready.
          </p>

          {/* Billing toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: yearly ? "var(--muted)" : "var(--text)" }}>
              Monthly
            </span>
            <button
              onClick={() => setYearly((v) => !v)}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                height: 24,
                width: 44,
                borderRadius: 9999,
                background: yearly ? "var(--accent)" : "var(--border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Toggle yearly billing"
            >
              <span
                style={{
                  display: "inline-block",
                  height: 16,
                  width: 16,
                  borderRadius: 9999,
                  background: "#fff",
                  transform: yearly ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: yearly ? "var(--text)" : "var(--muted)" }}>
              Yearly
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 9999,
                background: "rgba(76,175,80,0.15)",
                color: "var(--profit)",
              }}
            >
              Save 21%
            </span>
          </div>

          <div className="landing-pricing-grid">
            {/* Free Trial */}
            <div className="landing-price-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="landing-price-header">
                <h3 className="landing-price-name">Free Trial</h3>
                <div className="landing-price-amount">
                  <span className="landing-price-dollar" style={{ color: "var(--text)" }}>$0</span>
                  <span className="landing-price-period" style={{ color: "var(--muted)" }}>for 3 days</span>
                </div>
              </div>
              <ul className="landing-price-features">
                {FREE_FEATURES.map((f) => (
                  <li key={f}><IconCheck /> <span>{f}</span></li>
                ))}
              </ul>
              <Link
                href="/login"
                className="landing-price-btn"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div
              className="landing-price-card landing-price-card-highlight"
              style={{ background: "var(--card)", border: "2px solid var(--accent)" }}
            >
              <div className="landing-price-badge" style={{ background: "var(--accent)", color: "#fff" }}>
                POPULAR
              </div>
              <div className="landing-price-header">
                <h3 className="landing-price-name">Pro</h3>
                <div className="landing-price-amount">
                  <span className="landing-price-dollar" style={{ color: "var(--accent)" }}>
                    {yearly ? "$94.95" : "$9.99"}
                  </span>
                  <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                    {yearly ? "/year" : "/month"}
                  </span>
                </div>
                {yearly && (
                  <p style={{ fontSize: 11, marginTop: 2, color: "var(--profit)" }}>
                    $7.91/mo &mdash; Save 21%
                  </p>
                )}
              </div>
              <ul className="landing-price-features">
                {PRO_FEATURES.map((f) => (
                  <li key={f}><IconCheck /> <span>{f}</span></li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="landing-price-btn"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="testimonials">
        <div className="landing-container">
          <h2 className="landing-section-title">Trusted by Traders Worldwide</h2>
          <p className="landing-section-sub">
            See what real traders are saying about EZtrade.
          </p>
          <div className="landing-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="landing-testimonial-card"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="landing-testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <p className="landing-testimonial-quote" style={{ color: "var(--text)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="landing-testimonial-author">
                  <span className="landing-testimonial-name" style={{ color: "var(--text)" }}>{t.name}</span>
                  <span className="landing-testimonial-role" style={{ color: "var(--muted)" }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container" style={{ textAlign: "center" }}>
          <h2 className="landing-section-title">
            Ready to trade with confidence?
          </h2>
          <p className="landing-section-sub">
            Join thousands of traders who use EZtrade to manage risk and maximize returns.
          </p>
          <Link
            href="/login"
            className="landing-btn-primary"
            style={{ background: "var(--accent)", color: "#fff", display: "inline-block", marginTop: 16 }}
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="landing-footer" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo" style={{ color: "var(--accent)" }}>EZtrade</span>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              Professional position sizing for every trader.
            </p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Product</h4>
              <Link href="/app" style={{ color: "var(--muted)", fontSize: 12 }}>Calculator</Link>
              <Link href="/pricing" style={{ color: "var(--muted)", fontSize: 12 }}>Pricing</Link>
              <Link href="/app/log" style={{ color: "var(--muted)", fontSize: 12 }}>Trade Log</Link>
            </div>
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Account</h4>
              <Link href="/login" style={{ color: "var(--muted)", fontSize: 12 }}>Sign In</Link>
              <Link href="/app/settings" style={{ color: "var(--muted)", fontSize: 12 }}>Settings</Link>
            </div>
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Support</h4>
              <a href="mailto:support@eztradeapp.com" style={{ color: "var(--muted)", fontSize: 12 }}>support@eztradeapp.com</a>
              <span style={{ color: "var(--muted)", fontSize: 12 }}>Twitter</span>
              <span style={{ color: "var(--muted)", fontSize: 12 }}>Discord</span>
            </div>
          </div>
          <div className="landing-footer-bottom" style={{ color: "var(--muted)" }}>
            &copy; 2026 EZtrade. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Calculator mockup component                                         */
/* ------------------------------------------------------------------ */

function CalcMockup() {
  return (
    <div className="landing-mockup">
      <div className="landing-mockup-header">
        <div className="landing-mockup-dot" style={{ background: "#f44336" }} />
        <div className="landing-mockup-dot" style={{ background: "#f9a825" }} />
        <div className="landing-mockup-dot" style={{ background: "#4caf50" }} />
      </div>
      <div className="landing-mockup-body">
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: "var(--accent)", color: "#fff", textAlign: "center", fontSize: 11, fontWeight: 600 }}>
            Stock
          </div>
          <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: "var(--input-bg)", border: "1px solid var(--border)", textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
            Futures
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: "var(--muted)", marginBottom: 3 }}>Risk Amount</div>
            <div style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 8px", fontSize: 12, color: "var(--text)" }}>$200</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "var(--muted)", marginBottom: 3 }}>Entry Price</div>
            <div style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 8px", fontSize: 12, color: "var(--text)" }}>$185.50</div>
          </div>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, marginTop: 6 }}>
          <div style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700, marginBottom: 6 }}>Results</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Position Size</div>
              <div style={{ fontSize: 11, fontWeight: 700 }}>54 shares</div>
            </div>
            <div style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Overall R:R</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>3.20R</div>
            </div>
            <div style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Potential Profit</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--profit)" }}>$640.00</div>
            </div>
            <div style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Actual Risk</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--loss)" }}>$200.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
