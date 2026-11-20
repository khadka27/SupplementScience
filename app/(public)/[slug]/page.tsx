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
  generateEditorialTeamSchema,
} from "@/lib/schema";
import { normalizeSlug } from "@/lib/utils";
import PaginationControls from "@/components/PaginationControls";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const PAGE_SIZE = 50;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getData(slug: string, page: number = 1) {
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

    const totalOtherPosts = await prisma.post.count({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
        NOT: mainArticle ? { id: mainArticle.id } : undefined,
      },
    });

    const totalPages = Math.max(1, Math.ceil(totalOtherPosts / PAGE_SIZE));
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const skip = (currentPage - 1) * PAGE_SIZE;

    const otherPosts = await prisma.post.findMany({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
        NOT: mainArticle ? { id: mainArticle.id } : undefined,
      },
      include: {
        author: { select: { name: true, slug: true, avatarUrl: true } },
        category: { select: { name: true, slug: true, isHub: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    });

    return {
      type: "category" as const,
      category,
      totalPosts: totalOtherPosts,
      totalPages,
      currentPage,
      pageSize: PAGE_SIZE,
      mainArticle: mainArticle
        ? {
            ...mainArticle,
            tags:
              mainArticle.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
          }
        : null,
      posts: (otherPosts || []).map((p: (typeof otherPosts)[0]) => ({
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

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug.includes(".")) return { title: "Not Found" };
  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getData(slug, page);

  if (!data) return { title: "Not Found" };

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

  if (data.type === "category") {
    const { category, currentPage } = data;
    const baseTitle = (category.metaTitle || category.name).replace(/\s*\|\s*SupplementDecoded$/i, "");
    const title = currentPage > 1 ? `${baseTitle} - Page ${currentPage}` : baseTitle;
    const ogTitle = currentPage > 1 ? `${category.metaTitle || category.name} - Page ${currentPage}` : (category.metaTitle || category.name);
    const ogDescription =
      category.metaDescription ||
      category.description ||
      `Browse articles in ${category.name}`;
    const canonicalUrl = currentPage > 1 ? `${baseUrl}/${category.slug}?page=${currentPage}` : `${baseUrl}/${category.slug}`;
    const imageUrl = category.imageUrl
      ? (category.imageUrl.startsWith("http://") || category.imageUrl.startsWith("https://")
          ? category.imageUrl
          : `${baseUrl}${category.imageUrl.startsWith("/") ? "" : "/"}${category.imageUrl}`)
      : `${baseUrl}/og-default.jpg`;

    return {
      title,
      description: ogDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: "SupplementDecoded",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: category.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [imageUrl],
      },
    };
  } else {
    const { post } = data;
    const title = (post.metaTitle || post.title).replace(/\s*\|\s*SupplementDecoded$/i, "");
    const ogTitle = post.metaTitle || post.title;
    const ogDescription = post.metaDescription || post.excerpt || "";
    const canonicalUrl = `${baseUrl}/${post.slug}`;
    const imageUrl = post.featuredImageUrl
      ? (post.featuredImageUrl.startsWith("http://") || post.featuredImageUrl.startsWith("https://")
          ? post.featuredImageUrl
          : `${baseUrl}${post.featuredImageUrl.startsWith("/") ? "" : "/"}${post.featuredImageUrl}`)
      : `${baseUrl}/og-default.jpg`;

    return {
      title,
      description: ogDescription,
      keywords: post.tags?.map((t: any) => t.name) || [],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: "SupplementDecoded",
        locale: "en_US",
        type: "article",
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        authors: post.author?.name ? [post.author.name] : undefined,
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
        title: ogTitle,
        description: ogDescription,
        images: [imageUrl],
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isHub: true },
      select: { slug: true },
    });
    const rootPosts = await prisma.post.findMany({
      where: {
        isFeatured: true,
        categoryId: null,
      },
      select: { slug: true },
    });

    const allSlugs = [
      ...categories.map((c: { slug: string }) => ({ slug: c.slug })),
      ...rootPosts.map((p: { slug: string }) => ({ slug: p.slug })),
    ];

    return allSlugs;
  } catch {
    return [];
  }
}

export default async function GenericSlugPage({ params, searchParams }: Props) {
  const rawSlug = (await params).slug;

  // Requests containing dots (e.g. non-existent static files) should 404 directly, not redirect
  if (rawSlug.includes(".")) {
    notFound();
  }

  const slug = normalizeSlug(rawSlug);

  // Redirect broken space-encoded URLs to clean canonical form
  if (rawSlug !== slug) {
    redirect(`/${slug}`);
  }

  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const requestedPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getData(slug, requestedPage);

  if (!data) notFound();

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

  if (data.type === "post") {
    const { post } = data;
    const editorialTeamSchema = generateEditorialTeamSchema(baseUrl);
    const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
    const categoryUrl = post.category
      ? (post.category.isHub
          ? `${baseUrl}/${post.category.slug}`
          : `${baseUrl}/category/${post.category.slug}`)
      : undefined;
    const breadcrumbSchema = generateBreadcrumbSchema(
      [
        { name: "Home", url: `${baseUrl}/` },
        ...(post.category
          ? [{ name: post.category.name, url: categoryUrl! }]
          : []),
        {
          name: post.title,
          url: categoryUrl
            ? `${categoryUrl}/${post.slug}`
            : `${baseUrl}/${post.slug}`,
        },
      ],
      baseUrl,
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(editorialTeamSchema),
          }}
        />
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
  const { category, mainArticle, posts, totalPosts, totalPages, currentPage, pageSize } = data;
  const editorialTeamSchema = generateEditorialTeamSchema(baseUrl);
  const mainArticleCategoryUrl = category.isHub
    ? `${baseUrl}/${category.slug}`
    : `${baseUrl}/category/${category.slug}`;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100">
      {/* If we have a main article, we render it using BlogPostContent but inside the category context */}
      {mainArticle ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(editorialTeamSchema),
            }}
          />
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
                generateBreadcrumbSchema(
                  [
                    { name: "Home", url: `${baseUrl}/` },
                    { name: category.name, url: mainArticleCategoryUrl },
                    {
                      name: mainArticle.title,
                      url: `${baseUrl}/${category.slug}/${mainArticle.slug}`,
                    },
                  ],
                  baseUrl,
                ),
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
            <div className="container mx-auto px-4 py-12 max-w-6xl border-t border-stone-200/90 dark:border-stone-800 mt-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  More {category.name} Articles
                </h2>
                {totalPosts > pageSize && (
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalPosts)} of {totalPosts}
                  </span>
                )}
              </div>
              <BlogList posts={posts as any} showFeatured={false} />
              {totalPages > 1 && (
                <div className="pt-8 mt-8 border-t border-stone-200/90 dark:border-stone-800">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/${category.slug}`}
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Default Category View without a main article */}
          <div className="relative bg-stone-100/80 dark:bg-[#0A0F14] pt-20 sm:pt-[84px] pb-16 px-4 border-b border-stone-200/90 dark:border-stone-800">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {category.imageUrl && (
                  <div className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-stone-200/90 dark:border-stone-800">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover"
                      priority
                      unoptimized={
                        category.imageUrl.startsWith("http") ||
                        category.imageUrl.startsWith("/images/")
                      }
                    />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  {totalPosts > 0 && (
                    <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                      {totalPosts} Professional Guides &amp; Articles
                      {totalPages > 1 && (
                        <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">
                          (Page {currentPage} of {totalPages})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  Articles in {category.name}
                </h2>
                {totalPosts > pageSize && (
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalPosts)} of {totalPosts}
                  </span>
                )}
              </div>
              <BlogList posts={posts as any} showFeatured={false} />
              {totalPages > 1 && (
                <div className="pt-8 mt-8 border-t border-stone-200/90 dark:border-stone-800">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/${category.slug}`}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
