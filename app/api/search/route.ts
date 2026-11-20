import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fuzzySearch } from "@/lib/fuzzy-search";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // If query is empty or less than 1 char, return popular/top ingredient monographs
    if (!query || query.trim().length === 0) {
      const topIngredients = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          postType: true,
          excerpt: true,
          cardImageUrl: true,
          featuredImageUrl: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { postType: "desc" }, // prioritize ingredient monographs
          { publishedAt: "desc" },
        ],
        take: 6,
      });

      return NextResponse.json({
        results: topIngredients.map((item) => ({
          ...item,
          matchPercentage: 100,
          matchTier: "100% MATCH",
        })),
      });
    }

    const searchQuery = query.trim();

    // 1. Fetch published records from database (up to 500 to cover all published posts)
    const allPublished = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        postType: true,
        excerpt: true,
        content: true,
        cardImageUrl: true,
        featuredImageUrl: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 500,
    });

    // 2. Perform high-precision fuzzy search across titles, slugs, categories, excerpts, and synonyms
    const fuzzyResults = fuzzySearch(searchQuery, allPublished, {
      weights: {
        title: 1.0,
        slug: 0.9,
        category: 0.8,
        excerpt: 0.65,
        content: 0.55,
      },
      minScoreThreshold: 0.35,
      maxResults: 15,
    });

    return NextResponse.json({ results: fuzzyResults });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
