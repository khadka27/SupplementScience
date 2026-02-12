import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
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
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImageUrl,
      authorId,
      categoryId,
      tagIds,
      status,
      readTimeMinutes,
    } = body;

    console.log("Received post data:", { title, slug, status, tagIds });

    // Basic validation
    if (!title || !slug || !content) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields: title, slug, or content",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate tags
    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "At least one tag is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        metaTitle: body.metaTitle || title,
        metaDescription: body.metaDescription || excerpt || content.substring(0, 155).replace(/<[^>]*>/g, "") + "...",
        featuredImageUrl: featuredImageUrl || null,
        status: status?.toUpperCase() || "DRAFT",
        publishedAt: status?.toLowerCase() === "published" ? new Date() : null,
        readTimeMinutes: readTimeMinutes || 5,
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
        tags: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    console.log("Post created successfully:", post.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_POST] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(
      JSON.stringify({ error: "Internal Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
