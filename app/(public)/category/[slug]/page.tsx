import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";
import { normalizeSlug } from "@/lib/utils";
import { generateBreadcrumbSchema } from "@/lib/schema";
import PaginationControls from "@/components/PaginationControls";

export const dynamic = "force-dynamic";
export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const PAGE_SIZE = 50;

async function getData(slug: string, page: number = 1) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: { where: { status: "PUBLISHED" } } },
      },
    },
  });

  if (!category || category.isHub) {
    return null;
  }

  const totalPosts = category._count.posts;
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const posts = await prisma.post.findMany({
    where: {
      categoryId: category.id,
      status: "PUBLISHED",
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
    category,
    totalPosts,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE,
    posts: (posts || []).map((p: (typeof posts)[number]) => ({
      ...p,
      tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    })),
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getData(slug, page);

  if (!data) return { title: "Category Not Found" };

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;

  const baseTitle = (data.category.metaTitle || data.category.name).replace(/\s*\|\s*SupplementDecoded$/i, "");
  const title = page > 1 ? `${baseTitle} - Page ${page}` : baseTitle;
  const ogTitle = page > 1 ? `${data.category.metaTitle || data.category.name} - Page ${page}` : (data.category.metaTitle || data.category.name);
  const ogDescription = data.category.metaDescription || data.category.description || "";
  const canonicalUrl = page > 1 ? `${baseUrl}/category/${slug}?page=${page}` : `${baseUrl}/category/${slug}`;
  const imageUrl = data.category.imageUrl
    ? (data.category.imageUrl.startsWith("http://") || data.category.imageUrl.startsWith("https://")
        ? data.category.imageUrl
        : `${baseUrl}${data.category.imageUrl.startsWith("/") ? "" : "/"}${data.category.imageUrl}`)
    : `${baseUrl}/og-default.jpg`;

  return {
    title,
    description: ogDescription,
    alternates: {
      canonical: canonicalUrl,
    },
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
          alt: data.category.name,
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

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isHub: false },
      select: { slug: true },
    });
    return categories.map((c: (typeof categories)[number]) => ({
      slug: c.slug,
    }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const rawSlug = (await params).slug;
  const slug = normalizeSlug(rawSlug);

  if (rawSlug !== slug) {
    redirect(`/category/${slug}`);
  }

  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const requestedPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getData(slug, requestedPage);

  if (!data) notFound();

  const { category, posts, totalPosts, totalPages, currentPage, pageSize } = data;
  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", url: `${baseUrl}/` },
      { name: category.name, url: `${baseUrl}/category/${category.slug}` },
    ],
    baseUrl,
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl">
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#0D1217] border border-slate-200/85 dark:border-slate-800/80 shadow-xs mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
            {category.imageUrl && (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-800 shadow-md">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized={
                    category.imageUrl.startsWith("http") ||
                    category.imageUrl.startsWith("/images/")
                  }
                />
              </div>
            )}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 mb-3">
                <span>Category Archive</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-4 font-normal">
                  {category.description}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                  {totalPosts} Monitored Products &amp; Guides
                </span>
                {totalPages > 1 && (
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
              Latest in {category.name}
            </h2>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing {totalPosts === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalPosts)} of {totalPosts} articles
            </span>
          </div>

          <BlogList posts={posts as any} showFeatured={false} />

          {totalPages > 1 && (
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/category/${category.slug}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
