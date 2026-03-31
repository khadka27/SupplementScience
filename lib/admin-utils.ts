/**
 * Admin Utilities
 *
 * Helper functions for admin-side content creation and management
 */

import {
  getProductReviewSlug,
  getGuideSlug,
  getIngredientSlug,
  getReviewUrl,
  getGuideUrl,
  getIngredientUrl,
  getCategoryUrl,
} from "./internal-linking";

export type PostType = "review" | "guide" | "ingredient" | "blog";

export interface PostTypeConfig {
  type: PostType;
  label: string;
  description: string;
  slugGenerator: (input: string, categorySlug?: string) => string;
  urlGenerator: (slug: string, categorySlug?: string) => string;
  requiresCategory: boolean;
}

export const POST_TYPE_CONFIGS: Record<PostType, PostTypeConfig> = {
  review: {
    type: "review",
    label: "Product Review",
    description: "Supplement product review within a category",
    slugGenerator: (productName: string) => getProductReviewSlug(productName),
    urlGenerator: (slug: string, categorySlug?: string) => {
      if (!categorySlug) return "#";
      return getReviewUrl(categorySlug, slug);
    },
    requiresCategory: true,
  },
  guide: {
    type: "guide",
    label: "Category Guide",
    description: "General guide page",
    slugGenerator: (title: string) => {
      return title
        .toLowerCase()
        .trim()
        .replaceAll(/[^\w\s-]/g, "")
        .replaceAll(/[\s_-]+/g, "-")
        .replaceAll(/^-+|-+$/g, "");
    },
    urlGenerator: (slug: string) => `/guides/${slug}`,
    requiresCategory: false,
  },
  ingredient: {
    type: "ingredient",
    label: "Ingredient Page",
    description: "Global ingredient information page",
    slugGenerator: (ingredientName: string) =>
      getIngredientSlug(ingredientName),
    urlGenerator: (slug: string) => getIngredientUrl(slug),
    requiresCategory: false,
  },
  blog: {
    type: "blog",
    label: "Blog Post",
    description: "General blog post or article",
    slugGenerator: (title: string) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
    urlGenerator: (slug: string) => `/blog/${slug}`,
    requiresCategory: false,
  },
};

/**
 * Generate slug based on post type
 */
export function generateSlugForPostType(
  postType: PostType,
  input: string,
  categorySlug?: string,
  guideType?: string,
): string {
  const config = POST_TYPE_CONFIGS[postType];

  return config.slugGenerator(input, categorySlug);
}

/**
 * Generate preview URL based on post type
 */
export function generatePreviewUrl(
  postType: PostType,
  slug: string,
  categorySlug?: string,
): string {
  const config = POST_TYPE_CONFIGS[postType];
  return config.urlGenerator(slug, categorySlug);
}

/**
 * Get guide type options
 */
export const GUIDE_TYPES = [
  { value: "safety-measures", label: "Safety Measures" },
  { value: "how-to-choose", label: "How to Choose" },
  { value: "ingredients-used", label: "Ingredients Used" },
] as const;

/**
 * Validate slug format for post type
 */
export function validateSlugForPostType(
  postType: PostType,
  slug: string,
  categorySlug?: string,
): { valid: boolean; error?: string } {
  if (!slug || slug.length < 3) {
    return { valid: false, error: "Slug must be at least 3 characters" };
  }

  if (postType === "review" && !slug.endsWith("-review")) {
    return {
      valid: false,
      error: "Review slugs must end with '-review'",
    };
  }

  return { valid: true };
}

/**
 * Extract product name from review slug
 */
export function extractProductNameFromSlug(slug: string): string {
  if (slug.endsWith("-review")) {
    return slug.replace(/-review$/, "").replace(/-/g, " ");
  }
  return slug;
}

/**
 * Extract guide type from slug
 */
export function extractGuideTypeFromSlug(slug: string): string | null {
  if (slug.startsWith("safety-measures-for-")) {
    return "safety-measures";
  }
  if (slug.startsWith("how-to-choose-")) {
    return "how-to-choose";
  }
  if (slug.startsWith("ingredients-used-in-")) {
    return "ingredients-used";
  }
  return null;
}
