import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Category, Post } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 43200;

type Props = {
  params: { slug: string };
};

async function getCategory(slug: string): Promise<any | null> {
  const data = await prisma.category.findFirst({
    where: {
      slug,
    },
  });

  return data;
}

async function getCategoryPosts(categoryId: string): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoryId,
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
    take: 50,
  });

  return (data || []).map((post) => ({
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";
  const url = `${baseUrl}/category/${category.slug}`;

  return {
    title: category.metaTitle || `${category.name} | Blog`,
    description:
      category.metaDescription ||
      category.description ||
      `Browse articles in ${category.name}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: category.metaTitle || category.name,
      description:
        category.metaDescription ||
        category.description ||
        `Browse articles in ${category.name}`,
      url: url,
      type: "website",
      images: category.imageUrl
        ? [
            {
              url: category.imageUrl,
              width: 1200,
              height: 630,
              alt: category.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle || category.name,
      description:
        category.metaDescription ||
        category.description ||
        `Browse articles in ${category.name}`,
    },
  };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
    take: 100,
  });

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

async function getAllCategories(): Promise<any[]> {
  const data = await prisma.category.findMany({
    where: {
      postCount: {
        gte: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return data || [];
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(category.id);
  const allCategories = await getAllCategories();

  return (
    <div className="min-h-screen">
      {/* Category Header with Image */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {category.imageUrl && (
              <div className="relative w-full md:w-64 h-48 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {category.description}
                </p>
              )}
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
                <span className="font-semibold">{posts.length}</span>
                {posts.length === 1 ? "article" : "articles"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <BlogList posts={posts} />
      </div>

      {/* All Categories Section */}
      {allCategories.length > 1 && (
        <div className="bg-muted/30 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">Browse All Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allCategories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Card
                    className={`group hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 h-full cursor-pointer ${
                      cat.id === category.id
                        ? "border-green-500 dark:border-green-600 bg-green-50/50 dark:bg-green-950/30"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      {cat.imageUrl && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-base mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cat.postCount}{" "}
                        {cat.postCount === 1 ? "article" : "articles"}
                      </p>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
