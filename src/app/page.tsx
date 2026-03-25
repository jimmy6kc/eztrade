"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useI18n, SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n-context";

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
/* Landing Page                                                        */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [yearly, setYearly] = useState(true);
  const { T } = useI18n();

  const FEATURES = [
    { icon: <IconCalc />, titleKey: "landing_feat_calc_title", descKey: "landing_feat_calc_desc" },
    { icon: <IconTarget />, titleKey: "landing_feat_rr_title", descKey: "landing_feat_rr_desc" },
    { icon: <IconBook />, titleKey: "landing_feat_journal_title", descKey: "landing_feat_journal_desc" },
    { icon: <IconCloud />, titleKey: "landing_feat_sync_title", descKey: "landing_feat_sync_desc" },
    { icon: <IconGlobe />, titleKey: "landing_feat_lang_title", descKey: "landing_feat_lang_desc" },
    { icon: <IconBolt />, titleKey: "landing_feat_price_title", descKey: "landing_feat_price_desc" },
  ];

  const STEPS = [
    { num: "1", titleKey: "landing_step1_title", descKey: "landing_step1_desc" },
    { num: "2", titleKey: "landing_step2_title", descKey: "landing_step2_desc" },
    { num: "3", titleKey: "landing_step3_title", descKey: "landing_step3_desc" },
  ];

  const STATS = [
    { value: "10,000+", labelKey: "landing_stats_calcs" },
    { value: "50+", labelKey: "landing_stats_countries" },
    { value: "12", labelKey: "landing_stats_languages" },
    { value: "4.8\u2605", labelKey: "landing_stats_rating" },
  ];

  const FAQ_ITEMS = [
    { qKey: "landing_faq1_q", aKey: "landing_faq1_a" },
    { qKey: "landing_faq2_q", aKey: "landing_faq2_a" },
    { qKey: "landing_faq3_q", aKey: "landing_faq3_a" },
    { qKey: "landing_faq4_q", aKey: "landing_faq4_a" },
    { qKey: "landing_faq5_q", aKey: "landing_faq5_a" },
    { qKey: "landing_faq6_q", aKey: "landing_faq6_a" },
  ];

  const FREE_FEATURES_KEYS = [
    "landing_free_f1",
    "landing_free_f2",
    "landing_free_f3",
    "landing_free_f4",
  ];

  const PRO_FEATURES_KEYS = [
    "landing_pro_f1",
    "landing_pro_f2",
    "landing_pro_f3",
    "landing_pro_f4",
    "landing_pro_f5",
    "landing_pro_f6",
    "landing_pro_f7",
    "landing_pro_f8",
  ];

  return (
    <div className="landing-root">
      {/* -- STICKY NAV BAR -- */}
      <LandingNav />

      {/* -- SECTION 1: HERO -- */}
      <section className="landing-hero" style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", padding: "0 20px" }}>
          <h1 className="landing-hero-title" style={{ fontSize: 56, lineHeight: 1.05 }}>
            <span style={{ color: "var(--accent)" }}>EZtrade</span>
          </h1>
          <p className="landing-hero-subtitle" style={{ fontSize: 24, marginTop: 16 }}>
            {T("landing_tagline")}
          </p>
          <p className="landing-hero-desc" style={{ maxWidth: 540, margin: "16px auto 0", fontSize: 15, lineHeight: 1.7 }}>
            {T("landing_subtitle")}
          </p>
          <div className="landing-hero-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link
              href="/login"
              className="landing-btn-primary"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {T("landing_start_trial")}
            </Link>
            <Link
              href="/calc-demo"
              className="landing-btn-secondary"
              style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {T("landing_try_free")}
            </Link>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 16 }}>
            {T("landing_trust")}
          </p>
        </div>
      </section>

      {/* -- SECTION 2: SOCIAL PROOF STATS BAR -- */}
      <section style={{ background: "var(--card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "24px 0" }}>
        <div className="landing-container">
          <div className="landing-stats-bar">
            {STATS.map((s) => (
              <div key={s.labelKey} className="landing-stat-item">
                <span style={{ fontSize: 28, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{s.value}</span>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{T(s.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- SECTION 3: FEATURES -- */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <h2 className="landing-section-title">
            {T("landing_features_title")}
          </h2>
          <p className="landing-section-sub">
            {T("landing_features_sub")}
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((f) => (
              <div key={f.titleKey} className="landing-feature-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="landing-feature-icon-wrap" style={{ color: "var(--accent)" }}>
                  {f.icon}
                </div>
                <h3 className="landing-feature-title">{T(f.titleKey)}</h3>
                <p className="landing-feature-desc" style={{ color: "var(--muted)" }}>
                  {T(f.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- SECTION 4: TRADING JOURNAL SUCCESS STATS -- */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container" style={{ textAlign: "center" }}>
          <h2 className="landing-section-title">
            {T("landing_journal_title")}
          </h2>
          <p className="landing-section-sub" style={{ maxWidth: 600, marginTop: 16 }}>
            {T("landing_journal_desc")}
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            [Source: Trading Psychology Research]
          </p>
          <p style={{ fontSize: 15, color: "var(--text)", marginTop: 20, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            {T("landing_journal_cta")}
          </p>
        </div>
      </section>

      {/* -- SECTION 5: HOW IT WORKS -- */}
      <section className="landing-section" id="how-it-works">
        <div className="landing-container">
          <h2 className="landing-section-title">{T("landing_how_title")}</h2>
          <p className="landing-section-sub">
            {T("landing_how_sub")}
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
                <h3 className="landing-feature-title">{T(s.titleKey)}</h3>
                <p className="landing-feature-desc" style={{ color: "var(--muted)" }}>
                  {T(s.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- SECTION 6: PRICING -- */}
      <section className="landing-section landing-section-alt" id="pricing">
        <div className="landing-container">
          <h2 className="landing-section-title">
            {T("landing_pricing_title")}
          </h2>
          <p className="landing-section-sub">
            {T("landing_pricing_subtitle")}
          </p>

          {/* Billing toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24, marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: yearly ? "var(--muted)" : "var(--text)" }}>
              {T("landing_monthly")}
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
              {T("landing_yearly")}
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
                {T("landing_save")}
              </span>
            )}
          </div>

          <div className="landing-pricing-grid">
            {/* Free Trial */}
            <div className="landing-price-card" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="landing-price-header">
                <h3 className="landing-price-name">{T("landing_free_trial")}</h3>
                <div className="landing-price-amount">
                  <span className="landing-price-dollar" style={{ color: "var(--text)" }}>{T("landing_free_price")}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{T("landing_free_period")}</p>
              </div>
              <ul className="landing-price-features">
                {FREE_FEATURES_KEYS.map((k) => (
                  <li key={k}><IconCheck /> <span>{T(k)}</span></li>
                ))}
              </ul>
              <Link
                href="/login"
                className="landing-price-btn"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                {T("landing_start_trial")}
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
                {yearly ? T("landing_best_value") : T("landing_popular")}
              </div>
              <div className="landing-price-header">
                <h3 className="landing-price-name">{T("landing_pro")}</h3>
                {yearly ? (
                  <>
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--profit)", fontSize: 42, transition: "font-size 0.3s" }}>
                        $7.91
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        {T("landing_per_month")}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, marginTop: 4, color: "var(--muted)" }}>
                      {T("landing_billed_yearly")}
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
                      {T("landing_save")}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="landing-price-amount">
                      <span className="landing-price-dollar" style={{ color: "var(--accent)" }}>
                        $9.99
                      </span>
                      <span className="landing-price-period" style={{ color: "var(--muted)" }}>
                        {T("landing_per_month")}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <ul className="landing-price-features">
                {PRO_FEATURES_KEYS.map((k) => (
                  <li key={k}><IconCheck /> <span>{T(k)}</span></li>
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
                {yearly ? T("landing_get_best") : T("landing_upgrade_pro")}
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
              {T("landing_refund_title")}
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.4 }}>
              {T("landing_refund_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* -- SECTION 7: FAQ -- */}
      <section className="landing-section" id="faq">
        <div className="landing-container">
          <h2 className="landing-section-title">{T("landing_faq_title")}</h2>
          <p className="landing-section-sub">
            {T("landing_faq_sub")}
          </p>
          <div className="landing-faq-list">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.qKey} question={T(item.qKey)} answer={T(item.aKey)} />
            ))}
          </div>
        </div>
      </section>

      {/* -- SECTION 8: FINAL CTA -- */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container" style={{ textAlign: "center" }}>
          <h2 className="landing-section-title">
            {T("landing_final_title")}
          </h2>
          <p className="landing-section-sub">
            {T("landing_final_subtitle")}
          </p>
          <Link
            href="/login"
            className="landing-btn-primary"
            style={{ background: "var(--accent)", color: "#fff", display: "inline-block", marginTop: 20 }}
          >
            {T("landing_start_trial")}
          </Link>
        </div>
      </section>

      {/* -- SECTION 9: FOOTER -- */}
      <footer className="landing-footer" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo" style={{ color: "var(--accent)" }}>EZtrade</span>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              {T("landing_footer_tagline")} {"\uD83D\uDD25"}
            </p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{T("landing_footer_product")}</h4>
              <a href="#features" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_features")}</a>
              <a href="#pricing" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_pricing")}</a>
              <a href="#faq" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_faq")}</a>
            </div>
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{T("landing_footer_support")}</h4>
              <a href="mailto:support@eztradeapp.com" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_contact")}</a>
              <Link href="/privacy" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_privacy")}</Link>
              <Link href="/terms" style={{ color: "var(--muted)", fontSize: 12 }}>{T("landing_footer_terms")}</Link>
            </div>
          </div>
          <div className="landing-footer-bottom" style={{ color: "var(--muted)" }}>
            <p style={{ margin: 0 }}>&copy; 2026 EZtrade. All rights reserved.</p>
            <p style={{ margin: "4px 0 0", fontSize: 10 }}>
              {T("landing_footer_updates")}
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { T, lang, setLang } = useI18n();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentName = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name ?? "English";

  function selectLang(code: LangCode) {
    setLang(code);
    setLangOpen(false);
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
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    className="top-header-lang-option"
                    style={{
                      background: l.code === lang ? "var(--accent)" : "transparent",
                      color: l.code === lang ? "#fff" : "var(--text)",
                    }}
                    onClick={() => selectLang(l.code)}
                  >
                    {l.name}
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
            {T("landing_signin")}
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
