export const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'zh_cn', name: '简体中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'de', name: 'Deutsch' },
  { code: 'th', name: 'ไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'fr', name: 'Français' },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

type LocaleMap = Record<string, string>;

let currentLang: LangCode = 'en';
let currentLocale: LocaleMap = {};
let fallbackLocale: LocaleMap = {};

// Inline English fallback for SSR / build time (subset of critical keys)
const EN_FALLBACK: LocaleMap = {
  title: 'EZtrade', subtitle: 'Risk, Entry, SL → Position & R:R',
  stock: 'Stocks', futures: 'Futures', direction: 'Direction',
  long: 'Long', short: 'Short', risk_amount: 'Risk ($)',
  entry_price: 'Entry ($)', sl_price: 'SL Price ($)',
  tp_targets: 'TP Targets (optional)', calc_btn: 'Calculate',
  copy_btn: 'Copy', save_trade: 'Save Trade',
  nav_calc: 'Calc', nav_tpl: 'Strategy', nav_log: 'Log', nav_dash: 'Stats', nav_settings: 'Settings',
};

export async function loadLocale(lang: string): Promise<LocaleMap> {
  if (typeof window === 'undefined') return EN_FALLBACK;
  try {
    const res = await fetch(`/locales/${lang}.json`);
    if (!res.ok) return EN_FALLBACK;
    return await res.json();
  } catch {
    return EN_FALLBACK;
  }
}

export async function setLanguage(lang: LangCode): Promise<void> {
  currentLang = lang;
  currentLocale = await loadLocale(lang);
  if (lang !== 'en' && Object.keys(fallbackLocale).length === 0) {
    fallbackLocale = await loadLocale('en');
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('eztrade_lang', lang);
  }
}

export function getLanguage(): LangCode {
  return currentLang;
}

export function T(key: string): string {
  return currentLocale[key] ?? fallbackLocale[key] ?? EN_FALLBACK[key] ?? key;
}

export async function initI18n(lang?: LangCode): Promise<void> {
  const saved = (typeof window !== 'undefined'
    ? localStorage.getItem('eztrade_lang')
    : null) as LangCode | null;

  const target = lang ?? saved ?? 'en';

  fallbackLocale = await loadLocale('en');
  await setLanguage(target);
}
