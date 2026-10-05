import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a URL param slug that may contain spaces (decoded from %20)
 * into a proper hyphenated slug. Handles the case where a slug was saved
 * to the DB with spaces (e.g. "omega 3" → "omega-3").
 *
 * Use this on every dynamic route param before DB lookups.
 */
export function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")     // spaces → hyphens
    .replace(/[^a-z0-9-]/g, "") // strip non-slug chars
    .replace(/-+/g, "-")      // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Converts any string into a valid URL slug.
 * Use this on the admin side when creating/updating slugs.
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPostHref(post: {
  slug: string;
  postType?: string | null;
  category?: { slug: string; name: string; isHub?: boolean } | null;
}) {
  if (post.postType === "ingredient") {
    return `/ingredients/${post.slug}`;
  }
  if (post.postType === "guide") {
    return `/guides/${post.slug}`;
  }
  const categorySlug = post.category?.slug?.toLowerCase();
  const isHub = post.category?.isHub;

  // If category is marked as a hub, use top-level URL structure
  if (isHub && categorySlug) {
    return `/${categorySlug}/${post.slug}`;
  }

  // If category exists but not a hub, use regular category structure
  if (categorySlug) {
    if (post.slug === categorySlug) {
      return `/category/${categorySlug}`;
    }
    return `/${categorySlug}/${post.slug}`;
  }

  return `/${post.slug}`;
}

export function getCategoryHref(category: { slug: string }) {
  return `/${category.slug}`;
}

export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  // Specifically exclude vecteezy free-png pages which are HTML, not images
  if (url.includes("vecteezy.com/free-png")) return false;
  return true;
}
