import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Trade {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  pnl?: number;
  notes?: string;
  tags?: string[];
  strategy?: string;
  status: "open" | "closed";
  createdAt?: ReturnType<typeof serverTimestamp>;
  updatedAt?: ReturnType<typeof serverTimestamp>;
}

export interface Template {
  id: string;
  name: string;
  symbol?: string;
  direction?: "long" | "short";
  quantity?: number;
  strategy?: string;
  tags?: string[];
  notes?: string;
  createdAt?: ReturnType<typeof serverTimestamp>;
}

export interface UserSettings {
  defaultCurrency: string;
  defaultTimezone: string;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  livePricesEnabled: boolean;
  tradingViewEnabled: boolean;
  ibkrLinked: boolean;
}

// ---------------------------------------------------------------------------
// Collection helpers
// ---------------------------------------------------------------------------

function tradesCol(uid: string) {
  return collection(db, "users", uid, "trades");
}

function templatesCol(uid: string) {
  return collection(db, "users", uid, "templates");
}

function settingsDoc(uid: string) {
  return doc(db, "users", uid, "settings", "preferences");
}

// ---------------------------------------------------------------------------
// Trades
// ---------------------------------------------------------------------------

export async function getTrades(uid: string): Promise<Trade[]> {
  const q = query(tradesCol(uid), orderBy("entryDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Trade));
}

export async function saveTrade(
  uid: string,
  trade: Omit<Trade, "createdAt" | "updatedAt"> & { id?: string }
): Promise<string> {
  const id = trade.id ?? doc(tradesCol(uid)).id;
  const ref = doc(tradesCol(uid), id);

  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      ...trade,
      id,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return id;
}

export async function deleteTrade(uid: string, tradeId: string): Promise<void> {
  await deleteDoc(doc(tradesCol(uid), tradeId));
}

export function subscribeToTrades(
  uid: string,
  callback: (trades: Trade[]) => void
): Unsubscribe {
  const q = query(tradesCol(uid), orderBy("entryDate", "desc"));
  return onSnapshot(q, (snap) => {
    const trades = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Trade));
    callback(trades);
  });
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export async function getTemplates(uid: string): Promise<Template[]> {
  const snap = await getDocs(templatesCol(uid));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Template));
}

export async function saveTemplate(
  uid: string,
  template: Omit<Template, "createdAt"> & { id?: string }
): Promise<string> {
  const id = template.id ?? doc(templatesCol(uid)).id;
  const ref = doc(templatesCol(uid), id);

  await setDoc(
    ref,
    {
      ...template,
      id,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return id;
}

export async function deleteTemplate(
  uid: string,
  templateId: string
): Promise<void> {
  await deleteDoc(doc(templatesCol(uid), templateId));
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: UserSettings = {
  defaultCurrency: "USD",
  defaultTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: "system",
  notifications: true,
  livePricesEnabled: false,
  tradingViewEnabled: false,
  ibkrLinked: false,
};

export async function getSettings(uid: string): Promise<UserSettings> {
  const snap = await getDoc(settingsDoc(uid));
  if (!snap.exists()) {
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<UserSettings>) };
}

export async function saveSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  await setDoc(settingsDoc(uid), settings, { merge: true });
}
