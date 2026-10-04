import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";
import { normalizeSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getData(slug: string) {
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
    take: 50,
  });

  return {
    category,
    posts: (posts || []).map((p: (typeof posts)[number]) => ({
      ...p,
      tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) return { title: "Category Not Found" };

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;

  return {
    title: `${data.category.metaTitle || data.category.name} | SupplementDecoded`,
    description:
      data.category.metaDescription || data.category.description || "",
    alternates: {
      canonical: `${baseUrl}/category/${slug}`,
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

export default async function CategoryPage({ params }: Props) {
  const rawSlug = (await params).slug;
  const slug = normalizeSlug(rawSlug);

  if (rawSlug !== slug) {
    redirect(`/category/${slug}`);
  }

  const data = await getData(slug);

  if (!data) notFound();

  const { category, posts } = data;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          {category.imageUrl && (
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-xl">
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
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
              Category Archive
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-slate-900 dark:text-white">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-3">
                {category.description}
              </p>
            )}
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {data.category._count.posts} Professional Guides &amp; Articles
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-200/90 dark:border-stone-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Latest in {category.name}
            </h2>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Evidence-verified content
            </span>
          </div>
          <BlogList posts={posts as any} />
        </div>
      </div>
    </div>
  );
}
