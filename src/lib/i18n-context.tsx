"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  SUPPORTED_LANGUAGES,
  type LangCode,
  initI18n,
  setLanguage as setLangModule,
  T as TModule,
  getLanguage,
} from "./i18n";

interface I18nContextValue {
  lang: LangCode;
  T: (key: string) => string;
  setLang: (lang: LangCode) => void;
  ready: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0); // force re-render after locale loads

  // Initialize i18n on mount
  useEffect(() => {
    initI18n().then(() => {
      setLangState(getLanguage());
      setReady(true);
    });
  }, []);

  const setLang = useCallback(async (newLang: LangCode) => {
    await setLangModule(newLang);
    setLangState(newLang);
    setTick((t) => t + 1); // force re-render so T() picks up new locale
  }, []);

  // T wrapper that reads from the module (always current)
  const T = useCallback((key: string): string => {
    return TModule(key);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <I18nContext.Provider value={{ lang, T, setLang, ready }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export { SUPPORTED_LANGUAGES, type LangCode };
