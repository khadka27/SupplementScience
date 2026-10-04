import { Metadata } from "next";
import { FileCheck } from "lucide-react";
import Link from "next/link";

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "Editorial Independence & Disclosure | SupplementDecoded",
  description:
    "Learn about how SupplementDecoded maintains editorial independence, ensures transparency, evaluates evidence, and manages conflicts of interest.",
  alternates: {
    canonical: `${baseUrl}/editorial-independence`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorialIndependencePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-stone-100/70 dark:bg-[#0A0F14] pt-20 sm:pt-[84px] pb-16 px-4 overflow-hidden border-b border-stone-200/90 dark:border-stone-800">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white dark:bg-[#0D1217] shadow-sm w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-200/90 dark:border-stone-800">
            <FileCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Editorial Independence & Disclosure
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            How we maintain independence, evaluate evidence, and manage potential conflicts of interest.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 text-xs font-medium text-slate-600 dark:text-slate-400 shadow-xs">
            <span>Last Updated: March 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 hover:prose-a:underline prose-a:font-medium">
              <h2 className="text-3xl mt-0">Purpose of This Disclosure</h2>
              <p>
                This page explains how SupplementDecoded maintains editorial
                independence, ensures transparency in content creation,
                evaluates scientific evidence, and manages potential conflicts
                of interest.
              </p>
              <p>
                SupplementDecoded is an educational publication focused on the
                scientific, regulatory, and safety context of dietary
                supplements. Transparency regarding editorial standards,
                financial independence, and evidence evaluation methodology is
                essential to maintaining responsible health communication.
              </p>

              <h2>Editorial Independence</h2>
              <p>
                SupplementDecoded operates under defined editorial standards
                designed to maintain independence from commercial influence.
              </p>
              <p>
                Content is researched, drafted, fact-checked, and reviewed based
                on publicly available scientific and regulatory information.
                Editorial decisions, including topic selection, research
                interpretation, and content updates, are made independently of
                supplement manufacturers, distributors, retailers, or other
                commercial entities.
              </p>
              <p>
                SupplementDecoded does not accept compensation, incentives, or
                external editorial control related to supplement products or
                ingredient coverage.
              </p>
              <p>
                Editorial independence is maintained through internal review
                processes designed to prioritize accuracy, neutrality, and
                transparency.
              </p>

              <h2>Editorial Oversight and Accountability</h2>
              <p>
                Content published on SupplementDecoded is subject to internal
                editorial oversight to ensure accuracy, balance, and adherence
                to evidence-based standards.
              </p>
              <p>Editorial oversight includes:</p>
              <ul>
                <li>
                  Review of research interpretation and contextual accuracy
                </li>
                <li>Evaluation of safety considerations and risk framing</li>
                <li>
                  Verification of factual claims against primary and
                  authoritative sources
                </li>
                <li>
                  Consistency with established editorial methodology and
                  regulatory context
                </li>
              </ul>
              <p>
                Editorial decisions and content review processes are documented
                internally to support accountability, transparency, and
                consistency.
              </p>
              <p>
                When material errors, omissions, or inaccuracies are identified,
                corrections are implemented in accordance with defined editorial
                correction procedures.
              </p>

              <h2>Evidence Evaluation Standards</h2>
              <p>
                Scientific evidence is interpreted using a structured evidence
                hierarchy designed to reflect differences in study quality,
                reliability, and applicability.
              </p>
              <p>Evidence evaluation considers factors including:</p>
              <ul>
                <li>Study design and methodological rigor</li>
                <li>Population relevance and sample size</li>
                <li>Replication across independent studies</li>
                <li>Consistency of findings across multiple sources</li>
                <li>Limitations, uncertainty, and potential bias</li>
              </ul>
              <p>
                Different evidence types are clearly distinguished, including:
              </p>
              <ul>
                <li>Randomized controlled trials</li>
                <li>Systematic reviews and meta-analyses</li>
                <li>Observational studies</li>
                <li>Animal and in vitro research</li>
                <li>Mechanistic or preliminary evidence</li>
              </ul>
              <p>
                Findings from limited, early-stage, or indirect evidence are
                presented with appropriate uncertainty and contextual
                limitations.
              </p>
              <p>
                SupplementDecoded does not treat all evidence types as
                equivalent and does not present preliminary findings as
                established clinical outcomes.
              </p>

              <h2>No Affiliate Relationships</h2>
              <p>
                SupplementDecoded does not participate in affiliate marketing
                programs.
              </p>
              <p>This means:</p>
              <ul>
                <li>We do not earn commissions from supplement sales</li>
                <li>
                  We do not receive compensation for linking to products or
                  retailers
                </li>
                <li>We do not use referral tracking links</li>
              </ul>
              <p>
                Any references to products, ingredients, or external resources
                are provided solely for educational and informational purposes.
              </p>

              <h2>No Sponsored Content or Advertising</h2>
              <p>
                SupplementDecoded does not publish sponsored content, paid
                promotions, or advertising placements.
              </p>
              <p>
                We do not accept payment, incentives, or compensation in
                exchange for product coverage, analysis, or editorial inclusion.
              </p>
              <p>
                Content is not influenced by commercial relationships or
                financial considerations.
              </p>

              <h2>No Product Endorsements or Recommendations</h2>
              <p>
                SupplementDecoded does not recommend, endorse, rank, or promote
                supplements, products, or brands.
              </p>
              <p>
                Product analysis is conducted for educational purposes only and
                is intended to examine ingredient composition, research context,
                formulation transparency, and safety considerations.
              </p>
              <p>
                Content should not be interpreted as approval, certification, or
                endorsement of any product.
              </p>

              <h2>Conflict of Interest Management</h2>
              <p>
                SupplementDecoded evaluates scientific research with awareness
                of potential conflicts of interest.
              </p>
              <p>When reviewing studies, consideration may include:</p>
              <ul>
                <li>Disclosure of study funding sources</li>
                <li>
                  Potential financial relationships between researchers and
                  industry
                </li>
                <li>Independent replication of findings</li>
                <li>Consistency of evidence across multiple studies</li>
              </ul>
              <p>
                Where relevant, limitations and potential sources of bias are
                acknowledged in content.
              </p>
              <p>
                Medical or expert review, when conducted, is independent and
                free from commercial influence.
              </p>

              <h2>Regulatory Context and Jurisdiction</h2>
              <p>
                SupplementDecoded references publicly available regulatory
                information from major regulatory frameworks, including U.S.,
                European Union, and international authorities where applicable.
              </p>
              <p>
                Regulatory references are provided for informational context
                only.
              </p>
              <p>Regulatory status does not imply:</p>
              <ul>
                <li>Product approval</li>
                <li>Clinical effectiveness</li>
                <li>Safety certification</li>
                <li>Uniform regulatory enforcement across jurisdictions</li>
              </ul>
              <p>
                Regulatory requirements, oversight standards, and enforcement
                mechanisms vary between countries.
              </p>
              <p>
                Readers should not interpret regulatory references as
                endorsements or guarantees of safety or effectiveness.
              </p>

              <h2>User Safety and Vulnerable Populations</h2>
              <p>
                Content on SupplementDecoded is intended for general educational
                purposes and may not apply to all individuals.
              </p>
              <p>
                Certain populations may face increased risks related to
                supplement use, including individuals who are:
              </p>
              <ul>
                <li>Pregnant or breastfeeding</li>
                <li>Managing chronic medical conditions</li>
                <li>Taking prescription medications</li>
                <li>Undergoing medical treatment</li>
                <li>
                  Managing liver, kidney, cardiovascular, or endocrine
                  conditions
                </li>
              </ul>
              <p>
                Potential risks, interactions, and contraindications are
                discussed where supported by available evidence.
              </p>
              <p>Absence of risk data does not imply safety.</p>
              <p>
                SupplementDecoded does not provide medical advice, and readers
                should consult qualified healthcare professionals before making
                health-related decisions.
              </p>

              <h2>External Links and References</h2>
              <p>
                SupplementDecoded may link to external sources, including
                scientific publications, regulatory agencies, and publicly
                available product information.
              </p>
              <p>
                These links are provided to support transparency and allow
                readers to review original source material.
              </p>
              <p>
                SupplementDecoded does not receive compensation for linking to
                external resources.
              </p>
              <p>
                We do not control or assume responsibility for the content or
                practices of external websites.
              </p>

              <h2>Content Updates, Corrections, and Ongoing Review</h2>
              <p>
                Scientific knowledge and regulatory guidance evolve over time.
              </p>
              <p>To maintain accuracy and relevance:</p>
              <ul>
                <li>Content is periodically reviewed and updated</li>
                <li>
                  Corrections are made when factual errors or inaccuracies are
                  identified
                </li>
                <li>
                  Updated interpretations may be incorporated when new credible
                  evidence becomes available
                </li>
              </ul>
              <p>
                Substantive updates may be reflected through updated review
                dates or revised content sections.
              </p>
              <p>
                Editorial review processes are designed to support ongoing
                accuracy, transparency, and accountability.
              </p>

              <h2>Editorial Funding and Financial Model</h2>
              <p>
                SupplementDecoded currently operates as a non-commercial
                educational publication.
              </p>
              <p>We do not generate revenue through:</p>
              <ul>
                <li>Affiliate programs</li>
                <li>Sponsored content</li>
                <li>Product promotion</li>
                <li>Advertising partnerships related to supplement products</li>
              </ul>
              <p>
                Content is created solely for educational and informational
                purposes.
              </p>
              <p>
                If this model changes in the future, appropriate disclosure will
                be provided, and editorial independence policies will remain in
                place.
              </p>

              <h2>Relationship to Editorial Policy and Disclaimer</h2>
              <p>This Disclosure page should be read alongside our:</p>
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
                These documents explain our editorial methodology, content
                standards, and legal limitations.
              </p>

              <h2>Transparency and Accountability</h2>
              <p>
                SupplementDecoded is committed to transparency in editorial
                practices and independence.
              </p>
              <p>
                Questions, corrections, or concerns regarding editorial
                integrity may be submitted through our{" "}
                <Link href="/contact">Contact page</Link>.
              </p>

              <hr className="my-10 border-stone-200/90 dark:border-stone-800" />
              <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                Last reviewed and updated: March 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
