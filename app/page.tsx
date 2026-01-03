import Link from "next/link";
import prisma from "@/lib/prisma";
import { Post, Category } from "@/lib/supabase"; // Using types for compatibility
import BlogList from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 43200;

async function getFeaturedPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "published",
      isFeatured: true,
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: { name: true, slug: true, avatarUrl: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  return data || [];
}

async function getRecentPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "published",
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: { name: true, slug: true, avatarUrl: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  return data || [];
}

async function getCategories(): Promise<any[]> {
  const data = await prisma.category.findMany({
    where: {
      postCount: {
        gte: 1,
      },
    },
    orderBy: {
      postCount: "desc",
    },
    take: 6,
  });

  return data || [];
}

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();
  const recentPosts = await getRecentPosts();
  const categories = await getCategories();

  const postsToShow = featuredPosts.length > 0 ? featuredPosts : recentPosts;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Evidence-Based Health Information
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover expert articles about supplements, nutrition, and wellness
            backed by scientific research.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog">
              <Button size="lg">
                Browse Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {category.post_count}{" "}
                        {category.post_count === 1 ? "article" : "articles"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {postsToShow.length > 0 && (
        <section className="py-16">
          <BlogList
            posts={postsToShow}
            title={
              featuredPosts.length > 0 ? "Featured Articles" : "Latest Articles"
            }
          />
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {postsToShow.length === 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Blog</h2>
            <p className="text-muted-foreground mb-6">
              Your blog is ready! Add your first post to get started.
            </p>
            <p className="text-sm text-muted-foreground">
              Check out the QUICK_START.md file for instructions on adding
              content.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
