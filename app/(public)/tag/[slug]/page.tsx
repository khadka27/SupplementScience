import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Tag, Post } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";

export const dynamic = "force-static";
export const revalidate = 43200;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getTag(slug: string): Promise<any | null> {
  const data = await prisma.tag.findUnique({
    where: {
      slug,
    },
  });

  return data;
}

async function getTagPosts(tagId: string): Promise<any[]> {
  const data = await prisma.postTag.findMany({
    where: {
      tagId,
      post: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
    },
    include: {
      post: {
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
      },
    },
    orderBy: {
      post: {
        publishedAt: "desc",
      },
    },
    take: 50,
  });

  return data
    .map((item: any) => item.post)
    .filter(Boolean)
    .map((post: any) => ({
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";
  const url = `${baseUrl}/tag/${tag.slug}`;

  if (tag.postCount < 3) {
    return {
      title: tag.name,
      description: tag.description || `Articles tagged with ${tag.name}`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: `${tag.name} | Blog`,
    description: tag.description || `Browse articles tagged with ${tag.name}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tag.name,
      description: tag.description || `Browse articles tagged with ${tag.name}`,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tag.name,
      description: tag.description || `Browse articles tagged with ${tag.name}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        postCount: {
          gte: 3,
        },
      },
      select: {
        slug: true,
      },
      take: 200,
    });

    return tags.map((tag: (typeof tags)[number]) => ({
      slug: tag.slug,
    }));
  } catch {
    return [];
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = await getTag(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getTagPosts(tag.id);

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-sm text-black">
          {tag.name}
        </h1>
        {tag.description && (
          <p className="text-xl text-gray-800 max-w-3xl leading-relaxed">
            {tag.description}
          </p>
        )}
      </div>
      <div className="space-y-8 mt-12 pt-8 border-t border-[#D9CFC7]">
        <div className="flex items-center justify-between mb-8 pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
            <span className="w-8 h-1 bg-[#D9CFC7] rounded-full" />
            Latest guides for {tag.name}
          </h2>
          <span className="text-sm text-gray-500 italic hidden sm:block">
            Evidence-verified content
          </span>
        </div>
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
