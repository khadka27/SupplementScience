import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET all sections (hub categories only)
export async function GET() {
  try {
    const sections = await prisma.category.findMany({
      where: {
        isHub: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 },
    );
  }
}

// POST create a new section
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, metaTitle, metaDescription, imageUrl } =
      body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const section = await prisma.category.create({
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
        isHub: true, // Always create as a hub
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    console.error("Error creating section:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Section with this slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 },
    );
  }
}
