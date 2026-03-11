import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
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
      postType,
    } = body;

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug },
      });

      if (existingPost && existingPost.id !== id) {
        return NextResponse.json(
          { error: "Slug already exists. Please use a different slug." },
          { status: 400 },
        );
      }
    }

    // Get current post to check status
    const currentPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isNowPublished = status?.toUpperCase() === "PUBLISHED";
    const wasPublished = currentPost.status === "PUBLISHED";

    // Set publishedAt only if it's being published for the first time
    // or keep the existing publishedAt if it's already published
    let publishedAtData = currentPost.publishedAt;
    if (isNowPublished && !wasPublished) {
      publishedAtData = new Date();
    } else if (!isNowPublished) {
      publishedAtData = null;
    }

    // Update the post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImageUrl: featuredImageUrl || null,
        status: status?.toUpperCase() || "DRAFT",
        publishedAt: publishedAtData,
        readTimeMinutes: readTimeMinutes || 5,
        postType: postType || "blog",
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
          Array.isArray(tagIds) && {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId: string) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            },
          }),
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
    revalidatePath("/sitemap.xml");
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update post", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/sitemap.xml");
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
