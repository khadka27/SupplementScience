import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post status:", error);
    return NextResponse.json(
      { error: "Failed to update post status" },
      { status: 500 }
    );
  }
}
