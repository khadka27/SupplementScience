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

    // Basic validation
    if (!title || !slug || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return new NextResponse("Slug already exists", { status: 400 });
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImageUrl,
        authorId: authorId || null,
        categoryId: categoryId || null,
        // customAuthor, // Need to add this to schema first
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POSTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
