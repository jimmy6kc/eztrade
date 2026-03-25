import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Risk Reward Ratio Calculator - R:R Analysis Tool | EZtrade",
  description:
    "Calculate risk reward ratio for any trade setup. Free R:R calculator with multi-target analysis (T1-T5), visual price bar, and automatic profit/loss projections for stocks and futures.",
  keywords:
    "risk reward calculator, risk reward ratio, R:R calculator, risk to reward ratio, trading risk reward, risk reward analysis, trade risk calculator, RR ratio calculator",
  openGraph: {
    title: "Risk Reward Ratio Calculator - R:R Analysis Tool | EZtrade",
    description:
      "Calculate risk reward ratio for any trade setup. Free R:R calculator with multi-target analysis and automatic profit/loss projections.",
    type: "website",
    url: "https://www.eztradeapp.com/risk-reward-calculator",
  },
  alternates: {
    canonical: "https://www.eztradeapp.com/risk-reward-calculator",
  },
};

export default function RiskRewardCalculatorPage() {
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
            Risk Reward Ratio Calculator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 20 }}>
            The risk-to-reward ratio (R:R) is one of the most fundamental metrics in trading. It tells you how
            much potential profit a trade offers relative to its potential loss. A trade with a 1:3 R:R means you
            are risking $1 to potentially make $3. Understanding and calculating R:R before entering a trade is
            essential for long-term profitability. The EZtrade risk reward calculator computes your R:R instantly
            and supports up to 5 take-profit targets with automatic percentage distribution.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Why Risk Reward Ratio Matters
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Even a trader with a 40% win rate can be highly profitable if their average winner is significantly
            larger than their average loser. This is where R:R comes in. If you consistently take trades with a
            1:2 or better R:R, you only need to win 34% of your trades to break even. With a 1:3 R:R, you only
            need a 25% win rate. By filtering trades through an R:R lens, you naturally eliminate low-quality
            setups and focus on trades that offer the best risk-adjusted returns.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            How to Calculate Risk Reward Ratio
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            The R:R ratio calculation is simple:
          </p>
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              marginTop: 16,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            R:R = (Target Price - Entry Price) / (Entry Price - Stop Loss)
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>
            For a long trade with entry at $100, stop loss at $98, and target at $106, the risk is $2 and the
            reward is $6, giving you a 1:3 R:R ratio. For short trades, the formula is reversed. EZtrade handles
            both long and short calculations automatically and also computes the dollar P&amp;L at each target level
            based on your position size.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Multi-Target R:R Analysis with T1-T5
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Many traders scale out of positions at multiple price targets. EZtrade supports up to 5 take-profit
            targets (T1 through T5) with customizable percentage distribution. For example, you might take 40%
            off at T1 (1:1 R:R), another 30% at T2 (1:2 R:R), and let the remaining 30% run to T3 (1:3 R:R).
            The calculator shows you the expected P&amp;L at each level and the blended R:R for the entire trade,
            giving you a complete picture before you enter.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Minimum R:R Guidelines
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginTop: 16,
            }}
          >
            {[
              { rr: "1:1", desc: "Minimum viable. Need 50%+ win rate.", color: "var(--warn)" },
              { rr: "1:2", desc: "Good. Profitable at 34%+ win rate.", color: "var(--accent)" },
              { rr: "1:3+", desc: "Excellent. Profitable at 25%+ win rate.", color: "var(--profit)" },
            ].map((r) => (
              <div
                key={r.rr}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 24, fontWeight: 900, color: r.color, margin: 0 }}>{r.rr}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>{r.desc}</p>
              </div>
            ))}
          </div>

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
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Calculate Your R:R Now</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
              Free calculator with multi-target support. No sign-up required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <Link
                href="/calc-demo"
                className="landing-btn-primary"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Open Free Calculator
              </Link>
              <Link
                href="/login"
                className="landing-btn-secondary"
                style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Start 7-Day Free Trial
              </Link>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Frequently Asked Questions
          </h2>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What is a good risk reward ratio?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              A minimum of 1:2 is recommended for most trading strategies. This means for every dollar you risk,
              you target at least two dollars of profit. Higher R:R ratios (1:3 or better) give you more room for
              error in your win rate.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Can I use R:R for both stocks and futures?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Yes. The R:R concept applies universally across all markets. EZtrade calculates R:R for both stocks
              and futures, automatically accounting for contract specifications like point values and tick sizes
              when computing dollar P&amp;L.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Should I always aim for high R:R trades?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Not necessarily. Very high R:R trades (1:5+) typically have lower win rates because the target is
              far from entry. The best approach is to find a balance between R:R and probability. Most successful
              traders find their sweet spot between 1:2 and 1:3 R:R.
            </p>
          </div>

          <div style={{ marginTop: 32, fontSize: 14 }}>
            <p style={{ color: "var(--muted)" }}>
              Related tools:{" "}
              <Link href="/stock-position-size-calculator" style={{ color: "var(--accent)" }}>Stock Position Size Calculator</Link>
              {" | "}
              <Link href="/futures-position-size-calculator" style={{ color: "var(--accent)" }}>Futures Position Size Calculator</Link>
              {" | "}
              <Link href="/trading-journal" style={{ color: "var(--accent)" }}>Trading Journal</Link>
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
