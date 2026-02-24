import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Database,
  Cookie,
  Lock,
  Users,
  FileText,
  Mail,
} from "lucide-react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Privacy Policy | SupplementDecoded",
  description:
    "Our privacy policy explains how we collect, use, and protect your personal information. Learn about our commitment to data security and your privacy rights.",
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-700 dark:text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your privacy is important to us. Learn how we protect your data.
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
        <Card className="mb-12 border-2">
          <CardContent className="pt-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              We respect your privacy and are committed to protecting your
              personal data. This privacy policy explains how we collect, use,
              and safeguard your information when you visit our website.
            </p>
          </CardContent>
        </Card>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="font-bold mb-2">Data Collection</h3>
              <p className="text-sm text-muted-foreground">
                Minimal data collection with full transparency
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-[#D9CFC7]  w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary dark:text-primary" />
              </div>
              <h3 className="font-bold mb-2">Secure Storage</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard security measures
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="font-bold mb-2">Your Rights</h3>
              <p className="text-sm text-muted-foreground">
                Full control over your personal data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Information We Collect
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                We may collect the following types of information:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">Usage Data:</strong>{" "}
                    Information about how you use our website, including pages
                    visited, time spent, and navigation patterns
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Device Information:
                    </strong>{" "}
                    Browser type, operating system, IP address, and device
                    identifiers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Contact Information:
                    </strong>{" "}
                    If you contact us or subscribe to our newsletter, we collect
                    your email address and any other information you provide
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#D9CFC7]  p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    How We Use Your Information
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                We use the collected information to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Improve and optimize our website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Analyze usage patterns and trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Respond to your inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Send newsletters and updates (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                  <Cookie className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Cookies and Tracking
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your
                browsing experience. You can control cookie settings through
                your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Third-Party Services
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for analytics, advertising, and
                other purposes. These services may collect information about
                your use of our website. We recommend reviewing the privacy
                policies of these third-party services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <Lock className="w-5 h-5 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have certain rights
                regarding your personal data, including the right to access,
                correct, or delete your information.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will
                notify you of any significant changes by posting the new policy
                on this page.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Card */}
        <Card className="mt-12 border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <Mail className="w-8 h-8 text-blue-700 dark:text-blue-300" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Have Questions?</h3>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy, please
                  contact us.
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
