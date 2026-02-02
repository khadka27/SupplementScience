import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-static";
export const revalidate = 43200;

type Props = {
  params: Promise<{ slug: string }>;
};

// Ingredients are stored as Posts with a special tag or category pattern
// For now, we'll search by slug pattern matching "ingredient-" prefix
// You may want to create a separate Ingredient model in the future
async function getIngredientPost(slug: string) {
  // Option 1: Search by slug pattern (if you use "ingredient-{slug}" format)
  // Option 2: Search by category slug "ingredients"
  // Option 3: Search by tag "ingredient"

  const data = await prisma.post.findFirst({
    where: {
      slug: slug, // or `ingredient-${slug}` if you use prefix
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
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!data) return null;

  return {
    ...data,
    metaTitle: data.metaTitle ?? undefined,
    metaDescription: data.metaDescription ?? undefined,
    excerpt: data.excerpt ?? undefined,
    featuredImageUrl: data.featuredImageUrl ?? undefined,
    featuredImageAlt: data.featuredImageAlt ?? undefined,
    publishedAt: data.publishedAt ?? undefined,
    tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  } as any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getIngredientPost(slug);

  if (!post) {
    return {
      title: "Ingredient Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";
  const url = `${baseUrl}/ingredients/${slug}`;
  const imageUrl = post.featuredImageUrl || `${baseUrl}/og-default.jpg`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      url: url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author.name] : [],
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
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  // Fetch all ingredient posts
  // Adjust this query based on how you identify ingredient posts
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      // If you have a category for ingredients:
      // category: {
      //   slug: "ingredients"
      // }
      // Or if you use a tag:
      // tags: {
      //   some: {
      //     tag: {
      //       slug: "ingredient"
      //     }
      //   }
      // }
    },
    select: {
      slug: true,
    },
    take: 1000,
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params;
  const post = await getIngredientPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

  const blogPostSchema = generateBlogPostSchema(post, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Ingredients", url: `${baseUrl}/ingredients` },
    { name: post.title, url: `${baseUrl}/ingredients/${slug}` },
  ]);

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
        post={post}
        relatedPosts={[]}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
