"use client";

import React, { useState } from "react";
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  Sparkles,
  Award,
  Layers,
  FlaskConical,
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

export function MultiFormComparisonMatrix({
  title = "Chemical Form & Bioavailability Comparison Matrix",
  subtitle = "Why the compound bound to your mineral matters more than the label milligram number.",
  supplementFamily = "Magnesium Formulations",
  forms = DEFAULT_MAGNESIUM_FORMS,
}: MultiFormComparisonMatrixProps) {
  const [expandedFormId, setExpandedFormId] = useState<string | null>("glycinate");

  const getVerdictBadge = (badge: SupplementChemicalForm["verdictBadge"]) => {
    switch (badge) {
      case "Editor's Choice":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 border border-[#0E3B2F]/20 dark:border-emerald-800">
            <Sparkles className="w-3 h-3 text-[#0E3B2F] dark:text-emerald-400" /> Editor&apos;s Choice
          </span>
        );
      case "Clinical Gold Standard":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Award className="w-3 h-3" /> Gold Standard
          </span>
        );
      case "Budget Pick":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Budget Pick
          </span>
        );
      case "Specialized Use":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Specialized Target
          </span>
        );
      case "Avoid / Poor Absorption":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" /> Avoid / &lt;4% Absorbed
          </span>
        );
    }
  };

  const getToleranceBadge = (tol: SupplementChemicalForm["giTolerance"]) => {
    switch (tol) {
      case "High":
        return (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Tolerance
          </span>
        );
      case "Moderate":
        return (
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Moderate
          </span>
        );
      case "Laxative Risk":
        return (
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Laxative Risk
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{tol}</span>;
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

  return (
    <section id="form-matrix" className="bg-white dark:bg-[#0c0f12] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-[#0E3B2F]/20 dark:border-emerald-800">
            <FlaskConical className="w-3.5 h-3.5" /> Molecular Speciation
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-slate-100">
            {title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {subtitle} Comparing 6 commercial forms across fractional absorption, osmotic laxative thresholds, and target clinical indications.
          </p>
        </div>

        {/* Matrix Container */}
        <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {/* Sticky First Column on Mobile */}
                  <th className="py-3.5 px-4 sticky left-0 z-20 bg-[#F8F9FA] dark:bg-slate-900 shadow-[1px_0_0_0_#E2E8F0] dark:shadow-[1px_0_0_0_#1e293b]">
                    Supplement Form &amp; Chemistry
                  </th>
                  <th className="py-3.5 px-4">Primary Clinical Indication</th>
                  <th className="py-3.5 px-4">Bioavailability</th>
                  <th className="py-3.5 px-4">Elemental Yield</th>
                  <th className="py-3.5 px-4">GI Tolerance</th>
                  <th className="py-3.5 px-4 text-right">Decoded Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                {forms.map((form) => {
                  const isExpanded = expandedFormId === form.id;
                  return (
                    <React.Fragment key={form.id}>
                      <tr
                        onClick={() => setExpandedFormId(isExpanded ? null : form.id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          isExpanded ? "bg-[#F8F9FA]/80 dark:bg-slate-800/60" : ""
                        }`}
                      >
                        {/* Sticky First Column */}
                        <td className="py-4 px-4 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[1px_0_0_0_#E2E8F0] dark:shadow-[1px_0_0_0_#1e293b]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0F172A] dark:text-slate-100">
                              {form.name}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                isExpanded ? "rotate-180 text-[#0E3B2F] dark:text-emerald-400" : ""
                              }`}
                            />
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {form.chemicalFormula} • {form.ionicState}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {form.primaryIndication}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          {renderBioavailabilityBars(form.bioavailabilityScore)}
                          <div className="text-[11px] text-slate-500 mt-1">
                            {form.bioavailabilityLabel}
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-slate-100">
                          {form.elementalYieldPercent}%
                          <span className="text-[11px] text-slate-400 font-sans block font-normal">
                            elemental active
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          {getToleranceBadge(form.giTolerance)}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
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
                                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1">
                                    Primary Merits
                                  </div>
                                  <ul className="text-xs text-emerald-800 dark:text-emerald-300/90 space-y-1 list-disc pl-4">
                                    {form.pros.map((pro, idx) => (
                                      <li key={idx}>{pro}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60">
                                  <div className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider mb-1">
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

          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Scroll horizontally on smaller screens. Click any chemical form row to inspect bioavailability trials.</span>
            <span className="font-mono">Database ref: SD-CHEM-2026</span>
          </div>

        </div>

      </div>
    </section>
  );
}
