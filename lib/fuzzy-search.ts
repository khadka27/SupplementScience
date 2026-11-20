/**
 * High-performance, zero-dependency fuzzy search engine
 * Designed for clinical monographs, ingredients, and supplement research.
 * Calibrated for exact (100% MATCH), strong (70% MATCH), and partial/fuzzy (50% MATCH).
 */

export type MatchTier = "100% MATCH" | "70% MATCH" | "50% MATCH";

export function getMatchTier(percentage: number): MatchTier {
  if (percentage >= 88) return "100% MATCH";
  if (percentage >= 68) return "70% MATCH";
  return "50% MATCH";
}

// Common supplement and clinical synonyms / aliases
export const SYNONYMS: Record<string, string[]> = {
  green: ["green tea", "green tea extract", "egcg", "camellia sinensis", "greens"],
  "green tea": ["egcg", "camellia sinensis", "catechins", "green tea extract"],
  egcg: ["green tea", "green tea extract", "camellia sinensis", "epigallocatechin gallate"],
  tea: ["green tea", "green tea extract", "camellia sinensis", "l-theanine"],
  nac: ["n-acetyl cysteine", "n-acetylcysteine", "acetylcysteine"],
  coq10: ["coenzyme q10", "ubiquinol", "ubiquinone"],
  "vitamin d": ["vitamin d3", "cholecalciferol", "d3"],
  d3: ["vitamin d3", "cholecalciferol", "vitamin d"],
  omega: ["omega-3", "fish oil", "epa", "dha"],
  "omega 3": ["omega-3", "fish oil", "epa", "dha"],
  "fish oil": ["omega-3", "epa", "dha", "marine triglyceride"],
  turmeric: ["curcumin", "curcuma longa", "piperine"],
  curcumin: ["turmeric", "curcuma longa", "piperine"],
  ashwa: ["ashwagandha", "withania somnifera", "ksm-66", "sensoril"],
  ashwaganda: ["ashwagandha", "withania somnifera", "ksm-66"],
  ashwagandha: ["withania somnifera", "ksm-66", "sensoril"],
  mag: ["magnesium", "magnesium glycinate", "magnesium bisglycinate"],
  magnesium: ["magnesium glycinate", "magnesium bisglycinate", "chelated"],
  sleep: ["sleep-relaxation", "melatonin", "magnesium", "l-theanine"],
  anxiety: ["stress-cortisol", "ashwagandha", "l-theanine", "cortisol"],
  stress: ["stress-cortisol", "ashwagandha", "rhodiola", "cortisol"],
  joint: ["joint-pain", "arthritis", "curcumin", "turmeric"],
  brain: ["cognitive-health", "lion's mane", "l-theanine", "rhodiola"],
  creatine: ["creatine monohydrate", "creapure"],
  zinc: ["zinc picolinate", "elemental zinc"],
};

// Calculate Levenshtein distance between two strings
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) {
    row[j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      let val: number;
      if (a[i - 1] === b[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

// Calculate normalized similarity (0 to 1) based on edit distance
export function levenshteinSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const distance = levenshteinDistance(a, b);
  return Math.max(0, 1 - distance / maxLen);
}

// Check if query is an acronym matching initials of words (e.g. "nac" -> "n-acetyl cysteine", "egcg" -> "epigallocatechin gallate")
export function isAcronym(query: string, text: string): boolean {
  const words = text.toLowerCase().split(/[\s,()\-–/:]+/).filter(Boolean);
  if (words.length < query.length) return false;
  const initials = words.map((w) => w[0]).join("");
  return initials.includes(query);
}

// Score a single string field against a query
export function scoreField(query: string, text: string, isLongText = false): number {
  if (!text || !query) return 0;

  const q = query.toLowerCase().trim();
  const t = text.toLowerCase().trim();

  // 1. Exact match
  if (t === q) return 1.0;

  // 2. Clean alphanumeric exact match
  const cleanT = t.replace(/[^\w\s]/g, "");
  const cleanQ = q.replace(/[^\w\s]/g, "");
  if (cleanT === cleanQ) return 1.0;

  // 3. Text starts with query
  if (t.startsWith(q)) return 0.96;

  // 4. Query starts with text (short target)
  if (!isLongText && q.startsWith(t) && t.length >= 3) return 0.88;

  // 5. Word-by-word token analysis
  const words = t.split(/[\s,()\-–/:]+/).filter(Boolean);
  let bestScore = 0;

  for (const word of words) {
    if (word === q) {
      bestScore = Math.max(bestScore, 0.95);
    } else if (word.startsWith(q)) {
      bestScore = Math.max(bestScore, 0.90);
    } else if (!isLongText && q.startsWith(word) && word.length >= 3) {
      bestScore = Math.max(bestScore, 0.82);
    } else if (q.length >= 4 && word.length >= 4) {
      const sim = levenshteinSimilarity(q, word);
      if (sim >= 0.8) {
        bestScore = Math.max(bestScore, sim * 0.92);
      } else if (sim >= 0.65) {
        bestScore = Math.max(bestScore, sim * 0.78);
      }
    }
  }

  if (bestScore > 0) return bestScore;

  // 6. Substring match
  if (t.includes(q)) {
    // For very short queries (length <= 3), avoid matching arbitrary middle of unrelated words
    if (q.length <= 3) {
      const hasWordPrefix = words.some((w) => w.startsWith(q));
      if (hasWordPrefix) return 0.85;
      return 0;
    }
    return isLongText ? 0.65 : 0.75;
  }

  // 7. Clinical acronym match (e.g. nac, egcg)
  if (!isLongText && q.length >= 2 && q.length <= 5 && isAcronym(q, t)) {
    return 0.92;
  }

  // 8. Overall Levenshtein similarity on short string
  if (!isLongText && q.length >= 4 && t.length <= 60) {
    const sim = levenshteinSimilarity(q, t);
    if (sim >= 0.75) return sim * 0.82;
    if (sim >= 0.60) return sim * 0.70;
  }

  return 0;
}

export interface FuzzySearchOptions {
  weights?: {
    title?: number;
    slug?: number;
    category?: number;
    excerpt?: number;
    content?: number;
  };
  minScoreThreshold?: number;
  maxResults?: number;
}

export interface SearchableItem {
  id: string;
  title: string;
  slug: string;
  postType?: string;
  excerpt?: string | null;
  content?: string | null;
  cardImageUrl?: string | null;
  featuredImageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  [key: string]: any;
}

export interface FuzzySearchResult extends SearchableItem {
  matchPercentage: number;
  matchTier: MatchTier;
  score: number;
}

export function fuzzySearch(
  query: string,
  items: SearchableItem[],
  options: FuzzySearchOptions = {}
): FuzzySearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 1) return [];

  const weights = {
    title: options.weights?.title ?? 1.0,
    slug: options.weights?.slug ?? 0.9,
    category: options.weights?.category ?? 0.8,
    excerpt: options.weights?.excerpt ?? 0.65,
    content: options.weights?.content ?? 0.55,
  };

  const threshold = options.minScoreThreshold ?? 0.35;
  const maxResults = options.maxResults ?? 15;

  const results: FuzzySearchResult[] = [];

  for (const item of items) {
    // 1. Score short metadata fields
    const titleScore = scoreField(q, item.title, false) * weights.title;
    const slugScore = scoreField(q, (item.slug || "").replace(/-/g, " "), false) * weights.slug;
    const categoryScore = item.category?.name
      ? scoreField(q, item.category.name, false) * weights.category
      : 0;

    // 2. Score longer narrative fields
    const excerptScore = item.excerpt
      ? scoreField(q, item.excerpt, true) * weights.excerpt
      : 0;
    const contentScore = item.content
      ? scoreField(q, item.content.slice(0, 1500), true) * weights.content
      : 0;

    // 3. Check synonyms / aliases
    let synonymScore = 0;
    const syns = SYNONYMS[q] || [];
    for (const syn of syns) {
      const sTitle = scoreField(syn, item.title, false) * 0.92;
      const sCat = item.category?.name ? scoreField(syn, item.category.name, false) * 0.8 : 0;
      const sExc = item.excerpt ? scoreField(syn, item.excerpt, true) * 0.65 : 0;
      synonymScore = Math.max(synonymScore, sTitle, sCat, sExc);
    }

    const rawHighest = Math.max(
      titleScore,
      slugScore,
      categoryScore,
      excerptScore,
      contentScore,
      synonymScore
    );

    if (rawHighest >= threshold) {
      const rawPct = Math.round(rawHighest * 100);
      let matchTier: MatchTier = "50% MATCH";
      let matchPercentage = 50;

      if (rawPct >= 85) {
        matchTier = "100% MATCH";
        matchPercentage = 100;
      } else if (rawPct >= 65) {
        matchTier = "70% MATCH";
        matchPercentage = Math.min(85, Math.max(70, rawPct));
      } else {
        matchTier = "50% MATCH";
        matchPercentage = Math.min(65, Math.max(50, rawPct));
      }

      results.push({
        ...item,
        score: rawHighest,
        matchPercentage,
        matchTier,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}
