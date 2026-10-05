import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

export const metadata: Metadata = {
  title: "Medical Disclaimer | SupplementDecoded",
  description:
    "Please read our medical disclaimer. All content on this website is provided for educational and informational purposes only.",
  alternates: {
    canonical: `${baseUrl}/medical-disclaimer`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-stone-100/70 dark:bg-[#0A0F14] pt-20 sm:pt-[84px] pb-16 px-4 overflow-hidden border-b border-stone-200/90 dark:border-stone-800">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white dark:bg-[#0D1217] shadow-sm w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-200/90 dark:border-stone-800">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-500 drop-shadow-sm" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Medical Disclaimer
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            All content on this website is provided for educational and informational purposes only.
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
              <h2 className="text-3xl mt-0">Educational Purpose Only</h2>
              <p>
                All content on this website is provided for educational and
                informational purposes only.
              </p>
              <p>
                The information presented is intended to help readers understand
                supplements, nutrition, ingredients, safety considerations, and
                related research in context. It is not intended to replace
                professional medical advice, diagnosis, or treatment.
              </p>

              <h2>No Medical Advice</h2>
              <p>
                The content on this site does not constitute medical advice.
              </p>
              <p>We do not provide:</p>
              <ul>
                <li>Medical diagnoses</li>
                <li>Treatment recommendations</li>
                <li>Personalized health guidance</li>
              </ul>
              <p>
                Always seek the advice of a qualified healthcare professional
                regarding any medical condition, treatment, or health decision.
              </p>

              <h2>Scope of This Website</h2>
              <p>
                This website provides educational summaries of evidence,
                ingredient safety information, and claim context. It does not
                provide personalized advice, medical diagnoses, product
                recommendations, or “best supplement” lists.
              </p>
              <p>
                Safety concerns or potentially misleading claims may be reported
                through our <Link href="/contact">Contact page</Link>.
              </p>

              <h2>Supplements Are Not a Substitute for Medical Care</h2>
              <p>
                Diet, physical activity, sleep, and appropriate medical care are
                the foundation of health.
              </p>
              <p>
                Supplements, where discussed, are presented only as optional,
                supportive tools. They are not substitutes for professional
                healthcare, prescribed treatments, or healthy lifestyle
                practices.
              </p>

              <h2>Individual Differences</h2>
              <p>
                Health outcomes and responses to supplements can vary widely
                between individuals.
              </p>
              <p>
                Factors such as age, medical history, medications, genetics, and
                lifestyle may influence how information applies to you. For this
                reason, information on this site should not be used to
                self-diagnose or self-treat any condition.
              </p>

              <h2>Accuracy and Limitations</h2>
              <p>
                We strive to present accurate, evidence-based information using
                credible sources and defined editorial processes. However:
              </p>
              <ul>
                <li>Scientific research evolves over time</li>
                <li>Evidence may be limited, mixed, or inconclusive</li>
                <li>Errors or omissions may occur despite careful review</li>
              </ul>
              <p>
                We do not guarantee the completeness, accuracy, or applicability
                of all information at all times.
              </p>

              <h2>No Endorsements or Guarantees</h2>
              <p>
                This site does not endorse, recommend, certify, or promote any
                supplement, product, service, or brand.
              </p>
              <p>
                References to products or ingredients are provided solely for
                educational context. No guarantees of results or outcomes are
                expressed or implied.
              </p>

              <h2>External Links</h2>
              <p>
                This website may reference or link to external sources for
                additional context or research.
              </p>
              <p>
                We are not responsible for the content, accuracy, or practices
                of external websites and do not control their information or
                policies.
              </p>

              <h2>Monetization and Affiliate Policy</h2>
              <p>
                This website does not use affiliate links, sponsored placements,
                referral programs, or advertising partnerships.
              </p>
              <p>
                We do not receive compensation from supplement manufacturers,
                retailers, or third-party services for linking to external
                resources.
              </p>
              <p>
                Any external links are provided solely for educational context
                and reference purposes.
              </p>

              <h2>Use at Your Own Discretion</h2>
              <p>By using this website, you acknowledge that:</p>
              <ul>
                <li>
                  You are responsible for how you interpret and use the
                  information provided
                </li>
                <li>
                  Any actions you take based on this information are taken at
                  your own discretion
                </li>
                <li>
                  You agree that this site is not liable for decisions made
                  based on its content
                </li>
              </ul>

              <h2>Contact and Questions</h2>
              <p>
                If you have questions about this disclaimer or concerns about
                any content on the site, you may contact us through the{" "}
                <Link href="/contact">Contact page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
