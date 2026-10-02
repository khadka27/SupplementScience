"use client";

import React, { useState, useId } from "react";
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Utensils,
  ShieldAlert,
  Beaker,
  Scale,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export interface SupplementFormOption {
  id: string;
  name: string;
  shortName: string;
  withanolideYieldPercent: number; // e.g. 5 for 5%
  minEffectiveMg: number;
  maxOptimalMg: number;
  description: string;
  clinicalNote: string;
}

const FORMS: SupplementFormOption[] = [
  {
    id: "ksm-66",
    name: "KSM-66 Standardized Extract",
    shortName: "KSM-66 (5% Withanolides)",
    withanolideYieldPercent: 5.0,
    minEffectiveMg: 300,
    maxOptimalMg: 600,
    description: "Full-spectrum water-based root extract standardized to 5% withanolides by HPLC.",
    clinicalNote: "Used in >60% of published human trials for anxiety and cortisol modulation.",
  },
  {
    id: "sensoril",
    name: "Sensoril Standardized Extract",
    shortName: "Sensoril (10% Withanolides)",
    withanolideYieldPercent: 10.0,
    minEffectiveMg: 125,
    maxOptimalMg: 250,
    description: "Potent aqueous extract of both roots and leaves standardized to 10% withanolides.",
    clinicalNote: "Higher potency per milligram. Frequently dosed lower (125-250 mg) in clinical trials.",
  },
  {
    id: "root-powder",
    name: "Raw Full Spectrum Root Powder",
    shortName: "Raw Root Powder (~0.3%)",
    withanolideYieldPercent: 0.3,
    minEffectiveMg: 3000,
    maxOptimalMg: 6000,
    description: "Whole ground Withania somnifera root without chemical concentration.",
    clinicalNote: "Requires substantially larger volume (3 to 6 grams) to match standardized bioactives.",
  },
];

export function DosageEvaluator() {
  const [selectedFormId, setSelectedFormId] = useState<string>("ksm-66");
  const [dosageMg, setDosageMg] = useState<number>(500);

  const selectedForm = FORMS.find((f) => f.id === selectedFormId) || FORMS[0];

  // Dynamic range boundaries for slider
  const sliderMax = selectedForm.id === "root-powder" ? 8000 : 1200;
  const sliderMin = selectedForm.id === "root-powder" ? 500 : 50;
  const sliderStep = selectedForm.id === "root-powder" ? 100 : 25;

  // Active bioactive calculation
  const bioactiveYieldMg = (dosageMg * (selectedForm.withanolideYieldPercent / 100)).toFixed(1);

  // Evaluate clinical threshold state
  const isUnderdosed = dosageMg < selectedForm.minEffectiveMg;
  const isOptimal = dosageMg >= selectedForm.minEffectiveMg && dosageMg <= selectedForm.maxOptimalMg;
  const isExcessive = dosageMg > selectedForm.maxOptimalMg;

  const handleFormChange = (formId: string) => {
    setSelectedFormId(formId);
    if (formId === "root-powder") {
      setDosageMg(3000);
    } else if (formId === "sensoril") {
      setDosageMg(250);
    } else {
      setDosageMg(500);
    }
  };

  return (
    <section id="dosage-evaluator" className="bg-[#F8F9FA] dark:bg-[#0c0f12] py-12 border-y border-[#E2E8F0] dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-[#0E3B2F]/20 dark:border-emerald-800">
            <Scale className="w-3.5 h-3.5" /> Interactive Clinical Tool
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-slate-100">
            Dosage &amp; Bioactive Efficacy Evaluator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Match your supplement label&apos;s formulation and milligram dose against verified clinical trial protocols.
          </p>
        </div>

        {/* Main Evaluator Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* 1. Form Segmented Tab Controls */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Step 1: Select Chemical Formulation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              {FORMS.map((form) => {
                const isActive = form.id === selectedFormId;
                return (
                  <button
                    key={form.id}
                    type="button"
                    onClick={() => handleFormChange(form.id)}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-left flex flex-col justify-between min-h-[58px] ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-[#0E3B2F] dark:text-emerald-300 shadow-sm border border-slate-200/80 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span>{form.shortName}</span>
                    <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 mt-1">
                      {form.withanolideYieldPercent}% active yield
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 italic">
              {selectedForm.description}
            </p>
          </div>

          {/* 2. Interactive Dosage Controls: Slider + Number Input */}
          <div className="mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Step 2: Daily Dosage Taken
                </label>
                <span className="text-xs text-slate-400">
                  Slide or enter your single-serving or total daily milligram intake.
                </span>
              </div>

              {/* Number Input Box */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative">
                  <input
                    type="number"
                    min={sliderMin}
                    max={sliderMax}
                    step={sliderStep}
                    value={dosageMg}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) setDosageMg(val);
                    }}
                    className="w-32 py-2 px-3 text-right font-mono text-lg font-bold text-[#0F172A] dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3B2F] dark:focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono font-medium text-slate-400 pointer-events-none">
                    mg
                  </span>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="py-4">
              <Slider
                value={[dosageMg]}
                onValueChange={(val) => setDosageMg(val[0])}
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
                <span>{sliderMin} mg</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Recommended Target: {selectedForm.minEffectiveMg} - {selectedForm.maxOptimalMg} mg
                </span>
                <span>{sliderMax} mg</span>
              </div>
            </div>
          </div>

          {/* 3. Reactive Clinical Feedback State & Bioactive Yield */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8">
            
            {/* Feedback Verdict Badge */}
            <div className="md:col-span-8">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Clinical Efficacy Assessment
              </div>

              {isUnderdosed && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Sub-therapeutic Dosage (&lt; {selectedForm.minEffectiveMg} mg)
                    </div>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                      Below the minimum therapeutic threshold observed in double-blind stress reduction trials. You are likely experiencing sub-optimal clinical benefit or placebo response.
                    </p>
                  </div>
                </div>
              )}

              {isOptimal && (
                <div className="p-4 rounded-2xl bg-[#E7ECE9] dark:bg-[#11261D] border border-[#0E3B2F]/30 dark:border-emerald-700/60 flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0E3B2F] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-[#0E3B2F] dark:text-emerald-300">
                      Clinically Validated Dose ({selectedForm.minEffectiveMg} - {selectedForm.maxOptimalMg} mg)
                    </div>
                    <p className="text-xs text-[#0E3B2F]/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                      Matches 82% of peer-reviewed human RCTs. This window yields maximal serum cortisol reduction (-27.9%) with zero documented adverse events or next-day lethargy.
                    </p>
                  </div>
                </div>
              )}

              {isExcessive && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex items-start gap-3.5">
                  <Info className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Diminishing Returns (&gt; {selectedForm.maxOptimalMg} mg)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Human trials show no statistically significant additive cortisol or anxiolytic reduction above this ceiling. Potential for mild gastrointestinal distress, sedation, or emotional blunting.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Calculated Bioactive Yield Display */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-[#F8F9FA] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Net Active Yield
              </div>
              <div className="text-3xl font-mono font-bold text-[#0E3B2F] dark:text-emerald-400 mt-1">
                {bioactiveYieldMg} mg
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                Pure Withanolides
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Target benchmark: 15.0 - 30.0 mg/day
              </div>
            </div>

          </div>

          {/* 4. Administration Checklist & Clinical Protocols */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Step 3: Pharmacokinetic Administration Checklist
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-slate-200 mb-1">
                  <Utensils className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400" />
                  Take With Dietary Fats
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Withanolides are fat-soluble steroidal lactones. Absorption increases up to 34% when ingested alongside lipids (eggs, avocado, or full-fat yogurt).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-slate-200 mb-1">
                  <Clock className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400" />
                  Optimal Timing: Evening
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Take with dinner or 60 minutes before bed to synchronize with your natural nocturnal cortisol nadir and prevent daytime grogginess.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  Adulteration Alert
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Beware of unstandardized formulas spiked with aerial leaves (high Withaferin A cytotoxic content). Always verify 100% root-only extraction certificates.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
