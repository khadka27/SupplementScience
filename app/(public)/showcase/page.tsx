import { Metadata } from "next";
import Link from "next/link";
import {
  ClinicalHeroSearch,
  EvidenceScorecard,
  DosageEvaluator,
  MobileStickySheet,
  MultiFormComparisonMatrix,
} from "@/components/redesign";
import {
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileCode2,
  ExternalLink,
  Laptop,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Clinical-Editorial Redesign Showcase | Supplement Decoded",
  description:
    "Interactive showcase of all 5 clinical-editorial UI/UX components built according to the Supplement Decoded redesign guide and AI prompts.",
};

export default function RedesignShowcasePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0f12] text-[#0F172A] dark:text-slate-100 transition-colors pt-16">
      
      {/* Showcase Header Banner */}
      <section className="bg-[#0E3B2F] text-white py-12 px-4 border-b border-emerald-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Redesign Blueprint Implementation
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Supplement Decoded: Redesign Showcase
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg max-w-3xl mx-auto mt-4 leading-relaxed font-normal">
            Live interactive demonstrations of the 5 production-ready clinical-editorial components designed to eliminate generic AI-generated affiliate aesthetics and establish clinical authority.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold">
            <a
              href="#component-1"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              1. Hero &amp; Search Engine
            </a>
            <a
              href="#component-2"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              2. PDP Evidence Matrix
            </a>
            <a
              href="#component-3"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              3. Dosage Evaluator
            </a>
            <a
              href="#component-4"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              4. Mobile Sheet &amp; Accordions
            </a>
            <a
              href="#component-5"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              5. Multi-Form Matrix
            </a>
          </div>
        </div>
      </section>

      {/* COMPONENT 1: Homepage Hero & Clinical Search Engine */}
      <div id="component-1" className="relative border-b-8 border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-[#0E3B2F] dark:text-emerald-400">
              <FileCode2 className="w-4 h-4" /> Prompt 1 Component
            </span>
            <span>Homepage Hero &amp; Clinical Search Engine</span>
          </div>
        </div>
        <ClinicalHeroSearch />
      </div>

      {/* COMPONENT 2: Detail Page Hero & Evidence Matrix Component */}
      <div id="component-2" className="relative border-b-8 border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-[#0E3B2F] dark:text-emerald-400">
              <FileCode2 className="w-4 h-4" /> Prompt 2 Component
            </span>
            <span>Detail Page Hero, Evidence Matrix &amp; The Decoded Verdict</span>
          </div>
        </div>
        <EvidenceScorecard />
      </div>

      {/* COMPONENT 3: Interactive Dosage & Efficacy Evaluator */}
      <div id="component-3" className="relative border-b-8 border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-[#0E3B2F] dark:text-emerald-400">
              <FileCode2 className="w-4 h-4" /> Prompt 3 Component
            </span>
            <span>Interactive Dosage &amp; Bioactive Efficacy Evaluator</span>
          </div>
        </div>
        <DosageEvaluator />
      </div>

      {/* COMPONENT 5: Multi-Form Comparison Matrix Table */}
      <div id="component-5" className="relative border-b-8 border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-[#0E3B2F] dark:text-emerald-400">
              <FileCode2 className="w-4 h-4" /> Prompt 5 Component
            </span>
            <span>Multi-Form Comparison Matrix Table (Sticky Mobile Column)</span>
          </div>
        </div>
        <MultiFormComparisonMatrix />
      </div>

      {/* COMPONENT 4: Mobile Sticky Navigation & Dynamic Bottom Sheet */}
      <div id="component-4" className="relative border-b-8 border-slate-200 dark:border-slate-800 pb-20">
        <div className="max-w-6xl mx-auto px-4 pt-8 mb-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5 text-[#0E3B2F] dark:text-emerald-400">
              <FileCode2 className="w-4 h-4" /> Prompt 4 Component
            </span>
            <span>Sticky Sub-Nav, Contraindications Accordion &amp; Bottom Action Drawer</span>
          </div>
        </div>
        <MobileStickySheet />
      </div>

    </div>
  );
}
