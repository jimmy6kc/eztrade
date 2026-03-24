"use client";

import { useI18n, SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n-context";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function TopHeader() {
  const { lang, setLang } = useI18n();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Read theme on mount
  useEffect(() => {
    const t = localStorage.getItem("eztrade_theme");
    if (t === "light") {
      setTheme("light");
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("eztrade_theme", next);
    // Also update settings storage
    try {
      const raw = localStorage.getItem("eztrade_settings");
      if (raw) {
        const s = JSON.parse(raw);
        s.theme = next;
        localStorage.setItem("eztrade_settings", JSON.stringify(s));
      }
    } catch { /* ignore */ }
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleLangChange = (code: LangCode) => {
    setLang(code);
    setLangOpen(false);
  };

  const currentLangName =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.name ?? "English";

  return (
    <header
      className="top-header"
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="top-header-inner">
        {/* Left: brand */}
        <Link
          href="/app"
          className="top-header-brand"
          style={{ color: "var(--accent)" }}
        >
          EZtrade
        </Link>

        {/* Right: controls */}
        <div className="top-header-controls">
          {/* Language dropdown */}
          <div className="top-header-lang" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="top-header-lang-btn"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              aria-label="Change language"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 18.902 18.902 0 01-3.36 3.04 1 1 0 11-1.11-1.664 16.89 16.89 0 003.04-2.82 18.89 18.89 0 01-1.69-2.99 1 1 0 111.84-.78 16.89 16.89 0 001.316 2.318A16.877 16.877 0 007.578 6H3a1 1 0 010-2h3V3a1 1 0 011-1zM14 8a1 1 0 00-.956.7l-2.8 9.333a1 1 0 001.912.575L12.848 16h2.304l.692 2.608a1 1 0 001.912-.575l-2.8-9.333A1 1 0 0014 8zm.4 6h-.8l.4-1.333L14.4 14z" clipRule="evenodd" />
              </svg>
              <span className="top-header-lang-label">{currentLangName}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3" style={{ color: "var(--muted)", flexShrink: 0 }}>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {langOpen && (
              <div
                className="top-header-lang-menu"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className="top-header-lang-option"
                    style={{
                      background: lang === l.code ? "var(--accent)" : "transparent",
                      color: lang === l.code ? "#fff" : "var(--text)",
                    }}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="top-header-theme-btn"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              /* Sun icon */
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              /* Moon icon */
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
