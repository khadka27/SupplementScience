import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { ClinicalIngredientDossier } from "@/components/redesign";
import { generateBlogPostSchema, generateBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 10;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getData(slug: string) {
  try {
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
      // Gracefully check for legacy blog post with same slug
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
  } catch (error) {
    console.error("Error fetching ingredient post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData(slug);

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL &&
      process.env.NEXT_PUBLIC_BASE_URL.replace(
        /^https?:\/\/supplementdecoded\.com/i,
        "https://www.supplementdecoded.com"
      )) ||
      "https://www.supplementdecoded.com") as string);

  if (!post) {
    if (slug === "ashwagandha") {
      return {
        title: "Ashwagandha: Human Evidence, Dosage & Safety Analysis | Supplement Decoded",
        description:
          "Independent clinical dossier on Ashwagandha (Withania somnifera). 48 human RCTs analyzed, standardized dosages (300-600mg), drug interactions, and lab-tested brands.",
        alternates: { canonical: `${baseUrl}/ingredients/ashwagandha` },
      };
    }
    return { title: "Ingredient Monograph | Supplement Decoded" };
  }

  return {
    title: post.metaTitle || `${post.title}: Human Evidence & Dosage | Supplement Decoded`,
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
    const paths = ingredients.map((i) => ({ slug: i.slug }));
    if (!paths.some((p) => p.slug === "ashwagandha")) {
      paths.push({ slug: "ashwagandha" });
    }
    return paths;
  } catch {
    return [{ slug: "ashwagandha" }];
  }
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params;
  const post = await getData(slug);

  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL &&
      process.env.NEXT_PUBLIC_BASE_URL.replace(
        /^https?:\/\/supplementdecoded\.com/i,
        "https://www.supplementdecoded.com"
      )) ||
      "https://www.supplementdecoded.com") as string);

  // If not found in DB but matches archetypal blueprint ingredient "ashwagandha"
  if (!post && slug === "ashwagandha") {
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Ingredients", url: "/ingredients" },
      { name: "Ashwagandha", url: `/ingredients/ashwagandha` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ClinicalIngredientDossier
          ingredientName="Ashwagandha"
          scientificName="Withania somnifera"
          category="Neuroendocrine & Adaptogens"
          evidenceGrade="A"
          humanRctCount={48}
          primaryProvenOutcome="Serum Cortisol & Anxiety Reduction (-27.9%)"
          standardTherapeuticDose="300 - 600 mg/day (KSM-66 / Sensoril)"
          reviewerName="SupplementDecoded Research Editorial Team"
          reviewerCredentials=""
        />
      </>
    );
  }

  if (!post) notFound();

  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Ingredients", url: "/ingredients" },
    { name: post.title, url: `/ingredients/${post.slug}` },
  ]);

  const enrichedPost = {
    ...post,
    factCheckedBy: post.factCheckedBy || "SupplementDecoded Research Editorial Team",
    reviewedBy: post.reviewedBy || "SupplementDecoded Research Editorial Team",
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
        post={enrichedPost as any}
        relatedPosts={[]}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
