import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "Medical / Expert Review Policy | SupplementDecoded",
  description:
    "Learn how our medical and expert review process ensures accurate, balanced, and responsible health information. Understand our standards for scientific accuracy and transparency.",
  alternates: {
    canonical: `${baseUrl}/medical-expert-review`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MedicalExpertReviewPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <ShieldCheck className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Medical / Expert Review Policy
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            How we ensure accuracy, balance, and responsible health
            communication through expert review.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] text-sm font-medium text-gray-600 dark:text-zinc-400">
            <span>Last Updated: March 27, 2026</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-[#0F0E0A] border border-[#D9CFC7] dark:border-[#3B3028] rounded-4xl p-8 md:p-12 lg:p-16 shadow-xl shadow-black/5 dark:shadow-none">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-8 prose-headings:mb-4 prose-p:mb-4 prose-p:leading-relaxed prose-ul:my-4 prose-li:mb-2 prose-a:text-primary hover:prose-a:text-primary/80 prose-a:font-medium">
              <h2 className="text-3xl mt-0">
                Purpose of Medical and Expert Review
              </h2>
              <p>
                Health and supplement information can directly affect how people
                make decisions about their well-being. For that reason, certain
                content on this site undergoes medical or subject-matter review
                to help ensure accuracy, balance, and responsible communication.
              </p>
              <p>
                The goal of medical or expert review is not to provide medical
                advice, but to verify that information is presented in a way
                that reflects current scientific understanding and clearly
                communicates limitations and uncertainty.
              </p>

              <h2>What Medical / Expert Review Means on This Site</h2>
              <p>
                When content is medically or expert reviewed, it means that:
              </p>
              <ul>
                <li>
                  Scientific explanations have been checked for accuracy and
                  context
                </li>
                <li>
                  Language has been reviewed to avoid absolute or misleading
                  claims
                </li>
                <li>
                  Potential risks, limitations, and safety considerations are
                  clearly disclosed
                </li>
                <li>
                  Evidence is represented fairly, including mixed or
                  inconclusive findings
                </li>
              </ul>
              <p>
                Medical or expert review does not mean endorsement of a product,
                supplement, or intervention.
              </p>

              <h2>Who Reviews Our Content</h2>
              <p>
                Medical or expert review may involve individuals with
                backgrounds in areas such as:
              </p>
              <ul>
                <li>Nutrition science</li>
                <li>Pharmacology</li>
                <li>Public health</li>
                <li>Clinical research</li>
                <li>Related life or health sciences</li>
              </ul>
              <p>
                Reviewers are selected based on relevant subject-matter
                knowledge, not commercial affiliation.
              </p>

              <h2>Independence of Review</h2>
              <p>
                All medical and expert reviews are conducted with full
                independence.
              </p>
              <ul>
                <li>
                  Reviewers are not compensated by supplement manufacturers
                </li>
                <li>
                  No brand, company, or third party influences review
                  conclusions
                </li>
                <li>
                  Reviews are not promotional and do not recommend products
                </li>
                <li>
                  This site does not maintain financial relationships with
                  supplement companies or advertisers
                </li>
              </ul>

              <h2>What Content May Be Reviewed</h2>
              <p>Medical or expert review may apply to:</p>
              <ul>
                <li>Supplement ingredient explanations</li>
                <li>Safety and side-effect discussions</li>
                <li>Research summaries involving health outcomes</li>
                <li>
                  Product analyses where health implications are discussed
                </li>
                <li>Category-level health guides</li>
              </ul>
              <p>
                Not all content requires medical review. General educational or
                descriptive content may undergo editorial review only.
              </p>

              <h2>When Medical / Expert Review Occurs</h2>
              <p>
                Medical or expert review is applied after initial editorial
                drafting and fact-checking, and before content is finalized or
                substantially updated.
              </p>
              <p>
                Not all content on this site requires medical or expert review.
                Review is prioritized for pages that:
              </p>
              <ul>
                <li>
                  Discuss health outcomes, safety considerations, or potential
                  risks
                </li>
                <li>
                  Interpret or summarize scientific, clinical, or observational
                  research
                </li>
                <li>
                  Analyze supplement ingredients, formulations, or mechanisms of
                  action
                </li>
                <li>
                  Address health-related topics where misunderstanding could
                  pose risk
                </li>
              </ul>
              <p>
                General educational or descriptive content may undergo editorial
                review only.
              </p>

              <h2>What Medical / Expert Review Does Not Do</h2>
              <p>
                To protect readers and maintain trust, our medical or expert
                review process does not:
              </p>
              <ul>
                <li>Provide medical diagnoses or treatment recommendations</li>
                <li>Replace advice from licensed healthcare professionals</li>
                <li>Approve, endorse, or certify supplements or products</li>
                <li>
                  Guarantee accuracy beyond the limits of available evidence
                </li>
                <li>
                  Eliminate uncertainty where scientific consensus does not
                  exist
                </li>
              </ul>
              <p>
                Readers should always consult qualified healthcare professionals
                for personal medical decisions.
              </p>

              <h2>How Reviewed Content Is Identified</h2>
              <p>Where applicable, reviewed content may include:</p>
              <ul>
                <li>
                  A note indicating that the content has been medically or
                  expert reviewed
                </li>
                <li>
                  The general role or background of the reviewer (without
                  promotional framing)
                </li>
                <li>The most recent review or update date</li>
              </ul>
              <p>
                This information is provided to support transparency, not
                authority claims.
              </p>

              <h2>Handling New Evidence and Updates</h2>
              <p>Health research evolves. To remain accurate:</p>
              <ul>
                <li>
                  Reviewed content is periodically re-evaluated, typically every
                  6–12 months
                </li>
                <li>
                  Articles may be updated when new, credible evidence becomes
                  available
                </li>
                <li>
                  Significant changes are incorporated to reflect current
                  understanding
                </li>
                <li>
                  If important errors are identified, corrections are made
                  promptly
                </li>
              </ul>

              <h2>Limitations of Medical / Expert Review</h2>
              <p>
                Medical and expert review reflects knowledge available at the
                time of review. Scientific understanding may change, and
                individual health circumstances vary.
              </p>
              <p>For this reason:</p>
              <ul>
                <li>
                  Reviewed content should be used for educational purposes only
                </li>
                <li>It should not be used to self-diagnose or self-treat</li>
                <li>Professional medical advice should always take priority</li>
              </ul>

              <h2>Transparency and Accountability</h2>
              <p>
                We are committed to transparency in how medical and expert
                review is conducted.
              </p>
              <p>
                You can learn more about our standards on the following pages:
              </p>
              <ul>
                <li>
                  <Link href="/editorial-policy">Editorial Policy</Link>
                </li>
                <li>
                  <Link href="/fact-checking">Fact-Checking Process</Link>
                </li>
                <li>
                  <Link href="/medical-disclaimer">Medical Disclaimer</Link>
                </li>
              </ul>
              <p>
                Questions or concerns about reviewed content are welcome and can
                be submitted through our{" "}
                <Link href="/contact">Contact page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
