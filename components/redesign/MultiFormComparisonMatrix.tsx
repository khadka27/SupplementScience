"use client";

import React, { useState } from "react";
import {
  Table as TableIcon,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronDown,
  Info,
  Sparkles,
  Award,
  FlaskConical,
  Target,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

export interface SupplementChemicalForm {
  id: string;
  name: string;
  chemicalFormula: string;
  ionicState: string;
  primaryIndication: string;
  bioavailabilityScore: number; // 1 to 5
  bioavailabilityLabel: string;
  elementalYieldPercent: number; // e.g. 14.1
  giTolerance: "High" | "Moderate" | "Laxative Risk" | "Very Low";
  verdictBadge: "Editor's Choice" | "Budget Pick" | "Clinical Gold Standard" | "Avoid / Poor Absorption" | "Specialized Use";
  clinicalSummary: string;
  keyStudyCitation: string;
  pubmedUrl: string;
  pros: string[];
  cons: string[];
}

export interface MultiFormComparisonMatrixProps {
  title?: string;
  subtitle?: string;
  supplementFamily?: string;
  forms?: SupplementChemicalForm[];
}

const DEFAULT_MAGNESIUM_FORMS: SupplementChemicalForm[] = [
  {
    id: "glycinate",
    name: "Magnesium Bisglycinate",
    chemicalFormula: "C₄H₈MgN₂O₄",
    ionicState: "Chelated (bound to 2 glycine amino acids)",
    primaryIndication: "Sleep Architecture & Neurological Calm",
    bioavailabilityScore: 5,
    bioavailabilityLabel: "Superior (Peptide transport pathway)",
    elementalYieldPercent: 14.1,
    giTolerance: "High",
    verdictBadge: "Editor's Choice",
    clinicalSummary:
      "Chelated structure bypasses competitive mineral ion channels via dipeptide transporters (PepT1), dramatically reducing osmotic diarrhea risk while elevating serum and intracellular magnesium levels.",
    keyStudyCitation: "DiSilvestro et al. (2013) J. Trace Elem. Med. Biol.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/24077207/",
    pros: [
      "Zero osmotic laxative side effects at standard 200-400mg doses.",
      "Co-transported glycine confers independent inhibitory neurotransmitter (GABA-like) benefits for sleep.",
    ],
    cons: [
      "Lower elemental yield (~14%) requires 2 to 3 bulky capsules to hit target RDA.",
    ],
  },
  {
    id: "threonate",
    name: "Magnesium L-Threonate",
    chemicalFormula: "C₈H₁₄MgO₁₀",
    ionicState: "Chelated (Magtein® proprietary chelate)",
    primaryIndication: "Blood-Brain Barrier Crossing & Synaptic Plasticity",
    bioavailabilityScore: 4,
    bioavailabilityLabel: "High CSF Penetration",
    elementalYieldPercent: 8.3,
    giTolerance: "High",
    verdictBadge: "Specialized Use",
    clinicalSummary:
      "Engineered specifically to elevate cerebrospinal fluid (CSF) magnesium density. Human trials demonstrate enhanced working memory and executive task completion in age-associated memory loss.",
    keyStudyCitation: "Liu et al. (2016) Neuropharmacology",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/26597600/",
    pros: [
      "Proven elevation of synaptic density and hippocampus magnesium concentration.",
      "Very high gastrointestinal tolerance.",
    ],
    cons: [
      "Lowest elemental yield (8.3%) makes it cost-ineffective for correcting systemic magnesium deficiency.",
      "Premium patent pricing (~$1.10 - $1.40/day).",
    ],
  },
  {
    id: "citrate",
    name: "Magnesium Citrate",
    chemicalFormula: "C₆H₆MgO₇",
    ionicState: "Organic Acid Salt (1:1 stoichiometric ratio)",
    primaryIndication: "Bowel Motility & Cost-Effective Repletion",
    bioavailabilityScore: 4,
    bioavailabilityLabel: "High Solubility in Gastric Acid",
    elementalYieldPercent: 16.2,
    giTolerance: "Moderate",
    verdictBadge: "Budget Pick",
    clinicalSummary:
      "Readily absorbed in gastric juice with high water solubility. At dosages exceeding 350 mg elemental, it draws water into the colon lumen via osmotic pressure, serving dual purpose as a gentle laxative.",
    keyStudyCitation: "Walker et al. (2003) Magnes. Res.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/14596323/",
    pros: [
      "Economical repletion of systemic hypomagnesemia.",
      "Reliable first-line remedy for mild constipation.",
    ],
    cons: [
      "Loose stools or gastrointestinal cramping at higher therapeutic doses.",
    ],
  },
  {
    id: "malate",
    name: "Magnesium Malate",
    chemicalFormula: "C₄H₄MgO₅",
    ionicState: "Organic Dicarboxylic Acid Salt",
    primaryIndication: "Krebs Cycle ATP Synthesis & Fibromyalgia",
    bioavailabilityScore: 4,
    bioavailabilityLabel: "High Gastric Dissolution",
    elementalYieldPercent: 15.5,
    giTolerance: "High",
    verdictBadge: "Clinical Gold Standard",
    clinicalSummary:
      "Bound to malic acid, an essential intermediate in the Krebs energy cycle. Preferred for morning consumption to support muscular endurance and alleviate chronic fatigue syndrome or myalgia.",
    keyStudyCitation: "Uysal et al. (2019) Biol. Trace Elem. Res.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/29679229/",
    pros: [
      "Non-sedating daytime administration.",
      "Excellent intestinal tolerability with minimal laxative threshold.",
    ],
    cons: [
      "May stimulate wakefulness; unsuited for pre-bedtime calming protocols.",
    ],
  },
  {
    id: "taurate",
    name: "Magnesium Taurate",
    chemicalFormula: "C₄H₁₂MgN₂O₆S₂",
    ionicState: "Amino Acid Chelate (bound to 2 Taurine molecules)",
    primaryIndication: "Cardiovascular Rhythm & Endothelial Function",
    bioavailabilityScore: 4,
    bioavailabilityLabel: "High Cellular Retention",
    elementalYieldPercent: 9.0,
    giTolerance: "High",
    verdictBadge: "Specialized Use",
    clinicalSummary:
      "Taurine exerts synergistic anti-arrhythmic and vasoprotective effects via potassium-sodium channel regulation, making this chelate advantageous for blood pressure modulation.",
    keyStudyCitation: "McCarty (1996) Med. Hypotheses",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/8692051/",
    pros: [
      "Cardioprotective synergy between magnesium and taurine.",
      "Gentle on gastric mucosa.",
    ],
    cons: [
      "Lower elemental yield requires larger capsules.",
    ],
  },
  {
    id: "oxide",
    name: "Magnesium Oxide",
    chemicalFormula: "MgO",
    ionicState: "Inorganic Salt (high molecular density)",
    primaryIndication: "Acute Antacid / Colon Evacuation Only",
    bioavailabilityScore: 1,
    bioavailabilityLabel: "Extremely Poor (~4% Fractional Absorption)",
    elementalYieldPercent: 60.3,
    giTolerance: "Laxative Risk",
    verdictBadge: "Avoid / Poor Absorption",
    clinicalSummary:
      "Despite boasting 60% elemental weight on supplement labels, fractional intestinal absorption is documented at merely 4%. Up to 96% remains in the bowel, drawing fluid and provoking rapid diarrhea without elevating tissue magnesium.",
    keyStudyCitation: "Firoz & Graber (2001) Magnes. Res.",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/11794633/",
    pros: [
      "Cheap filler used by mass-market grocery brands to inflate label milligram claims.",
      "Effective as an acute short-term antacid or purgative.",
    ],
    cons: [
      "Only ~4% absorbed into bloodstream.",
      "Severe osmotic laxative effect.",
      "Commonly leads to consumer assumption that all magnesium upsets their stomach.",
    ],
  },
];

type FilterType = "all" | "high-absorption" | "gentle-gi" | "top-picks";

export function MultiFormComparisonMatrix({
  title = "Chemical Form & Bioavailability Comparison Matrix",
  subtitle = "Why the compound bound to your mineral matters more than the label milligram number.",
  supplementFamily = "Magnesium Formulations",
  forms = DEFAULT_MAGNESIUM_FORMS,
}: MultiFormComparisonMatrixProps) {
  const [expandedFormId, setExpandedFormId] = useState<string | null>("glycinate");
  const [viewMode, setViewMode] = useState<"auto" | "cards" | "table">("auto");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredForms = forms.filter((form) => {
    if (activeFilter === "high-absorption") return form.bioavailabilityScore >= 4;
    if (activeFilter === "gentle-gi") return form.giTolerance === "High";
    if (activeFilter === "top-picks")
      return (
        form.verdictBadge === "Editor's Choice" ||
        form.verdictBadge === "Clinical Gold Standard"
      );
    return true;
  });

  const getVerdictBadge = (badge: SupplementChemicalForm["verdictBadge"]) => {
    switch (badge) {
      case "Editor's Choice":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E7ECE9] dark:bg-emerald-950/70 text-[#0E3B2F] dark:text-emerald-300 border border-[#0E3B2F]/20 dark:border-emerald-700/60 shadow-xs whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#0E3B2F] dark:text-emerald-400 shrink-0" /> Editor&apos;s Choice
          </span>
        );
      case "Clinical Gold Standard":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700/60 shadow-xs whitespace-nowrap">
            <Award className="w-3 h-3 shrink-0" /> Gold Standard
          </span>
        );
      case "Budget Pick":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 shadow-xs whitespace-nowrap">
            Budget Pick
          </span>
        );
      case "Specialized Use":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700/60 shadow-xs whitespace-nowrap">
            Specialized Target
          </span>
        );
      case "Avoid / Poor Absorption":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-700/60 shadow-xs whitespace-nowrap">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" /> Avoid / &lt;4% Absorbed
          </span>
        );
      default:
        return null;
    }
  };

  const getToleranceBadge = (tol: SupplementChemicalForm["giTolerance"]) => {
    switch (tol) {
      case "High":
        return (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> High Tolerance
          </span>
        );
      case "Moderate":
        return (
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 inline-flex items-center gap-1 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Moderate
          </span>
        );
      case "Laxative Risk":
        return (
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" /> Laxative Risk
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 whitespace-nowrap">{tol}</span>;
    }
  };

  const renderBioavailabilityBars = (score: number) => {
    return (
      <div className="flex items-center gap-1" title={`${score}/5 Absorption score`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2.5 w-3.5 rounded-xs transition-colors ${
              i <= score
                ? score >= 4
                  ? "bg-[#0E3B2F] dark:bg-emerald-400"
                  : score >= 3
                  ? "bg-blue-600 dark:bg-blue-400"
                  : "bg-rose-500"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedFormId((prev) => (prev === id ? null : id));
  };

  // Determine whether to show cards or table based on viewMode
  const showCards = viewMode === "cards" || viewMode === "auto";
  const showTable = viewMode === "table" || viewMode === "auto";

  return (
    <section id="form-matrix" className="bg-white dark:bg-[#0c0f12] py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="text-left max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-[#0E3B2F]/20 dark:border-emerald-800">
              <FlaskConical className="w-3.5 h-3.5" /> Molecular Speciation
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {subtitle} Comparing 6 commercial forms across fractional absorption, osmotic laxative thresholds, and target clinical indications.
            </p>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "cards" || (viewMode === "auto")
                  ? "bg-white dark:bg-slate-900 text-[#0E3B2F] dark:text-emerald-400 shadow-xs md:bg-transparent md:text-slate-600 md:dark:text-slate-300 md:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              } ${viewMode === "cards" ? "!bg-white dark:!bg-slate-900 !text-[#0E3B2F] dark:!text-emerald-400 !shadow-xs" : ""}`}
              title="Card View (Mobile Optimized)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table" || (viewMode === "auto")
                  ? "bg-transparent text-slate-600 dark:text-slate-400 md:bg-white md:dark:bg-slate-900 md:text-[#0E3B2F] md:dark:text-emerald-400 md:shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              } ${viewMode === "table" ? "!bg-white dark:!bg-slate-900 !text-[#0E3B2F] dark:!text-emerald-400 !shadow-xs" : ""}`}
              title="Full Comparison Matrix Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeFilter === "all"
                ? "bg-[#0E3B2F] text-white dark:bg-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Forms ({forms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("top-picks")}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeFilter === "top-picks"
                ? "bg-[#0E3B2F] text-white dark:bg-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Top Recommendations
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("high-absorption")}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeFilter === "high-absorption"
                ? "bg-[#0E3B2F] text-white dark:bg-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            High Bioavailability (≥ 4/5)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("gentle-gi")}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeFilter === "gentle-gi"
                ? "bg-[#0E3B2F] text-white dark:bg-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Gentle on Stomach (High Tolerance)
          </button>
        </div>

        {/* ============================================================ */}
        {/* MOBILE CARDS VIEW (Clean, Native, Zero Squished Columns)     */}
        {/* Rendered on mobile screens (<md) or when explicitly toggled  */}
        {/* ============================================================ */}
        <div
          className={`space-y-4 ${
            viewMode === "table"
              ? "hidden"
              : viewMode === "cards"
              ? "block"
              : "block md:hidden"
          }`}
        >
          {filteredForms.map((form) => {
            const isExpanded = expandedFormId === form.id;
            return (
              <div
                key={form.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? "bg-white dark:bg-slate-900 border-[#0E3B2F]/40 dark:border-emerald-500/40 shadow-md ring-1 ring-[#0E3B2F]/15 dark:ring-emerald-500/20"
                    : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Card Top: Title, Chemistry Formula & Verdict Badge */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-[#0F172A] dark:text-slate-100 leading-snug">
                        {form.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {form.chemicalFormula}
                        </span>
                        <span>•</span>
                        <span className="truncate">{form.ionicState}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {getVerdictBadge(form.verdictBadge)}
                    </div>
                  </div>

                  {/* Clinical Target Highlight */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                      <Target className="w-3 h-3 text-[#0E3B2F] dark:text-emerald-400" />
                      Primary Clinical Indication
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {form.primaryIndication}
                    </div>
                  </div>

                  {/* 3-Column Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-left">
                    {/* Bioavailability Metric */}
                    <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Absorption
                      </span>
                      <div>
                        {renderBioavailabilityBars(form.bioavailabilityScore)}
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1 block truncate">
                          {form.bioavailabilityScore}/5 Score
                        </span>
                      </div>
                    </div>

                    {/* Elemental Yield Metric */}
                    <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Yield
                      </span>
                      <div>
                        <div className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
                          {form.elementalYieldPercent}%
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                          elemental
                        </span>
                      </div>
                    </div>

                    {/* GI Tolerance Metric */}
                    <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Tolerance
                      </span>
                      <div>
                        {getToleranceBadge(form.giTolerance)}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                          GI safety
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse Accordion Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(form.id)}
                    className="w-full mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0E3B2F] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      {isExpanded ? "Collapse Pharmacokinetics" : "Inspect Clinical Trials & Dossier"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Drawer: Pharmacokinetics, Pros/Cons & Benchmark Citation */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 space-y-3.5">
                    
                    {/* Clinical Synthesis */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0E3B2F] dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                        <Info className="w-3 h-3" /> Pharmacokinetics &amp; Cellular Uptake
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {form.clinicalSummary}
                      </p>
                    </div>

                    {/* Merits & Limitations Cards */}
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60">
                        <div className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Primary Merits
                        </div>
                        <ul className="text-xs text-emerald-900/90 dark:text-emerald-200/90 space-y-1 list-disc pl-4">
                          {form.pros.map((pro, idx) => (
                            <li key={idx}>{pro}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
                        <div className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          Clinical Limitations
                        </div>
                        <ul className="text-xs text-rose-900/90 dark:text-rose-200/90 space-y-1 list-disc pl-4">
                          {form.cons.map((con, idx) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Benchmark Study & PubMed Citation Link */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-slate-600 dark:text-slate-400">
                        Benchmark Study:{" "}
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                          {form.keyStudyCitation}
                        </strong>
                      </div>
                      <a
                        href={form.pubmedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#0E3B2F] dark:text-emerald-400 hover:underline self-start sm:self-auto"
                      >
                        Inspect Study on PubMed
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* DESKTOP & FULL TABLE VIEW (Fixed Width, Zero Squished Columns)*/}
        {/* Rendered on md+ screens or when explicitly toggled to Table   */}
        {/* ============================================================ */}
        <div
          className={`border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs ${
            viewMode === "cards"
              ? "hidden"
              : viewMode === "table"
              ? "block"
              : "hidden md:block"
          }`}
        >
          {/* Mobile swipe hint banner (only visible if forced to table mode on mobile) */}
          <div className="md:hidden bg-slate-50 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>👈 Swipe horizontally to view full matrix 👉</span>
            <button
              onClick={() => setViewMode("cards")}
              className="text-[#0E3B2F] dark:text-emerald-400 font-semibold underline underline-offset-2"
            >
              Switch to Cards
            </button>
          </div>

          <div
            className="overflow-x-auto w-full scrollbar-thin"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table
              className="w-full text-left border-collapse text-sm table-auto"
              style={{ minWidth: "860px" }}
            >
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {/* Sticky First Column */}
                  <th
                    className="py-3.5 px-4 sticky left-0 z-20 bg-[#F8F9FA] dark:bg-slate-900 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.5)] whitespace-nowrap"
                    style={{ minWidth: "220px", width: "230px" }}
                  >
                    Supplement Form &amp; Chemistry
                  </th>
                  <th
                    className="py-3.5 px-4 whitespace-nowrap"
                    style={{ minWidth: "220px" }}
                  >
                    Primary Clinical Indication
                  </th>
                  <th
                    className="py-3.5 px-4 whitespace-nowrap"
                    style={{ minWidth: "160px" }}
                  >
                    Bioavailability
                  </th>
                  <th
                    className="py-3.5 px-4 whitespace-nowrap"
                    style={{ minWidth: "130px" }}
                  >
                    Elemental Yield
                  </th>
                  <th
                    className="py-3.5 px-4 whitespace-nowrap"
                    style={{ minWidth: "140px" }}
                  >
                    GI Tolerance
                  </th>
                  <th
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    style={{ minWidth: "160px" }}
                  >
                    Decoded Verdict
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                {filteredForms.map((form) => {
                  const isExpanded = expandedFormId === form.id;
                  return (
                    <React.Fragment key={form.id}>
                      <tr
                        onClick={() => toggleExpand(form.id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          isExpanded ? "bg-[#F8F9FA]/80 dark:bg-slate-800/60" : ""
                        }`}
                      >
                        {/* Sticky First Column */}
                        <td
                          className="py-4 px-4 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_4px_-1px_rgba(0,0,0,0.5)]"
                          style={{ minWidth: "220px", width: "230px" }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F172A] dark:text-slate-100 whitespace-nowrap">
                              {form.name}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                isExpanded ? "rotate-180 text-[#0E3B2F] dark:text-emerald-400" : ""
                              }`}
                            />
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">
                            {form.chemicalFormula} • {form.ionicState.split(" ")[0]}
                          </div>
                        </td>

                        <td
                          className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200"
                          style={{ minWidth: "220px" }}
                        >
                          {form.primaryIndication}
                        </td>

                        <td
                          className="py-4 px-4 whitespace-nowrap"
                          style={{ minWidth: "160px" }}
                        >
                          {renderBioavailabilityBars(form.bioavailabilityScore)}
                          <div className="text-[11px] text-slate-500 mt-1 whitespace-nowrap">
                            {form.bioavailabilityLabel}
                          </div>
                        </td>

                        <td
                          className="py-4 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-slate-100"
                          style={{ minWidth: "130px" }}
                        >
                          {form.elementalYieldPercent}%
                          <span className="text-[11px] text-slate-400 font-sans block font-normal">
                            elemental active
                          </span>
                        </td>

                        <td
                          className="py-4 px-4 whitespace-nowrap"
                          style={{ minWidth: "140px" }}
                        >
                          {getToleranceBadge(form.giTolerance)}
                        </td>

                        <td
                          className="py-4 px-4 text-right whitespace-nowrap"
                          style={{ minWidth: "160px" }}
                        >
                          {getVerdictBadge(form.verdictBadge)}
                        </td>
                      </tr>

                      {/* Expandable Row Detail: Study Citations & Pharmacokinetics */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 dark:bg-slate-950/60">
                          <td colSpan={6} className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xs">
                              
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-[#0E3B2F] dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5" /> Pharmacokinetics &amp; Clinical Synthesis
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {form.clinicalSummary}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
                                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Primary Merits
                                  </div>
                                  <ul className="text-xs text-emerald-800 dark:text-emerald-300/90 space-y-1 list-disc pl-4">
                                    {form.pros.map((pro, idx) => (
                                      <li key={idx}>{pro}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60">
                                  <div className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                    Clinical Limitations
                                  </div>
                                  <ul className="text-xs text-rose-800 dark:text-rose-300/90 space-y-1 list-disc pl-4">
                                    {form.cons.map((con, idx) => (
                                      <li key={idx}>{con}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="text-slate-500">
                                  Benchmark Study: <strong className="text-slate-800 dark:text-slate-200">{form.keyStudyCitation}</strong>
                                </div>
                                <a
                                  href={form.pubmedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-[#0E3B2F] dark:text-emerald-400 hover:underline"
                                >
                                  Inspect Study on PubMed
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>Scroll horizontally on smaller screens. Click any chemical form row to inspect bioavailability trials.</span>
            <span className="font-mono">Database ref: SD-CHEM-2026</span>
          </div>

        </div>

      </div>
    </section>
  );
}
