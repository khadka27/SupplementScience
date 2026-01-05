import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get statistics
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({
      where: { status: "PUBLISHED" },
    });
    const draftPosts = await prisma.post.count({
      where: { status: "DRAFT" },
    });
    const totalCategories = await prisma.category.count();
    const totalTags = await prisma.tag.count();
    const totalAuthors = await prisma.author.count();
    const totalSubscribers = await prisma.subscriber.count();

    // Get recent posts
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        category: true,
      },
    });

    // Get popular posts (by views)
    const popularPosts = await prisma.post.findMany({
      take: 5,
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      include: {
        author: true,
        category: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalTags,
        totalAuthors,
        totalSubscribers,
      },
      recentPosts,
      popularPosts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
