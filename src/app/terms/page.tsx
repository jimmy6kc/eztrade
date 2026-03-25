import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - EZtrade",
  description: "EZtrade terms of service. Read our terms and conditions for using the platform.",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px 80px" }}>
        <Link href="/" style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
          &larr; Back to Home
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Last updated: March 2026</p>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Service Description</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            EZtrade is a position size calculator and trade journal application designed for educational
            and informational purposes. EZtrade does not provide financial advice, does not execute trades,
            and does not connect to brokerage accounts. All calculations are tools to assist your own
            decision-making process.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. Account Responsibilities</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activities that occur under your account. You must provide accurate information when
            creating your account and keep it up to date. You must not share your account with others
            or create multiple accounts.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. Subscription Terms</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            EZtrade offers both free and paid subscription tiers. Paid subscriptions are billed either
            monthly ($9.99/month) or annually ($94.95/year). Subscriptions automatically renew at the
            end of each billing period unless cancelled. You may cancel your subscription at any time
            from your account settings, and access will continue until the end of the current billing period.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. 7-Day Refund Policy</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            We offer a 7-day money-back guarantee on all paid subscriptions. If you are not satisfied
            with EZtrade for any reason, email us within 7 days of your purchase for a full refund.
            No questions asked. Refund requests should be sent to{" "}
            <a href="mailto:support@eztradeapp.com" style={{ color: "var(--accent)" }}>
              support@eztradeapp.com
            </a>.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Limitation of Liability</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            EZtrade is provided &quot;as is&quot; without warranties of any kind, either express or implied.
            We are not responsible for any trading losses, financial decisions, or outcomes resulting from
            the use of our calculator, journal, or any other features. Trading involves substantial risk
            of loss and is not suitable for all investors. You are solely responsible for your trading decisions.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Contact Us</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            For questions about these terms, please contact us at{" "}
            <a href="mailto:support@eztradeapp.com" style={{ color: "var(--accent)" }}>
              support@eztradeapp.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
