"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n-context";
import type { LangCode } from "@/lib/i18n";
import Link from "next/link";

const SETTINGS_KEY = "eztrade_settings";

interface AppSettings {
  lang: LangCode;
  theme: "dark" | "light";
  dailyRiskLimit: number;
  propFirmMode: boolean;
  propFirmMaxLoss: number;
  propFirmDailyMax: number;
}

const defaults: AppSettings = {
  lang: "en",
  theme: "dark",
  dailyRiskLimit: 500,
  propFirmMode: false,
  propFirmMaxLoss: 2000,
  propFirmDailyMax: 500,
};

export default function SettingsPage() {
  const { T } = useI18n();
  const router = useRouter();
  const { user, tier, logout } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaults);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        setSettings({ ...defaults, ...JSON.parse(raw) });
      }
      // Also read theme
      const t = localStorage.getItem("eztrade_theme");
      if (t === "light" || t === "dark") {
        setSettings((s) => ({ ...s, theme: t }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist
  const update = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  // Theme
  const toggleTheme = () => {
    const next = settings.theme === "dark" ? "light" : "dark";
    update({ theme: next });
    localStorage.setItem("eztrade_theme", next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  // Language
  const changeLang = (lang: LangCode) => {
    update({ lang });
    localStorage.setItem("eztrade_lang", lang);
  };

  // Backup
  const backup = () => {
    const data = {
      trades: JSON.parse(localStorage.getItem("eztrade_trades") || "[]"),
      strategies: JSON.parse(localStorage.getItem("eztrade_strategies") || "[]"),
      settings: settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eztrade_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import
  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (data.trades) localStorage.setItem("eztrade_trades", JSON.stringify(data.trades));
          if (data.strategies) localStorage.setItem("eztrade_strategies", JSON.stringify(data.strategies));
          if (data.settings) {
            const s = { ...defaults, ...data.settings };
            setSettings(s);
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
          }
          alert("Data imported successfully!");
        } catch {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex-1 px-4 py-4 pb-nav">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            {T("nav_settings")}
          </h1>
          <Link href="/app" className="text-xs" style={{ color: "var(--muted)" }}>
            &larr; {T("back")}
          </Link>
        </div>

        {/* Account */}
        <Section title={T("account")}>
          {user ? (
            <div className="space-y-3">
              <Row label={T("email")} value={user.email || "N/A"} />
              <Row
                label={T("plan")}
                value={
                  <span className="font-semibold capitalize" style={{ color: "var(--accent)" }}>
                    {tier}
                  </span>
                }
              />
              <div className="flex gap-2">
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {tier === "free" ? T("upgrade") : T("manage_plan")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "rgba(244,67,54,0.15)", color: "var(--loss)" }}
                >
                  {T("logout")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {T("sign_in_hint")}
              </p>
              <Link
                href="/login"
                className="inline-block px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {T("sign_in")}
              </Link>
            </div>
          )}
        </Section>

        {/* Risk Management */}
        <Section title={T("risk_settings")}>
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              {T("max_daily_risk")}
            </label>
            <input
              type="number"
              value={settings.dailyRiskLimit}
              onChange={(e) => update({ dailyRiskLimit: Number(e.target.value) })}
              className="w-full mt-1"
              min={0}
            />
          </div>
        </Section>

        {/* Prop Firm */}
        <Section title={T("prop_firm")}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{T("prop_firm")}</span>
            <button
              onClick={() => update({ propFirmMode: !settings.propFirmMode })}
              className={`toggle-switch ${settings.propFirmMode ? "active" : ""}`}
              aria-label="Toggle prop firm mode"
            />
          </div>
          {settings.propFirmMode && (
            <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-in">
              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  {T("max_daily_loss")}
                </label>
                <input
                  type="number"
                  value={settings.propFirmMaxLoss}
                  onChange={(e) => update({ propFirmMaxLoss: Number(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  {T("max_drawdown")}
                </label>
                <input
                  type="number"
                  value={settings.propFirmDailyMax}
                  onChange={(e) => update({ propFirmDailyMax: Number(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>
            </div>
          )}
        </Section>

        {/* Data */}
        <Section title={T("data")}>
          <div className="flex gap-2">
            <button
              onClick={backup}
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {T("backup_now")}
            </button>
            <button
              onClick={importData}
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {T("import_data")}
            </button>
          </div>
        </Section>

        {/* Contact Us */}
        <Section title={T("contact_us")}>
          <a
            href="mailto:support@eztradeapp.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: "var(--accent)", color: "#fff", textDecoration: "none" }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            support@eztradeapp.com
          </a>
        </Section>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            EZtrade v0.1.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
