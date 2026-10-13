import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authenticateApiRequest } from "@/lib/api-auth";
import { updatePostRecord, syncCategoryPostCount } from "@/lib/post-service";

export async function GET(req: Request) {
  try {
    const authResult = await authenticateApiRequest(req);
    const isAuthenticated = authResult.authenticated;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const postType = searchParams.get("postType");

    // Unauthenticated callers cannot query drafts or request all statuses.
    if (!isAuthenticated && status && status.toUpperCase() !== "PUBLISHED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};

    if (!isAuthenticated) {
      where.status = "PUBLISHED";
    } else if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (postType) {
      where.postType = postType;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            bio: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_GET] Error:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      metaTitle,
      metaDescription,
      content,
      featuredImageUrl,
      featuredImageAlt,
      cardImageUrl,
      authorId,
      factCheckedBy,
      reviewedBy,
      categoryId,
      tagIds,
      status,
      readTimeMinutes,
      postType,
    } = body;

    console.log("Received post data:", { title, slug, status, tagIds });

    // Basic validation
    if (!title || !slug || !content) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields: title, slug, or content",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return new NextResponse(
        JSON.stringify({
          error: "Slug already exists. Please use a different slug.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create the post
    const normalizedMetaTitle =
      typeof metaTitle === "string" && metaTitle.trim().length > 0
        ? metaTitle.trim()
        : title;
    const normalizedMetaDescription =
      typeof metaDescription === "string" && metaDescription.trim().length > 0
        ? metaDescription.trim()
        : excerpt ||
          content.substring(0, 155).replaceAll(/<[^>]*>/g, "") + "...";

    const authorName = authorId
      ? (
          await prisma.author.findUnique({
            where: { id: authorId },
            select: { name: true },
          })
        )?.name
      : null;

    const defaultReviewer = "SupplementDecoded Research Editorial Team";
    const finalFactCheckedBy = factCheckedBy || defaultReviewer;
    const finalReviewedBy = reviewedBy || defaultReviewer;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        metaTitle: normalizedMetaTitle,
        metaDescription: normalizedMetaDescription,
        featuredImageUrl: featuredImageUrl || null,
        featuredImageAlt: featuredImageAlt || null,
        cardImageUrl: cardImageUrl || null,
        status: status?.toUpperCase() || "DRAFT",
        publishedAt: status?.toLowerCase() === "published" ? new Date() : null,
        readTimeMinutes: readTimeMinutes || 5,
        postType: postType || "blog",
        factCheckedBy: finalFactCheckedBy,
        reviewedBy: finalReviewedBy,
        ...(authorId && {
          author: {
            connect: { id: authorId },
          },
        }),
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(tagIds &&
          Array.isArray(tagIds) &&
          tagIds.length > 0 && {
            tags: {
              create: tagIds.map((tagId: string) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            },
          }),
      },
      include: {
        tags: true,
      },
    });

    console.log("Post created successfully:", post.id);

    if (post.status === "PUBLISHED" && post.categoryId) {
      await syncCategoryPostCount(post.categoryId);
    }

    revalidatePath("/sitemap.xml");
    revalidatePath("/category");
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_POST] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(
      JSON.stringify({ error: "Internal Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * PUT /api/blog/posts
 * Update an existing post using Service Token or Admin Session.
 * Accepts 'id' or 'slug' in request body or URL search params (?id= or ?slug=).
 */
export async function PUT(req: Request) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { searchParams } = new URL(req.url);

    // Identify post to update
    const identifier =
      body.id ||
      searchParams.get("id") ||
      body.currentSlug ||
      body.slug ||
      searchParams.get("slug");

    if (!identifier) {
      return NextResponse.json(
        {
          error:
            "Missing post identifier. Please provide 'id' or 'slug' in request body or URL query parameter.",
        },
        { status: 400 },
      );
    }

    const updatedPost = await updatePostRecord(identifier, body);
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    if (error?.code === "NOT_FOUND") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error?.code === "CONFLICT") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[POSTS_PUT] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update post",
        details: error?.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/blog/posts
 * Partial update for an existing post using Service Token or Admin Session.
 */
export async function PATCH(req: Request) {
  return PUT(req);
}
