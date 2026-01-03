import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Post } from "@/lib/supabase"; // We'll update this type later to match Prisma if needed
import BlogPostContent from "@/components/blog/BlogPostContent";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";

export const dynamic = "force-static";
export const revalidate = 21600;

type Props = {
  params: { slug: string };
};

async function getPost(slug: string): Promise<any | null> {
  const data = await prisma.post.findFirst({
    where: {
      slug,
      status: "published",
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

  const post = {
    ...data,
    tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  };

  return post;
}

async function getRelatedPosts(
  categoryId?: string,
  currentPostId?: string
): Promise<any[]> {
  if (!categoryId) return [];

  const data = await prisma.post.findMany({
    where: {
      status: "published",
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
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";
  const url = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featured_image_url || `${baseUrl}/og-default.jpg`;

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || "",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      url: url,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author.name] : [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.featured_image_alt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      publishedAt: {
        lte: new Date(),
      },
    },
    select: {
      slug: true,
    },
    take: 1000,
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category_id, post.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

  const blogPostSchema = generateBlogPostSchema(post, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
    {
      name: post.category?.name || "Uncategorized",
      url: `${baseUrl}/category/${post.category?.slug}`,
    },
    { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
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
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}
