import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { ClinicalIngredientDossier } from "@/components/redesign";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateEditorialTeamSchema,
} from "@/lib/schema";

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
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  if (
    decoded === "omega 3 fatty acids" ||
    decoded === "omega-3-fatty-acids" ||
    decoded.startsWith("omega 3")
  ) {
    redirect("/ingredients/omega-3");
  }

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
        title: "Ashwagandha: Human Evidence, Dosage & Safety Analysis",
        description:
          "Independent clinical dossier on Ashwagandha (Withania somnifera). Standardized dosages, drug interactions, and evidence evaluations.",
        alternates: { canonical: `${baseUrl}/ingredients/ashwagandha` },
        openGraph: {
          title: "Ashwagandha: Human Evidence, Dosage & Safety Analysis",
          description: "Independent clinical dossier on Ashwagandha (Withania somnifera).",
          images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630 }],
        },
      };
    }
    return { title: "Ingredient Monograph" };
  }

  const title = (post.metaTitle || `${post.title}: Human Evidence & Dosage`).replace(
    /\s*\|\s*SupplementDecoded$/i,
    ""
  );
  const description = post.metaDescription || post.excerpt || "";
  const imageUrl = post.featuredImageUrl
    ? (post.featuredImageUrl.startsWith("http") ? post.featuredImageUrl : `${baseUrl}${post.featuredImageUrl.startsWith("/") ? "" : "/"}${post.featuredImageUrl}`)
    : `${baseUrl}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/ingredients/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/ingredients/${post.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
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
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  if (
    decoded === "omega 3 fatty acids" ||
    decoded === "omega-3-fatty-acids" ||
    decoded.startsWith("omega 3")
  ) {
    redirect("/ingredients/omega-3");
  }

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
    const editorialTeamSchema = generateEditorialTeamSchema(baseUrl);
    const breadcrumbSchema = generateBreadcrumbSchema(
      [
        { name: "Home", url: `${baseUrl}/` },
        { name: "Ingredients", url: `${baseUrl}/ingredients` },
        { name: "Ashwagandha", url: `${baseUrl}/ingredients/ashwagandha` },
      ],
      baseUrl,
    );

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ClinicalIngredientDossier
          ingredientName="Ashwagandha"
          scientificName="Withania somnifera"
          category="Neuroendocrine & Adaptogens"
          evidenceGrade="A"
          humanRctCount={48}
          primaryProvenOutcome="Serum Cortisol & Anxiety Reduction"
          standardTherapeuticDose="300 - 600 mg/day (KSM-66 / Sensoril)"
          reviewerName="SupplementDecoded Research Editorial Team"
          reviewerCredentials=""
        />
      </>
    );
  }

  if (!post) notFound();

  const editorialTeamSchema = generateEditorialTeamSchema(baseUrl);
  const blogPostSchema = generateBlogPostSchema(post as any, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", url: `${baseUrl}/` },
      { name: "Ingredients", url: `${baseUrl}/ingredients` },
      { name: post.title, url: `${baseUrl}/ingredients/${post.slug}` },
    ],
    baseUrl,
  );

  const enrichedPost = {
    ...post,
    factCheckedBy: post.factCheckedBy || "SupplementDecoded Research Editorial Team",
    reviewedBy: post.reviewedBy || "SupplementDecoded Research Editorial Team",
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
        post={enrichedPost as any}
        relatedPosts={[]}
        prevPost={null}
        nextPost={null}
      />
    </>
  );
}
