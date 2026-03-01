import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 10;

export const metadata: Metadata = {
  title: "Guides | Supplement Science",
  description: "Browse our comprehensive guides and expert reviews.",
};

export default async function GuidesPage() {
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
    take: 50,
  });

  const formattedPosts = (posts || []).map((p: (typeof posts)[number]) => ({
    ...p,
    tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-primary">
          Comprehensive Guides
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Explore our expert-verified library of comprehensive guides and
          wellness research.
        </p>
      </div>

      <div className="mb-20">
        <div className="flex items-center justify-between mb-8 border-b border-[#EFE9E3] pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Latest Guides
          </h2>
          <span className="text-sm text-gray-500 italic">
            Evidence-verified content
          </span>
        </div>
        <BlogList posts={formattedPosts as any} />
      </div>
    </div>
  );
}
