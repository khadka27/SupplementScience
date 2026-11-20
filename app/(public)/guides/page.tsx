import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";
import PaginationControls from "@/components/PaginationControls";

export const dynamic = "force-dynamic";
export const revalidate = 21600;

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "Evidence-Based Supplement Guides",
  description:
    "Comprehensive, science-backed supplement guides. Learn safe dosages, dangerous interactions, and clinical efficacy verified by human trials.",
  alternates: {
    canonical: `${baseUrl}/guides`,
  },
};

const PAGE_SIZE = 50;

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GuidesPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const requestedPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const totalGuides = await prisma.post.count({
    where: {
      status: "PUBLISHED",
      postType: "guide",
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalGuides / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(requestedPage, totalPages));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      postType: "guide",
    },
    include: {
      author: {
        select: {
          name: true,
          slug: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    skip,
    take: PAGE_SIZE,
  });

  const formattedPosts = (posts || []).map((p: (typeof posts)[number]) => ({
    ...p,
    tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-4">
            Evidence-Based Compilations
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Comprehensive Guides
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Explore our expert-verified library of comprehensive guides, clinical breakdown protocols, and supplement research.
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-stone-200/90 dark:border-stone-800 pb-4 gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Latest Guides
            </h2>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Showing {totalGuides === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalGuides)} of {totalGuides} guides
            </span>
          </div>

          <BlogList posts={formattedPosts as any} showFeatured={false} />

          {totalPages > 1 && (
            <div className="pt-8 border-t border-stone-200/90 dark:border-stone-800">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/guides"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
