/**
 * Internal Linking Utilities
 *
 * Provides helper functions for generating internal links
 * following the dynamic slug-based routing structure.
 */

/**
 * Generate ingredient page URL
 * @param ingredientSlug - The slug of the ingredient (e.g., "glucosamine", "turmeric")
 * @returns The full URL path for the ingredient page
 */
export function getIngredientUrl(ingredientSlug: string): string {
  return `/ingredients/${ingredientSlug}`;
}

/**
 * Generate category review URL
 * @param categorySlug - The category slug (e.g., "joint-pain")
 * @param productSlug - The product review slug (e.g., "flexitrinol-review")
 * @returns The full URL path for the review
 */
export function getReviewUrl(
  categorySlug: string,
  productSlug: string,
): string {
  return `/${categorySlug}/${productSlug}`;
}

/**
 * Generate category guide URL
 * @param categorySlug - The category slug (e.g., "joint-pain")
 * @param guideType - Type of guide: "safety-measures", "how-to-choose", "ingredients-used"
 * @returns The full URL path for the guide
 */
export function getGuideUrl(
  categorySlug: string,
  guideType: "safety-measures" | "how-to-choose" | "ingredients-used",
): string {
  const guideSlugMap = {
    "safety-measures": `safety-measures-for-${categorySlug}-supplements`,
    "how-to-choose": `how-to-choose-${categorySlug}-supplements`,
    "ingredients-used": `ingredients-used-in-${categorySlug}-supplements`,
  };

  return `/${categorySlug}/${guideSlugMap[guideType]}`;
}

/**
 * Generate category hub URL
 * @param categorySlug - The category slug (e.g., "joint-pain")
 * @returns The full URL path for the category hub
 */
export function getCategoryUrl(categorySlug: string): string {
  return `/category/${categorySlug}`;
}

/**
 * Create an internal link HTML element
 * @param href - The URL path
 * @param text - The link text
 * @param className - Optional CSS classes
 * @returns HTML anchor tag string
 */
export function createInternalLink(
  href: string,
  text: string,
  className?: string,
): string {
  const classAttr = className ? ` class="${className}"` : "";
  return `<a href="${href}"${classAttr}>${text}</a>`;
}

/**
 * Replace ingredient mentions in content with links
 * @param content - HTML content string
 * @param ingredientMap - Map of ingredient names to slugs
 * @returns Content with ingredient links added
 */
export function linkIngredients(
  content: string,
  ingredientMap: Record<string, string>,
): string {
  let processedContent = content;

  for (const [ingredientName, slug] of Object.entries(ingredientMap)) {
    // Create regex to match ingredient mentions (case-insensitive, whole word)
    const regex = new RegExp(
      `\\b${ingredientName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi",
    );

    // Replace with link, but avoid replacing if already inside an anchor tag
    processedContent = processedContent.replace(regex, (match, offset) => {
      // Check if we're inside an anchor tag
      const beforeMatch = processedContent.substring(0, offset);
      const lastOpenTag = beforeMatch.lastIndexOf("<a");
      const lastCloseTag = beforeMatch.lastIndexOf("</a>");

      if (lastOpenTag > lastCloseTag) {
        // We're inside an anchor tag, don't replace
        return match;
      }

      // Replace with linked version
      return createInternalLink(
        getIngredientUrl(slug),
        match,
        "text-green-600 dark:text-green-400 hover:underline",
      );
    });
  }

  return processedContent;
}

/**
 * Extract ingredient mentions from content
 * @param content - HTML content string
 * @param knownIngredients - Array of known ingredient names
 * @returns Array of found ingredient names
 */
export function extractIngredientMentions(
  content: string,
  knownIngredients: string[],
): string[] {
  const found: string[] = [];
  const lowerContent = content.toLowerCase();

  for (const ingredient of knownIngredients) {
    const regex = new RegExp(
      `\\b${ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    if (regex.test(lowerContent) && !found.includes(ingredient)) {
      found.push(ingredient);
    }
  }

  return found;
}

/**
 * Common ingredient slug mappings
 * Use this to standardize ingredient slugs across the site
 */
export const INGREDIENT_SLUGS: Record<string, string> = {
  glucosamine: "glucosamine",
  "glucosamine sulfate": "glucosamine",
  "glucosamine hcl": "glucosamine",
  chondroitin: "chondroitin",
  "chondroitin sulfate": "chondroitin",
  turmeric: "turmeric",
  curcumin: "turmeric",
  collagen: "collagen",
  "type ii collagen": "collagen",
  msm: "msm",
  methylsulfonylmethane: "msm",
  boswellia: "boswellia",
  "boswellia serrata": "boswellia",
  hyaluronic: "hyaluronic-acid",
  "hyaluronic acid": "hyaluronic-acid",
  omega3: "omega-3",
  "omega-3": "omega-3",
  "fish oil": "omega-3",
  vitamin: "vitamin-d",
  "vitamin d": "vitamin-d",
  "vitamin d3": "vitamin-d",
};

/**
 * Get ingredient slug from name (with fallback)
 * @param ingredientName - The ingredient name
 * @returns The standardized slug
 */
export function getIngredientSlug(ingredientName: string): string {
  const normalized = ingredientName.toLowerCase().trim();
  return (
    INGREDIENT_SLUGS[normalized] ||
    normalized
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generate guide slug for a category
 * @param categorySlug - The category slug (e.g., "joint-pain")
 * @param guideType - Type of guide
 * @returns The slug for the guide post
 */
export function getGuideSlug(
  categorySlug: string,
  guideType: "safety-measures" | "how-to-choose" | "ingredients-used",
): string {
  const guideSlugMap = {
    "safety-measures": `safety-measures-for-${categorySlug}-supplements`,
    "how-to-choose": `how-to-choose-${categorySlug}-supplements`,
    "ingredients-used": `ingredients-used-in-${categorySlug}-supplements`,
  };

  return guideSlugMap[guideType];
}

/**
 * Generate product review slug
 * @param productName - The product name (e.g., "Flexitrinol")
 * @returns The slug for the review post (e.g., "flexitrinol-review")
 */
export function getProductReviewSlug(productName: string): string {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}-review`;
}
