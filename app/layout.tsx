import "./globals.css";
import type { Metadata } from "next";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/schema";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID; // Add to .env

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SupplementDecoded | Evidence-Based Supplement Information",
    template: "%s | SupplementDecoded",
  },
  description:
    "Discover evidence-based information about supplements, nutrition, and health. Expert articles backed by scientific research.",
  keywords: [
    "supplements",
    "nutrition",
    "health",
    "wellness",
    "evidence-based",
    "science",
  ],
  authors: [{ name: "SupplementDecoded Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "SupplementDecoded",
    title: "SupplementDecoded | Evidence-Based Supplement Information",
    description:
      "Discover evidence-based information about supplements, nutrition, and health.",
    images: [
      {
        url: `${baseUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "SupplementDecoded",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SupplementDecoded | Evidence-Based Supplement Information",
    description:
      "Discover evidence-based information about supplements, nutrition, and health.",
    images: [`${baseUrl}/og-default.jpg`],
    creator: "@supplementdecoded",
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
  verification: {
    // TODO: Replace with your actual code from Google Search Console
    // google: "paste-your-verification-code-here",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClarityProvider } from "@/components/ClarityProvider";
import { BackToTop } from "@/components/BackToTop";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema(baseUrl);
  const websiteSchema = generateWebsiteSchema(baseUrl);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* TODO: Once you have your Google Search Console verification code,
             either add it here OR use the metadata.verification.google field above — not both. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className="font-sans antialiased min-h-screen relative"
        suppressHydrationWarning={true}
      >
        {/* Skip to content — first focusable element for keyboard/screen reader users */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AuthProvider>
          <ClarityProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Global clean subtle ambient foundation */}
            <div
              className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-b from-stone-50/50 via-white to-stone-50/30 dark:from-[#080B0E] dark:via-[#0A0D10] dark:to-[#080B0E]"
              aria-hidden="true"
            />

            <main id="main-content">
              {children}
            </main>
            <BackToTop />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
