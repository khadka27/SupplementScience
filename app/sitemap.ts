import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    select: {
      slug: true,
      updatedAt: true,
      featuredImageUrl: true,
      postType: true,
      category: {
        select: {
          slug: true,
          name: true,
          isHub: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 5000, // Increased limit
  });

  const categories = await prisma.category.findMany({
    where: {
      OR: [{ isHub: true }, { postCount: { gte: 1 } }],
    },
    select: {
      slug: true,
      updatedAt: true,
      isHub: true,
      imageUrl: true,
    },
    take: 500, // Increased limit
  });

  const tags = await prisma.tag.findMany({
    where: {
      postCount: {
        gte: 1, // Include tags with at least one post
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    take: 1000, // Increased limit
  });

  const postUrls = posts.map((post) => {
    const categorySlug = post.category?.slug?.toLowerCase();
    const isHub = post.category?.isHub;

    let url: string;

    if (post.postType === "ingredient") {
      url = `${baseUrl}/ingredients/${post.slug}`;
    } else if (isHub && categorySlug) {
      // Hub category posts: /[categorySlug]/[postSlug]
      url = `${baseUrl}/${categorySlug}/${post.slug}`;
    } else if (categorySlug) {
      // Regular category posts: /[categorySlug]/[postSlug]
      if (post.slug === categorySlug) {
        url = `${baseUrl}/category/${categorySlug}`;
      } else {
        url = `${baseUrl}/${categorySlug}/${post.slug}`;
      }
    } else {
      // No category: /[postSlug]
      url = `${baseUrl}/${post.slug}`;
    }

    return {
      url,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(post.featuredImageUrl && {
        images: [post.featuredImageUrl],
      }),
    };
  });

  const categoryUrls = categories.map((category) => ({
    url: category.isHub
      ? `${baseUrl}/${category.slug}`
      : `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...(category.imageUrl && {
      images: [category.imageUrl],
    }),
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: tag.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
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
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}
