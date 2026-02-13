import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
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
    const { status } = body;

    if (!status || !["PUBLISHED", "DRAFT"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PUBLISHED or DRAFT" },
        { status: 400 },
      );
    }

    // Get current post to check existing publishedAt
    const currentPost = await prisma.post.findUnique({
      where: { id },
      select: { status: true, publishedAt: true },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isNowPublished = status === "PUBLISHED";
    const wasPublished = currentPost.status === "PUBLISHED";

    let publishedAtData = currentPost.publishedAt;
    if (isNowPublished && !wasPublished) {
      publishedAtData = new Date();
    } else if (!isNowPublished) {
      publishedAtData = null;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        status,
        publishedAt: publishedAtData,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post status:", error);
    return NextResponse.json(
      { error: "Failed to update post status" },
      { status: 500 },
    );
  }
}
