import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-static";
export const revalidate = 21600;

type Props = {
  params: Promise<{ slug: string; postSlug: string }>;
};

async function getData(categorySlug: string, postSlug: string) {
  // Find the category and verify it's a hub
  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
      isHub: true,
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

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";
  const { post } = data;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    keywords: post.tags?.map((t: any) => t.name) || [],
    alternates: { canonical: `${baseUrl}/${slug}/${post.slug}` },
  };
}

export async function generateStaticParams() {
  // Get all hub categories
  const hubCategories = await prisma.category.findMany({
    where: {
      isHub: true,
    },
    select: {
      slug: true,
      id: true,
    },
  });

  // For each hub category, get all published posts
  const params: Array<{ slug: string; postSlug: string }> = [];

  for (const category of hubCategories) {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: category.id,
      },
      select: { slug: true },
    });

    posts.forEach((post) => {
      params.push({
        slug: category.slug,
        postSlug: post.slug,
      });
    });
  }

  return params;
}

export default async function HubPostPage({ params }: Props) {
  const { slug, postSlug } = await params;
  const data = await getData(slug, postSlug);

  if (!data) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";
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
