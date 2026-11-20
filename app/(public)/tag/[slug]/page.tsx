import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Tag, Post } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";
import PaginationControls from "@/components/PaginationControls";

export const dynamic = "force-dynamic";
export const revalidate = 43200;

const PAGE_SIZE = 50;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getTag(slug: string): Promise<any | null> {
  const data = await prisma.tag.findUnique({
    where: {
      slug,
    },
  });

  return data;
}

async function getTagPosts(tagId: string, page: number = 1) {
  const totalPosts = await prisma.postTag.count({
    where: {
      tagId,
      post: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const data = await prisma.postTag.findMany({
    where: {
      tagId,
      post: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
    },
    include: {
      post: {
        include: {
          author: {
            select: { name: true, slug: true, avatarUrl: true },
          },
          category: {
            select: { name: true, slug: true },
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true },
              },
            },
          },
        },
      },
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
    skip,
    take: PAGE_SIZE,
  });

  const posts = data
    .map((item: any) => item.post)
    .filter(Boolean)
    .map((post: any) => ({
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    }));

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE,
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);
  const url = page > 1 ? `${baseUrl}/tag/${tag.slug}?page=${page}` : `${baseUrl}/tag/${tag.slug}`;
  const title = page > 1 ? `${tag.name} (Page ${page}) | Blog` : `${tag.name} | Blog`;

  if (tag.postCount < 3) {
    return {
      title,
      description: tag.description || `Articles tagged with ${tag.name}`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title,
    description: tag.description || `Browse articles tagged with ${tag.name}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: tag.description || `Browse articles tagged with ${tag.name}`,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: tag.description || `Browse articles tagged with ${tag.name}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        postCount: {
          gte: 3,
        },
      },
      select: {
        slug: true,
      },
      take: 200,
    });

    return tags.map((tag: (typeof tags)[number]) => ({
      slug: tag.slug,
    }));
  } catch {
    return [];
  }
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    notFound();
  }

  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const requestedPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const { posts, totalPosts, totalPages, currentPage, pageSize } = await getTagPosts(tag.id, requestedPage);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
            Ingredient Monograph Archive
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            {tag.name}
          </h1>
          {tag.description && (
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {tag.description}
            </p>
          )}
          {totalPosts > 0 && (
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
              {totalPosts} Published {totalPosts === 1 ? "Guide" : "Guides"}
              {totalPages > 1 && (
                <span className="text-slate-500 dark:text-slate-400 font-normal ml-2">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="space-y-8 mt-12 pt-8 border-t border-stone-200/90 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-stone-200/90 dark:border-stone-800 gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Latest guides for {tag.name}
            </h2>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Showing {totalPosts === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalPosts)} of {totalPosts} guides
            </span>
          </div>
          <BlogList posts={posts} showFeatured={false} />

          {totalPages > 1 && (
            <div className="pt-8 border-t border-stone-200/90 dark:border-stone-800">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/tag/${tag.slug}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
