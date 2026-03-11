import { Metadata } from "next";
import { Shield } from "lucide-react";
import Link from "next/link";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

export const metadata: Metadata = {
  title: "Privacy Policy | SupplementDecoded",
  description:
    "Our privacy policy explains how we collect, use, and protect your personal information when you visit or interact with our content.",
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
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <Shield className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            We are committed to transparency and the responsible handling of
            your data.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-sm font-medium text-gray-600 dark:text-zinc-400">
            <span>Last Updated: February 25, 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-[#0F0E0A] border border-[#D9CFC7] dark:border-[#3B3028] rounded-4xl p-8 md:p-12 lg:p-16 shadow-xl shadow-black/5 dark:shadow-none">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-medium">
              <h2 className="text-3xl mt-0">Introduction</h2>
              <p>
                This Privacy Policy explains how this website collects, uses,
                and protects information when you visit or interact with our
                content.
              </p>
              <p>
                We are committed to transparency and responsible handling of
                data. This website is designed primarily for educational
                purposes and does not sell products or operate commercial
                advertising programs.
              </p>
              <p>
                By using this site, you agree to the terms outlined in this
                Privacy Policy.
              </p>

              <h2>Who We Are</h2>
              <p>
                This website is operated under the name Supplement Decoded by a
                group of independent publishers.
              </p>
              <p>
                The site provides evidence-based educational health information
                to a global audience and is not affiliated with any supplement
                manufacturer, distributor, advertiser, or commercial entity.
              </p>
              <p>
                For privacy-related inquiries, you may contact us through the{" "}
                <Link href="/contact">Contact page</Link>.
              </p>

              <h2>Health Information Notice</h2>
              <p>
                This website provides general educational information about
                supplements, nutrition, safety considerations, and related
                research.
              </p>
              <p className="font-semibold">
                It does not provide medical advice, diagnosis, or treatment.
              </p>
              <p>
                If you are experiencing a medical emergency or urgent health
                concern, contact a qualified healthcare professional or your
                local emergency services immediately.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We may collect limited types of information in the following
                ways:
              </p>

              <h3>1. Information You Provide Voluntarily</h3>
              <p>You may provide information when you:</p>
              <ul>
                <li>Submit a message through our Contact form</li>
                <li>Report an error or safety concern</li>
                <li>Send general inquiries</li>
              </ul>
              <p>This may include:</p>
              <ul>
                <li>Your name</li>
                <li>Email address</li>
                <li>The content of your message</li>
              </ul>
              <p>
                We collect only the information necessary to respond to your
                inquiry.
              </p>

              <h3>2. Automatically Collected Information</h3>
              <p>
                Like most websites, certain information may be collected
                automatically through standard technologies, including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device type</li>
                <li>Pages visited</li>
                <li>Time spent on pages</li>
                <li>Referring websites</li>
              </ul>
              <p>
                This data is used in aggregated form for analytical and site
                performance purposes.
              </p>

              <h2>Analytics and Cookie Choices</h2>
              <p>
                This website uses limited analytics tools, such as Google
                Analytics, to understand how visitors interact with content and
                to improve clarity and usability.
              </p>
              <p>We do not use:</p>
              <ul>
                <li>Advertising cookies</li>
                <li>Behavioral tracking for marketing</li>
                <li>Affiliate tracking technologies</li>
                <li>Sponsored data collection systems</li>
              </ul>
              <p>Cookies may be used for:</p>
              <ul>
                <li>Basic site functionality</li>
                <li>Anonymous traffic analysis</li>
              </ul>
              <p>
                You may control or disable cookies through your browser
                settings. Disabling cookies may affect certain site
                functionality.
              </p>
              <p>
                Google provides tools that allow users to opt out of certain
                data collection practices. You may review Google’s privacy and
                opt-out resources for more information.
              </p>

              <h2>Use of Analytics</h2>
              <p>We may use analytics tools such as:</p>
              <ul>
                <li>Google Analytics</li>
                <li>Search Console</li>
              </ul>
              <p>
                These services help us understand how visitors use the site so
                we can improve clarity, usability, and content quality.
              </p>
              <p>
                Analytics services may collect anonymized usage data. We do not
                use analytics data to personally identify visitors.
              </p>
              <p>
                You can learn more about how Google collects and processes data
                by visiting Google’s privacy documentation.
              </p>

              <h2>Cookies</h2>
              <p>This website may use cookies or similar technologies to:</p>
              <ul>
                <li>Improve user experience</li>
                <li>Analyze site traffic</li>
                <li>Maintain basic site functionality</li>
              </ul>
              <p>
                Cookies are small data files stored on your device. You may
                disable cookies through your browser settings, though some site
                features may not function properly.
              </p>
              <p className="font-semibold">
                We do not use cookies for advertising or behavioral tracking.
              </p>

              <h2>How We Use Information</h2>
              <p>Information collected may be used to:</p>
              <ul>
                <li>Respond to user inquiries</li>
                <li>Improve content quality and accuracy</li>
                <li>Monitor site performance and usage trends</li>
                <li>Maintain website security</li>
              </ul>
              <p className="font-semibold">
                We do not sell, rent, trade, or share personal information for
                commercial purposes.
              </p>

              <h2>Data Sharing</h2>
              <p>
                We do not sell or distribute personal information to third
                parties.
              </p>
              <p>
                Limited data may be processed by trusted third-party service
                providers (such as hosting providers or analytics platforms)
                solely for technical operation of the website.
              </p>
              <p>
                These providers are responsible for safeguarding data according
                to their own privacy policies.
              </p>

              <h2>International Data Transfers</h2>
              <p>This website serves a global audience.</p>
              <p>
                Certain technical service providers, including analytics or
                hosting services, may process data outside your country of
                residence.
              </p>
              <p>
                By using this site, you acknowledge that data may be transferred
                and processed in jurisdictions that may have data protection
                laws different from those in your country.
              </p>
              <p>
                We take reasonable steps to work with reputable service
                providers that maintain appropriate data protection standards.
              </p>

              <h2>Data Retention</h2>
              <p>
                We retain personal information only for as long as necessary to
                fulfill the purposes outlined in this policy.
              </p>
              <ul>
                <li>
                  Contact form submissions are retained for up to 12 months,
                  unless needed for correction records or legal obligations.
                </li>
                <li>
                  Aggregated analytics data is retained according to the
                  policies of the analytics provider.
                </li>
                <li>
                  Safety-related inquiries may be retained longer if necessary
                  to maintain transparency or correction records.
                </li>
              </ul>
              <p>
                We do not retain personal data longer than reasonably necessary.
              </p>

              <h2>Data Security</h2>
              <p>
                We take reasonable measures to protect information from
                unauthorized access, misuse, or disclosure.
              </p>
              <p>
                However, no method of data transmission over the internet is
                completely secure. Use of this site is at your own discretion.
              </p>

              <h2>Safety Reports and Sensitive Information</h2>
              <p>
                Users may report factual errors, safety concerns, or potentially
                misleading claims through the{" "}
                <Link href="/contact">Contact page</Link>.
              </p>
              <p>However, please do not submit:</p>
              <ul>
                <li>Detailed medical records</li>
                <li>Personal health histories</li>
                <li>Prescription information</li>
                <li>Financial information</li>
                <li>Government identification numbers</li>
              </ul>
              <p>
                We do not provide medical case review services and cannot
                respond to personal medical inquiries.
              </p>
              <p>
                Any safety-related concerns submitted are reviewed for factual
                accuracy only and do not constitute medical advice.
              </p>

              <h2>Children’s Privacy</h2>
              <p>
                This website is intended for a general audience and is not
                directed toward children under the age of 13.
              </p>
              <p>
                We do not knowingly collect personal information from children.
              </p>

              <h2>External Links</h2>
              <p>
                This website may link to external websites for research or
                reference purposes.
              </p>
              <p>
                We are not responsible for the privacy practices or content of
                external websites. Users should review the privacy policies of
                those sites independently.
              </p>

              <h2>Your Rights</h2>
              <p>
                Depending on your jurisdiction, you have rights regarding
                personal data, including:
              </p>
              <ul>
                <li>Requesting access to information you have submitted</li>
                <li>Requesting correction or deletion of personal data</li>
                <li>Withdrawing consent for data processing</li>
              </ul>
              <p>
                Requests can be submitted through our{" "}
                <Link href="/contact">Contact page</Link>.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                This Privacy Policy may be updated periodically to reflect
                operational, legal, or regulatory changes.
              </p>
              <p>
                The updated version will be posted on this page with a revised
                effective date.
              </p>

              <h2>Contact</h2>
              <p>
                If you have questions about this Privacy Policy or your data,
                please contact us through the{" "}
                <Link href="/contact">Contact page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
