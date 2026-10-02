/**
 * High-performance, zero-dependency fuzzy search engine
 * Designed for clinical monographs, ingredients, and supplement research.
 */

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

// Check if query is a subsequence of target (e.g. "nac" in "n-acetyl-cysteine")
export function isSubsequence(query: string, target: string): boolean {
  let qIdx = 0;
  let tIdx = 0;
  while (qIdx < query.length && tIdx < target.length) {
    if (query[qIdx] === target[tIdx]) {
      qIdx++;
    }
    tIdx++;
  }
  return qIdx === query.length;
}

// Score a single string field against a query
export function scoreField(query: string, text: string): number {
  if (!text || !query) return 0;

  const q = query.toLowerCase().trim();
  const t = text.toLowerCase().trim();

  // Exact match
  if (t === q) return 1.0;

  // Starts with query
  if (t.startsWith(q)) return 0.95;

  // Query starts with target (for short abbreviations)
  if (q.startsWith(t) && t.length >= 3) return 0.85;

  // Word boundary match (e.g. "somnifera" in "Withania somnifera")
  const words = t.split(/[\s,()\-–/]+/);
  for (const word of words) {
    if (word === q) return 0.92;
    if (word.startsWith(q)) return 0.88;
    // Word typo match
    if (q.length >= 4 && word.length >= 4) {
      const sim = levenshteinSimilarity(q, word);
      if (sim >= 0.75) return sim * 0.85;
    }
  }

  // Substring match
  if (t.includes(q)) return 0.8;

  // Acronym / Subsequence match
  if (q.length >= 2 && isSubsequence(q, t)) {
    return 0.65;
  }

  // Fuzzy Levenshtein on full phrase
  if (q.length >= 4) {
    const sim = levenshteinSimilarity(q, t);
    if (sim >= 0.7) return sim * 0.75;
  }

  return 0;
}

export interface FuzzySearchOptions {
  weights?: {
    title?: number;
    slug?: number;
    category?: number;
    excerpt?: number;
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
  featuredImageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
  [key: string]: any;
}

export interface FuzzySearchResult extends SearchableItem {
  matchPercentage: number;
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
    slug: options.weights?.slug ?? 0.85,
    category: options.weights?.category ?? 0.7,
    excerpt: options.weights?.excerpt ?? 0.4,
  };

    const threshold = options.minScoreThreshold ?? 0.42;
    const maxResults = options.maxResults ?? 8;

    const results: FuzzySearchResult[] = [];

    for (const item of items) {
      // Score each field
      const titleScore = scoreField(q, item.title) * weights.title;
      const slugScore = scoreField(q, item.slug.replace(/-/g, " ")) * weights.slug;
      const categoryScore = item.category?.name
        ? scoreField(q, item.category.name) * weights.category
        : 0;
      const excerptScore = item.excerpt
        ? scoreField(q, item.excerpt) * weights.excerpt
        : 0;

      const highestScore = Math.max(titleScore, slugScore, categoryScore, excerptScore);

      if (highestScore >= threshold) {
        results.push({
          ...item,
          score: highestScore,
          matchPercentage: Math.round(highestScore * 100),
        });
      }
    }

    // Sort descending by score
    results.sort((a, b) => b.score - a.score);

    // If top match is strong (>= 0.6), filter out any results that are far behind (< 0.45)
    if (results.length > 0 && results[0].score >= 0.6) {
      const topScore = results[0].score;
      return results.filter((r) => r.score >= Math.max(0.45, topScore - 0.35)).slice(0, maxResults);
    }

    return results.slice(0, maxResults);
}
