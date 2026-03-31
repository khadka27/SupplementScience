import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getData(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      postType: "guide",
    },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData(slug);

  if (!post) return { title: "Guide Not Found" };

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;

  return {
    title: post.metaTitle || `${post.title} | SupplementDecoded`,
    description: post.metaDescription || post.excerpt || "",
    alternates: { canonical: `${baseUrl}/guides/${post.slug}` },
  };
}

export async function generateStaticParams() {
  try {
    const guides = await prisma.post.findMany({
      where: { postType: "guide", status: "PUBLISHED" },
      select: { slug: true },
    });

    return guides.map((guide: { slug: string }) => ({ slug: guide.slug }));
  } catch {
    return [];
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const post = await getData(slug);

  if (!post) notFound();

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    )) ||
    "https://www.supplementdecoded.com") as string;

  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Guides", url: "/guides" },
    { name: post.title, url: `/guides/${post.slug}` },
  ]);

  const formattedPost = {
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BlogPostContent
        post={formattedPost as any}
        relatedPosts={[]}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
