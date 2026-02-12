import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Post } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";

export const dynamic = "force-static";
export const revalidate = 43200;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Blog | SupplementDecoded",
  description:
    "Discover expert articles, guides, and insights about supplements and health.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "Blog | SupplementDecoded",
    description:
      "Discover expert articles, guides, and insights about supplements and health.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | SupplementDecoded",
    description:
      "Discover expert articles, guides, and insights about supplements and health.",
  },
};

async function getPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
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

export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogList posts={posts} title="Latest Articles" />;
}
