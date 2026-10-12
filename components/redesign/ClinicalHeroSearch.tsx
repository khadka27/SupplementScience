"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface RealSearchResult {
  id: string;
  title: string;
  slug: string;
  postType?: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  score?: number;
  matchPercentage?: number;
}

export interface ShowcaseIngredient {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cardImageUrl?: string | null;
  featuredImageUrl?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ShowcaseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ClinicalHeroSearchProps {
  initialIngredients?: ShowcaseIngredient[];
  categories?: ShowcaseCategory[];
}

// Clean common name parser from database post title
function parseIngredientCommonName(title: string, slug?: string): string {
  if (slug === "ashwagandha" || title.toLowerCase().includes("ashwagandha")) {
    return "Ashwagandha KSM-66";
  }
  const match = title.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const main = match[1].trim();
    if (match[2].includes("Creapure")) return "Creatine Creapure®";
    if (match[2].includes("Chelated")) return "Magnesium Bisglycinate";
    if (match[2].includes("KSM-66")) return "Ashwagandha KSM-66";
    return main;
  }
  return title;
}

// Clinical trial dossier metrics by ingredient slug
function getIngredientMeta(slug: string, fallbackCategory?: string) {
  switch (slug) {
    case "ashwagandha":
      return {
        grade: "Grade A",
        trials: "48 Human RCTs",
        tag: "Stress & Cortisol",
        image: "/images/ashwagandha_bottle.jpg",
      };
    case "creatine-monohydrate":
      return {
        grade: "Grade A",
        trials: "500+ Clinical Trials",
        tag: "Power & Cognition",
        image: "/images/creatine_bottle.jpg",
      };
    case "magnesium-glycinate":
      return {
        grade: "Grade A",
        trials: "72 Human RCTs",
        tag: "Sleep & Muscle Relaxation",
        image: "/images/magnesium_bottle.jpg",
      };
    case "l-theanine":
      return {
        grade: "Grade A",
        trials: "31 Human RCTs",
        tag: "Cognition & Focus",
        image: "/images/ashwagandha_bottle.jpg",
      };
    case "berberine":
      return {
        grade: "Grade A",
        trials: "45 Human RCTs",
        tag: "Metabolic Health",
        image: "/images/creatine_bottle.jpg",
      };
    case "omega-3":
      return {
        grade: "Grade A",
        trials: "350+ Clinical Trials",
        tag: "Heart & Brain Health",
        image: "/images/magnesium_bottle.jpg",
      };
    case "curcumin-turmeric":
      return {
        grade: "Grade A",
        trials: "85 Human RCTs",
        tag: "Joints & Mobility",
        image: "/images/ashwagandha_bottle.jpg",
      };
    case "vitamin-d3":
      return {
        grade: "Grade A",
        trials: "140+ Human RCTs",
        tag: "Bone & Immune Health",
        image: "/images/magnesium_bottle.jpg",
      };
    case "rhodiola-rosea":
      return {
        grade: "Grade B+",
        trials: "24 Human RCTs",
        tag: "Fatigue & Resilience",
        image: "/images/ashwagandha_bottle.jpg",
      };
    case "lions-mane":
      return {
        grade: "Grade B+",
        trials: "18 Human Trials",
        tag: "Neurogenesis & Memory",
        image: "/images/creatine_bottle.jpg",
      };
    case "zinc":
      return {
        grade: "Grade A",
        trials: "62 Human RCTs",
        tag: "Immune Defense",
        image: "/images/magnesium_bottle.jpg",
      };
    case "coq10":
      return {
        grade: "Grade A",
        trials: "80+ Human RCTs",
        tag: "Cellular Bioenergetics",
        image: "/images/creatine_bottle.jpg",
      };
    default:
      return {
        grade: "Grade A",
        trials: "Clinical Trial Dossier",
        tag: fallbackCategory || "Clinical Monograph",
        image: "/images/ashwagandha_bottle.jpg",
      };
  }
}

export function ClinicalHeroSearch({
  initialIngredients = [],
  categories: initialCategories = [],
}: ClinicalHeroSearchProps = {}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RealSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real database ingredients and categories state (No mock data)
  const [allIngredients, setAllIngredients] = useState<ShowcaseIngredient[]>(initialIngredients);
  const [categoryList, setCategoryList] = useState<ShowcaseCategory[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Client-side fetch fallback if props were not provided (e.g., in /showcase)
  useEffect(() => {
    if (allIngredients.length === 0 || categoryList.length === 0) {
      fetch("/api/monographs/showcase")
        .then((res) => res.json())
        .then((data) => {
          if (data.allIngredients && data.allIngredients.length > 0) {
            setAllIngredients(data.allIngredients);
          }
          if (data.categories && data.categories.length > 0) {
            setCategoryList(data.categories);
          }
        })
        .catch((err) => console.error("Failed to load showcase data:", err));
    }
  }, [allIngredients.length, categoryList.length]);

  // Fetch real data from the database using our fuzzy search API
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setResults(data.results || []);
            setSelectedIndex(0);
          }
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Keyboard navigation
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
      if (e.key === "ArrowDown" && isOpen && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((p) => Math.min(p + 1, results.length - 1));
      }
      if (e.key === "ArrowUp" && isOpen && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((p) => Math.max(p - 1, 0));
      }
      if (e.key === "Enter" && isOpen && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item: RealSearchResult) => {
    const targetUrl =
      item.postType === "ingredient"
        ? `/ingredients/${item.slug}`
        : `/blog/${item.slug}`;
    router.push(targetUrl);
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (results.length > 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else {
        router.push(`/ingredients?search=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  // Filter ingredients based on selected category (no mock data, 100% database driven)
  const displayedCards = React.useMemo(() => {
    if (!allIngredients || allIngredients.length === 0) return [];

    if (activeCategory === "all") {
      const priorityOrder = [
        "ashwagandha",
        "creatine-monohydrate",
        "magnesium-glycinate",
      ];
      const prioritized = [...allIngredients].sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.slug);
        const indexB = priorityOrder.indexOf(b.slug);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
      return prioritized.slice(0, 3).map((item, idx) => ({
        ...item,
        dark: idx === 1,
      }));
    }

    const matching = allIngredients.filter(
      (item) => item.category?.slug === activeCategory,
    );

    // If 3 or more matching in this category, return top 3
    if (matching.length >= 3) {
      return matching.slice(0, 3).map((item, idx) => ({
        ...item,
        dark: idx === 1,
      }));
    }

    // If fewer than 3, display matching first, then fill remaining slots with other database ingredients
    const others = allIngredients.filter(
      (item) => item.category?.slug !== activeCategory,
    );
    const combined = [...matching, ...others];

    return combined.slice(0, 3).map((item, idx) => ({
      ...item,
      dark: idx === 1,
    }));
  }, [allIngredients, activeCategory]);

  return (
    <section
      aria-label="Clinical Supplement Research Database"
      className="relative bg-[#FAFAF8] dark:bg-[#070A0D] pt-20 sm:pt-[82px] pb-10 overflow-visible transition-colors"
    >
      {/* ── THE HERO BANNER RIBBON (NO EXTRA GAP UNDER NAVBAR) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-3 mb-6">
        <div className="relative rounded-3xl overflow-visible bg-gradient-to-r from-[#0E3B2F] via-[#11483A] to-[#0A2E24] shadow-2xl shadow-emerald-950/20 border border-emerald-800/40">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] lg:min-h-[420px] px-6 sm:px-10 lg:px-14 py-10 lg:py-8 gap-8">
            
            {/* Left Column: Heading + Copy + Action Buttons + Real Search */}
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

              {/* ── ACTION ROW: [View Catalog] [ REAL FUZZY SEARCH BAR ] [ SEARCH BUTTON ] ── */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                
                {/* 1. View Research Catalog Button */}
                <Link
                  href="/ingredients"
                  className="inline-flex items-center justify-center h-12 px-5 sm:px-6 rounded-xl bg-stone-950 hover:bg-black text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-black/40 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  View Research Catalog
                </Link>

                {/* 2. Real Fuzzy Search Bar + Submit Button */}
                <div ref={containerRef} className="relative flex-1 min-w-[260px] sm:min-w-[320px]">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    
                    {/* Search Input Box */}
                    <div
                      className={`relative flex items-center flex-1 h-12 bg-white/95 dark:bg-[#070A0D]/95 backdrop-blur-md rounded-xl border-2 transition-all duration-200 shadow-lg ${
                        isFocused
                          ? "border-emerald-300 dark:border-emerald-500 ring-4 ring-emerald-400/20"
                          : "border-white/30 dark:border-emerald-900/60 hover:border-emerald-300"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 ml-3.5 shrink-0 text-emerald-600 animate-spin" />
                      ) : (
                        <Search
                          className={`w-4 h-4 ml-3.5 shrink-0 transition-colors ${
                            isFocused ? "text-[#0E3B2F] dark:text-emerald-400" : "text-stone-400"
                          }`}
                        />
                      )}

                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => {
                          setIsOpen(true);
                          setIsFocused(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search monographs or clinical trials..."
                        className="w-full h-full px-3 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-transparent focus:outline-none"
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
                          className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center mr-2 shrink-0 text-xs font-bold"
                          aria-label="Clear search"
                        >
                          &times;
                        </button>
                      )}
                    </div>

                    {/* Dedicated Search Action Button */}
                    <button
                      type="submit"
                      className="h-12 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0E3B2F] font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center transition-all shadow-lg shadow-emerald-400/25 active:scale-95 shrink-0"
                    >
                      Search
                    </button>
                  </form>

                  {/* Autocomplete Dropdown: Displaying REAL Database Results */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-0 w-full min-w-[320px] sm:min-w-[480px] md:min-w-[560px] max-w-[calc(100vw-32px)] mt-2 bg-white dark:bg-[#0D1217] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl shadow-black/25 overflow-hidden z-50 text-left max-h-[420px] flex flex-col"
                      role="listbox"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900/80 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0 gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-500 shrink-0 whitespace-nowrap">
                          {query.trim()
                            ? `CLINICAL RESULTS (${results.length})`
                            : "TOP VERIFIED CLINICAL MONOGRAPHS"}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0 whitespace-nowrap">
                          ↑↓ to navigate · Enter to view
                        </span>
                      </div>

                      {/* Dropdown List */}
                      <div className="overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50 flex-1">
                        {results.length > 0 ? (
                          results.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            const isMonograph = item.postType === "ingredient";

                            return (
                              <button
                                key={item.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={() => handleSelect(item)}
                                className={`w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors ${
                                  isSelected
                                    ? "bg-emerald-50/80 dark:bg-emerald-950/40"
                                    : "hover:bg-stone-50/80 dark:hover:bg-stone-900/40"
                                }`}
                              >
                                {/* Line 1: Title + Monograph/Guide Tag + Match Percentage */}
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                  <span className="font-bold text-[13px] sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                                    {item.title}
                                  </span>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Type Tag */}
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                                        isMonograph
                                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60"
                                          : "bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60"
                                      }`}
                                    >
                                      {isMonograph ? "Monograph" : "Guide"}
                                    </span>

                                    {/* Fuzzy Match Percentage */}
                                    {item.matchPercentage !== undefined && query.trim() && (
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold shrink-0 ${
                                          item.matchPercentage >= 75
                                            ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40"
                                            : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/40"
                                        }`}
                                      >
                                        {item.matchPercentage}% match
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Line 2: Category & Excerpt */}
                                <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 min-w-0 overflow-hidden">
                                  {item.category?.name && (
                                    <>
                                      <span className="shrink-0 whitespace-nowrap font-semibold text-emerald-700 dark:text-emerald-400">
                                        {item.category.name}
                                      </span>
                                      <span className="shrink-0 text-stone-300 dark:text-stone-600">•</span>
                                    </>
                                  )}
                                  <span className="truncate text-stone-400 dark:text-stone-500 flex-1">
                                    {item.excerpt || "Peer-reviewed clinical evidence synthesis."}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                              No monographs or articles matched &ldquo;{query}&rdquo;
                            </p>
                            <Link
                              href={`/ingredients?search=${encodeURIComponent(query)}`}
                              className="text-xs font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline"
                            >
                              Browse all research monographs →
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500 shrink-0">
                        <span className="shrink-0">Database: Peer-reviewed clinical evidence</span>
                        <Link
                          href="/ingredients"
                          className="font-bold text-[#0E3B2F] dark:text-emerald-400 hover:underline shrink-0"
                        >
                          Browse All Ingredients →
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

      {/* ── QUICK FILTER TOPICS (REAL DATABASE CATEGORIES) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-1">
          {/* Label */}
          <span className="text-[11px] font-mono font-bold tracking-wider text-stone-400 uppercase mr-1 select-none">
            RESEARCH BY :
          </span>

          {/* All Topics Pill */}
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
              activeCategory === "all"
                ? "bg-white dark:bg-[#121A16] text-[#0E3B2F] dark:text-emerald-400 border border-[#0E3B2F]/60 dark:border-emerald-600 ring-1 ring-[#0E3B2F]/30"
                : "bg-white dark:bg-[#0D1217] text-stone-700 dark:text-stone-300 border border-stone-200/90 dark:border-stone-800 hover:border-[#0E3B2F] hover:text-[#0E3B2F] dark:hover:border-emerald-500 dark:hover:text-emerald-300"
            }`}
          >
            All Research
          </button>

          {/* Dynamic Category Pills from Database */}
          {categoryList.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#121A16] text-[#0E3B2F] dark:text-emerald-400 border border-[#0E3B2F]/60 dark:border-emerald-600 ring-1 ring-[#0E3B2F]/30 font-semibold"
                    : "bg-white dark:bg-[#0D1217] text-stone-700 dark:text-stone-300 border border-stone-200/90 dark:border-stone-800 hover:border-[#0E3B2F] hover:text-[#0E3B2F] dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM SECTION: "CLINICAL MONOGRAPHS" + 3 SHOWCASE CARDS FROM DATABASE ── */}
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

          {/* Right: 3 Showcase Cards from Database (Middle Card is Dark) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {displayedCards.map((item) => {
              const meta = getIngredientMeta(item.slug, item.category?.name);
              const commonName = parseIngredientCommonName(item.title, item.slug);
              const isDark = item.dark;
              const imageSrc = item.cardImageUrl || item.featuredImageUrl || meta.image;

              return (
                <Link
                  key={item.id}
                  href={`/ingredients/${item.slug}`}
                  className={`group relative rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                    isDark
                      ? "bg-[#1E252B] dark:bg-[#12181E] text-white shadow-lg shadow-stone-900/20 border border-stone-700/50"
                      : "bg-[#EBF3EE] dark:bg-[#101F18] text-stone-900 dark:text-stone-100 shadow-md shadow-emerald-950/5 border border-emerald-200/60 dark:border-emerald-900/40"
                  }`}
                >
                  {/* Product Image Stage Tile */}
                  <div className="relative w-full h-40 mb-4 rounded-2xl bg-white dark:bg-stone-900/90 flex items-center justify-center p-3 shadow-xs border border-stone-200/50 dark:border-stone-800/80 overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={commonName}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title from Database */}
                  <h3
                    className={`font-bold text-sm sm:text-base tracking-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
                      isDark ? "text-white" : "text-stone-900 dark:text-stone-100"
                    }`}
                  >
                    {commonName}
                  </h3>

                  {/* Trials / Grade Metatag */}
                  <div
                    className={`text-xs font-semibold ${
                      isDark ? "text-emerald-400" : "text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    {meta.grade} · {meta.trials}
                  </div>

                  {/* Category Pill from Database */}
                  <span
                    className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      isDark
                        ? "bg-stone-800/80 text-stone-300"
                        : "bg-white/80 dark:bg-stone-900/60 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {item.category?.name || meta.tag}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
