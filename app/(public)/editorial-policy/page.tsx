import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

export const metadata: Metadata = {
  title: "Editorial Policy | SupplementDecoded",
  description:
    "Read our Editorial Policy to learn how we provide clear, accurate, and unbiased health information to help you understand supplements and nutrition in context.",
  alternates: {
    canonical: `${baseUrl}/editorial-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <BookOpen className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Editorial Policy
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Our mission is to provide clear, accurate, and unbiased health
            information.
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
              <h2 className="text-3xl mt-0">Our Editorial Mission</h2>
              <p>
                Our mission is to provide clear, accurate, and unbiased health
                information to help readers understand supplements, nutrition,
                and safety in context.
              </p>
              <p>
                We exist to educate, not persuade. Our content is designed to
                reduce confusion in an industry often shaped by marketing claims
                by prioritizing evidence, transparency, and responsible health
                communication.
              </p>
              <p>
                We emphasize that diet, physical activity, sleep, and medical
                care are the foundation of health. Supplements, where discussed,
                are presented only as optional, supportive tools, never as
                replacements for healthy lifestyle practices or professional
                medical guidance.
              </p>

              <h2>Complete Editorial Independence</h2>
              <p>
                This website operates with full editorial independence and no
                monetization.
              </p>
              <ul>
                <li>We do not use affiliate links</li>
                <li>
                  We do not accept sponsorships, commissions, or referral
                  payments
                </li>
                <li>
                  We do not receive compensation from supplement manufacturers
                  or brands
                </li>
                <li>
                  No financial relationships influence topic selection,
                  analysis, or conclusions
                </li>
              </ul>
              <p>
                Our content is created solely for public education and
                understanding, without commercial intent.
              </p>

              <h2>How Topics Are Selected</h2>
              <p>Topics are chosen based on:</p>
              <ul>
                <li>
                  Common questions about supplements, ingredients, and safety
                </li>
                <li>
                  Areas where misinformation or exaggerated claims are
                  widespread
                </li>
                <li>
                  Public health relevance across categories such as joint pain,
                  weight management, and general wellness
                </li>
                <li>Availability (or lack) of credible scientific evidence</li>
              </ul>
              <p>
                Commercial popularity or sales trends do not influence topic
                selection.
              </p>

              <h2>Content Creation Standards</h2>
              <p>
                All content is developed by our Research Editorial Team using a
                structured process that includes:
              </p>
              <ul>
                <li>Reviewing peer-reviewed scientific literature</li>
                <li>
                  Consulting authoritative health and research organizations
                </li>
                <li>
                  Examining publicly available ingredient and product
                  information
                </li>
                <li>
                  Identifying known limitations, uncertainties, and safety
                  concerns
                </li>
              </ul>
              <p>
                When evidence is limited, mixed, or inconclusive, this is stated
                clearly. We do not exaggerate certainty, effectiveness, or
                outcomes.
              </p>

              <h2>Use of Evidence and Sources</h2>
              <p>
                We prioritize credible and authoritative sources, including:
              </p>
              <ul>
                <li>Peer-reviewed scientific journals</li>
                <li>Systematic reviews and meta-analyses</li>
                <li>Government and academic research databases</li>
                <li>Established public health and medical organizations</li>
              </ul>
              <p>
                Sources are referenced where appropriate to allow readers to
                verify information independently. Marketing materials,
                testimonials, and unverified claims are not used as evidence.
              </p>

              <h2>Medical Accuracy & Review</h2>
              <p>
                Health-related content undergoes editorial review to ensure:
              </p>
              <ul>
                <li>Scientific accuracy and contextual integrity</li>
                <li>Careful, non-absolute language</li>
                <li>
                  Clear distinction between evidence, hypothesis, and
                  uncertainty
                </li>
                <li>Transparent discussion of risks and limitations</li>
              </ul>
              <p>
                Some content may also be reviewed by professionals with
                backgrounds in nutrition science, pharmacology, public health,
                or clinical research.
              </p>

              <h2>What Our Content Does Not Do</h2>
              <p>
                To protect readers and maintain trust, our content does not:
              </p>
              <ul>
                <li>
                  Provide medical diagnoses or personalized treatment advice
                </li>
                <li>Claim that supplements cure, prevent, or treat diseases</li>
                <li>Guarantee results or outcomes</li>
                <li>Encourage supplement use over lifestyle or medical care</li>
                <li>Promote urgency-based or fear-driven messaging</li>
              </ul>
              <p>
                Readers should always consult qualified healthcare professionals
                for medical or health-related decisions.
              </p>

              <h2>Product & Supplement Coverage Philosophy</h2>
              <p>
                When supplements or health products are discussed, they are
                examined using an educational, case-study approach.
              </p>
              <p>Coverage focuses on:</p>
              <ul>
                <li>What the product is and how it is positioned</li>
                <li>Ingredient composition and transparency</li>
                <li>What research suggests about individual ingredients</li>
                <li>Known safety considerations and uncertainties</li>
              </ul>
              <p>We do not recommend, endorse, rank, or promote products.</p>

              <h2>Updates and Corrections</h2>
              <p>Because health research evolves:</p>
              <ul>
                <li>
                  Content is reviewed periodically, typically every 6–12 months
                </li>
                <li>Articles may be updated as new evidence emerges</li>
                <li>
                  Errors, if identified, are corrected promptly and
                  transparently
                </li>
              </ul>

              <h2>Reader Responsibility</h2>
              <p>All content is provided for educational purposes only.</p>
              <p>Readers are responsible for:</p>
              <ul>
                <li>
                  Consulting qualified professionals before making health
                  decisions
                </li>
                <li>Understanding that individual responses vary</li>
                <li>
                  Interpreting information within their own medical context
                </li>
              </ul>
              <p>
                This site does not replace professional medical advice,
                diagnosis, or treatment.
              </p>

              <h2>Transparency and Accountability</h2>
              <p>
                We are committed to openness in how content is created and
                reviewed.
              </p>
              <p>Additional information is available on:</p>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>Medical / Expert Review Policy</li>
                <li>
                  <Link href="/fact-checking">Fact-Checking Process</Link>
                </li>
                <li>
                  <Link href="/medical-disclaimer">Disclaimer</Link>
                </li>
              </ul>
              <p>
                Questions or concerns about content accuracy are always welcome.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
