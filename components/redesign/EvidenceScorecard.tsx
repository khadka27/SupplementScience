"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Printer,
  Microscope,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";

export interface EvidenceOutcome {
  id: string;
  claim: string;
  consensus: "Strong" | "Moderate" | "Preliminary" | "Ineffective" | "Contradictory";
  effectMagnitude: number; // 1 to 5
  effectLabel: string;
  studyCount: number;
  sampleSize: number;
  primaryPmid: string;
  doiUrl: string;
  evidenceNotes: string;
}

export interface EvidenceScorecardProps {
  ingredientName?: string;
  scientificName?: string;
  category?: string;
  evidenceGrade?: "A" | "B" | "C" | "D";
  evidenceGradeDescription?: string;
  humanRctCount?: number;
  primaryProvenOutcome?: string;
  standardTherapeuticDose?: string;
  reviewerName?: string;
  reviewerCredentials?: string;
  reviewerAvatar?: string;
  lastUpdated?: string;
  verdictWhatWorks?: string;
  verdictWhatIsOverhyped?: string;
  verdictWhoShouldAvoid?: string;
  outcomes?: EvidenceOutcome[];
  topProducts?: Array<{
    name: string;
    brand: string;
    badge: string;
    purityScore: string;
    labTestedBy: string;
    pricePerDay: string;
    affiliateUrl?: string;
  }>;
}

const DEFAULT_OUTCOMES: EvidenceOutcome[] = [
  {
    id: "cortisol",
    claim: "Serum Cortisol & Perceived Stress (PSS)",
    consensus: "Strong",
    effectMagnitude: 4,
    effectLabel: "Moderate-Large (-27.9%)",
    studyCount: 16,
    sampleSize: 1140,
    primaryPmid: "23439798",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/23439798/",
    evidenceNotes: "Consistent, statistically significant reductions in morning serum cortisol and validated stress scores in adults with chronic stress.",
  },
  {
    id: "sleep",
    claim: "Sleep Latency & Sleep Quality Index",
    consensus: "Moderate",
    effectMagnitude: 3,
    effectLabel: "Small-Moderate (-16 min)",
    studyCount: 8,
    sampleSize: 610,
    primaryPmid: "32540634",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/32540634/",
    evidenceNotes: "Improved non-restorative sleep scores and decreased sleep onset latency, particularly when dosed at 600mg evening.",
  },
  {
    id: "cognition",
    claim: "Executive Function & Reaction Time",
    consensus: "Preliminary",
    effectMagnitude: 3,
    effectLabel: "Moderate (Short-term)",
    studyCount: 6,
    sampleSize: 380,
    primaryPmid: "28471731",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/28471731/",
    evidenceNotes: "Modest improvements in card sorting tests and immediate memory recall in mild cognitive impairment cohorts.",
  },
  {
    id: "testosterone",
    claim: "Testosterone Surge in Healthy Men",
    consensus: "Ineffective",
    effectMagnitude: 1,
    effectLabel: "Inconclusive / Negligible",
    studyCount: 7,
    sampleSize: 420,
    primaryPmid: "31105977",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/31105977/",
    evidenceNotes: "Elevations only documented in infertile or severely stressed baseline men; zero clinically relevant surges in young eugonadal athletic males.",
  },
  {
    id: "power",
    claim: "Muscle Strength & Resistance Adaptation",
    consensus: "Preliminary",
    effectMagnitude: 2,
    effectLabel: "Small Positive",
    studyCount: 5,
    sampleSize: 290,
    primaryPmid: "26609282",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/26609282/",
    evidenceNotes: "Some bench press/squat 1RM increases noted, but confounded by training status and small trial sample bounds.",
  },
  {
    id: "thyroid",
    claim: "Thyroid T3/T4 Stimulation",
    consensus: "Contradictory",
    effectMagnitude: 2,
    effectLabel: "Cautionary (Elevates T4)",
    studyCount: 4,
    sampleSize: 150,
    primaryPmid: "28829155",
    doiUrl: "https://pubmed.ncbi.nlm.nih.gov/28829155/",
    evidenceNotes: "May elevate serum T4; beneficial for subclinical hypothyroidism but poses risk for subclinical hyperthyroidism.",
  },
];

const DEFAULT_PRODUCTS = [
  {
    name: "Daily Ashwagandha KSM-66",
    brand: "Thorne Research",
    badge: "Clinical Gold Standard",
    purityScore: "99.8% Pure",
    labTestedBy: "NSF Certified for Sport",
    pricePerDay: "$0.38 / day",
  },
  {
    name: "Pure Ashwagandha Extract",
    brand: "Pure Encapsulations",
    badge: "Best Hypoallergenic",
    purityScore: "99.5% Pure",
    labTestedBy: "USP Verified Batch",
    pricePerDay: "$0.44 / day",
  },
  {
    name: "Shoden Withanolide 35%",
    brand: "Nootropics Depot",
    badge: "Highest Bioactive Yield",
    purityScore: "99.9% Pure",
    labTestedBy: "ISO-17025 Third-Party Tested",
    pricePerDay: "$0.29 / day",
  },
];

export function EvidenceScorecard({
  ingredientName = "Ashwagandha",
  scientificName = "Withania somnifera",
  category = "Adaptogens & Neuroendocrine",
  evidenceGrade = "A",
  evidenceGradeDescription = "Strong, replicated double-blind human RCTs establish therapeutic efficacy for primary indications.",
  humanRctCount = 48,
  primaryProvenOutcome = "Serum Cortisol Reduction (-27.9%)",
  standardTherapeuticDose = "300 - 600 mg/day (KSM-66 / Sensoril)",
  reviewerName = "Dr. Sarah Lin",
  reviewerCredentials = "PharmD, BCPS • Clinical Pharmacology",
  reviewerAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
  lastUpdated = "Q4 2026",
  verdictWhatWorks = "Robust and consistent reduction in serum cortisol and perceived stress scale (PSS). Proven improvements in sleep onset latency.",
  verdictWhatIsOverhyped = "Aggressive fitness marketing asserting 20-30% testosterone increases in healthy young athletic men is clinically unsupported.",
  verdictWhoShouldAvoid = "Individuals taking thyroid hormone replacement (Levothyroxine), sedatives (benzodiazepines/GABAergics), or experiencing acute liver enzyme elevation.",
  outcomes = DEFAULT_OUTCOMES,
  topProducts = DEFAULT_PRODUCTS,
}: EvidenceScorecardProps) {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const getConsensusBadge = (consensus: EvidenceOutcome["consensus"]) => {
    switch (consensus) {
      case "Strong":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7ECE9] dark:bg-emerald-950/40 text-[#0E3B2F] dark:text-emerald-300 border border-[#0E3B2F]/20 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Strong Evidence
          </span>
        );
      case "Moderate":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3" /> Moderate
          </span>
        );
      case "Preliminary":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <HelpCircle className="w-3 h-3" /> Preliminary
          </span>
        );
      case "Ineffective":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <XCircle className="w-3 h-3" /> Overhyped / Null
          </span>
        );
      case "Contradictory":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" /> Watchout / Mixed
          </span>
        );
    }
  };

  const renderEffectPillMeter = (magnitude: number) => {
    return (
      <div className="flex items-center gap-1" title={`${magnitude} out of 5 magnitude scale`}>
        {[1, 2, 3, 4, 5].map((idx) => (
          <span
            key={idx}
            className={`h-2.5 w-4 rounded-xs transition-colors ${
              idx <= magnitude
                ? magnitude >= 4
                  ? "bg-[#0E3B2F] dark:bg-emerald-500"
                  : magnitude >= 3
                  ? "bg-blue-600 dark:bg-blue-400"
                  : magnitude >= 2
                  ? "bg-amber-500"
                  : "bg-slate-400"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <section className="bg-white dark:bg-[#0c0f12] text-[#0F172A] dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Meta Strip */}
        <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#0E3B2F] dark:hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/ingredients" className="hover:text-[#0E3B2F] dark:hover:text-emerald-400 transition-colors">
                Ingredients Database
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#0F172A] dark:text-slate-200">
                {ingredientName} ({scientificName})
              </span>
            </nav>

            {/* Medical Reviewer Credential Pill */}
            <div className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 px-3.5 py-1.5 rounded-full shadow-2xs">
              <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                <Image
                  src={reviewerAvatar}
                  alt={reviewerName}
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 flex items-center gap-1.5">
                  Fact-checked by {reviewerName}
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-400">
                    PharmD Verified
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {reviewerCredentials} • Updated {lastUpdated}
                </div>
              </div>
            </div>

          </div>

          {/* Editorial Title & Dossier Header */}
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-block px-2.5 py-0.5 text-xs font-semibold text-[#0E3B2F] dark:text-emerald-300 bg-[#E7ECE9] dark:bg-emerald-950/50 rounded-md mb-2">
                CLINICAL MONOGRAPH #{humanRctCount}-RCT
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
                {ingredientName}: Human Clinical Evidence &amp; Safety Audit
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-2 italic">
                Botanical taxon: <span className="font-medium text-[#0F172A] dark:text-slate-300">{scientificName}</span> • Solanaceae family
              </p>
            </div>

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs self-start md:self-auto shrink-0"
              title="Print or save clinical dossier as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Download 1-Page Summary PDF
            </button>
          </div>
        </div>

        {/* 2. Evidence Summary Card (Quick Bar) */}
        <div className="bg-[#F8F9FA] dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 mb-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Big Evidence Grade Letter Indicator */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0E3B2F] dark:bg-emerald-600 text-white font-serif font-black text-3xl flex items-center justify-center shadow-sm shrink-0">
                {evidenceGrade}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0E3B2F] dark:text-emerald-400">
                  Evidence Consensus
                </div>
                <div className="font-serif text-lg font-bold text-[#0F172A] dark:text-slate-100">
                  Grade {evidenceGrade}: Robust Evidence
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  High replicability across independent human trials.
                </div>
              </div>
            </div>

            {/* Metric 1: Human RCT Count */}
            <div className="px-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Human RCT Cohort
              </div>
              <div className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 mt-1">
                {humanRctCount} Trials
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                3,420+ total human participants
              </div>
            </div>

            {/* Metric 2: Primary Proven Outcome */}
            <div className="px-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Primary Proven Indication
              </div>
              <div className="text-base font-bold text-[#0E3B2F] dark:text-emerald-400 mt-1 truncate" title={primaryProvenOutcome}>
                {primaryProvenOutcome}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                p &lt; 0.001 vs placebo in meta-analyses
              </div>
            </div>

            {/* Metric 3: Standard Therapeutic Dosage Range */}
            <div className="px-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Therapeutic Range
              </div>
              <div className="text-base font-bold text-[#0F172A] dark:text-slate-100 mt-1">
                {standardTherapeuticDose}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Standardized to ≥5% withanolides
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Asymmetric Grid: 65% Main Matrix Table, 35% Sidebar Verdict */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main 65% Column: Claims vs. Science Matrix */}
          <div className="lg:col-span-8">
            <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              
              <div className="p-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-[#0E3B2F] dark:text-emerald-400" />
                    Claims vs. Clinical Evidence Matrix
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Graded outcomes based on double-blind placebo-controlled trials. Click rows to inspect trial details.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-mono bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                  {outcomes.length} Endpoints Analyzed
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">Claimed Outcome</th>
                      <th className="py-3 px-4">Consensus</th>
                      <th className="py-3 px-4">Effect Size</th>
                      <th className="py-3 px-4 text-right">PubMed Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                    {outcomes.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr
                          onClick={() => setSelectedOutcomeId(selectedOutcomeId === item.id ? null : item.id)}
                          className={`cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                            selectedOutcomeId === item.id ? "bg-[#F8F9FA] dark:bg-slate-800/80" : ""
                          }`}
                        >
                          <td className="py-4 px-4 font-semibold text-[#0F172A] dark:text-slate-200">
                            <div className="flex items-center gap-2">
                              <span>{item.claim}</span>
                              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${selectedOutcomeId === item.id ? "rotate-90 text-[#0E3B2F] dark:text-emerald-400" : ""}`} />
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                              {item.studyCount} Trials • n={item.sampleSize} subjects
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {getConsensusBadge(item.consensus)}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {renderEffectPillMeter(item.effectMagnitude)}
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mt-1">
                              {item.effectLabel}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <a
                              href={item.doiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#0E3B2F] hover:text-white dark:hover:bg-emerald-600 transition-colors border border-slate-200 dark:border-slate-700"
                            >
                              PMID: {item.primaryPmid}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>

                        {/* Expandable study details drawer */}
                        {selectedOutcomeId === item.id && (
                          <tr className="bg-slate-50/60 dark:bg-slate-900/60">
                            <td colSpan={4} className="p-4 border-b border-slate-200 dark:border-slate-800">
                              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#0E3B2F] dark:text-emerald-400 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5" /> Clinical Synthesis &amp; Study Notes
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {item.evidenceNotes}
                                </p>
                                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                  <span>Sample Size: <strong className="text-slate-800 dark:text-slate-200">{item.sampleSize}</strong></span>
                                  <span>Methodology: <strong className="text-slate-800 dark:text-slate-200">Double-blind RCT</strong></span>
                                  <a
                                    href={item.doiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0E3B2F] dark:text-emerald-400 font-semibold underline underline-offset-2 flex items-center gap-1"
                                  >
                                    View Full RCT on PubMed Database →
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footnote */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Confidence intervals: 95% CI. Studies with direct industry sponsorship excluded or flagged.</span>
                <span className="font-mono">Audit rev. 2026.10</span>
              </div>
            </div>
          </div>

          {/* Sidebar 35% Column: The Decoded Verdict & Lab Picks */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* The Decoded Verdict High-Contrast Block */}
            <div className="rounded-2xl border-2 border-[#0E3B2F] dark:border-emerald-500/80 bg-[#0E3B2F] text-white p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <ShieldCheck className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-400/30">
                  <Sparkles className="w-3 h-3" /> The Decoded Verdict
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> What Works
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {verdictWhatWorks}
                    </p>
                  </div>

                  <div className="border-t border-emerald-800/80 pt-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> What Is Overhyped
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {verdictWhatIsOverhyped}
                    </p>
                  </div>

                  <div className="border-t border-emerald-800/80 pt-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-1">
                      <XCircle className="w-4 h-4 text-rose-400" /> Who Should Avoid
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {verdictWhoShouldAvoid}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/80 flex items-center justify-between">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-[#0E3B2F] font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download 1-Page Summary PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Top Lab-Tested Verified Brands */}
            <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400" />
                  Top Lab-Tested Products
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Zero Sponsor Bias
                </span>
              </div>

              <div className="space-y-3">
                {topProducts.map((prod, index) => (
                  <div
                    key={prod.name}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0E3B2F] dark:hover:border-emerald-500/60 transition-colors bg-[#F8F9FA]/50 dark:bg-slate-950/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold text-[#0E3B2F] dark:text-emerald-400 uppercase tracking-wider">
                          #{index + 1} {prod.badge}
                        </div>
                        <div className="text-sm font-bold text-[#0F172A] dark:text-slate-100 mt-0.5">
                          {prod.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {prod.brand} • <span className="font-semibold text-emerald-700 dark:text-emerald-400">{prod.purityScore}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                          {prod.pricePerDay}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          effective dose
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {prod.labTestedBy}
                      </span>
                      <span className="font-semibold text-[#0E3B2F] dark:text-emerald-400">
                        View Certificate →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/safety-measures"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0E3B2F] dark:hover:text-emerald-400 underline underline-offset-2"
                >
                  Read our independent heavy metal screening protocol →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
