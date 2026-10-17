import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

/** Ensure image URLs are always absolute. Google rejects relative paths in sitemaps. */
function absoluteImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Relative path — prepend baseUrl
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const revalidate = 3600; // revalidate every hour
export const dynamic = "force-dynamic";

const REVISION_DATE = new Date("2026-10-04T12:00:00.000Z");

const staticPages: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: REVISION_DATE,
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${baseUrl}/ingredients`,
    lastModified: REVISION_DATE,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/guides`,
    lastModified: REVISION_DATE,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/category`,
    lastModified: REVISION_DATE,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${baseUrl}/about`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/contact`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${baseUrl}/editorial-policy`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/medical-disclaimer`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/editorial-independence`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/fact-checking`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/privacy`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${baseUrl}/terms`,
    lastModified: REVISION_DATE,
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      select: {
        slug: true,
        updatedAt: true,
        featuredImageUrl: true,
        postType: true,
        category: { select: { slug: true, name: true, isHub: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 5000,
    });

    const categories = await prisma.category.findMany({
      where: { OR: [{ isHub: true }, { postCount: { gte: 1 } }] },
      select: { slug: true, updatedAt: true, isHub: true, imageUrl: true },
      take: 500,
    });

    const tags = await prisma.tag.findMany({
      where: { postCount: { gte: 1 } },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });

    const postUrls = posts
      .map((post: (typeof posts)[number]) => {
        const categorySlug = post.category?.slug?.toLowerCase();
        const isHub = post.category?.isHub;
        let url: string;

        if (post.postType === "ingredient" || categorySlug === "ingredients") {
          url = `${baseUrl}/ingredients/${post.slug}`;
        } else if (post.postType === "guide") {
          url = `${baseUrl}/guides/${post.slug}`;
        } else if (isHub && categorySlug) {
          url = `${baseUrl}/${categorySlug}/${post.slug}`;
        } else if (categorySlug) {
          url =
            post.slug === categorySlug
              ? `${baseUrl}/category/${categorySlug}`
              : `${baseUrl}/${categorySlug}/${post.slug}`;
        } else {
          url = `${baseUrl}/${post.slug}`;
        }

        const absImage = absoluteImageUrl(post.featuredImageUrl);
        return {
          url,
          lastModified: post.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.8,
          ...(absImage && { images: [absImage] }),
        };
      })
      .filter((entry) => {
        const decoded = decodeURIComponent(entry.url).toLowerCase();
        // Remove dead/unencoded space URLs and redirected paths
        return (
          !decoded.includes("omega 3 fatty acids") &&
          !decoded.includes("how-to-choose-the-best-joint-pain-supplement-safely") &&
          !entry.url.includes(" ")
        );
      });

    const categoryUrls = categories.map(
      (category: (typeof categories)[number]) => {
        const absImage = absoluteImageUrl(category.imageUrl);
        return {
          url: category.isHub
            ? `${baseUrl}/${category.slug}`
            : `${baseUrl}/category/${category.slug}`,
          lastModified: category.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          ...(absImage && { images: [absImage] }),
        };
      },
    );

    const tagUrls = tags.map((tag: (typeof tags)[number]) => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: tag.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticPages, ...postUrls, ...categoryUrls, ...tagUrls];
  } catch {
    // Return static pages only if DB is unavailable at build time
    return staticPages;
  }
}
