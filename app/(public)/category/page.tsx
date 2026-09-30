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
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl min-h-[60vh]">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-black">
          Content Categories
        </h1>
        <p className="text-xl text-gray-800 max-w-3xl leading-relaxed">
          Explore our expert-verified library of supplement guides, ingredient
          analyses, and wellness research organized by topic.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {regularCategories.length === 0 && hubCategories.length === 0 ? (
          <p className="text-gray-500 italic">No categories found.</p>
        ) : (
          [...hubCategories, ...regularCategories].map((category) => (
            <a
              key={category.id}
              href={
                category.isHub
                  ? `/${category.slug}`
                  : `/category/${category.slug}`
              }
              className="group block p-8 rounded-[2rem] bg-white/70 backdrop-blur-sm border border-[#D9CFC7] hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-3 text-black">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="inline-flex flex-wrap items-center gap-2 bg-[#EFE9E3] text-black px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-black group-hover:text-white transition-colors">
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
  );
}
