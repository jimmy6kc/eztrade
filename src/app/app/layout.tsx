"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, trialDaysLeft, trialExpired } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-sm" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Trial expired banner */}
      {trialExpired && (
        <div
          className="px-4 py-2 text-center text-xs font-semibold"
          style={{
            background: "rgba(244,67,54,0.15)",
            color: "var(--loss)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          Your free trial has ended. Upgrade to Pro to continue.{" "}
          <Link
            href="/pricing"
            className="underline font-bold"
            style={{ color: "var(--accent)" }}
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Active trial banner */}
      {!trialExpired && trialDaysLeft !== null && trialDaysLeft > 0 && (
        <div
          className="px-4 py-1.5 text-center text-[11px]"
          style={{
            background: "rgba(0,188,212,0.08)",
            color: "var(--accent)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left in your free trial
        </div>
      )}

      {children}
    </>
  );
}
