import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run all database queries concurrently for maximum speed
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalAuthors,
      totalSubscribers,
      recentPosts,
      popularPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.author.count(),
      prisma.subscriber.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: true, category: true },
      }),
      prisma.post.findMany({
        take: 5,
        where: { status: "PUBLISHED" },
        orderBy: { viewCount: "desc" },
        include: { author: true, category: true },
      }),
    ]);

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
      { status: 500 },
    );
  }
}
