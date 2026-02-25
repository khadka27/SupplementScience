import { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Fact-Checking Process | SupplementDecoded",
  description:
    "Learn about our fact-checking process. Discover how we verify scientific statements, review sources, and ensure content accuracy for our readers.",
  alternates: {
    canonical: `${baseUrl}/fact-checking`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FactCheckingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <CheckCircle className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Fact-Checking Process
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            The purpose of our fact-checking process is to ensure that
            information published on this site is accurate, balanced, and
            responsibly presented.
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
              <h2 className="text-3xl mt-0">Purpose of Fact-Checking</h2>
              <p>
                The purpose of our fact-checking process is to ensure that
                information published on this site is accurate, balanced, and
                responsibly presented.
              </p>
              <p>
                Health and supplement information can influence personal
                decisions. For this reason, we verify factual claims, research
                references, and contextual explanations before content is
                published or updated. Fact-checking helps reduce errors,
                misinterpretation, and the spread of misinformation.
              </p>

              <h2>What Fact-Checking Means on This Site</h2>
              <p>Fact-checking on this site involves verifying that:</p>
              <ul>
                <li>
                  Scientific statements accurately reflect the source material
                </li>
                <li>
                  Research findings are summarized correctly and without
                  exaggeration
                </li>
                <li>
                  Data points, definitions, and terminology are used
                  appropriately
                </li>
                <li>Context is preserved so findings are not misleading</li>
                <li>
                  Claims are supported by credible evidence or clearly
                  identified as uncertain
                </li>
              </ul>
              <p>
                Fact-checking is a verification process, not an endorsement of
                supplements, products, or health outcomes.
              </p>

              <h2>Sources Used for Verification</h2>
              <p>
                We prioritize verification using credible and authoritative
                sources, including:
              </p>
              <ul>
                <li>Peer-reviewed scientific journals</li>
                <li>Systematic reviews and meta-analyses</li>
                <li>Government and academic research databases</li>
                <li>Reputable public health and medical organizations</li>
              </ul>
              <p>
                Marketing materials, testimonials, anecdotal reports, and
                unverified online sources are not used as evidence during
                fact-checking.
              </p>

              <h2>Fact-Checking Workflow</h2>
              <p>Our fact-checking process generally follows these steps:</p>
              <h3>Source Identification</h3>
              <p>
                Claims and statements are traced back to original research,
                guidelines, or authoritative references.
              </p>

              <h3>Source Evaluation</h3>
              <p>
                Sources are assessed for credibility, relevance, publication
                quality, and potential bias.
              </p>

              <h3>Claim Verification</h3>
              <p>
                Statements are checked to ensure they accurately reflect what
                the source reports, including limitations or mixed findings.
              </p>

              <h3>Language Review</h3>
              <p>
                Wording is reviewed to avoid absolute, misleading, or
                exaggerated claims and to reflect uncertainty where appropriate.
              </p>

              <h3>Context Review</h3>
              <p>
                Information is examined to ensure it is presented within
                appropriate scientific and practical context.
              </p>

              <h2>Who Performs Fact-Checking</h2>
              <p>
                Fact-checking is conducted by members of our Research Editorial
                Team and trained contributors working under editorial oversight.
              </p>
              <p>Fact-checkers are selected based on:</p>
              <ul>
                <li>
                  Educational or professional background in science, health, or
                  research-based writing
                </li>
                <li>
                  Familiarity with interpreting scientific studies and evidence
                  hierarchies
                </li>
                <li>
                  Training in our internal editorial and verification standards
                </li>
              </ul>
              <p>
                Fact-checking is performed independently of any commercial
                considerations.
              </p>
              <p>
                This site does not operate affiliate programs, accept
                sponsorships, or receive compensation from supplement
                manufacturers. Fact-checkers are not influenced by brands,
                products, or financial relationships.
              </p>

              <h2>Evidence Strength & How We Describe Findings</h2>
              <p>
                Not all evidence carries the same weight. During fact-checking,
                evidence is evaluated using a simplified hierarchy:
              </p>
              <ul>
                <li>
                  <strong>High evidence:</strong> Systematic reviews or
                  meta-analyses of human randomized controlled trials
                </li>
                <li>
                  <strong>Moderate evidence:</strong> Individual human
                  randomized or controlled studies
                </li>
                <li>
                  <strong>Low evidence:</strong> Observational or population
                  studies
                </li>
                <li>
                  <strong>Very low / preliminary evidence:</strong> Animal
                  studies, in-vitro research, or mechanism-only data
                </li>
              </ul>
              <p>This hierarchy directly affects how claims are written:</p>
              <ul>
                <li>
                  Stronger evidence may be described using phrases like “has
                  been studied for”
                </li>
                <li>
                  Mixed or limited evidence is described using “may”,
                  “suggests”, or “evidence is mixed”
                </li>
                <li>
                  Preliminary or mechanistic findings are clearly labeled as
                  hypothesis-level and not presented as proven human outcomes
                </li>
              </ul>
              <p>
                Balanced coverage means presenting benefits, limitations, and
                null or negative findings with similar prominence, and
                describing the totality of evidence, not isolated results.
              </p>

              <h2>Additional Fact-Checking Standards for Supplement Content</h2>
              <p>
                When fact-checking supplement-related content, we apply
                additional verification steps, including:
              </p>
              <ul>
                <li>
                  Comparing dosage ranges used in studies with product-label
                  dosages
                </li>
                <li>
                  Identifying whether study populations match the general public
                  or specific groups (age, sex, health condition)
                </li>
                <li>
                  Distinguishing short-term trial outcomes from assumptions
                  about long-term use
                </li>
                <li>
                  Clarifying whether reported outcomes are clinically meaningful
                  or limited to surrogate markers (e.g., biomarkers)
                </li>
              </ul>
              <p>Safety review includes checking:</p>
              <ul>
                <li>
                  Known side effects and contraindications from authoritative
                  references
                </li>
                <li>
                  Common interaction risks, especially for higher-risk groups
                  such as:
                  <ul>
                    <li>Pregnant or breastfeeding individuals</li>
                    <li>People with liver or kidney conditions</li>
                    <li>
                      Those using anticoagulants or certain psychiatric
                      medications
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                When safety data is limited or unavailable, this is stated
                explicitly as “insufficient data”.
              </p>

              <h2>Citation and Traceability Standards</h2>
              <p>Fact-checking requires that:</p>
              <ul>
                <li>
                  Key factual claims are supported by citations or clearly
                  labeled as uncertain
                </li>
                <li>
                  Primary research sources are preferred whenever available
                </li>
                <li>Secondary summaries are used only to provide context</li>
                <li>
                  Sources are traceable so readers can review the original
                  evidence
                </li>
              </ul>
              <p>Content may include:</p>
              <ul>
                <li>“Last fact-checked” or “Last updated” dates</li>
                <li>
                  Notes indicating significant updates or corrections when
                  appropriate
                </li>
              </ul>

              <h2>What Is Fact-Checked</h2>
              <p>Fact-checking may apply to:</p>
              <ul>
                <li>Ingredient descriptions and mechanisms</li>
                <li>Research summaries and evidence discussions</li>
                <li>Safety information, side effects, and interactions</li>
                <li>Numerical data, definitions, and terminology</li>
                <li>Health-related claims and explanations</li>
              </ul>
              <p>
                Not all content requires the same level of fact-checking.
                General descriptive content may undergo lighter verification,
                while health-sensitive topics receive more thorough review.
              </p>

              <h2>What Fact-Checking Does Not Do</h2>
              <p>
                To maintain clarity and trust, our fact-checking process does
                not:
              </p>
              <ul>
                <li>
                  Guarantee accuracy beyond the limits of available evidence
                </li>
                <li>
                  Eliminate uncertainty in areas where research is evolving
                </li>
                <li>Replace medical or expert review when required</li>
                <li>Provide medical advice or personalized recommendations</li>
                <li>
                  Approve or endorse supplements, products, or interventions
                </li>
              </ul>
              <p>
                Readers should always consult qualified healthcare professionals
                for personal medical decisions.
              </p>

              <h2>Handling Updates, Corrections, and Errors</h2>
              <p>
                Despite careful review, errors can occur. When issues are
                identified:
              </p>
              <ul>
                <li>
                  Content is reviewed and corrected as promptly as possible
                </li>
                <li>Corrections are made transparently within the article</li>
                <li>Updated information reflects current credible evidence</li>
              </ul>
              <p>
                Significant changes may be noted to maintain transparency for
                readers.
              </p>

              <h2>Relationship Between Fact-Checking and Review</h2>
              <p>Fact-checking is a foundational editorial step.</p>
              <ul>
                <li>
                  All content undergoes fact-checking prior to publication
                </li>
                <li>
                  Certain content may also undergo medical or expert review
                </li>
              </ul>
              <p>
                Fact-checking supports accuracy; expert review adds
                subject-matter oversight.
              </p>
              <p>
                These processes work together to promote responsible health
                communication.
              </p>

              <h2>Reader Responsibility</h2>
              <p>
                All information on this site is provided for educational
                purposes only.
              </p>
              <p>Readers are responsible for:</p>
              <ul>
                <li>
                  Consulting qualified professionals before making health
                  decisions
                </li>
                <li>Understanding that scientific knowledge evolves</li>
                <li>
                  Interpreting information in light of individual circumstances
                </li>
              </ul>
              <p>
                This site does not replace professional medical advice,
                diagnosis, or treatment.
              </p>

              <h2>Transparency and Accountability</h2>
              <p>
                We are committed to openness in how facts are verified and
                corrections are handled.
              </p>
              <p>
                You can learn more about our standards on the following pages:
              </p>
              <ul>
                <li>
                  <Link href="/editorial-policy">Editorial Policy</Link>
                </li>
                <li>Medical / Expert Review Policy</li>
                <li>
                  <Link href="/medical-disclaimer">Disclaimer</Link>
                </li>
              </ul>
              <p>
                Questions or concerns about factual accuracy are welcome and can
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
