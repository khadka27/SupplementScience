import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ALLOWED_POST_TYPES = ["blog", "review", "guide", "ingredient"];

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
    const postType =
      typeof body.postType === "string" ? body.postType.toLowerCase() : "";

    if (!ALLOWED_POST_TYPES.includes(postType)) {
      return NextResponse.json(
        {
          error:
            "Invalid post type. Must be one of: blog, review, guide, ingredient",
        },
        { status: 400 },
      );
    }

    const currentPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: { postType },
      select: {
        id: true,
        title: true,
        slug: true,
        postType: true,
      },
    });

    revalidatePath("/sitemap.xml");
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post type:", error);
    return NextResponse.json(
      { error: "Failed to update post type" },
      { status: 500 },
    );
  }
}
