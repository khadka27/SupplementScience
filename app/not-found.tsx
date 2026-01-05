import prisma from "@/lib/prisma";
import { Post, Category } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getPopularPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImageUrl: true,
      readTimeMinutes: true,
    },
    orderBy: {
      viewCount: "desc",
    },
    take: 3,
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
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      postCount: "desc",
    },
    take: 6,
  });

  return data || [];
}

export default async function NotFound() {
  const popularPosts = await getPopularPosts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularPosts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Popular Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  {post.featuredImageUrl && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {post.readTimeMinutes} min read
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
