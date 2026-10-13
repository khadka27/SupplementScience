import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateReadTime } from "@/lib/content-processor";

export class PostNotFoundError extends Error {
  code = "NOT_FOUND";
  constructor(message: string = "Post not found") {
    super(message);
    this.name = "PostNotFoundError";
  }
}

export class PostConflictError extends Error {
  code = "CONFLICT";
  constructor(message: string = "Post already exists") {
    super(message);
    this.name = "PostConflictError";
  }
}

/**
 * Recalculate and persist the published post count for a category.
 */
export async function syncCategoryPostCount(
  categoryId: string | null | undefined,
): Promise<void> {
  if (!categoryId) return;
  try {
    const count = await prisma.post.count({
      where: { categoryId, status: "PUBLISHED" },
    });
    await prisma.category.update({
      where: { id: categoryId },
      data: { postCount: count },
    });
  } catch (err) {
    console.error("Failed to sync category post count:", err);
  }
}

/**
 * Finds a post by ID or slug.
 */
export async function findPostByIdOrSlug(
  identifier: string,
  options?: { includeRelations?: boolean },
) {
  if (!identifier || typeof identifier !== "string") return null;

  const include = options?.includeRelations
    ? {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      }
    : undefined;

  // Try finding by ID first
  const postById = await prisma.post.findUnique({
    where: { id: identifier },
    include,
  });
  if (postById) return postById;

  // Fallback to finding by slug
  const postBySlug = await prisma.post.findUnique({
    where: { slug: identifier },
    include,
  });
  return postBySlug;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: string;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  cardImageUrl?: string | null;
  status?: string; // "PUBLISHED" | "DRAFT"
  publishedAt?: Date | string | null;
  readTimeMinutes?: number;
  postType?: string;
  factCheckedBy?: string | null;
  reviewedBy?: string | null;
  isFeatured?: boolean;
  authorId?: string | null;
  customAuthor?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  sources?: any;
  faqs?: any;
  references?: any;
}

/**
 * Updates a post record by its ID or slug.
 */
export async function updatePostRecord(
  identifier: string,
  input: UpdatePostInput,
) {
  const currentPost = await findPostByIdOrSlug(identifier);
  if (!currentPost) {
    throw new PostNotFoundError(
      `Post not found with identifier '${identifier}'`,
    );
  }

  // Check if slug is changing and conflicts with another post
  if (input.slug && input.slug !== currentPost.slug) {
    const existingWithSlug = await prisma.post.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });
    if (existingWithSlug && existingWithSlug.id !== currentPost.id) {
      throw new PostConflictError(
        "Slug already exists. Please choose a different unique slug.",
      );
    }
  }

  const isNowPublished = input.status?.toUpperCase() === "PUBLISHED";
  const wasPublished = currentPost.status === "PUBLISHED";

  let publishedAtData = currentPost.publishedAt;
  if (input.status !== undefined) {
    if (isNowPublished && !wasPublished) {
      publishedAtData = input.publishedAt
        ? new Date(input.publishedAt)
        : new Date();
    } else if (!isNowPublished) {
      publishedAtData = null;
    }
  }

  const defaultReviewer = "SupplementDecoded Research Editorial Team";
  const finalFactCheckedBy =
    input.factCheckedBy !== undefined
      ? input.factCheckedBy || defaultReviewer
      : currentPost.factCheckedBy || defaultReviewer;
  const finalReviewedBy =
    input.reviewedBy !== undefined
      ? input.reviewedBy || defaultReviewer
      : currentPost.reviewedBy || defaultReviewer;

  // Meta tags normalization
  let normalizedMetaTitle: string | undefined = undefined;
  if (input.metaTitle !== undefined) {
    normalizedMetaTitle =
      typeof input.metaTitle === "string" && input.metaTitle.trim().length > 0
        ? input.metaTitle.trim()
        : input.title || currentPost.title;
  }

  let normalizedMetaDescription: string | null | undefined = undefined;
  if (input.metaDescription !== undefined) {
    normalizedMetaDescription =
      typeof input.metaDescription === "string" &&
      input.metaDescription.trim().length > 0
        ? input.metaDescription.trim()
        : input.excerpt ||
          (input.content
            ? input.content.substring(0, 155).replaceAll(/<[^>]*>/g, "") + "..."
            : currentPost.metaDescription);
  }

  // Calculate read time
  let readTimeMinutes = input.readTimeMinutes;
  if (
    readTimeMinutes === undefined &&
    input.content !== undefined &&
    input.content !== currentPost.content
  ) {
    try {
      readTimeMinutes = calculateReadTime(input.content);
    } catch {
      readTimeMinutes = currentPost.readTimeMinutes;
    }
  }

  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt || null;
  if (input.content !== undefined) updateData.content = input.content;
  if (normalizedMetaTitle !== undefined)
    updateData.metaTitle = normalizedMetaTitle;
  if (normalizedMetaDescription !== undefined)
    updateData.metaDescription = normalizedMetaDescription;
  if (input.featuredImageUrl !== undefined)
    updateData.featuredImageUrl = input.featuredImageUrl || null;
  if (input.featuredImageAlt !== undefined)
    updateData.featuredImageAlt = input.featuredImageAlt || null;
  if (input.cardImageUrl !== undefined)
    updateData.cardImageUrl = input.cardImageUrl || null;
  if (input.status !== undefined) {
    updateData.status = input.status.toUpperCase();
    updateData.publishedAt = publishedAtData;
  }
  if (readTimeMinutes !== undefined)
    updateData.readTimeMinutes = readTimeMinutes;
  if (input.postType !== undefined) updateData.postType = input.postType;
  if (finalFactCheckedBy !== undefined)
    updateData.factCheckedBy = finalFactCheckedBy;
  if (finalReviewedBy !== undefined)
    updateData.reviewedBy = finalReviewedBy;
  if (input.isFeatured !== undefined)
    updateData.isFeatured = Boolean(input.isFeatured);
  if (input.customAuthor !== undefined)
    updateData.customAuthor = input.customAuthor;
  if (input.sources !== undefined) updateData.sources = input.sources;
  if (input.faqs !== undefined) updateData.faqs = input.faqs;
  if (input.references !== undefined) updateData.references = input.references;

  if (input.authorId !== undefined) {
    if (input.authorId) {
      updateData.author = { connect: { id: input.authorId } };
    } else {
      updateData.author = { disconnect: true };
    }
  }

  if (input.categoryId !== undefined) {
    if (input.categoryId) {
      updateData.category = { connect: { id: input.categoryId } };
    } else {
      updateData.category = { disconnect: true };
    }
  }

  if (input.tagIds !== undefined && Array.isArray(input.tagIds)) {
    updateData.tags = {
      deleteMany: {},
      create: input.tagIds.map((tagId: string) => ({
        tag: {
          connect: { id: tagId },
        },
      })),
    };
  }

  const updatedPost = await prisma.post.update({
    where: { id: currentPost.id },
    data: updateData,
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

  // Keep postCount in sync:
  const oldCategoryId = currentPost.categoryId;
  const newCategoryId =
    input.categoryId !== undefined ? input.categoryId : oldCategoryId;
  const categoryChanged = oldCategoryId !== newCategoryId;

  if (categoryChanged) {
    await Promise.all([
      syncCategoryPostCount(oldCategoryId),
      syncCategoryPostCount(newCategoryId),
    ]);
  } else if (input.status !== undefined && isNowPublished !== wasPublished) {
    await syncCategoryPostCount(newCategoryId);
  }

  revalidatePath("/sitemap.xml");
  revalidatePath("/category");
  if (currentPost.slug) {
    revalidatePath(`/blog/${currentPost.slug}`);
  }
  if (updatedPost.slug && updatedPost.slug !== currentPost.slug) {
    revalidatePath(`/blog/${updatedPost.slug}`);
  }

  return updatedPost;
}

/**
 * Deletes a post record by its ID or slug.
 */
export async function deletePostRecord(identifier: string) {
  const currentPost = await findPostByIdOrSlug(identifier);
  if (!currentPost) {
    throw new PostNotFoundError(
      `Post not found with identifier '${identifier}'`,
    );
  }

  await prisma.post.delete({
    where: { id: currentPost.id },
  });

  if (currentPost.categoryId) {
    await syncCategoryPostCount(currentPost.categoryId);
  }

  revalidatePath("/sitemap.xml");
  revalidatePath("/category");
  if (currentPost.slug) {
    revalidatePath(`/blog/${currentPost.slug}`);
  }

  return { success: true, id: currentPost.id, slug: currentPost.slug };
}
