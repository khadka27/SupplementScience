import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Supplement Ingredients | Complete Guide",
  description:
    "Explore comprehensive guides on supplement ingredients, their benefits, safety, and scientific research.",
  alternates: {
    canonical: "/ingredients",
  },
};

async function getIngredientPosts(): Promise<any[]> {
  // Fetch all ingredient posts
  // Adjust this query based on how you identify ingredient posts
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      // If you have a category for ingredients:
      // category: {
      //   slug: "ingredients"
      // }
    },
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
    orderBy: {
      publishedAt: "desc",
    },
    take: 100,
  });

  return (data || []).map((post) => ({
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));
}

export default async function IngredientsPage() {
  const posts = await getIngredientPosts();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Supplement Ingredients Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive, science-backed information about supplement
              ingredients, their benefits, safety profiles, and research
              findings.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
              <span className="font-semibold">{posts.length}</span>
              {posts.length === 1 ? "ingredient" : "ingredients"} covered
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Posts */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}

