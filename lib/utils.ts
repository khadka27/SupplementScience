import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPostHref(post: {
  slug: string;
  category?: { slug: string; name: string; isHub?: boolean } | null;
}) {
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
