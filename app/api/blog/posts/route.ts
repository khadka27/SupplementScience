import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      status,
    } = body;

    console.log("Received post data:", { title, slug, status });

    // Basic validation
    if (!title || !slug || !content) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields: title, slug, or content",
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
        featuredImageUrl: featuredImageUrl || null,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
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
