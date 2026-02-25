import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Safety Measures for Supplement Use | SupplementDecoded",
  description:
    "An evidence-based guide to responsible supplement decisions. Learn how to approach supplement use responsibly, with safety, context, and evidence in mind.",
  alternates: {
    canonical: `${baseUrl}/safety-measures`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SafetyMeasuresPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-500 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Safety Measures for Supplement Use
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            An Evidence-Based Guide to Responsible Supplement Decisions
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
              <p className="lead text-xl text-gray-600 dark:text-zinc-400 mt-0">
                Supplements are widely available and often marketed as simple
                solutions for complex health concerns. However, like any
                substance that affects the body, supplements can carry risks,
                interactions, and uncertainties.
              </p>
              <p>
                This guide explains how to approach supplement use responsibly,
                with safety, context, and evidence in mind.
              </p>
              <p className="font-semibold text-primary/90">
                Supplements do not replace balanced nutrition, physical
                activity, medical care, or healthy lifestyle habits. Where used,
                they should be considered optional and supportive—not
                foundational.
              </p>

              <h2>Why Safety Matters</h2>
              <p>
                Unlike prescription medications, dietary supplements are
                regulated differently in many countries. While reputable
                manufacturers follow quality standards, variability in
                formulation, labeling, and dosage can occur.
              </p>
              <p>
                For this reason, understanding safety considerations is
                essential before using any supplement.
              </p>

              <h2>1. Understand Regulatory Differences</h2>
              <p>In many regions:</p>
              <ul>
                <li>Supplements are regulated as food products, not drugs</li>
                <li>
                  Manufacturers are responsible for safety before marketing
                </li>
                <li>
                  Pre-market approval for effectiveness is typically not
                  required
                </li>
                <li>
                  Health claims are limited to structure/function statements
                </li>
              </ul>
              <p>This means:</p>
              <ul>
                <li>Evidence levels may vary</li>
                <li>Clinical validation may be limited</li>
                <li>Oversight differs from pharmaceutical standards</li>
              </ul>
              <p>
                Consumers should interpret supplement claims cautiously and seek
                evidence beyond marketing language.
              </p>

              <h2>2. Evaluate Dosage Carefully</h2>
              <p>Dosage is one of the most important safety factors.</p>
              <p>When reviewing supplements:</p>
              <ul>
                <li>
                  Compare product dosage to amounts studied in human research
                </li>
                <li>
                  Be cautious of megadoses exceeding established upper intake
                  levels
                </li>
                <li>
                  Understand that “more” does not necessarily mean “better”
                </li>
              </ul>
              <p>
                In some cases, doses used in research differ significantly from
                those found in commercial products.
              </p>

              <h2>3. Consider Potential Side Effects</h2>
              <p>Even commonly used supplements can cause adverse effects.</p>
              <p>Examples of possible risks may include:</p>
              <ul>
                <li>Gastrointestinal discomfort</li>
                <li>Headaches or dizziness</li>
                <li>Allergic reactions</li>
                <li>Blood pressure or blood sugar changes</li>
                <li>Liver or kidney stress (in rare cases)</li>
              </ul>
              <p>Side effects may depend on:</p>
              <ul>
                <li>Dosage</li>
                <li>Duration of use</li>
                <li>Individual sensitivity</li>
              </ul>
              <p>
                When safety data is limited, it should be treated as
                uncertain—not assumed safe.
              </p>

              <h2>4. Check for Drug and Supplement Interactions</h2>
              <p>
                Certain supplements may interact with medications or other
                supplements.
              </p>
              <p>Higher-risk interactions may involve:</p>
              <ul>
                <li>Anticoagulants</li>
                <li>Antidepressants (SSRIs, MAOIs)</li>
                <li>Blood pressure medications</li>
                <li>Diabetes medications</li>
                <li>Hormone therapies</li>
              </ul>
              <p>
                Interactions can increase or decrease the effectiveness of
                medications or raise safety concerns.
              </p>
              <p className="font-semibold">
                Consulting a healthcare professional before combining
                supplements with medications is strongly advised.
              </p>

              <h2>5. Identify Higher-Risk Populations</h2>
              <p>Some individuals require extra caution, including:</p>
              <ul>
                <li>Pregnant or breastfeeding individuals</li>
                <li>Children and adolescents</li>
                <li>Older adults</li>
                <li>Individuals with liver or kidney conditions</li>
                <li>People with autoimmune or chronic illnesses</li>
              </ul>
              <p>
                Research often excludes certain populations, meaning safety data
                may be incomplete.
              </p>

              <h2>6. Understand Evidence Limitations</h2>
              <p>Not all supplement claims are supported by strong evidence.</p>
              <p>Evidence types vary:</p>
              <ul>
                <li>
                  <strong>High:</strong> Systematic reviews and meta-analyses of
                  human randomized controlled trials
                </li>
                <li>
                  <strong>Moderate:</strong> Individual controlled human studies
                </li>
                <li>
                  <strong>Low:</strong> Observational studies
                </li>
                <li>
                  <strong>Very low:</strong> Animal or laboratory studies
                </li>
              </ul>
              <p>
                Preliminary or mechanistic findings should not be interpreted as
                confirmed human benefits.
              </p>
              <p>
                When evidence is mixed or inconclusive, that uncertainty should
                guide expectations.
              </p>

              <h2>7. Quality and Label Transparency</h2>
              <p>Supplement quality can vary.</p>
              <p>Consumers should consider:</p>
              <ul>
                <li>Clear ingredient labeling</li>
                <li>Transparent dosage information</li>
                <li>Absence of proprietary blends that obscure amounts</li>
                <li>Third-party testing certifications (where applicable)</li>
              </ul>
              <p>
                Third-party testing does not guarantee effectiveness, but it may
                indicate better manufacturing transparency.
              </p>

              <h2>8. Beware of Red Flags in Marketing</h2>
              <p>Exercise caution when encountering claims such as:</p>
              <ul>
                <li>“Cures” or “reverses” disease</li>
                <li>“Guaranteed results”</li>
                <li>“Clinically proven” without cited evidence</li>
                <li>“Works for everyone”</li>
                <li>
                  Urgency-driven language (“limited time,” “miracle
                  breakthrough”)
                </li>
              </ul>
              <p>
                Responsible health information avoids absolute language and
                clearly states limitations.
              </p>

              <h2>9. Long-Term Use Considerations</h2>
              <p>Many supplements are studied only short-term.</p>
              <p>Before long-term use, consider:</p>
              <ul>
                <li>Whether long-term safety data exists</li>
                <li>Whether continuous use is necessary</li>
                <li>Whether benefits have plateaued</li>
                <li>Whether lifestyle changes may be more effective</li>
              </ul>
              <p>Regular re-evaluation of supplement use is advisable.</p>

              <h2>10. When to Seek Professional Guidance</h2>
              <p>Consult a qualified healthcare professional if:</p>
              <ul>
                <li>You take prescription medications</li>
                <li>You have chronic health conditions</li>
                <li>You are pregnant or breastfeeding</li>
                <li>You experience adverse effects</li>
                <li>You are unsure about appropriate dosage</li>
              </ul>
              <p>
                Professional guidance is especially important when health
                conditions are involved.
              </p>

              <h2>Safety as an Ongoing Process</h2>
              <p>
                Safety is not a single decision, it is an ongoing evaluation.
              </p>
              <p>Before starting any supplement, consider:</p>
              <ul>
                <li>Why am I considering this?</li>
                <li>What does the evidence actually show?</li>
                <li>Are risks clearly understood?</li>
                <li>Could lifestyle changes address this concern instead?</li>
              </ul>
              <p>
                In many cases, improvements in diet, movement, sleep, and
                medical care provide stronger long-term outcomes than
                supplements alone.
              </p>

              <h2>Final Note on Responsible Use</h2>
              <p>
                This guide is provided for educational purposes only and does
                not replace medical advice.
              </p>
              <p>
                Supplements may have a role in certain situations, but they
                should be approached thoughtfully, cautiously, and in context.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
