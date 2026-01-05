import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Scale,
  Shield,
  Globe,
  AlertTriangle,
  BookOpen,
  Mail,
} from "lucide-react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

export const metadata: Metadata = {
  title: "Terms of Service | SupplementScience",
  description:
    "Terms and conditions for using our website and services. Read our user agreement and understand your rights and responsibilities.",
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-slate-100 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-slate-700 dark:text-slate-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Please read these terms carefully before using our website
          </p>
          <p className="text-sm text-muted-foreground">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Introduction Card */}
        <Card className="mb-12 border-2 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using our website, you agree to be bound by
                  these Terms of Service. If you disagree with any part of these
                  terms, you may not access our website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-8">

        {/* Content Sections */}
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Use of Our Website</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                You agree to use our website only for lawful purposes and in a
                way that does not:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Violate any applicable laws or regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Infringe on the rights of others</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Harass, abuse, or harm another person</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Transmit any harmful code or malware</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Intellectual Property
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, images, graphics,
                logos, and software, is the property of SupplementScience or its
                content suppliers and is protected by copyright and other
                intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">User Content</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you submit comments, feedback, or other content to our
                website, you grant us a non-exclusive, royalty-free, perpetual
                license to use, modify, and display that content.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Disclaimer of Warranties
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our website and content are provided on an "as is" basis without
                warranties of any kind. We do not guarantee that our website will
                be error-free or uninterrupted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Limitation of Liability
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, SupplementScience shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of our
                website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">External Links</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites. We are not
                responsible for the content, privacy policies, or practices of
                these external sites.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to this page.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                  <Scale className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with
                applicable laws, without regard to conflict of law provisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Card */}
        <Card className="mt-12 border-2 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full">
                <Mail className="w-8 h-8 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Questions About These Terms?
                </h3>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us.
                </p>
              </div>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Contact Us
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
