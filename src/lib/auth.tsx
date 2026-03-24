"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Tier = "free" | "pro" | "premium";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  tier: Tier;
  trialDaysLeft: number | null; // null = not on trial, 0+ = days remaining
  trialExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

// ---------------------------------------------------------------------------
// Helper — ensure a user document exists in Firestore
// ---------------------------------------------------------------------------

interface UserDocResult {
  tier: Tier;
  trialStart: Date | null;
  trialDays: number;
}

async function ensureUserDoc(user: User): Promise<UserDocResult> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      tier: (data.tier as Tier) ?? "free",
      trialStart: data.trialStart?.toDate?.() ?? null,
      trialDays: data.trialDays ?? 3,
    };
  }

  // First-time user — create their document with a free trial.
  await setDoc(ref, {
    email: user.email,
    displayName: user.displayName ?? null,
    tier: "free" as Tier,
    trialStart: serverTimestamp(),
    trialDays: 3,
    createdAt: serverTimestamp(),
  });

  return { tier: "free", trialStart: new Date(), trialDays: 3 };
}

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<Tier>("free");
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const result = await ensureUserDoc(firebaseUser);
        setTier(result.tier);

        // Compute trial state
        if (result.tier === "free" && result.trialStart) {
          const now = Date.now();
          const trialEnd = result.trialStart.getTime() + result.trialDays * 24 * 60 * 60 * 1000;
          const msLeft = trialEnd - now;
          if (msLeft <= 0) {
            setTrialDaysLeft(0);
            setTrialExpired(true);
          } else {
            setTrialDaysLeft(Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
            setTrialExpired(false);
          }
        } else {
          setTrialDaysLeft(null);
          setTrialExpired(false);
        }
      } else {
        setUser(null);
        setTier("free");
        setTrialDaysLeft(null);
        setTrialExpired(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ------ Auth methods ------

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithEmail = login;

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    []
  );

  const signInWithGoogleFn = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signInWithAppleFn = useCallback(async () => {
    await signInWithPopup(auth, appleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  // ------ Value ------

  const value: AuthContextValue = {
    user,
    loading,
    tier,
    trialDaysLeft,
    trialExpired,
    login,
    logout,
    signInWithGoogle: signInWithGoogleFn,
    signInWithApple: signInWithAppleFn,
    signInWithEmail,
    signUpWithEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
