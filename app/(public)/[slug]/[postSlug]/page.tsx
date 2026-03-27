import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string; postSlug: string }>;
};

// Helper function to safely parse JSON fields
function parseJsonField(field: any): any {
  if (!field) return [];
  return typeof field === "string" ? JSON.parse(field) : field;
}

async function getData(categorySlug: string, postSlug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
  });

  if (!category) {
    return null;
  }

  // Find the post within this hub category
  const post = await prisma.post.findFirst({
    where: {
      slug: postSlug,
      status: "PUBLISHED",
      categoryId: category.id,
    },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (post) {
    return {
      category,
      post: {
        ...post,
        // Parse JSON fields properly
        sources: parseJsonField(post.sources),
        faqs: parseJsonField(post.faqs),
        references: parseJsonField(post.references),
        // Extract tags
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      },
    };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const data = await getData(slug, postSlug);

  if (!data) return { title: "Not Found" };

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;
  const { post } = data;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    keywords: post.tags?.map((t: any) => t.name) || [],
    alternates: { canonical: `${baseUrl}/${slug}/${post.slug}` },
  };
}

export async function generateStaticParams() {
  try {
    // Get all categories that have posts
    const categories = await prisma.category.findMany({
      where: {
        postCount: {
          gt: 0,
        },
      },
      select: {
        slug: true,
        id: true,
      },
    });

    // For each hub category, get all published posts
    const params: Array<{ slug: string; postSlug: string }> = [];

    for (const category of categories) {
      const posts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          categoryId: category.id,
        },
        select: { slug: true },
      });

      posts.forEach((post: { slug: string }) => {
        params.push({
          slug: category.slug,
          postSlug: post.slug,
        });
      });
    }

    return params;
  } catch {
    return [];
  }
}

export default async function CategorizedPostPage({ params }: Props) {
  const { slug, postSlug } = await params;
  const data = await getData(slug, postSlug);

  if (!data) notFound();

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;
  const { category, post } = data;

  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: category.name, url: `/${slug}` },
    { name: post.title, url: `/${slug}/${postSlug}` },
  ]);

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
      <BlogPostContent
        post={post as any}
        relatedPosts={[]}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
