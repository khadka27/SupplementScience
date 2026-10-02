"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Award,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Info,
  Pill,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface NavSection {
  id: string;
  label: string;
}

const NAV_SECTIONS: NavSection[] = [
  { id: "evidence-summary", label: "Consensus" },
  { id: "dosage-evaluator", label: "Dosage Table" },
  { id: "form-matrix", label: "Form Comparison" },
  { id: "contraindications", label: "Contraindications" },
  { id: "best-brands", label: "Top Lab Picks" },
];

export function MobileStickySheet({
  topBrandName = "Thorne Daily Ashwagandha (KSM-66)",
  pricePerDay = "$0.38/day",
  labScore = "99.8% Elemental Purity",
  batchTestDate = "August 2026",
  certBody = "NSF Certified for Sport & USP",
}: {
  topBrandName?: string;
  pricePerDay?: string;
  labScore?: string;
  batchTestDate?: string;
  certBody?: string;
}) {
  const [activeSection, setActiveSection] = useState<string>("evidence-summary");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // ScrollSpy to highlight the active horizontal pill
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* 1. Horizontal Scroll Anchor Strip (Sticky sub-nav) */}
      <div className="sticky top-14 md:top-16 z-30 w-full bg-white/95 dark:bg-[#0c0f12]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth"
            aria-label="Monograph Sections"
          >
            {NAV_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 min-h-[36px] flex items-center ${
                    isActive
                      ? "bg-[#0E3B2F] text-white dark:bg-emerald-600 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 2. Progressive Disclosure Accordions Section */}
      <section id="contraindications" className="bg-white dark:bg-[#0c0f12] py-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Clinical Safety Disclosures
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-slate-100">
              Safety, Drug Interactions &amp; Methodology
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Progressive clinical disclosure for patients, pharmacists, and medical practitioners.
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="interactions" className="w-full space-y-3">
            
            {/* Accordion 1: Contraindications & Drug Interactions */}
            <AccordionItem
              value="interactions"
              className="border border-[#E2E8F0] dark:border-slate-800 rounded-2xl px-5 py-1 bg-[#F8F9FA]/60 dark:bg-slate-900/60"
            >
              <AccordionTrigger className="text-left font-serif text-base font-bold text-[#0F172A] dark:text-slate-100 hover:no-underline py-4">
                <span className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  Contraindications &amp; Known Pharmaceutical Interactions (4 classes)
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-5 text-sm text-slate-700 dark:text-slate-300 space-y-4">
                <div className="space-y-3">
                  
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-xs text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
                      1. Thyroid Hormone Therapy (Levothyroxine, Synthroid)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Withanolides possess intrinsic thyroid-stimulating properties, demonstrating dose-dependent increases in free T3 and T4 levels. Co-administration can provoke hyperthyroid symptoms or necessitate dosage adjustments.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                      2. CNS Depressants, Benzodiazepines &amp; GABAergics
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ashwagandha exhibits mild GABA-mimetic activity. Concomitant use with sedatives (Zolpidem, Lorazepam, Alprazolam) or alcohol may produce additive central nervous system depression.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      3. Immunosuppressants (Autoimmune Diseases)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      May potentiate innate and adaptive immune cell signaling. Individuals with systemic lupus erythematosus (SLE), rheumatoid arthritis, or multiple sclerosis should avoid unmonitored use.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      4. Hepatic Clearance (CYP450 Metabolism)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Rare idiosyncratic liver enzyme elevations have been documented in isolated case reports, predominantly linked to whole-plant formulas containing high Withaferin A. Discontinue if jaundice, dark urine, or abdominal pain occurs.
                    </p>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion 2: Clinical Trial Methodology & Grading Standards */}
            <AccordionItem
              value="methodology"
              className="border border-[#E2E8F0] dark:border-slate-800 rounded-2xl px-5 py-1 bg-[#F8F9FA]/60 dark:bg-slate-900/60"
            >
              <AccordionTrigger className="text-left font-serif text-base font-bold text-[#0F172A] dark:text-slate-100 hover:no-underline py-4">
                <span className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                  Clinical Trial Methodology &amp; Grading Standards
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-5 text-sm text-slate-700 dark:text-slate-300 space-y-3">
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Every outcome grade at Supplement Decoded follows a strict hierarchical evidence rubric:
                </p>
                <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-5">
                  <li>
                    <strong className="text-slate-900 dark:text-slate-200">Grade A (High Consensus):</strong> Multiple replicated double-blind, randomized, placebo-controlled human trials (RCTs) with n ≥ 200 subjects and low risk of Cochrane bias.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-slate-200">Grade B (Moderate Consensus):</strong> At least two well-designed human trials with consistent direction of effect, but limited by smaller cohort sizing.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-slate-200">Industry Sponsorship Audits:</strong> Studies funded directly by ingredient patent holders without third-party blind verification are down-weighted in effect size calculations.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </section>

      {/* 3. Dynamic Bottom Action Sheet (Mobile Bottom Drawer) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f12]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          
          {/* Collapsed Preview Trigger (56px minimum touch height) */}
          <DrawerTrigger asChild>
            <button
              type="button"
              className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Open Top Tested Supplement Drawer"
            >
              <div className="flex items-center gap-3 overflow-hidden text-left">
                <div className="w-9 h-9 rounded-xl bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 flex items-center justify-center shrink-0 border border-[#0E3B2F]/20">
                  <Award className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">
                    #1 Rated: {topBrandName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {pricePerDay} • <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{labScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <span className="text-[11px] font-bold text-[#0E3B2F] dark:text-emerald-400 uppercase tracking-wider">
                  Details
                </span>
                <ChevronUp className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-400" />
              </div>
            </button>
          </DrawerTrigger>

          {/* Expanded Bottom Drawer Content */}
          <DrawerContent className="bg-white dark:bg-[#0c0f12] border-t border-slate-200 dark:border-slate-800 p-6 max-h-[85vh] overflow-y-auto">
            <div className="max-w-md mx-auto">
              
              <DrawerHeader className="p-0 mb-4 text-left">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0E3B2F] dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Lab-Verified Benchmark Pick
                </div>
                <DrawerTitle className="font-serif text-xl font-bold text-[#0F172A] dark:text-slate-100">
                  {topBrandName}
                </DrawerTitle>
              </DrawerHeader>

              {/* Lab Certification Strip */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    Independent Lab Audit
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {certBody} • Tested {batchTestDate}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    PASSED
                  </span>
                </div>
              </div>

              {/* Quick Pros and Cons */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clinical Merits
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-4 list-disc">
                    <li>Guaranteed 5% withanolides yield via HPLC root extraction.</li>
                    <li>Zero heavy metal contamination (Lead &lt;0.01 ppm, USP compliance).</li>
                    <li>Transparent elemental pricing: {pricePerDay}.</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Limitations
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-4 list-disc">
                    <li>Gelatin-free capsule shell is slightly larger than unstandardized powders.</li>
                  </ul>
                </div>
              </div>

              {/* Actions: Minimum 44x44px touch targets */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <a
                  href="#best-brands"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-[#0E3B2F] dark:bg-emerald-600 text-white font-bold text-sm shadow-sm hover:bg-[#134E4A] transition-colors"
                >
                  View Full Brand Audit &amp; Lab Data
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Dismiss Drawer
                </button>
              </div>

            </div>
          </DrawerContent>

        </Drawer>
      </div>
    </>
  );
}
