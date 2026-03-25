import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Trading Journal App - Track & Analyze Your Trades | EZtrade",
  description:
    "Track and analyze every trade with the EZtrade trading journal. Log entries with tags, notes, and screenshots. View equity curves, heatmaps, and advanced analytics. Free to start.",
  keywords:
    "trading journal, trade journal app, trading log, trade tracker, trading diary, trade analysis, equity curve, trading analytics, trading performance tracker, free trading journal",
  openGraph: {
    title: "Free Trading Journal App - Track & Analyze Your Trades | EZtrade",
    description:
      "Track and analyze every trade with the EZtrade trading journal. Log entries with tags, notes, and screenshots. View equity curves and advanced analytics.",
    type: "website",
    url: "https://www.eztradeapp.com/trading-journal",
  },
  alternates: {
    canonical: "https://www.eztradeapp.com/trading-journal",
  },
};

export default function TradingJournalPage() {
  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-nav-brand" style={{ color: "var(--accent)" }}>
            EZtrade
          </Link>
          <div className="landing-nav-right">
            <Link href="/login" className="landing-nav-signin" style={{ color: "var(--accent)" }}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="landing-section" style={{ paddingTop: 48 }}>
        <div className="landing-container" style={{ maxWidth: 720 }}>
          <h1 className="landing-section-title" style={{ fontSize: 36, textAlign: "left" }}>
            Trading Journal App
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 20 }}>
            A trading journal is the single most important tool for improving your trading performance over time.
            Research shows that traders who consistently journal their trades are 30% more likely to be profitable
            compared to those who do not. The EZtrade trading journal makes it effortless to log every trade,
            track your performance metrics, and identify the patterns that separate your winning setups from
            your losing ones.
          </p>

          <div
            style={{
              background: "rgba(76,175,80,0.08)",
              border: "1px solid rgba(76,175,80,0.2)",
              borderRadius: 12,
              padding: 24,
              marginTop: 24,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 28, fontWeight: 900, color: "var(--profit)", margin: 0 }}>30%</p>
            <p style={{ fontSize: 14, color: "var(--profit)", fontWeight: 600, marginTop: 4 }}>
              Traders who journal are 30% more likely to be profitable
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Source: Trading Psychology Research
            </p>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Why Every Trader Needs a Journal
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Trading without a journal is like driving without a dashboard. You have no idea how fast you are going,
            how much fuel you have left, or whether the engine is overheating. A trading journal provides the data
            you need to make informed decisions about your strategy. It reveals your win rate, average R:R ratio,
            best performing setups, worst trading days, and emotional patterns that sabotage your results. Over time,
            this data becomes your most valuable trading asset.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            EZtrade Journal Features
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
              marginTop: 16,
            }}
          >
            {[
              { title: "One-Tap Logging", desc: "Log trades directly from the calculator with a single tap. Entry, stop, targets, and size are pre-filled." },
              { title: "Tags & Notes", desc: "Add custom tags like setup type, market conditions, and emotions. Attach notes and screenshots to every trade." },
              { title: "Equity Curve", desc: "Visualize your P&L over time with an interactive equity curve chart. Spot drawdowns and winning streaks instantly." },
              { title: "Performance Heatmap", desc: "See which days and hours are your most profitable. Optimize your trading schedule based on real data." },
              { title: "Cloud Sync", desc: "Access your journal from any device. Phone, tablet, desktop — your trades are always in sync." },
              { title: "CSV Export", desc: "Export your trade data to CSV for deeper analysis in Excel or Google Sheets." },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            How to Start Journaling Your Trades
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Getting started is simple. Sign up for a free EZtrade account, calculate your position size for your
            next trade, and save it to your journal with one tap. After the trade closes, update the result. Within
            a few weeks, you will have enough data to start seeing patterns in your trading. The key is consistency.
            Even logging just the basics (entry, exit, P&L, and one sentence about the setup) is infinitely better
            than logging nothing at all.
          </p>

          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              padding: 32,
              borderRadius: 14,
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Start Journaling Today</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
              Free 7-day trial with full Pro features. No credit card required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
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
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Frequently Asked Questions
          </h2>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Is the trading journal free?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              The free tier includes up to 2 saved trades with basic stats. For unlimited trade logging, cloud sync,
              equity curves, and advanced analytics, upgrade to Pro starting at $7.91/month with annual billing.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Can I import trades from my broker?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Currently, trades are logged manually or directly from the EZtrade calculator. CSV import from brokers
              is on our roadmap. You can also export your EZtrade data to CSV at any time.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What analytics does the journal provide?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Pro users get equity curves, performance heatmaps, win rate by setup type, average R:R ratio,
              profit factor, best and worst trading days, and more. All analytics update in real time as you log trades.
            </p>
          </div>

          <div style={{ marginTop: 32, fontSize: 14 }}>
            <p style={{ color: "var(--muted)" }}>
              Related tools:{" "}
              <Link href="/stock-position-size-calculator" style={{ color: "var(--accent)" }}>Stock Position Size Calculator</Link>
              {" | "}
              <Link href="/futures-position-size-calculator" style={{ color: "var(--accent)" }}>Futures Position Size Calculator</Link>
              {" | "}
              <Link href="/risk-reward-calculator" style={{ color: "var(--accent)" }}>Risk Reward Calculator</Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="landing-footer" style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo" style={{ color: "var(--accent)" }}>EZtrade</span>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Built for traders, by traders</p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <h4 style={{ color: "var(--text)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Product</h4>
              <Link href="/#features" style={{ color: "var(--muted)", fontSize: 12 }}>Features</Link>
              <Link href="/pricing" style={{ color: "var(--muted)", fontSize: 12 }}>Pricing</Link>
              <Link href="/#faq" style={{ color: "var(--muted)", fontSize: 12 }}>FAQ</Link>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
