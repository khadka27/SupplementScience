import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  FlaskConical,
  Scale,
  Microscope,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FileText,
  Lock,
  Search,
  Sparkles,
} from "lucide-react";

const baseUrl = (
  (process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com"
    )) ||
  "https://www.supplementdecoded.com"
) as string;

export const metadata: Metadata = {
  title: "About Our Research & Editorial Charter | SupplementDecoded",
  description:
    "SupplementDecoded is an independent educational monograph database. We evaluate dietary supplement ingredients using double-blind human RCTs, bioavailability kinetics, and zero commercial sponsor influence.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Our Research & Editorial Charter | SupplementDecoded",
    description:
      "Independent clinical supplement monographs. Human trials only, elemental dosage verification, and zero affiliate kickbacks.",
    url: `${baseUrl}/about`,
    type: "website",
  },
};

const STATS = [
  { value: "1,420+", label: "Human RCTs Indexed", sub: "Double-blind, placebo-controlled" },
  { value: "0%", label: "Sponsor or Affiliate Bias", sub: "Strict anti-commercial charter" },
  { value: "100%", label: "PharmD Fact-Checked", sub: "Clinical toxicology oversight" },
  { value: "USP / WHO", label: "Purity Standards", sub: "Heavy metal screening limits" },
];

const EVIDENCE_LEVELS = [
  {
    grade: "Grade A",
    title: "Systematic Reviews & Meta-Analyses",
    desc: "Multiple high-quality human RCTs with consistent endpoints, robust sample sizes (>100 subjects), and low risk of funding bias.",
    status: "Therapeutic standard",
    color: "emerald",
  },
  {
    grade: "Grade B",
    title: "Independent Human Clinical Trials",
    desc: "Double-blind, placebo-controlled human studies measuring direct physiological outcomes rather than subjective questionnaires.",
    status: "Probable efficacy",
    color: "teal",
  },
  {
    grade: "Grade C",
    title: "Small Human Pilots & Observational Data",
    desc: "Preliminary human trials with small cohorts (<30 subjects) or short durations. Noted transparently as inconclusive.",
    status: "Preliminary signal",
    color: "amber",
  },
  {
    grade: "Grade D",
    title: "Animal & In Vitro Proxies",
    desc: "Rodent or cell-culture mechanisms. Reported solely for biological plausibility; strictly forbidden from supporting human dosing claims.",
    status: "Hypothesis generation only",
    color: "stone",
  },
  {
    grade: "Discarded",
    title: "Manufacturer Whitepapers & Influencer Claims",
    desc: "In-house brand studies, undisclosed proprietary blends, and paid testimonials carry zero evidential standing in our monographs.",
    status: "Zero clinical validity",
    color: "red",
  },
];

const GOVERNANCE_LINKS = [
  {
    title: "Editorial Policy",
    desc: "Our non-commercial charter, conflict-of-interest guidelines, and source verification hierarchy.",
    href: "/editorial-policy",
    icon: FileText,
  },
  {
    title: "Fact-Checking Process",
    desc: "How each monograph undergoes multi-stage toxicology review and human RCT verification.",
    href: "/fact-checking",
    icon: CheckCircle2,
  },
  {
    title: "Scam & Whistleblower Desk",
    desc: "Confidential triage for reporting tainted batches, fake COAs, or undisclosed prescription drugs.",
    href: "/contact",
    icon: Lock,
  },
  {
    title: "Medical Disclaimer",
    desc: "Regulatory definitions separating public research syntheses from individual medical treatment.",
    href: "/medical-disclaimer",
    icon: AlertOctagon,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0D] text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* ── 1. HERO SECTION (ALIGNED TIGHTLY UNDER 80PX NAVBAR) ───── */}
      <section className="relative pt-20 sm:pt-[84px] pb-16 overflow-hidden border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div className="max-w-3xl text-left">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>INSTITUTIONAL CHARTER · INDEPENDENT CLINICAL MONOGRAPHS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.1] mb-6">
              The Human-Trial Standard for Dietary Supplements
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal mb-10">
              SupplementDecoded was established to dismantle the marketing fluff of the $180B global
              supplement industry. We extract therapeutic dosage thresholds, bioavailability kinetics,
              and heavy metal safety screens directly from published RCTs — with zero sponsor funding,
              zero affiliate links, and zero pay-to-play reviews.
            </p>

            {/* Quick Credentials Strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                <span>100% Non-Commercial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                <span>Human RCT Evidence Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Updated Continually (2026 Standards)</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. KEY STATS METRIC BAR ───────────────────────────────── */}
      <section className="py-8 bg-white dark:bg-[#0D1217] border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {STATS.map((stat, i) => (
              <div key={i} className="pl-4 border-l-2 border-[#0E3B2F] dark:border-emerald-500">
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#0E3B2F] dark:text-emerald-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-stone-400 dark:text-stone-500 font-mono mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THE REGULATORY REALITY & WHY WE EXIST ───────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: The Problem with Supplement Marketing */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                THE REGULATORY BLINDSPOT
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Why Standard Supplement Marketing Cannot Be Trusted
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Under the U.S. Dietary Supplement Health and Education Act of 1994 (DSHEA) and similar
                frameworks globally, dietary supplements are not required to demonstrate clinical efficacy
                prior to reaching consumer shelves. Manufacturers do not submit prospective Phase III
                human trials to the FDA before selling products.
              </p>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                This legal structure creates an environment where:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-2xs flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">
                      Fairy-Dusting & Under-Dosing
                    </strong>
                    <span className="text-stone-500 dark:text-stone-400">
                      Brands cite clinical trials showing benefits at 600mg of standardized extract, but include only 50mg of cheap whole-herb powder in proprietary blends.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-2xs flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">
                      Insoluble & Low-Bioavailability Salts
                    </strong>
                    <span className="text-stone-500 dark:text-stone-400">
                      Cheap magnesium oxide is advertised identically to magnesium bisglycinate, despite having an elemental absorption rate of roughly 4% compared to chelated forms.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-2xs flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">
                      Affiliate-Driven "Top 10" Reviews
                    </strong>
                    <span className="text-stone-500 dark:text-stone-400">
                      Commercial wellness review sites rank products based on who pays the highest affiliate commission (often 20% to 50% per sale), disguising advertisements as medical reviews.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The SupplementDecoded Human-Trial Counter-Model */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                OUR CLINICAL COUNTER-MODEL
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                How SupplementDecoded Evaluates Ingredients
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                We operate as an independent clinical research and monograph desk. Every monograph in our
                database is constructed from the ground up by reviewing primary trial data indexed in PubMed,
                the Cochrane Library, and academic pharmacology repositories.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-emerald-950 dark:text-emerald-200 block mb-0.5">
                      Double-Blind Human Trials (RCTs) Only
                    </strong>
                    <span className="text-emerald-900/80 dark:text-emerald-300/80">
                      We prioritize randomized, placebo-controlled human studies. Rodent, canine, and cell-culture studies are classified as hypothesis-generating and cannot validate clinical efficacy.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-emerald-950 dark:text-emerald-200 block mb-0.5">
                      Elemental Ion Weight vs Bulk Salt
                    </strong>
                    <span className="text-emerald-900/80 dark:text-emerald-300/80">
                      We break down chemical molecular weights. 500mg of magnesium malate yields only ~75mg of elemental magnesium ions. We expose the exact active payload in every monograph.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-emerald-950 dark:text-emerald-200 block mb-0.5">
                      Pharmacokinetics & Heavy Metal Limits
                    </strong>
                    <span className="text-emerald-900/80 dark:text-emerald-300/80">
                      We track peak serum concentration (Tmax), elimination half-life (t1/2), and compare heavy metal thresholds (lead, cadmium, arsenic, mercury) against strict USP and WHO standards.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. THE STRICT ANTI-AFFILIATE COVENANT ──────────────────── */}
      <section className="py-16 sm:py-20 bg-stone-100/70 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>THE ZERO-CONFLICT COVENANT</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight mb-3">
              Our Non-Commercial Independence Charter
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Financial independence is the only guarantee of scientific integrity in dietary supplement research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-base mb-4 border border-red-200 dark:border-red-900/50">
                0%
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                No Affiliate Tracking
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                We never use Amazon Associates, reward links, or retailer checkout cookies. Links point to PubMed DOIs and clinical registries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-base mb-4 border border-red-200 dark:border-red-900/50">
                0%
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                No Sponsored Reviews
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Brands cannot pay for expedited monograph reviews, favorable grades, or promotional placement. Every review is independent.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-4 border border-emerald-200 dark:border-emerald-900/50">
                100%
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                PharmD Reviewed
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Our monographs are fact-checked by clinical specialists with backgrounds in pharmacology, pharmacognosy, and clinical biochemistry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-4 border border-emerald-200 dark:border-emerald-900/50">
                100%
              </div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                Living Evidence Base
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                When new multi-center human trials contradict older findings, our monographs are revised and version-stamped immediately.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. HIERARCHY OF EVIDENCE (5-TIER SCALE) ───────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>THE SCIENTIFIC HIERARCHY</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Our 5-Tier Evidence Evaluation Scale
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
              How our editorial team grades research quality and therapeutic plausibility.
            </p>
          </div>

          <div className="space-y-3.5">
            {EVIDENCE_LEVELS.map((lvl) => {
              const isGradeA = lvl.grade === "Grade A";
              const isDiscarded = lvl.grade === "Discarded";

              return (
                <div
                  key={lvl.grade}
                  className={`p-5 rounded-2xl border transition-all ${
                    isGradeA
                      ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs"
                      : isDiscarded
                      ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
                      : "bg-white dark:bg-[#0D1217] border-stone-200/90 dark:border-stone-800 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
                          isGradeA
                            ? "bg-emerald-600 text-white"
                            : isDiscarded
                            ? "bg-red-600 text-white"
                            : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        {lvl.grade}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                        {lvl.title}
                      </h3>
                    </div>

                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                      {lvl.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans pl-1">
                    {lvl.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. INSTITUTIONAL POLICIES & GOVERNANCE ─────────────────── */}
      <section className="py-16 bg-white dark:bg-[#0D1217] border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TRANSPARENCY & METHODOLOGY</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Institutional Governance & Review Standards
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Explore the detailed methodology documentation governing our scientific publishing process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOVERNANCE_LINKS.map((gov) => {
              const Icon = gov.icon;
              return (
                <Link
                  key={gov.title}
                  href={gov.href}
                  className="p-5 rounded-2xl bg-[#FAFAF8] dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 hover:border-[#0E3B2F] dark:hover:border-emerald-600 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-100 dark:border-emerald-900/50">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors mb-1">
                      {gov.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      {gov.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#0E3B2F] dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                    <span>Read Policy</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 7. BOTTOM EXPLORATION CALL TO ACTION ──────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0E3B2F] via-[#11483A] to-[#0A2E24] text-white shadow-2xl shadow-emerald-950/20 border border-emerald-800/40 text-center relative overflow-hidden">
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold block mb-2">
                EVIDENCE OVER MARKETING CLAIMS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Explore the Clinical Monograph Database
              </h2>
              <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed mb-8">
                Search over 1,420 peer-reviewed trials, therapeutic dosing ranges, and safety screens
                for 384+ dietary supplement compounds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/ingredients"
                  className="h-12 px-6 rounded-xl bg-white hover:bg-emerald-50 text-[#0E3B2F] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Research Monographs</span>
                </Link>

                <Link
                  href="/contact"
                  className="h-12 px-6 rounded-xl bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all border border-emerald-700/60 flex items-center gap-2 active:scale-95"
                >
                  <span>Submit Clinical Correction</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
