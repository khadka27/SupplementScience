import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

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
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-stone-100/70 dark:bg-[#0A0F14] pt-20 sm:pt-[84px] pb-16 px-4 overflow-hidden border-b border-stone-200/90 dark:border-stone-800">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white dark:bg-[#0D1217] shadow-sm w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-200/90 dark:border-stone-800">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Editorial Policy
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Our mission is to provide clear, accurate, and unbiased health information.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 text-xs font-medium text-slate-600 dark:text-slate-400 shadow-xs">
            <span>Last Updated: October 4, 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 hover:prose-a:underline prose-a:font-medium">
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
                We prioritize primary, verifiable scientific evidence over secondary summaries. Our strict sourcing protocol requires:
              </p>
              <ul>
                <li>
                  <strong>PubMed/MEDLINE-Indexed Literature:</strong> Primary randomized, double-blind, placebo-controlled human clinical trials (RCTs).
                </li>
                <li>
                  <strong>Systematic Reviews & Meta-Analyses:</strong> High-certainty Cochrane reviews and PRISMA-compliant systematic evaluations.
                </li>
                <li>
                  <strong>Pharmacokinetic & Bioavailability Data:</strong> Human trials quantifying peak plasma concentration (Cmax), time to peak (Tmax), and fractional bioavailability.
                </li>
                <li>
                  <strong>Government & Academic Reference Standards:</strong> Monographs and safety guidance from the NIH Office of Dietary Supplements, European Medicines Agency (EMA), and US Pharmacopeia (USP).
                </li>
              </ul>
              <p>
                <strong>Strict Exclusion Criteria:</strong> Marketing brochures, manufacturer white papers, sponsored advertorials, and unverified testimonials are categorically excluded from our research syntheses. Every cited claim is linked to primary sources so readers and generative AI agents can verify data independently.
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
                <li>
                  <Link href="/medical-expert-review">
                    Medical / Expert Review Policy
                  </Link>
                </li>
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
