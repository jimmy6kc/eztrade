import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Futures Position Size Calculator - ES, NQ, GC & More | EZtrade",
  description:
    "Calculate futures position size for ES, NQ, GC, CL, and more. Free online futures contract calculator with tick value, margin requirements, and R:R analysis for futures traders.",
  keywords:
    "futures position size calculator, futures contract calculator, ES position size, NQ position size, futures risk calculator, futures tick value calculator, futures margin calculator, GC futures calculator",
  openGraph: {
    title: "Futures Position Size Calculator - ES, NQ, GC & More | EZtrade",
    description:
      "Calculate futures position size for ES, NQ, GC, CL, and more. Free online calculator with tick value and margin analysis.",
    type: "website",
    url: "https://www.eztradeapp.com/futures-position-size-calculator",
  },
  alternates: {
    canonical: "https://www.eztradeapp.com/futures-position-size-calculator",
  },
};

export default function FuturesPositionSizeCalculatorPage() {
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
            Futures Position Size Calculator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 20 }}>
            Futures trading requires precise position sizing because each contract has a different tick value,
            point value, and margin requirement. Unlike stocks where you simply choose a number of shares,
            futures contracts are standardized and each tick movement can represent a significant dollar amount.
            The EZtrade futures position size calculator handles all of this complexity for you, supporting
            popular contracts like ES (S&amp;P 500 E-mini), NQ (Nasdaq 100 E-mini), GC (Gold), CL (Crude Oil),
            and many more.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Understanding Futures Contract Sizing
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Every futures contract has a specific point value and tick size. For example, one ES contract has a
            point value of $50 per point and a minimum tick size of 0.25 points ($12.50 per tick). One NQ contract
            has a point value of $20 per point with a 0.25 tick size ($5.00 per tick). When sizing your position,
            you need to account for these values to understand how much you are actually risking in dollar terms
            based on your stop loss distance.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            How to Calculate Futures Position Size
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            The formula for futures position sizing is:
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
            Contracts = Dollar Risk / (Stop Distance in Points x Point Value)
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>
            For instance, if you have a $100,000 account risking 1% ($1,000) and you are trading ES with a
            4-point stop loss, each point is worth $50, so your risk per contract is $200. You can trade 5
            contracts ($1,000 / $200 = 5). EZtrade performs this calculation instantly and also considers margin
            requirements to ensure you have sufficient buying power.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Supported Futures Contracts
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
              { sym: "ES", name: "S&P 500 E-mini", val: "$50/pt" },
              { sym: "NQ", name: "Nasdaq 100 E-mini", val: "$20/pt" },
              { sym: "GC", name: "Gold", val: "$100/pt" },
              { sym: "CL", name: "Crude Oil", val: "$1,000/pt" },
              { sym: "MES", name: "Micro S&P 500", val: "$5/pt" },
              { sym: "MNQ", name: "Micro Nasdaq", val: "$2/pt" },
            ].map((c) => (
              <div
                key={c.sym}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <span style={{ fontWeight: 800, color: "var(--accent)" }}>{c.sym}</span>
                <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 8 }}>{c.name}</span>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{c.val}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 36 }}>
            Margin and Risk Management for Futures
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>
            Futures trading uses leverage, which means you only need a fraction of the full contract value as
            margin. While this amplifies potential returns, it also magnifies risk. Proper position sizing is even
            more critical in futures than in stocks because of this leverage. EZtrade helps prop firm traders track
            daily loss limits and maximum drawdown to stay compliant with their funded account rules.
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
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Try the Futures Calculator Now</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
              Supports ES, NQ, GC, CL, MES, MNQ, and more. No sign-up required.
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
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What is a tick value in futures?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              A tick is the minimum price movement of a futures contract. Each contract has a specific dollar
              value per tick. For ES, one tick (0.25 points) equals $12.50. For NQ, one tick (0.25 points)
              equals $5.00. Your position size calculator must account for these values.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>How many contracts should I trade?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              The number of contracts depends on your account size, risk tolerance, and stop loss distance.
              Never risk more than 1-2% of your account on a single futures trade. Use the EZtrade calculator
              to determine the exact number of contracts for each setup.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Does EZtrade support micro futures?</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>
              Yes. EZtrade supports micro contracts including MES (Micro S&amp;P 500), MNQ (Micro Nasdaq), and
              others. Micro contracts are ideal for traders with smaller accounts who want to maintain proper
              position sizing discipline.
            </p>
          </div>

          <div style={{ marginTop: 32, fontSize: 14 }}>
            <p style={{ color: "var(--muted)" }}>
              Related tools:{" "}
              <Link href="/stock-position-size-calculator" style={{ color: "var(--accent)" }}>Stock Position Size Calculator</Link>
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
