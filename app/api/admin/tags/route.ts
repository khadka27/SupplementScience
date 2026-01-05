import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tag:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
