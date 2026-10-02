"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Scale,
  ArrowRight,
  Command,
  ChevronRight,
  Microscope,
  ShieldCheck,
  Award,
  X,
  Play,
  Moon,
  Brain,
  Zap,
  Dumbbell,
  HeartPulse,
  Shield,
} from "lucide-react";

interface SearchSuggestion {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  evidenceGrade: "A" | "B" | "C" | "D";
  trialsCount: number;
  slug: string;
  emoji: string;
  dosage: string;
}

const SAMPLE_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    category: "Stress & Cortisol",
    evidenceGrade: "A",
    trialsCount: 48,
    slug: "ashwagandha",
    emoji: "🌿",
    dosage: "300–600 mg/day (KSM-66®)",
  },
  {
    id: "magnesium-glycinate",
    name: "Magnesium Bisglycinate",
    scientificName: "Bisglycinate Chelate",
    category: "Sleep & Relaxation",
    evidenceGrade: "A",
    trialsCount: 72,
    slug: "magnesium-glycinate",
    emoji: "💊",
    dosage: "200–400 mg elemental Mg",
  },
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    scientificName: "Methylguanidine-acetic acid",
    category: "Muscle & Cognition",
    evidenceGrade: "A",
    trialsCount: 500,
    slug: "creatine-monohydrate",
    emoji: "⚡",
    dosage: "3–5 g/day continuous",
  },
  {
    id: "vitamin-d3-k2",
    name: "Vitamin D3 + K2",
    scientificName: "Cholecalciferol & MK-7",
    category: "Bone & Immune Health",
    evidenceGrade: "A",
    trialsCount: 140,
    slug: "vitamin-d3",
    emoji: "☀️",
    dosage: "2,000–5,000 IU + 100 mcg MK-7",
  },
  {
    id: "l-theanine",
    name: "L-Theanine",
    scientificName: "γ-glutamylethylamide",
    category: "Focus & Alpha Waves",
    evidenceGrade: "B",
    trialsCount: 31,
    slug: "l-theanine",
    emoji: "🍵",
    dosage: "100–200 mg co-ingested",
  },
  {
    id: "berberine",
    name: "Berberine HCl",
    scientificName: "Berberis aristata extract",
    category: "Metabolic & Glucose",
    evidenceGrade: "B",
    trialsCount: 29,
    slug: "berberine",
    emoji: "🫐",
    dosage: "500 mg tid with meals",
  },
];

const FILTER_TAGS = [
  { label: "Sleep & Anxiety", query: "sleep", icon: Moon, count: "48 RCTs" },
  { label: "Cognitive Health", query: "cognition", icon: Brain, count: "72 RCTs" },
  { label: "Hormones & Cortisol", query: "cortisol", icon: Zap, count: "35 RCTs" },
  { label: "Sports Performance", query: "creatine", icon: Dumbbell, count: "120+ RCTs" },
  { label: "Metabolic Health", query: "metabolic", icon: HeartPulse, count: "54 RCTs" },
  { label: "Joints & Mobility", query: "joint", icon: Shield, count: "29 RCTs" },
];

const GRADE_STYLES: Record<string, { badge: string; text: string }> = {
  A: {
    badge: "bg-emerald-600 text-white dark:bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  B: {
    badge: "bg-sky-600 text-white dark:bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
  },
  C: {
    badge: "bg-amber-600 text-white dark:bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  },
  D: {
    badge: "bg-rose-600 text-white dark:bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
  },
};

const FEATURED_CARDS = [
  {
    id: "ashwagandha",
    name: "Ashwagandha KSM-66",
    image: "/images/ashwagandha_bottle.jpg",
    grade: "Grade A",
    trials: "48 Human RCTs",
    tag: "Stress & Cortisol",
    slug: "ashwagandha",
    dark: false,
  },
  {
    id: "creatine",
    name: "Creatine Creapure®",
    image: "/images/creatine_bottle.jpg",
    grade: "Grade A",
    trials: "500+ Clinical Trials",
    tag: "Power & Cognition",
    slug: "creatine-monohydrate",
    dark: true, // Dark hero card in the middle like reference
  },
  {
    id: "magnesium",
    name: "Magnesium Bisglycinate",
    image: "/images/magnesium_bottle.jpg",
    grade: "Grade A",
    trials: "72 Human RCTs",
    tag: "Sleep & Muscle Relaxation",
    slug: "magnesium-glycinate",
    dark: false,
  },
];

export function ClinicalHeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = query.trim()
    ? SAMPLE_SUGGESTIONS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.scientificName.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SAMPLE_SUGGESTIONS.slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        setSelectedIndex((p) => Math.min(p + 1, filteredSuggestions.length - 1));
      }
      if (e.key === "ArrowUp" && isOpen) {
        e.preventDefault();
        setSelectedIndex((p) => Math.max(p - 1, 0));
      }
      if (e.key === "Enter" && isOpen && filteredSuggestions[selectedIndex]) {
        router.push(`/ingredients/${filteredSuggestions[selectedIndex].slug}`);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredSuggestions, router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ingredients?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchSuggestion) => {
    router.push(`/ingredients/${item.slug}`);
    setIsOpen(false);
  };

  return (
    <section
      aria-label="Clinical Supplement Research Database"
      className="relative bg-[#FAFAF8] dark:bg-[#070A0D] pt-4 pb-12 overflow-visible transition-colors"
    >
      {/* ── TOP MASTHEAD STRIP ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] py-1 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-bold text-[#0E3B2F] dark:text-emerald-400">
              INDEPENDENT CLINICAL MONOGRAPH DATABASE
            </span>
            <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-stone-500">
              1,420+ RCTs Analyzed
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-[10px] font-mono font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ZERO CONFLICTS OF INTEREST · NO AFFILIATE COMMISSION</span>
          </div>
        </div>
      </div>

      {/* ── THE HERO BANNER RIBBON (WITH INTEGRATED SEARCH WHERE DRAWN) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative rounded-3xl overflow-visible bg-gradient-to-r from-[#0E3B2F] via-[#11483A] to-[#0A2E24] shadow-2xl shadow-emerald-950/20 border border-emerald-800/40">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] lg:min-h-[420px] px-6 sm:px-10 lg:px-14 py-10 lg:py-8 gap-8">
            
            {/* Left Column: Heading + Copy + Action Buttons + Search */}
            <div className="lg:col-span-7 flex flex-col justify-center z-20 text-left">
              
              {/* Line 1: Subdued Headline on Banner */}
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-200/90 tracking-tight leading-tight">
                The Human-Trial Dossier on
              </div>

              {/* Line 2: Giant Contrast White Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mt-1 mb-5 drop-shadow-sm">
                Dietary Supplements
              </h1>

              {/* Subtext */}
              <p className="text-emerald-100/85 text-sm sm:text-base leading-relaxed max-w-xl mb-7 font-sans font-normal">
                We extract therapeutic dosage thresholds, bioavailability kinetics, and heavy metal
                safety screens directly from published RCTs — no kickbacks, no influencer deals,
                no marketing fluff.
              </p>

              {/* ── ACTION ROW: [View Catalog] [ ▶ ] [ SEARCH BAR ] [ BUTTON ] ── */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                
                {/* 1. View Research Catalog Button */}
                <Link
                  href="/ingredients"
                  className="inline-flex items-center justify-center h-12 px-5 sm:px-6 rounded-xl bg-stone-950 hover:bg-black text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  View Research Catalog
                </Link>

                {/* 2. Video / Guide Icon Button */}
                <Link
                  href="/guides"
                  className="w-12 h-12 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0E3B2F] flex items-center justify-center transition-all shadow-lg shadow-emerald-400/25 hover:scale-105 active:scale-95 shrink-0 group"
                  aria-label="How we evaluate supplements"
                  title="How We Evaluate Supplements"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* 3. Search Bar + Submit Button (Positioned exactly as user requested!) */}
                <div ref={containerRef} className="relative flex-1 min-w-[240px] sm:min-w-[280px]">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    
                    {/* Search Input Box */}
                    <div
                      className={`relative flex items-center flex-1 h-12 bg-white/95 dark:bg-[#070A0D]/95 backdrop-blur-md rounded-xl border-2 transition-all duration-200 shadow-lg ${
                        isFocused
                          ? "border-emerald-300 dark:border-emerald-500 ring-4 ring-emerald-400/20"
                          : "border-white/30 dark:border-emerald-900/60 hover:border-emerald-300"
                      }`}
                    >
                      <Search
                        className={`w-4 h-4 ml-3.5 shrink-0 transition-colors ${
                          isFocused ? "text-[#0E3B2F] dark:text-emerald-400" : "text-stone-400"
                        }`}
                      />

                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setIsOpen(true);
                          setSelectedIndex(0);
                        }}
                        onFocus={() => {
                          setIsOpen(true);
                          setIsFocused(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search an ingredient, symptom..."
                        className="w-full h-full px-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-transparent focus:outline-none"
                        aria-label="Search clinical supplement database"
                        autoComplete="off"
                      />

                      {query && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                          }}
                          className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center mr-1.5 shrink-0"
                          aria-label="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 mr-2 text-[9px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 shrink-0 select-none">
                        <Command className="w-2.5 h-2.5" />K
                      </kbd>
                    </div>

                    {/* Dedicated Search Action Button */}
                    <button
                      type="submit"
                      className="w-12 h-12 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0E3B2F] flex items-center justify-center transition-all shadow-lg shadow-emerald-400/25 active:scale-95 shrink-0"
                      aria-label="Analyze Search"
                      title="Analyze Search"
                    >
                      <ArrowRight className="w-5 h-5 font-bold" />
                    </button>
                  </form>

                  {/* Autocomplete Dropdown */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0D1217] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden z-50 text-left"
                      role="listbox"
                    >
                      <div className="px-4 py-2 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-500">
                          {query.trim() ? "MATCHING CLINICAL MONOGRAPHS" : "VERIFIED HUMAN-TRIAL TARGETS"}
                        </span>
                        <span className="text-[10px] text-stone-400">↑↓ to navigate · Enter select</span>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            const gradeConfig = GRADE_STYLES[item.evidenceGrade] || GRADE_STYLES.A;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={() => handleSelect(item)}
                                className={`w-full text-left px-4 py-2.5 flex items-center gap-3.5 transition-colors ${
                                  isSelected ? "bg-stone-50 dark:bg-stone-900/80" : "hover:bg-stone-50/70 dark:hover:bg-stone-900/40"
                                }`}
                              >
                                <div className="relative shrink-0 w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-sm border border-stone-200 dark:border-stone-700">
                                  {item.emoji}
                                  <span
                                    className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-mono font-bold flex items-center justify-center ${gradeConfig.badge}`}
                                  >
                                    {item.evidenceGrade}
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-stone-400 italic hidden sm:inline">
                                      ({item.scientificName})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400">
                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                      {item.trialsCount} RCTs
                                    </span>
                                    <span>•</span>
                                    <span>{item.category}</span>
                                  </div>
                                </div>

                                <ChevronRight
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? "text-[#0E3B2F] dark:text-emerald-400" : "text-stone-300"
                                  }`}
                                />
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-xs text-stone-500 mb-1">
                              No monograph indexed for &ldquo;{query}&rdquo;
                            </p>
                            <Link
                              href={`/ingredients?search=${encodeURIComponent(query)}`}
                              className="text-xs font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline"
                            >
                              Search complete database →
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-2 bg-stone-50 dark:bg-stone-900/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500">
                        <span>384 ingredients indexed</span>
                        <Link
                          href="/ingredients"
                          className="font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline"
                        >
                          Browse all →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Column: Elevated 3D Podium with Supplement Bottles */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end z-10">
              <div className="relative w-full max-w-[480px] lg:scale-110 lg:translate-y-2 drop-shadow-2xl">
                <Image
                  src="/images/supplement_podium.jpg"
                  alt="Clinical dietary supplements presented on laboratory pedestal"
                  width={640}
                  height={480}
                  priority
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── QUICK FILTER TOPICS STRIP (ELEVATED CLINICAL CONTROL BAR) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-sm flex flex-wrap items-center gap-2">
          
          {/* Label with Live Indicator */}
          <div className="flex items-center gap-2 pl-3 pr-3.5 py-1 sm:border-r border-stone-200 dark:border-stone-800">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 whitespace-nowrap">
              RESEARCH BY:
            </span>
          </div>

          {/* Interactive Badges with Icons */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {FILTER_TAGS.map((tag) => {
              const Icon = tag.icon;
              return (
                <Link
                  key={tag.label}
                  href={`/ingredients?search=${encodeURIComponent(tag.query)}`}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/60 hover:bg-[#0E3B2F] dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white border border-stone-200 dark:border-stone-800 hover:border-[#0E3B2F] dark:hover:border-emerald-600 transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors shrink-0" />
                  <span>{tag.label}</span>
                  <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 group-hover:text-emerald-200 dark:group-hover:text-emerald-100 transition-colors hidden xl:inline">
                    {tag.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Browse all catalog link */}
          <Link
            href="/ingredients"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline px-3 py-1 whitespace-nowrap ml-auto"
          >
            <span>All 384 Targets</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── BOTTOM SECTION: "CLINICAL MONOGRAPHS" + 3 SHOWCASE CARDS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Title: NEW PRODUCTS / CLINICAL MONOGRAPHS */}
          <div className="lg:col-span-3 flex flex-col justify-center text-left">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none uppercase">
              CLINICAL
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight leading-tight uppercase">
              MONOGRAPHS
            </span>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">
              Double-blind, peer-reviewed human clinical evidence indexed for immediate review.
            </p>
          </div>

          {/* Right: 3 Showcase Cards (Middle Card is Dark like Reference) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURED_CARDS.map((card) => {
              const isDark = card.dark;

              return (
                <Link
                  key={card.id}
                  href={`/ingredients/${card.slug}`}
                  className={`group relative rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                    isDark
                      ? "bg-[#1E252B] dark:bg-[#12181E] text-white shadow-lg shadow-stone-900/20 border border-stone-700/50"
                      : "bg-[#EBF3EE] dark:bg-[#101F18] text-stone-900 dark:text-stone-100 shadow-md shadow-emerald-950/5 border border-emerald-200/60 dark:border-emerald-900/40"
                  }`}
                >
                  {/* Product Image Stage Tile */}
                  <div className="relative w-full h-40 mb-4 rounded-2xl bg-white dark:bg-stone-900/90 flex items-center justify-center p-3 shadow-xs border border-stone-200/50 dark:border-stone-800/80 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title */}
                  <h3
                    className={`font-bold text-sm sm:text-base tracking-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
                      isDark ? "text-white" : "text-stone-900 dark:text-stone-100"
                    }`}
                  >
                    {card.name}
                  </h3>

                  {/* Trials / Grade Metatag */}
                  <div
                    className={`text-xs font-semibold ${
                      isDark ? "text-emerald-400" : "text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    {card.grade} · {card.trials}
                  </div>

                  {/* Category Pill */}
                  <span
                    className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      isDark
                        ? "bg-stone-800/80 text-stone-300"
                        : "bg-white/80 dark:bg-stone-900/60 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {card.tag}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── AUDIT & CREDIBILITY GUARANTEE STRIP ─────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-200/80 dark:border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2.5">
            <Microscope className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                100% Peer-Reviewed
              </span>
              <span className="text-[10px] text-stone-400">
                Human RCTs only — no animal proxies
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                Elemental Dosing
              </span>
              <span className="text-[10px] text-stone-400">
                Verified ion weight vs bulk salt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                Heavy Metal Screen
              </span>
              <span className="text-[10px] text-stone-400">
                USP & WHO limits verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-[#0E3B2F] dark:text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 block">
                PharmD Fact-Checked
              </span>
              <span className="text-[10px] text-stone-400">
                Clinical toxicology oversight
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
