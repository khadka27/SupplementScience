import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
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
    const { name, slug, description } = body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    console.error("Error updating tag:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting tag:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
