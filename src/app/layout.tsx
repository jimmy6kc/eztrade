import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import ClientShell from "@/components/ClientShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EZtrade - Position Size Calculator & Trade Journal for Stocks & Futures",
  description:
    "Calculate position size, manage risk, and log your trades. Free trading calculator for stocks and futures with R:R analysis, cloud sync, and 12 languages. Start your free trial today.",
  keywords:
    "position size calculator, trade journal, trading calculator, stock calculator, futures calculator, risk management, R:R ratio, trading log, trade tracker",
  manifest: "/manifest.json",
  openGraph: {
    title: "EZtrade - Position Size Calculator & Trade Journal for Stocks & Futures",
    description:
      "Calculate position size, manage risk, and log your trades. Free trading calculator for stocks and futures with R:R analysis, cloud sync, and 12 languages. Start your free trial today.",
    type: "website",
    url: "https://www.eztradeapp.com",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EZtrade",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f1923",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('eztrade_theme');
                  if (t === 'light') document.documentElement.setAttribute('data-theme','light');
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ClientShell>{children}</ClientShell>
        </AuthProvider>
      </body>
    </html>
  );
}
