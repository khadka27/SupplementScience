import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchQuery = query.toLowerCase();

    // Search posts by title and content
    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImageUrl: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 10,
    });

    // Calculate match percentages
    const results = posts.map((post) => {
      const titleLower = post.title.toLowerCase();
      const excerptLower = post.excerpt?.toLowerCase() || "";

      // Calculate title match percentage
      let matchScore = 0;

      // Exact match = 100%
      if (titleLower === searchQuery) {
        matchScore = 100;
      }
      // Title starts with query = 90%
      else if (titleLower.startsWith(searchQuery)) {
        matchScore = 90;
      }
      // Title contains query as whole word = 80%
      else if (titleLower.includes(` ${searchQuery} `) || titleLower.includes(` ${searchQuery}`)) {
        matchScore = 80;
      }
      // Title contains query = 70%
      else if (titleLower.includes(searchQuery)) {
        matchScore = 70;
      }
      // Excerpt contains query = 60%
      else if (excerptLower.includes(searchQuery)) {
        matchScore = 60;
      }
      // Content match (if we got here) = 50%
      else {
        matchScore = 50;
      }

      return {
        ...post,
        matchPercentage: matchScore,
      };
    });

    // Sort by match percentage (highest first)
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
