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
    },
    orderBy: {
      name: "asc",
    },
  });

  const hubCategories = await prisma.category.findMany({
    where: {
      isHub: true,
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
                <span>{category.postCount || 0}</span>
                <span>
                  {(category.postCount || 0) === 1 ? "Guide" : "Guides"}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
