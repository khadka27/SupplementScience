import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Category, Post } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/schema";

export const dynamic = "force-static";
export const revalidate = 21600;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getData(slug: string) {
  // Check if it's a category
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        take: 1,
      },
    },
  });

  if (category) {
    // If it's a regular category (not a hub), redirect to /category/[slug]
    if (!category.isHub) {
      redirect(`/category/${slug}`);
    }

    // Check if there's a main article with the same slug inside this category
    const mainArticle = await prisma.post.findFirst({
      where: {
        slug: slug,
        categoryId: category.id,
        status: "PUBLISHED",
      },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    const otherPosts = await prisma.post.findMany({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
        NOT: mainArticle ? { id: mainArticle.id } : undefined,
      },
      include: {
        author: { select: { name: true, slug: true, avatarUrl: true } },
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    return {
      type: "category" as const,
      category,
      mainArticle: mainArticle
        ? {
            ...mainArticle,
            tags:
              mainArticle.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
          }
        : null,
      posts: (otherPosts || []).map((p) => ({
        ...p,
        tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      })),
    };
  }

  // Check if it's a root-level post (e.g., Featured)
  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
      status: "PUBLISHED",
    },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (post) {
    const isHub = post.category?.isHub;
    const categorySlug = post.category?.slug;

    // Redirect if it belongs to a category
    if (categorySlug) {
      redirect(`/${categorySlug}/${slug}`);
    }

    return {
      type: "post" as const,
      post: {
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      },
    };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) return { title: "Not Found" };

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

  if (data.type === "category") {
    const { category } = data;
    return {
      title: category.metaTitle || `${category.name} | SupplementDecoded`,
      description:
        category.metaDescription ||
        category.description ||
        `Browse articles in ${category.name}`,
      alternates: { canonical: `${baseUrl}/${category.slug}` },
    };
  } else {
    const { post } = data;
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      keywords: post.tags?.map((t: any) => t.name) || [],
      alternates: { canonical: `${baseUrl}/${post.slug}` },
    };
  }
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isHub: true },
    select: { slug: true },
  });
  const rootPosts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      // Exclude ALL categorized posts from root generation, as they live at /[categorySlug]/[postSlug]
      categoryId: null,
    },
    select: { slug: true },
  });

  const allSlugs = [
    ...categories.map((c) => ({ slug: c.slug })),
    ...rootPosts.map((p) => ({ slug: p.slug })),
  ];

  return allSlugs;
}

export default async function GenericSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

  if (data.type === "post") {
    const { post } = data;
    const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      ...(post.category
        ? [{ name: post.category.name, url: `/${post.category.slug}` }]
        : []),
      { name: post.title, url: `/${post.slug}` },
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

  // Handle Category
  const { category, mainArticle, posts } = data;

  return (
    <div className="min-h-screen">
      {/* If we have a main article, we render it using BlogPostContent but inside the category context */}
      {mainArticle ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateBlogPostSchema(mainArticle as any, baseUrl),
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateBreadcrumbSchema([
                  { name: "Home", url: baseUrl },
                  { name: category.name, url: `/${category.slug}` },
                ]),
              ),
            }}
          />

          <BlogPostContent
            post={mainArticle as any}
            relatedPosts={posts as any}
            prevPost={null}
            nextPost={null}
          />

          {/* Related Articles in this category (if any left) */}
          {posts.length > 0 && (
            <div className="container mx-auto px-4 py-12 max-w-6xl border-t border-border mt-12">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#EFE9E3]0 rounded-full" />
                More {category.name} Articles
              </h2>
              <BlogList posts={posts as any} />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Default Category View without a main article */}
          <div className="relative bg-gradient-to-br from-[#F9F8F6] via-[#EFE9E3] to-[#D9CFC7]  py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {category.imageUrl && (
                  <div className="relative w-full md:w-64 h-48 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-lg text-muted-foreground max-w-3xl">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#EFE9E3]0 rounded-full" />
                Articles in {category.name}
              </h2>
              <BlogList posts={posts as any} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
