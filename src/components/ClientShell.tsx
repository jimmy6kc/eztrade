"use client";

import { usePathname } from "next/navigation";
import { I18nProvider } from "@/lib/i18n-context";
import TopHeader from "@/components/TopHeader";

const HIDE_HEADER_ROUTES = ["/landing"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = HIDE_HEADER_ROUTES.includes(pathname);

  return (
    <I18nProvider>
      {!hideHeader && <TopHeader />}
      <main className={hideHeader ? "" : "pt-top-header"}>
        {children}
      </main>
    </I18nProvider>
  );
}
