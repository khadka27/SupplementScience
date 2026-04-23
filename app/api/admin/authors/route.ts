import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return NextResponse.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
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
    const {
      name,
      slug,
      bio,
      expertise,
      qualification,
      avatarUrl,
      email,
      socialLinks,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const author = await prisma.author.create({
      data: {
        name,
        slug,
        bio,
        expertise,
        qualification,
        avatarUrl,
        email,
        socialLinks: socialLinks || {},
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error: any) {
    console.error("Error creating author:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Author with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
