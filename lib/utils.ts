import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPostHref(post: {
  slug: string;
  postType?: string;
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
