import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/categories/sync-counts
 * Recalculates and persists the correct postCount for every category.
 * Safe to call repeatedly. Protected by admin auth.
 */
export async function POST(request: NextRequest) {
  const authResult = await authenticateApiRequest(request);
  if (!authResult.authenticated) {
    return NextResponse.json(
      { error: authResult.error || "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const results: { name: string; id: string; newCount: number }[] = [];

    for (const category of categories) {
      const count = await prisma.post.count({
        where: { categoryId: category.id, status: "PUBLISHED" },
      });
      await prisma.category.update({
        where: { id: category.id },
        data: { postCount: count },
      });
      results.push({ name: category.name, id: category.id, newCount: count });
    }

    return NextResponse.json({
      message: "Synced postCount for " + results.length + " categories",
      categories: results,
    });
  } catch (error) {
    console.error("Error syncing category counts:", error);
    return NextResponse.json({ error: "Failed to sync counts" }, { status: 500 });
  }
}
