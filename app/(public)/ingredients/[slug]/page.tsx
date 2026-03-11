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
  const post = await prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      postType: "ingredient",
    },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    // If we didn't find strictly as ingredient, but we want to fail gracefully during migration
    const legacyPost = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });
    if (legacyPost) return legacyPost;
    return null;
  }
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData(slug);

  if (!post) return { title: "Ingredient Not Found" };

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

  return {
    title: post.metaTitle || `${post.title} | Supplement Science`,
    description: post.metaDescription || post.excerpt || "",
    alternates: { canonical: `${baseUrl}/ingredients/${post.slug}` },
  };
}

export async function generateStaticParams() {
  try {
    const ingredients = await prisma.post.findMany({
      where: { postType: "ingredient", status: "PUBLISHED" },
      select: { slug: true },
    });
    return ingredients.map((i: (typeof ingredients)[number]) => ({
      slug: i.slug,
    }));
  } catch {
    return [];
  }
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params;
  const post = await getData(slug);

  if (!post) notFound();

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Ingredients", url: "/ingredients" },
    { name: post.title, url: `/ingredients/${post.slug}` },
  ]);

  // format tags
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
