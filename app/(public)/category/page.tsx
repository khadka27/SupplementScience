import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Categories | Supplement Science",
  description: "Browse all our supplement categories and expert guides.",
};

export default async function CategoriesPage() {
  const regularCategories = await prisma.category.findMany({
    where: {
      isHub: false,
      postCount: {
        gt: 0,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const hubCategories = await prisma.category.findMany({
    where: {
      isHub: true,
      postCount: {
        gt: 0,
      },
    },
    orderBy: {
      name: "asc",
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

  const formattedPosts = (posts || []).map((p) => ({
    ...p,
    tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Content Categories
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Explore our expert-verified library of supplement guides, ingredient
          analyses, and wellness research organized by topic.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-1 space-y-12">
          {hubCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-emerald-600"></span>
                Authority Hubs
              </h2>
              <div className="flex flex-col gap-3">
                {hubCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`/${category.slug}`}
                    className="p-4 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-100 transition-all group flex items-center justify-between"
                  >
                    <span className="font-semibold text-emerald-900">
                      {category.name}
                    </span>
                    <span className="text-xs bg-white/80 px-2 py-1 rounded-md text-emerald-700 shadow-sm leading-none font-medium">
                      {category.postCount}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-slate-400"></span>
              Topic Categories
            </h2>
            <div className="flex flex-col gap-2">
              {regularCategories.map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 flex items-center justify-between border border-transparent hover:border-slate-100"
                >
                  {category.name}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {category.postCount}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Latest categorized articles
            </h2>
            <span className="text-sm text-muted-foreground italic">
              Evidence-verified content
            </span>
          </div>
          <BlogList posts={formattedPosts as any} />
        </div>
      </div>
    </div>
  );
}
