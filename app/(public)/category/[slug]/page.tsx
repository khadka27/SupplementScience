import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";

export const dynamic = "force-static";
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
    posts: (posts || []).map((p) => ({
      ...p,
      tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.category.metaTitle || data.category.name} | Supplement Science`,
    description:
      data.category.metaDescription || data.category.description || "",
  };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isHub: false },
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) notFound();

  const { category, posts } = data;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
        {category.imageUrl && (
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border-4 border-white shadow-xl">
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
          <div className="mt-4 text-sm font-medium text-primary">
            {posts.length} Professional Guides & Articles
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-4">
          Latest in {category.name}
        </h2>
        <BlogList posts={posts as any} />
      </div>
    </div>
  );
}
