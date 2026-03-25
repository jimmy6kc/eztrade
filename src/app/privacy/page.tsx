import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - EZtrade",
  description: "EZtrade privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px 80px" }}>
        <Link href="/" style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
          &larr; Back to Home
        </Link>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Last updated: March 2026</p>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Information We Collect</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            When you create an account, we collect your email address and authentication credentials.
            When you use EZtrade, we store your trade data, calculator inputs, strategy templates, and
            app preferences. This data is necessary to provide our core services including cloud sync,
            trade logging, and analytics.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. How We Store Your Data</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            Your data is stored securely using Google Firebase with industry-standard encryption (AES-256)
            both in transit and at rest. We use Firebase Authentication for secure sign-in and Firestore
            for database storage. Your data is only accessible by you through your authenticated account.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. We Do Not Sell Your Data</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            We will never sell, rent, or share your personal information or trade data with third parties
            for marketing purposes. Your trading data is yours and yours alone.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Cookies</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            We use essential cookies and localStorage to maintain your session, remember your language
            preference, and store your theme settings. We do not use tracking cookies or third-party
            advertising cookies.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. GDPR Compliance</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            If you are located in the European Economic Area, you have the right to access, correct,
            or delete your personal data at any time. You may request a copy of all data we hold about
            you, or request complete deletion of your account and associated data. To exercise these
            rights, contact us at the email below.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Contact Us</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
            If you have any questions about this privacy policy or your data, please contact us at{" "}
            <a href="mailto:support@eztradeapp.com" style={{ color: "var(--accent)" }}>
              support@eztradeapp.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
