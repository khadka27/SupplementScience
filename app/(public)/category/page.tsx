import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 21600;

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "Supplement Categories | SupplementDecoded",
  description:
    "Browse all supplement research categories — independent evidence-based analysis of ingredients, safety, and product claims organized by health topic.",
  alternates: {
    canonical: `${baseUrl}/category`,
  },
};

export default async function CategoriesPage() {
  const regularCategories = await prisma.category.findMany({
    where: {
      isHub: false,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { posts: { where: { status: "PUBLISHED" } } },
      },
    },
  });

  const hubCategories = await prisma.category.findMany({
    where: {
      isHub: true,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { posts: { where: { status: "PUBLISHED" } } },
      },
    },
  });


  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: { not: null },
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
          isHub: true,
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
    take: 50,
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
            Curated Archives
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Content Categories
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Explore our expert-verified library of supplement guides, ingredient analyses, and wellness research organized by clinical category.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {regularCategories.length === 0 && hubCategories.length === 0 ? (
            <p className="text-slate-500 italic">No categories found.</p>
          ) : (
            [...hubCategories, ...regularCategories].map((category) => (
              <a
                key={category.id}
                href={
                  category.isHub
                    ? `/${category.slug}`
                    : `/category/${category.slug}`
                }
                className="group block p-7 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500/80 hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-300"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-2.5 text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-2 leading-relaxed text-sm sm:text-base">
                    {category.description}
                  </p>
                )}
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <span>{category._count.posts}</span>
                  <span>
                    {category._count.posts === 1 ? "Guide" : "Guides"}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
