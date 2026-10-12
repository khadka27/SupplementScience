import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/monographs/showcase
 * Returns published ingredient monographs and active categories from the database.
 * No mock data.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    // Fetch all published ingredient posts with their category
    const ingredients = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        postType: "ingredient",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        cardImageUrl: true,
        featuredImageUrl: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Fetch categories with published ingredient posts
    const categories = await prisma.category.findMany({
      where: {
        posts: {
          some: {
            postType: "ingredient",
            status: "PUBLISHED",
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Filter if category parameter provided
    let filtered = ingredients;
    if (categorySlug && categorySlug !== "all") {
      filtered = ingredients.filter(
        (item) => item.category?.slug === categorySlug,
      );
    }

    return NextResponse.json({
      ingredients: filtered,
      allIngredients: ingredients,
      categories,
      count: filtered.length,
    });
  } catch (error) {
    console.error("[MONOGRAPHS_SHOWCASE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch monographs from database" },
      { status: 500 },
    );
  }
}
