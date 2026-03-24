"use client";

import Link from "next/link";

/* ------------------------------------------------------------------ */
/* SVG icons used across the page                                      */
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

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="landing-feature-icon">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: "var(--profit)" }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted)" }}>
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Feature data                                                        */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: <IconCalc />,
    title: "Position Calculator",
    desc: "Enter risk, entry, and stop loss. Instantly get your ideal position size and total cost.",
  },
  {
    icon: <IconTarget />,
    title: "R:R with T1 - T5",
    desc: "Set up to 5 take-profit targets with percentage allocation and see your risk-reward at every level.",
  },
  {
    icon: <IconBook />,
    title: "Trade Log",
    desc: "Save every trade with tags, notes, and P&L tracking. Review your history and learn from it.",
  },
  {
    icon: <IconCloud />,
    title: "Cloud Sync",
    desc: "Sign in once and your trades, strategies, and settings follow you across all your devices.",
  },
  {
    icon: <IconBolt />,
    title: "Live Prices",
    desc: "Real-time stock quotes with one-tap fill. No more switching between apps for the latest price.",
  },
  {
    icon: <IconGlobe />,
    title: "12 Languages",
    desc: "From English to Japanese, Chinese, Korean, Spanish, French, and more. Trade in your language.",
  },
];

/* ------------------------------------------------------------------ */
/* Pricing data                                                        */
/* ------------------------------------------------------------------ */

const FREE_FEATURES = [
  "Position size calculator",
  "Up to 5 saved trades",
  "Basic stats dashboard",
  "3 strategy templates",
  "Local storage",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited trades",
  "Cloud sync across devices",
  "Live price feeds",
  "Unlimited strategies",
  "Advanced analytics",
  "CSV export",
  "Priority support",
];

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
        {/* Fake mode toggle */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: "var(--accent)", color: "#fff", textAlign: "center", fontSize: 11, fontWeight: 600 }}>
            Stock
          </div>
          <div style={{ flex: 1, padding: "6px 0", borderRadius: 6, background: "var(--input-bg)", border: "1px solid var(--border)", textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
            Futures
          </div>
        </div>

        {/* Fake fields */}
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

        {/* Fake result */}
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

/* ------------------------------------------------------------------ */
/* Landing Page                                                        */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
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
              The fastest way to size your trades
            </p>
            <p className="landing-hero-desc">
              Professional position-size calculator for stocks and futures.
              Manage risk, set multi-target take profits, log trades, and track
              your performance -- all in one app.
            </p>
            <div className="landing-hero-actions">
              <Link
                href="/"
                className="landing-btn-primary"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Get Started Free
              </Link>
              <Link
                href="#pricing"
                className="landing-btn-secondary"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                View Pricing
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

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="pricing">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Simple, transparent pricing
          </h2>
          <p className="landing-section-sub">
            Start free. Upgrade when you are ready for more power.
          </p>

          <div className="landing-pricing-grid">
            {/* Free */}
            <div className="landing-price-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="landing-price-header">
                <h3 className="landing-price-name">Free</h3>
                <div className="landing-price-amount">
                  <span className="landing-price-dollar" style={{ color: "var(--text)" }}>$0</span>
                  <span className="landing-price-period" style={{ color: "var(--muted)" }}>forever</span>
                </div>
              </div>
              <ul className="landing-price-features">
                {FREE_FEATURES.map((f) => (
                  <li key={f}><IconCheck /> <span>{f}</span></li>
                ))}
              </ul>
              <Link
                href="/"
                className="landing-price-btn"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                Get Started
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
                  <span className="landing-price-dollar" style={{ color: "var(--accent)" }}>$9.99</span>
                  <span className="landing-price-period" style={{ color: "var(--muted)" }}>/month</span>
                </div>
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
                Start Pro Trial
              </Link>
            </div>
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
            href="/"
            className="landing-btn-primary"
            style={{ background: "var(--accent)", color: "#fff", display: "inline-block", marginTop: 16 }}
          >
            Get Started Free
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
          </div>
          <div className="landing-footer-bottom" style={{ color: "var(--muted)" }}>
            &copy; {new Date().getFullYear()} EZtrade. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
