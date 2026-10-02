"use client";

import React from "react";
import Link from "next/link";
import { EvidenceScorecard } from "./EvidenceScorecard";
import { DosageEvaluator } from "./DosageEvaluator";
import { MultiFormComparisonMatrix } from "./MultiFormComparisonMatrix";
import { MobileStickySheet } from "./MobileStickySheet";
import {
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Share2,
  Microscope,
} from "lucide-react";

interface ClinicalIngredientDossierProps {
  ingredientName?: string;
  scientificName?: string;
  category?: string;
  evidenceGrade?: "A" | "B" | "C" | "D";
  humanRctCount?: number;
  primaryProvenOutcome?: string;
  standardTherapeuticDose?: string;
  reviewerName?: string;
  reviewerCredentials?: string;
  lastUpdated?: string;
  contentHtml?: string;
}

export function ClinicalIngredientDossier({
  ingredientName = "Ashwagandha",
  scientificName = "Withania somnifera",
  category = "Neuroendocrine & Stress Adaptation",
  evidenceGrade = "A",
  humanRctCount = 48,
  primaryProvenOutcome = "Serum Cortisol & Anxiety Reduction (-27.9%)",
  standardTherapeuticDose = "300 - 600 mg/day (Standardized Extract)",
  reviewerName = "Dr. Sarah Lin",
  reviewerCredentials = "PharmD, BCPS • Clinical Pharmacology",
  lastUpdated = "Q4 2026",
  contentHtml,
}: ClinicalIngredientDossierProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0f12] text-[#0F172A] dark:text-slate-100 transition-colors">
      
      {/* 1. Detail Page Hero & Evidence Matrix (Wireframe 2.A) */}
      <div id="evidence-summary">
        <EvidenceScorecard
          ingredientName={ingredientName}
          scientificName={scientificName}
          category={category}
          evidenceGrade={evidenceGrade}
          humanRctCount={humanRctCount}
          primaryProvenOutcome={primaryProvenOutcome}
          standardTherapeuticDose={standardTherapeuticDose}
          reviewerName={reviewerName}
          reviewerCredentials={reviewerCredentials}
          lastUpdated={lastUpdated}
        />
      </div>

      {/* 2. Interactive Dosage & Bioactive Evaluator (Prompt 3) */}
      <DosageEvaluator />

      {/* 3. Multi-Form Comparison Matrix Table (Prompt 5) */}
      <MultiFormComparisonMatrix
        title={`${ingredientName} & Mineral Chelates: Form Comparison Matrix`}
        subtitle="Comparing bioactive bioavailability, cellular uptake pathways, and gastric tolerability across forms."
        supplementFamily={ingredientName}
      />

      {/* 4. Mobile Sticky Navigation, Contraindications Accordion & Bottom Sheet (Prompt 4) */}
      <MobileStickySheet
        topBrandName={`Thorne Daily ${ingredientName} (KSM-66)`}
        pricePerDay="$0.38/day"
        labScore="99.8% Elemental Purity"
        batchTestDate="August 2026"
        certBody="NSF Certified for Sport & USP"
      />

      {/* Long-Form Clinical Analysis Section (if markdown / CMS content exists) */}
      {contentHtml ? (
        <section className="py-12 bg-white dark:bg-[#0c0f12] border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen className="w-3.5 h-3.5 text-[#0E3B2F] dark:text-emerald-400" />
              Full Clinical Monograph &amp; Pharmacodynamics
            </div>
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-[#0E3B2F] dark:prose-a:text-emerald-400"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </section>
      ) : (
        <section className="py-12 bg-white dark:bg-[#0c0f12] border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#F8F9FA] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-slate-100 mb-2">
                Clinical Pharmacodynamics &amp; Mechanism of Action
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Withanolides, particularly withaferin A and withanolide D, act primarily through the hypothalamic-pituitary-adrenal (HPA) axis to attenuate the stress-induced release of adrenocorticotropic hormone (ACTH), thereby dampening downstream hypercortisolemia. Furthermore, structural similarity to GABA allows withanolides to bind allosterically to GABA-A receptors, explaining the mild sedation and anxiolytic effects observed without the tolerance profile typical of classical benzodiazepines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FA] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
              <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-slate-100 mb-2">
                Heavy Metal Screening &amp; Adulteration Testing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Due to soil accumulation dynamics in the Solanaceae family, unverified imported raw roots frequently demonstrate lead (Pb) and cadmium (Cd) levels exceeding California Proposition 65 thresholds (0.5 mcg/day). Consumers should solely purchase extracts certified under ISO-17025 accredited ICP-MS laboratory screens.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Independence & Conflict of Interest Statement */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Supplement Decoded Editorial Disclosure
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            We do not accept financial compensation, free inventory, or sponsored placements from supplement manufacturers. All clinical evaluations are executed independently by licensed healthcare professionals and medical researchers.
          </p>
        </div>
      </footer>

    </div>
  );
}
