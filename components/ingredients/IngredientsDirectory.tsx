"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  List,
  FlaskConical,
  Activity,
  Layers,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Info,
  Pill,
  ArrowUpDown,
  Beaker,
  Flame,
  Moon,
  Zap,
  Heart,
  Brain,
  Sun,
  Shield,
} from "lucide-react";

export interface IngredientItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cardImageUrl?: string | null;
  featuredImageUrl?: string | null;
  publishedAt: string | Date | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface IngredientsDirectoryProps {
  ingredients: IngredientItem[];
}

// Helper to extract common name and scientific/chemical specification
function parseIngredientTitle(title: string) {
  const match = title.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      commonName: match[1].trim(),
      scientificName: match[2].trim(),
    };
  }
  return {
    commonName: title,
    scientificName: null,
  };
}

// Preset evidence metrics based on clinical dossier content
function getIngredientClinicalMeta(slug: string, categoryName?: string | null) {
  switch (slug) {
    case "ashwagandha":
      return {
        evidenceGrade: "Grade A",
        trialCount: "48 Human RCTs",
        trialsNumeric: 48,
        keyOutcome: "Cortisol & Stress Reduction (-27.9%)",
        bioactive: "Withanolides (KSM-66 / Sensoril)",
        doseWindow: "300 – 600 mg/day",
        badgeColor: "emerald",
        icon: Brain,
      };
    case "creatine-monohydrate":
      return {
        evidenceGrade: "Grade A",
        trialCount: "500+ Clinical Trials",
        trialsNumeric: 500,
        keyOutcome: "Maximal Power & Intracellular Hydration",
        bioactive: "Creapure® (Micronized)",
        doseWindow: "3 – 5 g/day continuous",
        badgeColor: "blue",
        icon: Zap,
      };
    case "magnesium-glycinate":
      return {
        evidenceGrade: "Grade A",
        trialCount: "72 Human RCTs",
        trialsNumeric: 72,
        keyOutcome: "GABAergic Deep Sleep & Muscle Tone",
        bioactive: "Chelated Bisglycinate (Organic)",
        doseWindow: "200 – 400 mg elemental",
        badgeColor: "indigo",
        icon: Moon,
      };
    case "l-theanine":
      return {
        evidenceGrade: "Grade A",
        trialCount: "31 Human RCTs",
        trialsNumeric: 31,
        keyOutcome: "Alpha Wave Induction (8-12 Hz) & Jitter Blunting",
        bioactive: "Suntheanine® (Enantiomer Pure)",
        doseWindow: "100 – 200 mg / with caffeine",
        badgeColor: "teal",
        icon: Activity,
      };
    case "berberine":
      return {
        evidenceGrade: "Grade A",
        trialCount: "45 Human RCTs",
        trialsNumeric: 45,
        keyOutcome: "AMPK Activation & Fasting Glycemia Modulation",
        bioactive: "Berberine HCl (97% Alkaloid)",
        doseWindow: "500 mg 2-3x/day with meals",
        badgeColor: "amber",
        icon: Flame,
      };
    case "omega-3":
      return {
        evidenceGrade: "Grade A",
        trialCount: "350+ Clinical Trials",
        trialsNumeric: 350,
        keyOutcome: "Triglyceride Lowering & Membrane Fluidity",
        bioactive: "Re-esterified Triglyceride (rTG) EPA/DHA",
        doseWindow: "1,000 – 2,000 mg active EPA+DHA",
        badgeColor: "cyan",
        icon: Heart,
      };
    case "rhodiola-rosea":
      return {
        evidenceGrade: "Grade B+",
        trialCount: "24 Human RCTs",
        trialsNumeric: 24,
        keyOutcome: "Acute Cognitive Fatigue & Stress Resilience",
        bioactive: "Standardized 3% Rosavins / 1% Salidroside",
        doseWindow: "200 – 400 mg morning",
        badgeColor: "rose",
        icon: Sparkles,
      };
    case "lions-mane":
      return {
        evidenceGrade: "Grade B+",
        trialCount: "18 Human Trials",
        trialsNumeric: 18,
        keyOutcome: "NGF Synthesis & Working Memory Modulation",
        bioactive: "Hericenones & Erinacines (Dual Extract)",
        doseWindow: "500 – 1,000 mg dual extract",
        badgeColor: "purple",
        icon: Brain,
      };
    case "vitamin-d3":
      return {
        evidenceGrade: "Grade A",
        trialCount: "140+ Human RCTs",
        trialsNumeric: 140,
        keyOutcome: "25(OH)D Serum Kinetics & Bone Homeostasis",
        bioactive: "Cholecalciferol + Menaquinone-7 (K2)",
        doseWindow: "2,000 – 5,000 IU + 100 mcg K2",
        badgeColor: "amber",
        icon: Sun,
      };
    case "zinc":
      return {
        evidenceGrade: "Grade A",
        trialCount: "62 Human RCTs",
        trialsNumeric: 62,
        keyOutcome: "Mucosal Defense & Thymulin Enzymatic Activity",
        bioactive: "Zinc Picolinate (High Bioavailability)",
        doseWindow: "15 – 30 mg elemental",
        badgeColor: "emerald",
        icon: ShieldCheck,
      };
    case "curcumin-turmeric":
      return {
        evidenceGrade: "Grade A",
        trialCount: "85 Human RCTs",
        trialsNumeric: 85,
        keyOutcome: "NF-κB Inhibition & Joint Comfort Support",
        bioactive: "95% Curcuminoids + Piperine / Phytosome",
        doseWindow: "500 mg with 5 mg BioPerine®",
        badgeColor: "orange",
        icon: FlaskConical,
      };
    case "coq10":
      return {
        evidenceGrade: "Grade A",
        trialCount: "80+ Human RCTs",
        trialsNumeric: 80,
        keyOutcome: "Mitochondrial Complex I-III ATP Production",
        bioactive: "Ubiquinol (Reduced Active Form)",
        doseWindow: "100 – 200 mg with lipid meal",
        badgeColor: "red",
        icon: Zap,
      };
    default:
      return {
        evidenceGrade: "Grade A",
        trialCount: "Peer-Reviewed",
        trialsNumeric: 10,
        keyOutcome: categoryName || "Metabolic & Cellular Optimization",
        bioactive: "Standardized Bioactive Form",
        doseWindow: "Clinical Trial Range",
        badgeColor: "emerald",
        icon: Pill,
      };
  }
}

type SortField = "name-asc" | "name-desc" | "category" | "trials-desc" | "grade";

export function IngredientsDirectory({ ingredients }: IngredientsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortField>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Extract unique categories and their counts
  const categoriesWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of ingredients) {
      const cat = item.category?.name || "General";
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [ingredients]);

  // Extract available initial letters for quick jump
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const item of ingredients) {
      const { commonName } = parseIngredientTitle(item.title);
      const firstLetter = commonName.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    }
    return Array.from(letters).sort();
  }, [ingredients]);

  // Filter and sort items
  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((item) => {
        const { commonName, scientificName } = parseIngredientTitle(item.title);
        const query = searchQuery.trim().toLowerCase();

        // 1. Search filter
        if (query) {
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchCommon = commonName.toLowerCase().includes(query);
          const matchSci = scientificName?.toLowerCase().includes(query);
          const matchCat = item.category?.name.toLowerCase().includes(query);
          const matchExcerpt = item.excerpt?.toLowerCase().includes(query);
          const matchContent = item.content?.toLowerCase().includes(query);

          if (!matchTitle && !matchCommon && !matchSci && !matchCat && !matchExcerpt && !matchContent) {
            return false;
          }
        }

        // 2. Category filter
        if (selectedCategory !== "ALL") {
          const catName = item.category?.name || "General";
          if (catName !== selectedCategory) {
            return false;
          }
        }

        // 3. A-Z letter filter
        if (selectedLetter !== "ALL") {
          const firstLetter = commonName.charAt(0).toUpperCase();
          if (firstLetter !== selectedLetter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const titleA = parseIngredientTitle(a.title).commonName.toLowerCase();
        const titleB = parseIngredientTitle(b.title).commonName.toLowerCase();
        const metaA = getIngredientClinicalMeta(a.slug, a.category?.name);
        const metaB = getIngredientClinicalMeta(b.slug, b.category?.name);

        if (sortBy === "name-asc") {
          return titleA.localeCompare(titleB);
        }
        if (sortBy === "name-desc") {
          return titleB.localeCompare(titleA);
        }
        if (sortBy === "category") {
          const catA = a.category?.name || "";
          const catB = b.category?.name || "";
          if (catA === catB) return titleA.localeCompare(titleB);
          return catA.localeCompare(catB);
        }
        if (sortBy === "trials-desc") {
          return metaB.trialsNumeric - metaA.trialsNumeric;
        }
        if (sortBy === "grade") {
          return metaA.evidenceGrade.localeCompare(metaB.evidenceGrade);
        }
        return 0;
      });
  }, [ingredients, searchQuery, selectedCategory, selectedLetter, sortBy]);

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "ALL" || selectedLetter !== "ALL";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedLetter("ALL");
    setExpandedRowId(null);
  };

  const handleHeaderSort = (field: "name" | "category" | "trials" | "grade") => {
    if (field === "name") {
      setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc");
    } else if (field === "category") {
      setSortBy("category");
    } else if (field === "trials") {
      setSortBy(sortBy === "trials-desc" ? "name-asc" : "trials-desc");
    } else if (field === "grade") {
      setSortBy(sortBy === "grade" ? "name-asc" : "grade");
    }
  };

  return (
    <div className="w-full">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#0D1217] rounded-3xl p-5 sm:p-7 border border-stone-200/90 dark:border-stone-800 shadow-sm mb-8 transition-colors">
        {/* Search input bar */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400 dark:text-stone-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ingredient, botanical name, mechanism, or clinical benefit (e.g. Ashwagandha, Cortisol, Sleep, ATP)..."
            className="w-full pl-12 sm:pl-13 pr-10 py-3.5 sm:py-4 bg-[#FAFAF8] dark:bg-[#070A0E] border border-stone-200/90 dark:border-stone-750 rounded-2xl text-slate-900 dark:text-stone-100 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm sm:text-base transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-stone-300 transition-colors"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Pills & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mr-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Health Goal:
          </span>
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === "ALL"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-stone-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700/80"
            }`}
          >
            All Categories ({ingredients.length})
          </button>
          {categoriesWithCounts.map(([catName, count]) => (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === catName
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700/80"
              }`}
            >
              {catName} ({count})
            </button>
          ))}
        </div>

        {/* Secondary Bar: A-Z Jump Bar, Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
          {/* Alphabet quick jump */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 dark:text-stone-500 mr-1">
              A–Z:
            </span>
            <button
              onClick={() => setSelectedLetter("ALL")}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center shrink-0 ${
                selectedLetter === "ALL"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                  : "text-slate-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              All
            </button>
            {availableLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center shrink-0 ${
                  selectedLetter === letter
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Sort dropdown and layout toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-slate-400 dark:text-stone-500 font-medium">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAFAF8] dark:bg-[#070A0E] border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="name-asc">Alphabetical (A → Z)</option>
                <option value="name-desc">Alphabetical (Z → A)</option>
                <option value="trials-desc">Most Clinical Trials</option>
                <option value="grade">Evidence Grade (A → B)</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-0.5 rounded-xl border border-stone-200/80 dark:border-stone-700/80">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                aria-label="Compact list view"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-200"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results summary bar with clear button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/60 text-xs text-slate-500 dark:text-stone-400">
          <div>
            Showing <strong className="text-slate-900 dark:text-stone-100">{filteredIngredients.length}</strong> of{" "}
            <strong>{ingredients.length}</strong> clinical monographs
            {searchQuery && (
              <span>
                {" "}for <span className="text-emerald-600 dark:text-emerald-400 font-semibold">"{searchQuery}"</span>
              </span>
            )}
            {selectedCategory !== "ALL" && (
              <span>
                {" "}in <span className="font-semibold text-slate-700 dark:text-stone-200">{selectedCategory}</span>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredIngredients.length === 0 && (
        <div className="bg-white dark:bg-[#0D1217] rounded-3xl p-12 text-center border border-stone-200/90 dark:border-stone-800 my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
            <FlaskConical className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No matching clinical monographs found
          </h3>
          <p className="text-sm text-slate-600 dark:text-stone-400 max-w-md mx-auto mb-6">
            We haven't indexed an ingredient monograph matching your current search query or filter criteria yet.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-950/20"
          >
            <RotateCcw className="w-4 h-4" />
            Clear filters & view all ({ingredients.length})
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredIngredients.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIngredients.map((item) => {
            const { commonName, scientificName } = parseIngredientTitle(item.title);
            const clinical = getIngredientClinicalMeta(item.slug, item.category?.name);
            const IconComponent = clinical.icon;

            return (
              <Link
                key={item.id}
                href={`/ingredients/${item.slug}`}
                className="group relative flex flex-col justify-between bg-white dark:bg-[#0D1217] rounded-3xl p-6 sm:p-7 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/70 dark:hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/5 dark:hover:shadow-black/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                      <IconComponent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {item.category?.name || "Bioactive"}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {clinical.evidenceGrade}
                    </span>
                  </div>

                  {/* Ingredient Names */}
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {commonName}
                    </h3>
                    {scientificName && (
                      <p className="text-xs font-mono italic text-slate-500 dark:text-stone-400 mt-1">
                        {scientificName}
                      </p>
                    )}
                  </div>

                  {/* Clinical Excerpt */}
                  <p className="text-slate-600 dark:text-stone-300 text-sm leading-relaxed mb-5 line-clamp-3">
                    {item.excerpt || item.content?.slice(0, 160) + "..."}
                  </p>

                  {/* Monograph Meta Grid */}
                  <div className="bg-[#FAFAF8] dark:bg-[#070A0E] rounded-2xl p-3.5 border border-stone-200/70 dark:border-stone-800/80 space-y-2 mb-5">
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-400 dark:text-stone-500 font-medium shrink-0">
                        Primary Evidence:
                      </span>
                      <span className="text-right font-semibold text-slate-800 dark:text-stone-200 truncate">
                        {clinical.trialCount}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-400 dark:text-stone-500 font-medium shrink-0">
                        Bioactive Spec:
                      </span>
                      <span className="text-right font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300 truncate">
                        {clinical.bioactive}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-slate-400 dark:text-stone-500 font-medium shrink-0">
                        Clinical Dose:
                      </span>
                      <span className="text-right font-medium text-slate-700 dark:text-stone-300 truncate">
                        {clinical.doseWindow}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Clinical Monograph
                  </span>
                  <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
                    Read Dossier
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Enhanced Clinical Table View */}
      {viewMode === "table" && filteredIngredients.length > 0 && (
        <div className="bg-white dark:bg-[#0D1217] rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden transition-colors">
          {/* Table Header Bar */}
          <div className="px-6 py-3.5 bg-stone-50/80 dark:bg-[#070A0E] border-b border-stone-200/80 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Clinical Matrix: <strong>{filteredIngredients.length}</strong> monographs indexed
              </span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-stone-500">
              Click row to toggle quick synthesis • Click headers to sort
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[940px] text-sm">
              <thead>
                <tr className="border-b border-stone-200/90 dark:border-stone-800 bg-[#FAFAF8] dark:bg-[#0A0E13] text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-stone-400 select-none">
                  {/* Column 1: Ingredient */}
                  <th
                    onClick={() => handleHeaderSort("name")}
                    className="py-4 px-6 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Ingredient & Spec</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Column 2: Category */}
                  <th
                    onClick={() => handleHeaderSort("category")}
                    className="py-4 px-5 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Health Goal</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Column 3: Evidence Level */}
                  <th
                    onClick={() => handleHeaderSort("grade")}
                    className="py-4 px-4 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Grade</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Column 4: Human RCTs */}
                  <th
                    onClick={() => handleHeaderSort("trials")}
                    className="py-4 px-5 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Clinical Evidence</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* Column 5: Bioactive & Mechanism */}
                  <th className="py-4 px-5">Standardized Bioactive Form</th>

                  {/* Column 6: Therapeutic Dose */}
                  <th className="py-4 px-5">Therapeutic Dose</th>

                  {/* Column 7: CTA */}
                  <th className="py-4 px-6 text-right">Dossier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {filteredIngredients.map((item) => {
                  const { commonName, scientificName } = parseIngredientTitle(item.title);
                  const clinical = getIngredientClinicalMeta(item.slug, item.category?.name);
                  const IconComponent = clinical.icon;
                  const isExpanded = expandedRowId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                        className={`group cursor-pointer transition-colors border-l-4 ${
                          isExpanded
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-l-emerald-600"
                            : "border-l-transparent hover:bg-stone-50/80 dark:hover:bg-stone-850/50 hover:border-l-emerald-500/60"
                        }`}
                      >
                        {/* Col 1: Ingredient */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-slate-700 dark:text-stone-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                {commonName}
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                                    isExpanded ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                                  }`}
                                />
                              </div>
                              {scientificName && (
                                <div className="text-xs font-mono text-slate-400 dark:text-stone-500 italic mt-0.5">
                                  {scientificName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Col 2: Category */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/80">
                            {item.category?.name || "General"}
                          </span>
                        </td>

                        {/* Col 3: Evidence Grade */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              clinical.evidenceGrade.includes("A")
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                                : "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800"
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {clinical.evidenceGrade}
                          </span>
                        </td>

                        {/* Col 4: Human RCTs & confidence bar */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="font-semibold text-xs text-slate-800 dark:text-stone-200">
                            {clinical.trialCount}
                          </div>
                          {/* Mini visual confidence bar */}
                          <div className="w-24 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(25, (clinical.trialsNumeric / 250) * 100))}%`,
                              }}
                            />
                          </div>
                        </td>

                        {/* Col 5: Standardized Bioactive Form */}
                        <td className="py-4 px-5">
                          <div className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-xs">
                            {clinical.bioactive}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-stone-400 truncate max-w-xs mt-0.5">
                            {clinical.keyOutcome}
                          </div>
                        </td>

                        {/* Col 6: Therapeutic Dose */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/80 text-xs font-mono font-medium text-slate-800 dark:text-stone-200">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {clinical.doseWindow}
                          </div>
                        </td>

                        {/* Col 7: Action */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <Link
                            href={`/ingredients/${item.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-600 hover:text-white dark:bg-stone-800 dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-semibold text-slate-700 dark:text-stone-200 transition-all shadow-2xs group-hover:scale-102"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>

                      {/* Expandable Quick-Peek Drawer */}
                      {isExpanded && (
                        <tr className="bg-stone-50/70 dark:bg-[#090D11] border-b border-stone-200/90 dark:border-stone-800">
                          <td colSpan={7} className="p-5 sm:p-6">
                            <div className="bg-white dark:bg-[#0D1217] rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800/80">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                    {commonName} Clinical Monograph Abstract
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 font-mono">
                                    Evidence Grade: <strong>{clinical.evidenceGrade}</strong> ({clinical.trialCount})
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-slate-700 dark:text-stone-300 leading-relaxed">
                                {item.excerpt || item.content?.slice(0, 300) + "..."}
                              </p>

                              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#070A0E] border border-stone-200/80 dark:border-stone-800">
                                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-1">
                                    Standard Bioactive Spec
                                  </div>
                                  <div className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                                    {clinical.bioactive}
                                  </div>
                                </div>

                                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#070A0E] border border-stone-200/80 dark:border-stone-800">
                                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-1">
                                    Clinical Target Endpoint
                                  </div>
                                  <div className="text-xs font-medium text-slate-800 dark:text-stone-200">
                                    {clinical.keyOutcome}
                                  </div>
                                </div>

                                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#070A0E] border border-stone-200/80 dark:border-stone-800">
                                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-1">
                                    Therapeutic Window
                                  </div>
                                  <div className="text-xs font-mono font-medium text-slate-800 dark:text-stone-200">
                                    {clinical.doseWindow}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                                <span className="text-xs text-slate-500 dark:text-stone-400 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  Indexed under {item.category?.name} clinical trial repository
                                </span>
                                <Link
                                  href={`/ingredients/${item.slug}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
                                >
                                  <span>View Complete Dossier & Studies</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
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

          {/* Table Footer */}
          <div className="p-4 bg-stone-50/80 dark:bg-[#070A0E] border-t border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-stone-400">
            <div>
              Showing <strong>{filteredIngredients.length}</strong> of <strong>{ingredients.length}</strong> verified clinical monographs
            </div>
            <div className="flex items-center gap-4">
              <span>Scroll horizontally on smaller displays</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
