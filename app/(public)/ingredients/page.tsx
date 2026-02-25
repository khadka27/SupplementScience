import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 10;

export const metadata: Metadata = {
  title: "Ingredients | Supplement Science",
  description: "Browse all our supplement ingredients and expert guides.",
};

export default async function IngredientsPage() {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: {
          post: {
            postType: "ingredient",
            status: "PUBLISHED",
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      postType: "ingredient",
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
    take: 50,
  });

  const formattedPosts = (posts || []).map((p) => ({
    ...p,
    tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-primary">
          Supplement Ingredients
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Explore our expert-verified library of supplement ingredients,
          analyses, and wellness research.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-1 space-y-12">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4b5563] mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-[#D9CFC7]"></span>
              All Ingredients
            </h2>
            <div className="flex flex-col gap-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 italic px-2 py-4">
                  No ingredients found.
                </p>
              ) : (
                tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-4 py-3 rounded-lg hover:bg-[#EFE9E3] transition-colors text-sm font-medium text-black flex items-center justify-between border border-transparent hover:border-[#D9CFC7]"
                  >
                    {tag.name}
                    {tag.postCount > 0 && (
                      <span className="text-[10px] text-gray-500 font-normal">
                        {tag.postCount}
                      </span>
                    )}
                  </a>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8 border-b border-[#EFE9E3] pb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Latest ingredient analyses
            </h2>
            <span className="text-sm text-gray-500 italic">
              Evidence-verified content
            </span>
          </div>
          <BlogList posts={formattedPosts as any} />
        </div>
      </div>
    </div>
  );
}
