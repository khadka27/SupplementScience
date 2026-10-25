import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateEditorialTeamSchema,
} from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  ) || "https://www.supplementdecoded.com";

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

  const title = (post.metaTitle || post.title).replace(/\s*\|\s*SupplementDecoded$/i, "");
  const ogTitle = post.metaTitle || post.title;
  const ogDescription = post.metaDescription || post.excerpt || "";
  const canonicalUrl = `${baseUrl}/guides/${post.slug}`;
  const imageUrl = post.featuredImageUrl
    ? (post.featuredImageUrl.startsWith("http://") || post.featuredImageUrl.startsWith("https://")
        ? post.featuredImageUrl
        : `${baseUrl}${post.featuredImageUrl.startsWith("/") ? "" : "/"}${post.featuredImageUrl}`)
    : `${baseUrl}/og-default.jpg`;

  return {
    title,
    description: ogDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "SupplementDecoded",
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [imageUrl],
    },
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

  const editorialTeamSchema = generateEditorialTeamSchema(baseUrl);
  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", url: `${baseUrl}/` },
      { name: "Guides", url: `${baseUrl}/guides` },
      { name: post.title, url: `${baseUrl}/guides/${post.slug}` },
    ],
    baseUrl,
  );

  const formattedPost = {
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(editorialTeamSchema),
        }}
      />
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
