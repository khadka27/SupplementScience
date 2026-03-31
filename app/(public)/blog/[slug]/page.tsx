import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// Always run dynamically — this redirect page must query DB at request time
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Handles legacy /blog/[slug] URLs by redirecting to the correct
 * canonical URL: /[categorySlug]/[postSlug] or /[postSlug].
 */
export default async function BlogSlugRedirectPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug },
    select: {
      slug: true,
      postType: true,
      category: {
        select: { slug: true, isHub: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const categorySlug = post.category?.slug?.toLowerCase();

  if (post.postType === "guide") {
    redirect(`/guides/${post.slug}`);
  }

  if (categorySlug) {
    redirect(`/${categorySlug}/${post.slug}`);
  }

  redirect(`/${post.slug}`);
}
