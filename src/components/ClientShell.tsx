"use client";

import { usePathname } from "next/navigation";
import { I18nProvider } from "@/lib/i18n-context";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";

const HIDE_CHROME_ROUTES = ["/landing", "/login", "/pricing"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = HIDE_CHROME_ROUTES.includes(pathname);

  return (
    <I18nProvider>
      {!hideChrome && <TopHeader />}
      <main className={hideChrome ? "" : "pt-top-header"}>
        {children}
      </main>
      {!hideChrome && <BottomNav />}
    </I18nProvider>
  );
}
