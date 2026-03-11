import { Metadata } from "next";
import { Scale } from "lucide-react";
import Link from "next/link";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

export const metadata: Metadata = {
  title: "Terms of Use | SupplementDecoded",
  description:
    "Please read these Terms of Use carefully before using our website. By accessing or using the site, you agree to be bound by these terms.",
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
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <Scale className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Terms of Use
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our website.
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
              <h2 className="text-3xl mt-0">Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you agree to comply with
                and be bound by these Terms of Use.
              </p>
              <p>
                If you do not agree with any part of these terms, you should
                discontinue use of the website.
              </p>
              <p>
                These Terms of Use apply to all visitors, users, and others who
                access the site.
              </p>

              <h2>Who Operates This Website</h2>
              <p>
                This website is operated under the name Supplement Decoded by a
                group of publishers based.
              </p>
              <p>
                The site provides educational health information to a general
                audience and is not affiliated with any supplement manufacturer,
                distributor, advertiser, or commercial entity.
              </p>

              <h2>Educational Purpose Only</h2>
              <p>
                All content on this website is provided for educational and
                informational purposes only.
              </p>
              <p>The information presented:</p>
              <ul>
                <li>Is not medical advice</li>
                <li>Does not constitute diagnosis or treatment</li>
                <li>Does not replace professional healthcare guidance</li>
              </ul>
              <p>
                Always consult a qualified healthcare professional regarding
                health-related decisions.
              </p>

              <h2>No Emergency Services</h2>
              <p>
                This website is not intended for use in medical emergencies.
              </p>
              <p>
                If you are experiencing a medical emergency or urgent health
                concern, contact a qualified healthcare professional or local
                emergency services immediately.
              </p>

              <h2>No Endorsements or Recommendations</h2>
              <p>This website:</p>
              <ul>
                <li>
                  Does not recommend or endorse specific supplements or products
                </li>
                <li>Does not publish “best supplement” rankings</li>
                <li>Does not provide personalized recommendations</li>
                <li>Does not guarantee outcomes or results</li>
              </ul>
              <p>
                Product discussions are presented solely for educational
                analysis.
              </p>

              <h2>No Commercial Influence</h2>
              <p>
                This website does not operate advertising programs, affiliate
                partnerships, sponsored placements, or referral arrangements
                that influence content decisions.
              </p>
              <p>
                Content is published independently for educational purposes
                only.
              </p>

              <h2>User Responsibilities</h2>
              <p>By using this website, you agree that:</p>
              <ul>
                <li>
                  You are responsible for how you interpret and use the
                  information
                </li>
                <li>
                  You will not rely solely on website content for medical
                  decisions
                </li>
                <li>You will seek professional guidance when appropriate</li>
              </ul>
              <p>Use of this website is at your own discretion.</p>

              <h2>Intellectual Property</h2>
              <p>All original content on this website, including:</p>
              <ul>
                <li>Text</li>
                <li>Structure</li>
                <li>Graphics</li>
                <li>Branding elements</li>
                <li>Design</li>
              </ul>
              <p>
                is the intellectual property of Supplement Decoded unless
                otherwise stated.
              </p>
              <p>You may:</p>
              <ul>
                <li>View and read content for personal, non-commercial use</li>
              </ul>
              <p>You may not:</p>
              <ul>
                <li>Reproduce content for commercial purposes</li>
                <li>Republish content without permission</li>
                <li>Copy substantial portions of content</li>
                <li>Misrepresent content as your own</li>
              </ul>
              <p>
                Proper citation with link-back is required for limited
                quotations.
              </p>

              <h2>External Links</h2>
              <p>
                This website may link to external resources for educational
                context.
              </p>
              <p>
                We do not control or guarantee the accuracy, reliability, or
                practices of external websites and are not responsible for their
                content.
              </p>

              <h2>Limitation of Liability</h2>
              <p>To the fullest extent permitted by applicable law:</p>
              <ul>
                <li>
                  This website is provided on an “as is” and “as available”
                  basis
                </li>
                <li>
                  We make no warranties regarding accuracy, completeness, or
                  suitability
                </li>
                <li>
                  We are not liable for any direct, indirect, incidental, or
                  consequential damages arising from use of the site
                </li>
              </ul>
              <p>Use of the site is at your own risk.</p>

              <h2>No Warranties</h2>
              <p>We do not guarantee that:</p>
              <ul>
                <li>The website will be error-free</li>
                <li>The content will always be current</li>
                <li>The site will be uninterrupted or secure</li>
              </ul>
              <p>
                While we strive for accuracy and reliability, no guarantees are
                made.
              </p>

              <h2>User Conduct</h2>
              <p>Users agree not to:</p>
              <ul>
                <li>Use the website for unlawful purposes</li>
                <li>
                  Attempt to interfere with site security or functionality
                </li>
                <li>Attempt to access restricted areas of the website</li>
                <li>Submit false or malicious information</li>
              </ul>

              <h2>User Submissions</h2>
              <p>
                If you submit inquiries, reports, or other communications
                through the Contact page, you agree that:
              </p>
              <ul>
                <li>
                  The information provided is accurate to the best of your
                  knowledge
                </li>
                <li>
                  The submission does not contain unlawful, abusive, defamatory,
                  or misleading content
                </li>
                <li>
                  The submission does not violate the rights of any third party
                </li>
              </ul>
              <p>
                Submission of a message does not create a professional, medical,
                advisory, or confidential relationship.
              </p>
              <p>
                We reserve the right to disregard or remove submissions that are
                inappropriate, unlawful, or unrelated to the website’s
                educational purpose.
              </p>

              <h2>International Use</h2>
              <p>
                This website is operated from Nepal but is accessible worldwide.
              </p>
              <p>
                Users accessing the site from other jurisdictions are
                responsible for compliance with local laws.
              </p>

              <h2>Right to Modify Content</h2>
              <p>
                We reserve the right to update, modify, remove, or discontinue
                any content on this website at any time without prior notice.
              </p>
              <p>
                We are not obligated to maintain or update specific content
                unless required by applicable law.
              </p>

              <h2>Modifications to Terms</h2>
              <p>
                We reserve the right to update or modify these Terms of Use at
                any time.
              </p>
              <p>
                Updated terms will be posted on this page with a revised
                effective date.
              </p>
              <p>
                Continued use of the site after changes constitutes acceptance
                of the updated terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms of Use are governed by and interpreted in accordance
                with the laws of Nepal, without regard to conflict-of-law
                principles.
              </p>

              <h2>Contact</h2>
              <p>
                If you have questions regarding these Terms of Use, you may
                contact us through the <Link href="/contact">Contact page</Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
