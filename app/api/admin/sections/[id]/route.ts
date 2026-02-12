import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT update a section
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
    const { name, slug, description, metaTitle, metaDescription, imageUrl } =
      body;

    const section = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        metaTitle: metaTitle || name,
        metaDescription:
          metaDescription ||
          description ||
          `Explore our comprehensive ${name} section for expert articles and insights.`,
        imageUrl,
        isHub: true, // Ensure it stays as a hub
      },
    });

    return NextResponse.json(section);
  } catch (error: any) {
    console.error("Error updating section:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Section with this slug already exists" },
        { status: 409 },
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 },
    );
  }
}

// DELETE a section
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

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting section:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 },
    );
  }
}
