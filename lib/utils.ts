import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPostHref(post: {
  slug: string;
  category?: { slug: string; name: string } | null;
}) {
  if (
    post.category?.slug === "ingredients" ||
    post.category?.name?.toLowerCase() === "ingredients"
  ) {
    return `/${post.slug}`;
  }
  if (post.category?.slug) {
    // If the post slug is the same as the category slug, just return the category path
    if (post.slug === post.category.slug) {
      return `/${post.category.slug}`;
    }
    return `/${post.category.slug}/${post.slug}`;
  }
  return `/blog/${post.slug}`;
}

export function getCategoryHref(category: { slug: string }) {
  return `/${category.slug}`;
}
