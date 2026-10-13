import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/api-auth";
import {
  findPostByIdOrSlug,
  updatePostRecord,
  deletePostRecord,
} from "@/lib/post-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/blog/posts/[id]
 * Fetch a single post by ID or slug.
 * Public for PUBLISHED posts; requires authentication (Service Token or Session) for DRAFT posts.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await findPostByIdOrSlug(id, { includeRelations: true });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status !== "PUBLISHED") {
      const authResult = await authenticateApiRequest(req);
      if (!authResult.authenticated) {
        return NextResponse.json(
          { error: authResult.error || "Unauthorized" },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("[POST_BY_ID_GET] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: error?.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/blog/posts/[id]
 * Update a post by ID or slug using Service Token or Admin Session.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();

    const updatedPost = await updatePostRecord(id, body);
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    if (error?.code === "NOT_FOUND") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error?.code === "CONFLICT") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[POST_BY_ID_PUT] Error:", error);
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
 * PATCH /api/blog/posts/[id]
 * Partial update a post by ID or slug using Service Token or Admin Session.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return PUT(req, context);
}

/**
 * DELETE /api/blog/posts/[id]
 * Delete a post by ID or slug using Service Token or Admin Session.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const result = await deletePostRecord(id);
    return NextResponse.json({
      message: "Post deleted successfully",
      ...result,
    });
  } catch (error: any) {
    if (error?.code === "NOT_FOUND") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[POST_BY_ID_DELETE] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete post",
        details: error?.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
