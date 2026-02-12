import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";

export const dynamic = "force-static";
export const revalidate = 21600;

type Props = {
  params: Promise<{ slug: string; "review-slug": string }>;
};

async function getCategory(slug: string): Promise<any | null> {
  const data = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  return data;
}

async function getReviewPost(
  categorySlug: string,
  reviewSlug: string,
): Promise<any | null> {
  const category = await getCategory(categorySlug);
  if (!category) return null;

  const data = await prisma.post.findFirst({
    where: {
      slug: reviewSlug,
      status: "PUBLISHED",
      categoryId: category.id,
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!data) return null;

  return {
    ...data,
    metaTitle: data.metaTitle ?? undefined,
    metaDescription: data.metaDescription ?? undefined,
    excerpt: data.excerpt ?? undefined,
    featuredImageUrl: data.featuredImageUrl ?? undefined,
    featuredImageAlt: data.featuredImageAlt ?? undefined,
    publishedAt: data.publishedAt ?? undefined,
    tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  } as any;
}

async function getRelatedPosts(
  categoryId: string,
  currentPostId: string,
): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoryId,
      id: {
        not: currentPostId,
      },
      publishedAt: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImageUrl: true,
      publishedAt: true,
      readTimeMinutes: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, "review-slug": reviewSlug } = await params;
  const post = await getReviewPost(slug, reviewSlug);

  if (!post) {
    return {
      title: "Review Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";
  const url = `${baseUrl}/${slug}/${reviewSlug}`;
  const imageUrl = post.featuredImageUrl || `${baseUrl}/og-default.jpg`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      url: url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author.name] : [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  // Generate params for all category review combinations
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      id: true,
    },
    take: 100,
  });

  const params: Array<{ slug: string; "review-slug": string }> = [];

  for (const category of categories) {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: category.id,
        publishedAt: {
          lte: new Date(),
        },
      },
      select: {
        slug: true,
      },
      take: 50, // Limit per category to avoid too many static params
    });

    for (const post of posts) {
      if (post.slug === category.slug) continue;
      params.push({
        slug: category.slug,
        "review-slug": post.slug,
      });
    }
  }

  return params;
}

export default async function CategoryReviewPage({ params }: Props) {
  const { slug, "review-slug": reviewSlug } = await params;
  const post = await getReviewPost(slug, reviewSlug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.categoryId!, post.id);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

  const blogPostSchema = generateBlogPostSchema(post, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    {
      name: post.category?.name || "Category",
      url: `${baseUrl}/${slug}`,
    },
    { name: post.title, url: `${baseUrl}/${slug}/${reviewSlug}` },
  ]);

  const faqSchema = post.faqs ? generateFAQSchema(post.faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogPostContent
        post={post}
        relatedPosts={relatedPosts}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
