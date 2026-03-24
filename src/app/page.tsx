"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n";
import { calculate, type CalcInput } from "@/lib/calculate";

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

function IconGlobeSmall() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={20}
      height={20}
      style={{
        transition: "transform 0.2s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
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

const SOCIAL_PROOF = [
  { emoji: "\u{1F30D}", label: "Available in 12 languages" },
  { emoji: "\u{1F4CA}", label: "Stocks & Futures supported" },
  { emoji: "\u26A1", label: "Instant position sizing in seconds" },
  { emoji: "\u{1F512}", label: "Your data, your device \u2014 privacy first" },
];

const FAQ_ITEMS = [
  {
    q: "Is EZtrade free to use?",
    a: "Yes! You can try all Pro features free for 3 days. After that, the basic calculator remains free with limited saves. Upgrade to Pro for $9.99/month for unlimited access.",
  },
  {
    q: "Where is my data stored?",
    a: "Free users: data is stored locally in your browser. Pro users: data syncs securely to the cloud via Firebase, so you can access it from any device.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. Cancel anytime from your Settings page. No questions asked, no hidden fees.",
  },
  {
    q: "What markets does EZtrade support?",
    a: "Stocks and futures, including popular contracts like ES, NQ, GC, CL and their micro versions. Options support is coming soon.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes! We offer a 7-day no-questions-asked money-back guarantee. Simply email support@eztradeapp.com within 7 days of your purchase and we\u2019ll refund you in full. No hassle, no risk.",
  },
  {
    q: "Is my financial data secure?",
    a: "We never see your broker credentials or account information. EZtrade is a calculator and journal \u2014 it doesn\u2019t connect to your brokerage account.",
  },
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
  const [yearly, setYearly] = useState(true);

  return (
    <div className="landing-root">
      {/* ── STICKY NAV BAR ─────────────────────────────────────────── */}
      <LandingNav />

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
              <a
                href="#how-it-works"
                className="landing-btn-secondary"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See How It Works
              </a>
            </div>
            <a
              href="#try-calculator"
              className="landing-live-demo-arrow"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("try-calculator")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Live Demo ↓
            </a>
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

      {/* ── TRY CALCULATOR ─────────────────────────────────────────── */}
      <section className="landing-section" id="try-calculator">
        <div className="landing-container">
          <h2 className="landing-section-title">Try the Calculator</h2>
          <p className="landing-section-sub">
            No sign-up required. Enter your trade details and get instant results.
          </p>
          <TryCalculator />
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="social-proof">
        <div className="landing-container">
          <h2 className="landing-section-title">Built for Every Trader</h2>
          <div className="landing-social-proof-grid">
            {SOCIAL_PROOF.map((item) => (
              <div
                key={item.label}
                className="landing-social-proof-card"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <span className="landing-social-proof-emoji">{item.emoji}</span>
                <span className="landing-social-proof-label">{item.label}</span>
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

          {/* Urgency banner */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--warn)",
              background: "rgba(249,168,37,0.1)",
              padding: "6px 16px",
              borderRadius: 9999,
              animation: "pulseLabel 2s ease-in-out infinite",
            }}>
              {"\uD83D\uDD25"} Limited time: Save 21% with annual billing
            </span>
          </div>

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
                background: yearly ? "var(--profit)" : "var(--border)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "background 0.2s",
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
              Get 2 months free!
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
              className={`landing-price-card landing-price-card-highlight${yearly ? " yearly-glow" : ""}`}
              style={{
                background: "var(--card)",
                border: yearly ? "2px solid var(--profit)" : "2px solid var(--accent)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            >
              <div className="landing-price-badge" style={{
                background: yearly ? "var(--profit)" : "var(--accent)",
                color: "#fff",
                transition: "background 0.3s",
              }}>
                {yearly ? "BEST VALUE" : "POPULAR"}
              </div>
              <div className="landing-price-header">
                <h3 className="landing-price-name">Pro</h3>
                {yearly ? (
                  <>
                    <div className="landing-price-amount" style={{ alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--muted)",
                        textDecoration: "line-through",
                      }}>
                        $119.88/yr
                      </span>
                    </div>
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--profit)", fontSize: 42, transition: "font-size 0.3s" }}>
                        $7.91
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        /month
                      </span>
                    </div>
                    <p style={{ fontSize: 13, marginTop: 4, color: "var(--muted)" }}>
                      Billed $94.95/year
                    </p>
                    <p style={{ fontSize: 12, marginTop: 4, color: "var(--profit)", fontWeight: 700 }}>
                      You save $24.93
                    </p>
                    <p style={{ fontSize: 11, marginTop: 2, color: "var(--profit)" }}>
                      Get 2 months free!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--accent)", opacity: 0.85 }}>
                        $9.99
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        /month
                      </span>
                    </div>
                    <p style={{ fontSize: 11, marginTop: 4, color: "var(--warn)" }}>
                      {"\u2191"} Switch to yearly and save $24.93
                    </p>
                  </>
                )}
              </div>
              <ul className="landing-price-features">
                {PRO_FEATURES.map((f) => (
                  <li key={f}><IconCheck /> <span>{f}</span></li>
                ))}
              </ul>
              <Link
                href="/login"
                className="landing-price-btn"
                style={{
                  background: yearly ? "var(--profit)" : "var(--accent)",
                  color: "#fff",
                  transition: "background 0.3s",
                }}
              >
                {yearly ? "Get 2 Months Free" : "Upgrade to Pro"}
              </Link>
            </div>
          </div>

          {/* Refund guarantee badge */}
          <div
            style={{
              marginTop: 24,
              textAlign: "center",
              padding: "14px 20px",
              borderRadius: 12,
              background: "rgba(76,175,80,0.08)",
              border: "1px solid rgba(76,175,80,0.2)",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--profit)", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
              <span style={{ marginRight: 6 }}>{"\u2705"}</span>
              7-Day Money-Back Guarantee
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.4 }}>
              No questions asked. Just email{" "}
              <a href="mailto:support@eztradeapp.com" style={{ color: "var(--profit)", textDecoration: "underline" }}>
                support@eztradeapp.com
              </a>{" "}
              within 7 days for a full refund.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="faq">
        <div className="landing-container">
          <h2 className="landing-section-title">Frequently Asked Questions</h2>
          <p className="landing-section-sub">
            Got questions? We have answers.
          </p>
          <div className="landing-faq-list">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
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
/* Landing Nav (sticky top bar with language switcher)                  */
/* ------------------------------------------------------------------ */

function LandingNav() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LangCode>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("eztrade_lang") as LangCode | null;
    if (saved) setCurrentLang(saved);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentName = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.name ?? "English";

  function selectLang(code: LangCode) {
    localStorage.setItem("eztrade_lang", code);
    setCurrentLang(code);
    setLangOpen(false);
    window.location.reload();
  }

  return (
    <nav className="landing-nav">
      <div className="landing-nav-inner">
        <Link href="/" className="landing-nav-brand" style={{ color: "var(--accent)" }}>
          EZtrade
        </Link>
        <div className="landing-nav-right">
          <div className="top-header-lang" ref={dropdownRef}>
            <button
              className="top-header-lang-btn"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
              onClick={() => setLangOpen((v) => !v)}
            >
              <IconGlobeSmall />
              <span className="top-header-lang-label">{currentName}</span>
            </button>
            {langOpen && (
              <div className="top-header-lang-menu" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className="top-header-lang-option"
                    style={{
                      background: lang.code === currentLang ? "var(--accent)" : "transparent",
                      color: lang.code === currentLang ? "#fff" : "var(--text)",
                    }}
                    onClick={() => selectLang(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/login"
            className="landing-nav-signin"
            style={{ color: "var(--accent)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ Accordion Item                                                   */
/* ------------------------------------------------------------------ */

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-faq-item" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <button
        className="landing-faq-question"
        onClick={() => setOpen((v) => !v)}
        style={{ color: "var(--text)" }}
      >
        <span>{question}</span>
        <IconChevron open={open} />
      </button>
      <div
        className="landing-faq-answer"
        style={{
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          color: "var(--muted)",
        }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Try Calculator (inline, no auth)                                     */
/* ------------------------------------------------------------------ */

function TryCalculator() {
  const [entry, setEntry] = useState("185.50");
  const [sl, setSl] = useState("182.00");
  const [risk, setRisk] = useState("200");
  const [result, setResult] = useState<{
    qty: number;
    rr: number;
    profit: number;
    loss: number;
  } | null>(null);

  function handleCalc() {
    const entryNum = parseFloat(entry);
    const slNum = parseFloat(sl);
    const riskNum = parseFloat(risk);
    if (!entryNum || !slNum || !riskNum) return;

    const dir = entryNum > slNum ? "long" : "short";
    const tpPrice = dir === "long"
      ? entryNum + (entryNum - slNum) * 2
      : entryNum - (slNum - entryNum) * 2;

    const input: CalcInput = {
      type: "stock",
      dir,
      entry: entryNum,
      sl: slNum,
      riskAmount: riskNum,
      fee: 0,
      tps: [{ label: "TP1", price: tpPrice, pct: 100 }],
    };

    const res = calculate(input);
    if (res) {
      setResult({
        qty: res.qty,
        rr: res.overallRR,
        profit: res.potentialProfit,
        loss: res.actualRisk,
      });
    }
  }

  return (
    <div className="landing-try-calc">
      <div className="landing-try-calc-form">
        <div className="landing-try-calc-field">
          <label style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4, display: "block" }}>Entry Price ($)</label>
          <input
            type="number"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            style={{ width: "100%" }}
            step="any"
          />
        </div>
        <div className="landing-try-calc-field">
          <label style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4, display: "block" }}>Stop Loss ($)</label>
          <input
            type="number"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            style={{ width: "100%" }}
            step="any"
          />
        </div>
        <div className="landing-try-calc-field">
          <label style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4, display: "block" }}>Risk Amount ($)</label>
          <input
            type="number"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            style={{ width: "100%" }}
            step="any"
          />
        </div>
        <button
          className="landing-try-calc-btn"
          onClick={handleCalc}
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="landing-try-calc-results animate-fade-in">
          <div className="landing-try-calc-result-grid">
            <div className="landing-try-calc-result-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Shares to Buy</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{result.qty}</div>
            </div>
            <div className="landing-try-calc-result-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>R:R Ratio</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>{result.rr.toFixed(2)}R</div>
            </div>
            <div className="landing-try-calc-result-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Potential Profit</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--profit)" }}>${result.profit.toFixed(2)}</div>
            </div>
            <div className="landing-try-calc-result-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Risk (Loss)</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--loss)" }}>${result.loss.toFixed(2)}</div>
            </div>
          </div>
          <div className="landing-try-calc-cta">
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
              Want more? Sign up free to save trades, track stats, and sync across devices.
            </p>
            <Link
              href="/login"
              className="landing-btn-primary"
              style={{ background: "var(--accent)", color: "#fff", display: "inline-block" }}
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Calculator mockup component (animated)                               */
/* ------------------------------------------------------------------ */

function CalcMockup() {
  return (
    <div className="landing-mockup landing-mockup-glow">
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
            <div className="landing-mockup-result-cell" style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Position Size</div>
              <div className="landing-mockup-count" style={{ fontSize: 11, fontWeight: 700 }}>54 shares</div>
            </div>
            <div className="landing-mockup-result-cell" style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Overall R:R</div>
              <div className="landing-mockup-count" style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>3.20R</div>
            </div>
            <div className="landing-mockup-result-cell" style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Potential Profit</div>
              <div className="landing-mockup-count" style={{ fontSize: 11, fontWeight: 700, color: "var(--profit)" }}>$640.00</div>
            </div>
            <div className="landing-mockup-result-cell" style={{ background: "var(--input-bg)", borderRadius: 6, padding: "4px 6px" }}>
              <div style={{ fontSize: 8, color: "var(--muted)" }}>Actual Risk</div>
              <div className="landing-mockup-count" style={{ fontSize: 11, fontWeight: 700, color: "var(--loss)" }}>$200.00</div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating label */}
      <div className="landing-mockup-floating-label">
        54 shares
      </div>
    </div>
  );
}
