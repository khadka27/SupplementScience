import { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  FlaskConical,
  AlertOctagon,
  Clock,
  ArrowRight,
  BookOpen,
  Send,
  HelpCircle,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

const baseUrl = (
  (process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com"
    )) ||
  "https://www.supplementdecoded.com"
) as string;

export const metadata: Metadata = {
  title: "Contact & Research Triage Desk | SupplementDecoded",
  description:
    "Direct editorial intake for clinical researchers, whistleblowers reporting tainted supplements, journalists, and readers. Confidential, independent PharmD review.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact & Research Triage Desk | SupplementDecoded",
    description:
      "Direct editorial intake for clinical researchers, whistleblowers reporting tainted supplements, journalists, and readers. Confidential, independent PharmD review.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
};

const DIRECT_DESKS = [
  {
    title: "Clinical Research & Corrections",
    email: "editorial@supplementdecoded.com",
    sla: "24–48 hours",
    badge: "PharmD Review",
    desc: "Submit newly published human RCTs, bioavailability kinetics, or dosage threshold corrections.",
    icon: FlaskConical,
  },
  {
    title: "Scam Watch & Fraud Whistleblower",
    email: "scamwatch@supplementdecoded.com",
    sla: "Prioritized intake (<12h)",
    badge: "Confidential Triage",
    desc: "Report adulterated batches, undeclared pharmaceutical spiking, or forged third-party lab COAs.",
    icon: AlertOctagon,
  },
  {
    title: "Press, Media & Commentary",
    email: "press@supplementdecoded.com",
    sla: "Same-day response",
    badge: "Media Inquiries",
    desc: "Expert toxicology commentary on FDA warning letters, regulatory recalls, and dietary supplement policy.",
    icon: Mail,
  },
  {
    title: "General & Ingredient Requests",
    email: "contact@supplementdecoded.com",
    sla: "1–2 business days",
    badge: "Editorial Staff",
    desc: "Platform questions, methodology inquiries, or suggesting new ingredients for monograph indexing.",
    icon: Send,
  },
];

const FAQS = [
  {
    q: "Can supplement companies pay for an ingredient monograph or review?",
    a: "No. Absolutely not. SupplementDecoded operates under a strict Zero-Sponsor charter. We accept zero manufacturer sponsorship, zero affiliate commissions, and zero pay-to-play review fees. Every monograph is funded entirely independently.",
  },
  {
    q: "How do you protect whistleblowers reporting adulterated products?",
    a: "All whistleblower submissions are scrubbed of metadata and IP logs. If you are reporting contaminated supplements or forged lab tests, your identity remains strictly confidential under investigative journalist privilege.",
  },
  {
    q: "What evidence is required to update an existing monograph?",
    a: "We require peer-reviewed, double-blind, randomized controlled trials (RCTs) conducted in humans, or systematic reviews and meta-analyses indexed in PubMed, Cochrane, or major medical journals. Animal and in vitro studies carry secondary evidential weight.",
  },
  {
    q: "Can you review my personal bloodwork or suggest supplements for my condition?",
    a: "No. We publish public research syntheses and toxicology evaluations. We do not provide personalized medical advice, diagnostic services, or individual dosing protocols. Please consult a licensed physician or clinical pharmacist.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0D] text-stone-900 dark:text-stone-100 transition-colors">
      
      {/* ── TOP HERO HEADER (SEAMLESSLY UNDER 80PX NAVBAR) ────────── */}
      <section className="relative pt-20 sm:pt-[84px] pb-12 overflow-hidden border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div className="max-w-3xl">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>EDITORIAL DESK & CLINICAL INTAKE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.1] mb-5">
              Connect with Research & Editorial
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal mb-8">
              Submit newly published human trial citations, report deceptive marketing or adulterated
              formulations, or request monograph corrections directly from our PharmD review board.
            </p>

            {/* Quick Guarantees Strip */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                <span>100% Confidential Triage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                <span>24–48h PharmD SLA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Zero Sponsor Access</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: DIRECT DESKS (LEFT) + INTERACTIVE FORM (RIGHT) ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (5 Cols): Direct Specialized Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-2">
                  Direct Specialized Desks
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  Route your inquiry to the appropriate research unit for expedited review.
                </p>
              </div>

              {/* Desk Cards */}
              <div className="space-y-3.5">
                {DIRECT_DESKS.map((desk) => {
                  const Icon = desk.icon;
                  return (
                    <div
                      key={desk.title}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs hover:border-[#0E3B2F] dark:hover:border-emerald-600 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors">
                            {desk.title}
                          </h3>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
                          {desk.badge}
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                        {desk.desc}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-[11px]">
                        <a
                          href={`mailto:${desk.email}`}
                          className="font-mono font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>{desk.email}</span>
                        </a>
                        <span className="text-stone-400 font-mono text-[10px]">
                          {desk.sla}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What We Accept vs Reject Card */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-left">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Editorial Intake Guidelines</span>
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 block mb-0.5">
                      ✓ Prioritized Submissions:
                    </span>
                    <p className="text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                      Peer-reviewed human clinical trials (PubMed/DOI), third-party lab certificates of analysis (HPLC/ICP-MS), and whistleblower documentation on adulterated ingredients.
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-stone-700 dark:text-stone-300 block mb-0.5">
                      ✗ Automatically Rejected:
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      Sponsored product review pitches, paid guest posts, affiliate marketing proposals, and requests for individualized medical prescriptions.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (7 Cols): Interactive Clinical Intake Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* ── CLINICAL & MEDICAL SCOPE DISCLAIMER ─────────────────────── */}
      <section className="py-8 bg-stone-100/70 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-amber-300/80 dark:border-amber-800/60 shadow-xs flex flex-col sm:flex-row items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                Strict Medical Scope & Regulatory Notice
              </h4>
              <p>
                SupplementDecoded synthesizes published clinical toxicology and human trials. Our team does
                not evaluate personal medical records, diagnose health conditions, or prescribe personalized
                supplement protocols. For individual medical conditions, contraindications, or emergency
                adverse reactions, consult your licensed physician or contact emergency medical services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (EDITORIAL INTEGRITY) ────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Editorial Standards & Triage FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-xs"
              >
                <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── BOTTOM CTA BANNER: EXPLORE CLINICAL DATABASE ────────────── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0E3B2F] via-[#11483A] to-[#0A2E24] text-white shadow-2xl shadow-emerald-950/20 border border-emerald-800/40 text-center relative overflow-hidden">
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold block mb-2">
                1,420+ HUMAN CLINICAL RCTS INDEXED
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Looking for Evidence-Based Monograph Data?
              </h2>
              <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed mb-8">
                Explore our independent research library with therapeutic dosing thresholds,
                bioavailability rankings, and heavy metal screens — 100% free of sponsor influence.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/ingredients"
                  className="h-12 px-6 rounded-xl bg-white hover:bg-emerald-50 text-[#0E3B2F] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Ingredient Monographs</span>
                </Link>

                <Link
                  href="/guides"
                  className="h-12 px-6 rounded-xl bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all border border-emerald-700/60 flex items-center gap-2 active:scale-95"
                >
                  <span>Read Safety Guides</span>
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
