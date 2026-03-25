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
    "position size calculator, trade journal, trading calculator, stock calculator, futures calculator, risk management, R:R ratio, trading log, trade tracker, stock position size calculator, futures position size calculator, risk reward calculator, trading journal app",
  manifest: "/manifest.json",
  metadataBase: new URL("https://www.eztradeapp.com"),
  alternates: {
    canonical: "https://www.eztradeapp.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "EZtrade - Position Size Calculator & Trade Journal for Stocks & Futures",
    description:
      "Calculate position size, manage risk, and log your trades. Free trading calculator for stocks and futures with R:R analysis, cloud sync, and 12 languages. Start your free trial today.",
    type: "website",
    url: "https://www.eztradeapp.com",
    siteName: "EZtrade",
  },
  twitter: {
    card: "summary_large_image",
    title: "EZtrade - Position Size Calculator & Trade Journal for Stocks & Futures",
    description:
      "Calculate position size, manage risk, and log your trades. Free trading calculator for stocks and futures with R:R analysis, cloud sync, and 12 languages.",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "EZtrade",
                  "description": "Position size calculator and trade journal for stocks and futures. Calculate risk, log trades, and improve your trading edge.",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web, iOS, Android",
                  "url": "https://www.eztradeapp.com",
                  "offers": {
                    "@type": "AggregateOffer",
                    "lowPrice": "0",
                    "highPrice": "9.99",
                    "priceCurrency": "USD",
                    "offerCount": 2,
                    "offers": [
                      { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD" },
                      { "@type": "Offer", "name": "Pro Monthly", "price": "9.99", "priceCurrency": "USD", "billingIncrement": 1, "unitCode": "MON" },
                      { "@type": "Offer", "name": "Pro Yearly", "price": "94.95", "priceCurrency": "USD", "billingIncrement": 1, "unitCode": "ANN" }
                    ]
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "520",
                    "bestRating": "5",
                    "worstRating": "1"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "EZtrade",
                  "url": "https://www.eztradeapp.com",
                  "logo": "https://www.eztradeapp.com/icons/icon-512.png",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "support@eztradeapp.com",
                    "contactType": "customer support"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.eztradeapp.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Calculator Demo", "item": "https://www.eztradeapp.com/calc-demo" },
                    { "@type": "ListItem", "position": 3, "name": "Pricing", "item": "https://www.eztradeapp.com/pricing" }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    { "@type": "Question", "name": "Is EZtrade free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Start with a 7-day free trial with full Pro features. After that, the free tier includes 5 calculations per day and 2 saved trades." } },
                    { "@type": "Question", "name": "What markets does EZtrade support?", "acceptedAnswer": { "@type": "Answer", "text": "Stocks, futures (NQ, ES, GC, CL and more), and ETFs. We support all US-listed securities." } },
                    { "@type": "Question", "name": "Can I use EZtrade on my phone?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! EZtrade is a Progressive Web App. Add it to your home screen and use it like a native app." } },
                    { "@type": "Question", "name": "Is my data safe?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. We use Firebase with bank-level encryption. Your data is synced securely and only accessible by you." } },
                    { "@type": "Question", "name": "Can I cancel anytime?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Cancel anytime from your account settings. Plus, we offer a 7-day money-back guarantee." } },
                    { "@type": "Question", "name": "What languages are supported?", "acceptedAnswer": { "@type": "Answer", "text": "We support 12 languages: English, Traditional Chinese, Simplified Chinese, Japanese, Korean, Spanish, Portuguese, Hindi, German, Thai, Bahasa Indonesia, and French." } }
                  ]
                }
              ]
            }),
          }}
        />
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
