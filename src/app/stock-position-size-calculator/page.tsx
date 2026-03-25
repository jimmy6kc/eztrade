import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stock Position Size Calculator - Free Online Tool | EZtrade",
  description:
    "Calculate your stock position size instantly based on account size, risk percentage, and stop loss. Free online stock position size calculator with R:R analysis for day traders and swing traders.",
  keywords:
    "stock position size calculator, position sizing stocks, how many shares to buy, stock risk calculator, share size calculator, trading position size, stock trade calculator",
  openGraph: {
    title: "Stock Position Size Calculator - Free Online Tool | EZtrade",
    description:
      "Calculate your stock position size instantly based on account size, risk percentage, and stop loss. Free tool for day traders and swing traders.",
    type: "website",
    url: "https://www.eztradeapp.com/stock-position-size-calculator",
  },
  alternates: {
    canonical: "https://www.eztradeapp.com/stock-position-size-calculator",
  },
};

export default function StockPositionSizeCalculatorPage() {
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
            Stock Position Size Calculator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 20 }}>
            Knowing exactly how many shares to buy on every trade is one of the most critical skills in trading.
            A stock position size calculator removes the guesswork by computing the optimal number of shares based
            on your account size, the percentage of capital you are willing to risk, and the distance between your
            entry price and stop loss.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Why Position Sizing Matters for Stock Traders
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Professional traders never risk more than a small percentage of their account on a single trade,
            typically between 0.5% and 2%. This discipline ensures that even a string of losing trades will not
            blow up a trading account. Without proper position sizing, you are gambling rather than trading.
            A position size calculator enforces consistent risk management on every single trade, whether you are
            day trading volatile small caps or swing trading large cap stocks.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            The Position Size Formula
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            The formula for calculating position size is straightforward:
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
            Shares = (Account Size x Risk %) / (Entry Price - Stop Loss)
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>
            For example, if you have a $50,000 account and you are willing to risk 1% per trade ($500), and your
            entry price is $150 with a stop loss at $145, the dollar risk per share is $5. Dividing $500 by $5
            gives you 100 shares. This is the maximum number of shares you should buy to stay within your risk
            parameters.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Features of the EZtrade Stock Calculator
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            EZtrade goes beyond a simple calculator. It offers live price feeds so your entry price auto-fills,
            multi-target R:R analysis with up to 5 take-profit levels, a built-in trade journal to log the results,
            and cloud sync so your data is available on every device. Prop firm traders can also set daily loss limits
            to stay within funded account drawdown rules. The calculator supports both long and short positions, and
            works with any US-listed stock or ETF.
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
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Try the Calculator Now</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
              No sign-up required. Calculate your position size in seconds.
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
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What is position sizing?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Position sizing is the process of determining how many shares or contracts to trade based on your risk
              tolerance. It is the foundation of risk management and ensures no single trade can cause catastrophic
              losses to your trading account.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>How much should I risk per trade?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Most professional traders risk between 0.5% and 2% of their account per trade. Beginners should start
              at the lower end (0.5% to 1%) until they have a proven strategy with a positive expectancy.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Does EZtrade work for day trading and swing trading?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Yes. EZtrade works for any trading style. Whether you are scalping with tight stop losses or holding
              swing trades for days, the position size calculator adjusts to your specific risk parameters.
            </p>
          </div>

          <div style={{ marginTop: 32, fontSize: 14 }}>
            <p style={{ color: "var(--muted)" }}>
              Related tools:{" "}
              <Link href="/futures-position-size-calculator" style={{ color: "var(--accent)" }}>Futures Position Size Calculator</Link>
              {" | "}
              <Link href="/risk-reward-calculator" style={{ color: "var(--accent)" }}>Risk Reward Calculator</Link>
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
