"use client";

import { usePathname } from "next/navigation";
import { I18nProvider } from "@/lib/i18n-context";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show TopHeader + BottomNav only for /app/* routes
  const showChrome = pathname.startsWith("/app");

  return (
    <I18nProvider>
      {showChrome && <TopHeader />}
      <main className={showChrome ? "pt-top-header" : ""}>
        {children}
      </main>
      {showChrome && <BottomNav />}
    </I18nProvider>
  );
}
