import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Your Site Name | Evidence-Based Supplement Information',
    template: '%s | Your Site Name'
  },
  description: 'Discover evidence-based information about supplements, nutrition, and health. Expert articles backed by scientific research.',
  keywords: ['supplements', 'nutrition', 'health', 'wellness', 'evidence-based', 'science'],
  authors: [{ name: 'Your Site Name Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Your Site Name',
    title: 'Your Site Name | Evidence-Based Supplement Information',
    description: 'Discover evidence-based information about supplements, nutrition, and health.',
    images: [
      {
        url: `${baseUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Your Site Name'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Site Name | Evidence-Based Supplement Information',
    description: 'Discover evidence-based information about supplements, nutrition, and health.',
    images: [`${baseUrl}/og-default.jpg`],
    creator: '@yourhandle'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema(baseUrl);
  const websiteSchema = generateWebsiteSchema(baseUrl);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
