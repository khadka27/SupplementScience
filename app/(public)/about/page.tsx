import { Metadata } from "next";
import { Info } from "lucide-react";
import Link from "next/link";

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "About Us | SupplementDecoded",
  description:
    "Learn about SupplementDecoded, an independent educational publication focused on the scientific, regulatory, and safety context of dietary supplements.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <Info className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            About SupplementDecoded
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            An independent educational publication focused on the scientific,
            regulatory, and safety context of dietary supplements.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-sm font-medium text-gray-600 dark:text-zinc-400">
            <span>Last Updated: March 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-[#0F0E0A] border border-[#D9CFC7] dark:border-[#3B3028] rounded-4xl p-8 md:p-12 lg:p-16 shadow-xl shadow-black/5 dark:shadow-none">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-medium">
              <h2 className="text-3xl mt-0">Our Purpose</h2>
              <p>
                SupplementDecoded is an independent educational publication
                focused on the scientific, regulatory, and safety context of
                dietary supplements.
              </p>
              <p>
                Dietary supplements are widely available and commonly used, yet
                their regulation, research evidence, and safety evaluation
                differ substantially from pharmaceutical drugs. The purpose of
                this site is to examine supplement ingredients, formulations,
                and product claims using publicly available scientific research,
                regulatory information, and transparent editorial standards.
              </p>
              <p>
                Content on SupplementDecoded is intended to provide factual,
                contextual analysis to improve understanding of how supplements
                are studied, regulated, and evaluated. It is not intended to
                promote supplement use, recommend products, or replace
                professional medical advice.
              </p>

              <h2>Scope of Content</h2>
              <p>
                SupplementDecoded publishes structured, evidence-based
                educational analysis of:
              </p>
              <ul>
                <li>Dietary supplement products and formulations</li>
                <li>Individual supplement ingredients</li>
                <li>
                  Scientific research related to supplement safety and
                  effectiveness
                </li>
                <li>
                  Regulatory and safety considerations relevant to supplement
                  use
                </li>
              </ul>
              <p>
                Content focuses on ingredient composition, research evidence,
                formulation transparency, and safety considerations.
                SupplementDecoded does not provide product recommendations,
                rankings, or endorsements.
              </p>

              <h2>Regulatory Context of Supplements</h2>
              <p>
                Dietary supplements are regulated differently from
                pharmaceutical drugs in most countries.
              </p>
              <p>
                Regulatory authorities such as the U.S. Food and Drug
                Administration (FDA) and the European Food Safety Authority
                (EFSA) do not require supplements to undergo the same pre-market
                approval process required for prescription medications.
              </p>
              <p>This means:</p>
              <ul>
                <li>
                  Supplements are generally not required to demonstrate
                  effectiveness before being marketed
                </li>
                <li>
                  Product quality, ingredient consistency, and dosage accuracy
                  may vary between manufacturers
                </li>
                <li>
                  Regulatory oversight primarily focuses on post-market safety
                  monitoring rather than pre-market verification
                </li>
              </ul>
              <p>
                Because regulatory systems have defined limitations, independent
                evaluation of ingredient evidence, formulation transparency, and
                safety considerations is necessary for informed interpretation.
              </p>

              <h2>Limitations of Supplement Research</h2>
              <p>
                Scientific research on dietary supplements varies widely in
                quality, duration, and applicability.
              </p>
              <p>Common limitations include:</p>
              <ul>
                <li>Small sample sizes in human clinical studies</li>
                <li>
                  Short study durations that may not reflect long-term use
                </li>
                <li>Differences between animal research and human outcomes</li>
                <li>Variation in dosage, formulation, and study populations</li>
                <li>
                  Potential conflicts of interest in industry-funded studies
                </li>
              </ul>
              <p>
                In many cases, individual ingredients are studied independently,
                while complete commercial supplement formulations are not
                evaluated in controlled clinical trials.
              </p>
              <p>
                SupplementDecoded presents research findings with appropriate
                context, including limitations, uncertainty, and variability in
                scientific evidence.
              </p>

              <h2>Methodology and Evidence Evaluation</h2>
              <p>
                SupplementDecoded follows a structured editorial methodology
                designed to promote accuracy, transparency, and neutrality.
              </p>
              <p>Sources reviewed may include:</p>
              <ul>
                <li>Peer-reviewed scientific journals</li>
                <li>Systematic reviews and meta-analyses</li>
                <li>Clinical trial publications</li>
                <li>Public health and regulatory agencies</li>
                <li>Academic research databases such as PubMed</li>
              </ul>
              <p>
                Evidence is evaluated using a defined hierarchy that prioritizes
                well-designed human clinical research while clearly identifying
                areas where evidence is limited, inconsistent, or preliminary.
              </p>
              <p>
                Conflicting findings, methodological limitations, and
                uncertainty are presented transparently.
              </p>
              <p>
                Detailed information about our editorial standards is available
                in our <Link href="/editorial-policy">Editorial Policy</Link>{" "}
                and <Link href="/fact-checking">Fact-Checking Process</Link>.
              </p>

              <h2>Conflict of Interest and Bias Awareness</h2>
              <p>
                Scientific research may be influenced by funding sources, study
                design, and publication bias.
              </p>
              <p>
                When evaluating research, SupplementDecoded considers factors
                such as:
              </p>
              <ul>
                <li>Disclosure of study funding sources</li>
                <li>
                  Potential financial relationships between researchers and
                  industry
                </li>
                <li>Replication of findings across independent studies</li>
                <li>
                  Consistency of evidence across different populations and study
                  designs
                </li>
              </ul>
              <p>
                Where relevant, limitations and potential sources of bias are
                disclosed to support balanced interpretation.
              </p>
              <p>
                Medical or expert review, when conducted, is independent and
                free from commercial influence.
              </p>

              <h2>Safety and Risk Awareness</h2>
              <p>
                Dietary supplements can produce physiological effects and are
                not inherently risk-free.
              </p>
              <p>Safety considerations may include:</p>
              <ul>
                <li>Known side effects</li>
                <li>Interactions with medications</li>
                <li>Risks associated with long-term or high-dose use</li>
                <li>
                  Increased risks when multiple supplements are used together
                </li>
              </ul>
              <p>
                The term “natural” does not guarantee safety, and individual
                responses may vary.
              </p>
              <p>
                SupplementDecoded emphasizes that supplements should not be used
                as substitutes for medical care, prescribed treatment, or
                professional healthcare guidance.
              </p>

              <h2>Editorial Independence and Non-Commercial Position</h2>
              <p>
                SupplementDecoded operates with complete editorial independence.
              </p>
              <p>We do not:</p>
              <ul>
                <li>Accept affiliate partnerships</li>
                <li>Publish sponsored content</li>
                <li>
                  Receive compensation from supplement manufacturers or
                  retailers
                </li>
                <li>
                  Participate in supplement advertising or referral programs
                </li>
              </ul>
              <p>
                SupplementDecoded does not sell supplements or provide product
                recommendations.
              </p>
              <p>
                All content is created solely for educational and informational
                purposes.
              </p>
              <p>
                Financial relationships do not influence editorial decisions,
                research evaluation, or content conclusions.
              </p>

              <h2>Editorial Structure and Review Process</h2>
              <p>
                SupplementDecoded operates through an independent research
                editorial team responsible for content development, evidence
                review, and editorial oversight.
              </p>
              <p>Content may undergo multiple layers of review, including:</p>
              <ul>
                <li>Research and drafting using primary scientific sources</li>
                <li>
                  Structured fact-checking against authoritative references
                </li>
                <li>Editorial review for accuracy, clarity, and neutrality</li>
                <li>Medical or subject-matter review where appropriate</li>
              </ul>
              <p>
                Scientific knowledge evolves over time. Content may be updated
                periodically to reflect current evidence and understanding.
              </p>

              <h2>Transparency and Accountability</h2>
              <p>
                SupplementDecoded is committed to transparency in editorial
                standards, methodology, and content governance.
              </p>
              <p>Additional information is available on the following pages:</p>
              <ul>
                <li>
                  <Link href="/editorial-policy">Editorial Policy</Link>
                </li>
                <li>
                  <Link href="/fact-checking">Fact-Checking Process</Link>
                </li>
                <li>
                  <Link href="/medical-expert-review">
                    Medical / Expert Review Policy
                  </Link>
                </li>
                <li>
                  <Link href="/medical-disclaimer">Disclaimer</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Use</Link>
                </li>
              </ul>
              <p>
                Feedback, corrections, or questions may be submitted through the{" "}
                <Link href="/contact">Contact page</Link>.
              </p>

              <h2>Educational Purpose</h2>
              <p>
                All content published on SupplementDecoded is provided for
                educational purposes only.
              </p>
              <p>
                SupplementDecoded does not provide medical advice, diagnosis, or
                treatment recommendations.
              </p>
              <p>
                Health-related decisions should be made in consultation with
                qualified healthcare professionals.
              </p>

              <hr className="my-10 border-[#D9CFC7] dark:border-[#3B3028]" />
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                Last reviewed and updated: March 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
