"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n";

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
  { icon: <IconCalc />, title: "Position Calculator", desc: "Calculate exactly how many shares to buy based on your risk tolerance" },
  { icon: <IconTarget />, title: "R:R Analysis with T1-T5", desc: "Set up to 5 take-profit targets with automatic percentage distribution" },
  { icon: <IconBook />, title: "Trade Journal", desc: "Log every trade with tags, notes, and screenshots. Never forget a setup." },
  { icon: <IconCloud />, title: "Cloud Sync", desc: "Access your trades from any device. Phone, tablet, desktop \u2014 always in sync." },
  { icon: <IconGlobe />, title: "12 Languages", desc: "Trade in your language. \u7E41\u9AD4\u4E2D\u6587, \u65E5\u672C\u8A9E, \uD55C\uAD6D\uC5B4, Espa\u00F1ol, and 8 more." },
  { icon: <IconBolt />, title: "Live Prices", desc: "Real-time price feeds auto-fill your entry price. No more switching apps." },
];

const STEPS = [
  { num: "1", title: "Sign Up Free", desc: "Create your account in 10 seconds. No credit card needed." },
  { num: "2", title: "Size Your Trade", desc: "Enter risk, entry, and stop loss. Get position size and R:R instantly." },
  { num: "3", title: "Track & Improve", desc: "Log trades, review stats, and watch your edge grow over time." },
];

const STATS = [
  { value: "10,000+", label: "Calculations" },
  { value: "50+", label: "Countries" },
  { value: "12", label: "Languages" },
  { value: "4.8\u2605", label: "Rating" },
];

const FAQ_ITEMS = [
  {
    q: "Is EZtrade free to use?",
    a: "Yes! Start with a 3-day free trial with full Pro features. After that, the free tier includes 5 calculations per day and 2 saved trades.",
  },
  {
    q: "What markets does EZtrade support?",
    a: "Stocks, futures (NQ, ES, GC, CL and more), and ETFs. We support all US-listed securities.",
  },
  {
    q: "Can I use EZtrade on my phone?",
    a: "Yes! EZtrade is a Progressive Web App (PWA). Add it to your home screen and use it like a native app.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We use Firebase with bank-level encryption. Your data is synced securely to the cloud and only accessible by you.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. Plus, we offer a 7-day money-back guarantee.",
  },
  {
    q: "What languages are supported?",
    a: "We support 12 languages: English, \u7E41\u9AD4\u4E2D\u6587, \u7B80\u4F53\u4E2D\u6587, \u65E5\u672C\u8A9E, \uD55C\uAD6D\uC5B4, Espa\u00F1ol, Portugu\u00EAs, \u0939\u093F\u0928\u094D\u0926\u0940, Deutsch, \u0E44\u0E17\u0E22, Bahasa Indonesia, and Fran\u00E7ais.",
  },
];

const FREE_FEATURES = [
  "3-day full access",
  "5 calculations per day",
  "2 saved trades",
  "Basic stats dashboard",
];

const PRO_FEATURES = [
  "Unlimited calculations",
  "Unlimited trade log",
  "Cloud sync",
  "Live prices",
  "Strategy templates",
  "Advanced analytics",
  "CSV export",
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

      {/* ── SECTION 1: HERO ───────────────────────────────────────── */}
      <section className="landing-hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
          <h1 className="landing-hero-title" style={{ fontSize: 56, lineHeight: 1.05 }}>
            <span style={{ color: "var(--accent)" }}>EZtrade</span>
          </h1>
          <p className="landing-hero-subtitle" style={{ fontSize: 24, marginTop: 16 }}>
            The Smartest Way to Size Your Trades
          </p>
          <p className="landing-hero-desc" style={{ maxWidth: 540, margin: "16px auto 0", fontSize: 15, lineHeight: 1.7 }}>
            Built for traders, by traders. Calculate position size, track your trades,
            and improve your edge &mdash; all in one app.
          </p>
          <div className="landing-hero-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link
              href="/login"
              className="landing-btn-primary"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/calc-demo"
              className="landing-btn-secondary"
              style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Try Calculator Free
            </Link>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 16 }}>
            No credit card required &bull; 3-day free trial &bull; 7-day money-back guarantee
          </p>
        </div>
      </section>

      {/* ── SECTION 2: SOCIAL PROOF STATS BAR ─────────────────────── */}
      <section style={{ background: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
        <div className="landing-container">
          <div className="landing-stats-bar">
            {STATS.map((s) => (
              <div key={s.label} className="landing-stat-item">
                <span style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{s.value}</span>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES ───────────────────────────────────── */}
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

      {/* ── SECTION 4: TRADING JOURNAL SUCCESS STATS ──────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container" style={{ textAlign: "center" }}>
          <h2 className="landing-section-title">
            Traders With a Journal Are 30% More Likely to Be Profitable
          </h2>
          <p className="landing-section-sub" style={{ maxWidth: 600, marginTop: 16 }}>
            Studies show that traders who consistently log their trades improve their
            win rate by an average of 12% within 3 months.
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            [Source: Trading Psychology Research]
          </p>
          <p style={{ fontSize: 15, color: "var(--text)", marginTop: 20, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            EZtrade gives you the tools to track every trade, analyze your patterns,
            and find your edge.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ───────────────────────────────── */}
      <section className="landing-section" id="how-it-works">
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

      {/* ── SECTION 6: PRICING ────────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="pricing">
        <div className="landing-container">
          <h2 className="landing-section-title">
            Simple, transparent pricing
          </h2>
          <p className="landing-section-sub">
            Start with a 3-day free trial. Upgrade when you&#39;re ready.
          </p>

          {/* Billing toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24, marginBottom: 24 }}>
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
            {yearly && (
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
            )}
          </div>

          <div className="landing-pricing-grid">
            {/* Free Trial */}
            <div className="landing-price-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="landing-price-header">
                <h3 className="landing-price-name">Free Trial</h3>
                <div className="landing-price-amount">
                  <span className="landing-price-dollar" style={{ color: "var(--text)" }}>Free</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>3-day full access</p>
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
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--profit)", fontSize: 42, transition: "font-size 0.3s" }}>
                        $7.91
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        /mo
                      </span>
                    </div>
                    <p style={{ fontSize: 12, marginTop: 4, color: "var(--muted)" }}>
                      billed $94.95/year
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 9999,
                        background: "rgba(76,175,80,0.15)",
                        color: "var(--profit)",
                        marginTop: 4,
                      }}
                    >
                      Save 21%
                    </span>
                  </>
                ) : (
                  <>
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--accent)" }}>
                        $9.99
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        /mo
                      </span>
                    </div>
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
                {yearly ? "Get Best Value" : "Upgrade to Pro"}
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
              7-Day Money-Back Guarantee
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.4 }}>
              Not satisfied? Email us within 7 days for a full refund. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ────────────────────────────────────────── */}
      <section className="landing-section" id="faq">
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

      {/* ── SECTION 8: FINAL CTA ──────────────────────────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container" style={{ textAlign: "center" }}>
          <h2 className="landing-section-title">
            Ready to Trade Smarter?
          </h2>
          <p className="landing-section-sub">
            Join thousands of traders who calculate with confidence.
          </p>
          <Link
            href="/login"
            className="landing-btn-primary"
            style={{ background: "var(--accent)", color: "#fff", display: "inline-block", marginTop: 20 }}
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* ── SECTION 9: FOOTER ─────────────────────────────────────── */}
      <footer className="landing-footer" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo" style={{ color: "var(--accent)" }}>EZtrade</span>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              Built for traders, by traders {"\uD83D\uDD25"}
            </p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Product</h4>
              <a href="#features" style={{ color: "var(--muted)", fontSize: 12 }}>Features</a>
              <a href="#pricing" style={{ color: "var(--muted)", fontSize: 12 }}>Pricing</a>
              <a href="#faq" style={{ color: "var(--muted)", fontSize: 12 }}>FAQ</a>
            </div>
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Support</h4>
              <a href="mailto:support@eztradeapp.com" style={{ color: "var(--muted)", fontSize: 12 }}>Contact Us</a>
              <Link href="/privacy" style={{ color: "var(--muted)", fontSize: 12 }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "var(--muted)", fontSize: 12 }}>Terms of Service</Link>
            </div>
          </div>
          <div className="landing-footer-bottom" style={{ color: "var(--muted)" }}>
            <p style={{ margin: 0 }}>&copy; 2026 EZtrade. All rights reserved.</p>
            <p style={{ margin: "4px 0 0", fontSize: 10 }}>
              Constant updates &bull; World-class support &bull; Community-driven development
            </p>
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
