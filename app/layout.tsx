import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/schema";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID; // Add to .env

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Your Site Name | Evidence-Based Supplement Information",
    template: "%s | Your Site Name",
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
  authors: [{ name: "Your Site Name Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Your Site Name",
    title: "Your Site Name | Evidence-Based Supplement Information",
    description:
      "Discover evidence-based information about supplements, nutrition, and health.",
    images: [
      {
        url: `${baseUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Your Site Name",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Site Name | Evidence-Based Supplement Information",
    description:
      "Discover evidence-based information about supplements, nutrition, and health.",
    images: [`${baseUrl}/og-default.jpg`],
    creator: "@yourhandle",
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
    google: "your-google-verification-code",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Toaster } from "@/components/ui/sonner";

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
        <meta
          name="google-site-verification"
          content="your-actual-verification-code-here"
        />
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
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Premium Background Decoration */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-50 dark:opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow pt-24">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
