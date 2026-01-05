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
    const { name, slug, bio, avatarUrl, email, socialLinks } = body;

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        slug,
        bio,
        avatarUrl,
        email,
        socialLinks,
      },
    });

    return NextResponse.json(author);
  } catch (error: any) {
    console.error("Error updating author:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Author with this slug already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update author" },
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

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting author:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 }
    );
  }
}
