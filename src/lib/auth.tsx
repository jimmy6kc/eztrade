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

async function ensureUserDoc(user: User): Promise<Tier> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return (snap.data().tier as Tier) ?? "free";
  }

  // First-time user — create their document with the free tier.
  await setDoc(ref, {
    email: user.email,
    displayName: user.displayName ?? null,
    tier: "free" as Tier,
    createdAt: serverTimestamp(),
  });

  return "free";
}

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userTier = await ensureUserDoc(firebaseUser);
        setTier(userTier);
      } else {
        setUser(null);
        setTier("free");
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
