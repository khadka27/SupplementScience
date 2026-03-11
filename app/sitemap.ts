import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

export const revalidate = 3600; // revalidate every hour
export const dynamic = "force-dynamic";

const staticPages: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${baseUrl}/category`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${baseUrl}/privacy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${baseUrl}/terms`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
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

    const postUrls = posts.map((post: (typeof posts)[number]) => {
      const categorySlug = post.category?.slug?.toLowerCase();
      const isHub = post.category?.isHub;
      let url: string;

      if (post.postType === "ingredient") {
        url = `${baseUrl}/ingredients/${post.slug}`;
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

      return {
        url,
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...(post.featuredImageUrl && { images: [post.featuredImageUrl] }),
      };
    });

    const categoryUrls = categories.map(
      (category: (typeof categories)[number]) => ({
        url: category.isHub
          ? `${baseUrl}/${category.slug}`
          : `${baseUrl}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        ...(category.imageUrl && { images: [category.imageUrl] }),
      }),
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
