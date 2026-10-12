import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, unauthorizedResponse } from "@/lib/api-auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/service-tokens
 * Lists all existing service tokens (with masked token hints).
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error);
    }

    const tokens = await prisma.serviceToken.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        tokenHint: true,
        description: true,
        expiresAt: true,
        lastUsedAt: true,
        isActive: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const now = new Date();
    const enrichedTokens = tokens.map((token: typeof tokens[number]) => {
      const isExpired = token.expiresAt ? new Date(token.expiresAt) < now : false;
      const daysUntilExpiration = token.expiresAt
        ? Math.ceil(
            (new Date(token.expiresAt).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

      return {
        ...token,
        isExpired,
        daysUntilExpiration,
      };
    });

    return NextResponse.json({ tokens: enrichedTokens });
  } catch (error) {
    console.error("Error fetching service tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch service tokens" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/service-tokens
 * Generates a new service token with expiration time and returns it once.
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await req.json();
    const { name, description, expiresIn } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "A descriptive name for the service token is required" },
        { status: 400 },
      );
    }

    // Calculate expiration date
    let expiresAt: Date | null = null;
    const now = new Date();

    if (expiresIn === "7d") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (expiresIn === "30d" || !expiresIn) {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (expiresIn === "90d") {
      expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (expiresIn === "1y") {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else if (expiresIn === "never") {
      expiresAt = null;
    } else if (typeof expiresIn === "string" && !isNaN(Date.parse(expiresIn))) {
      expiresAt = new Date(expiresIn);
      if (expiresAt <= now) {
        return NextResponse.json(
          { error: "Expiration date must be in the future" },
          { status: 400 },
        );
      }
    } else {
      // Default to 30 days if unrecognized
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    // Generate secure token: sd_live_<48 random hex characters>
    const randomEntropy = crypto.randomBytes(24).toString("hex");
    const rawToken = `sd_live_${randomEntropy}`;
    const tokenHint = `sd_live_••••${rawToken.slice(-6)}`;

    const creatorName =
      authResult.user?.name ||
      authResult.user?.email ||
      authResult.serviceToken?.name ||
      "admin";

    const createdToken = await prisma.serviceToken.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        token: rawToken,
        tokenHint,
        expiresAt,
        createdBy: creatorName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Service token generated successfully. Make sure to copy it now; it won't be shown again.",
        token: rawToken, // ONLY TIME THIS FULL TOKEN IS RETURNED
        tokenRecord: {
          id: createdToken.id,
          name: createdToken.name,
          tokenHint: createdToken.tokenHint,
          description: createdToken.description,
          expiresAt: createdToken.expiresAt,
          createdAt: createdToken.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service token:", error);
    return NextResponse.json(
      { error: "Failed to generate service token" },
      { status: 500 },
    );
  }
}
