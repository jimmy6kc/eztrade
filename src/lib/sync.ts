import {
  getTrades,
  saveTrade,
  getTemplates,
  saveTemplate,
  getSettings,
  saveSettings,
  subscribeToTrades,
  type Trade,
  type Template,
  type UserSettings,
} from "@/lib/firestore";
import type { Unsubscribe } from "firebase/firestore";

// ---------------------------------------------------------------------------
// LocalStorage keys
// ---------------------------------------------------------------------------

const LS_TRADES = "eztrade_trades";
const LS_TEMPLATES = "eztrade_templates";
const LS_SETTINGS = "eztrade_settings";
const LS_SYNCED = "eztrade_cloud_synced";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------------------------------------------------------------------------
// migrateLocalToCloud
// ---------------------------------------------------------------------------

/**
 * On the user's first login, push any data stored in localStorage up to
 * Firestore so nothing is lost. This is a one-time operation — subsequent
 * calls are skipped via the `eztrade_cloud_synced` flag.
 */
export async function migrateLocalToCloud(uid: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(LS_SYNCED) === "true") return;

  const localTrades = readLocal<Trade[]>(LS_TRADES) ?? [];
  const localTemplates = readLocal<Template[]>(LS_TEMPLATES) ?? [];
  const localSettings = readLocal<Partial<UserSettings>>(LS_SETTINGS);

  const tradePromises = localTrades.map((t) => saveTrade(uid, t));
  const templatePromises = localTemplates.map((t) => saveTemplate(uid, t));
  await Promise.all([...tradePromises, ...templatePromises]);

  if (localSettings) {
    await saveSettings(uid, localSettings);
  }

  localStorage.setItem(LS_SYNCED, "true");
}

// ---------------------------------------------------------------------------
// syncFromCloud
// ---------------------------------------------------------------------------

/**
 * Pull the latest data from Firestore and write it to localStorage so the
 * app can render immediately on the next load (even if offline).
 */
export async function syncFromCloud(uid: string): Promise<void> {
  const [trades, templates, settings] = await Promise.all([
    getTrades(uid),
    getTemplates(uid),
    getSettings(uid),
  ]);

  writeLocal(LS_TRADES, trades);
  writeLocal(LS_TEMPLATES, templates);
  writeLocal(LS_SETTINGS, settings);
}

// ---------------------------------------------------------------------------
// Real-time sync
// ---------------------------------------------------------------------------

let activeUnsubscribe: Unsubscribe | null = null;

/**
 * Attach a Firestore onSnapshot listener for trades and keep localStorage
 * in sync whenever Firestore data changes.
 */
export function startRealtimeSync(uid: string): void {
  // Avoid duplicate listeners.
  stopRealtimeSync();

  activeUnsubscribe = subscribeToTrades(uid, (trades) => {
    writeLocal(LS_TRADES, trades);
  });
}

/**
 * Detach the real-time listener if one is active.
 */
export function stopRealtimeSync(): void {
  if (activeUnsubscribe) {
    activeUnsubscribe();
    activeUnsubscribe = null;
  }
}
