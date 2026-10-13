import { NextRequest, NextResponse } from "next/server";
import {
  authenticateApiRequest,
  extractServiceToken,
  validateServiceToken,
} from "@/lib/api-auth";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/service/verify
 * Verification & ping endpoint for testing Service Tokens.
 * Usage:
 *   curl -H "Authorization: Bearer sd_live_..." https://www.supplementdecoded.com/api/service/verify
 *   Browser: https://www.supplementdecoded.com/api/service/verify?token=sd_live_...
 */
export async function GET(req: NextRequest) {
  const token = extractServiceToken(req);

  // 1. If a Service Token is provided, validate it directly
  if (token) {
    const result = await validateServiceToken(token);

    if (!result.valid || !result.serviceToken) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || "Invalid, revoked, or expired service token.",
        },
        { status: 401 },
      );
    }

    const tokenRecord = result.serviceToken;
    const now = new Date();
    const expiresAt = tokenRecord.expiresAt ? new Date(tokenRecord.expiresAt) : null;
    const daysRemaining = expiresAt
      ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    return NextResponse.json({
      valid: true,
      message: "Service token successfully authenticated.",
      serviceToken: {
        id: tokenRecord.id,
        name: tokenRecord.name,
        tokenHint: tokenRecord.tokenHint,
        description: tokenRecord.description,
        expiresAt: tokenRecord.expiresAt ? tokenRecord.expiresAt.toISOString() : null,
        expiresStatus: expiresAt ? `${daysRemaining} days remaining` : "Never expires",
        isActive: tokenRecord.isActive,
        lastUsedAt: tokenRecord.lastUsedAt ? tokenRecord.lastUsedAt.toISOString() : "Just now",
        createdAt: tokenRecord.createdAt.toISOString(),
      },
      capabilities: [
        "read_content",
        "publish_articles",
        "update_articles",
        "delete_articles",
        "upload_media",
        "view_metrics",
        "automated_sync",
      ],
    });
  }

  // 2. If NO service token was provided, check if administrator is logged in via browser cookie
  try {
    const session = await auth();
    if (session?.user) {
      return NextResponse.json({
        valid: true,
        authType: "admin_session",
        message: "You are authenticated via your Administrator browser session.",
        instructions:
          "To test a specific Service Token, append ?token=sd_live_... to the URL, or use the header 'Authorization: Bearer sd_live_...'.",
        adminUser: {
          name: session.user?.name,
          email: session.user?.email,
          role: (session.user as any)?.role,
        },
      });
    }
  } catch {}

  // 3. Neither token nor session
  return NextResponse.json(
    {
      valid: false,
      error:
        "Missing service token. Provide it via header 'Authorization: Bearer <token>', header 'X-Service-Token: <token>', or query parameter '?token=<token>'.",
      usageTip:
        "CLI: curl -H 'Authorization: Bearer sd_live_xxx' https://www.supplementdecoded.com/api/service/verify",
      browserTip:
        "Browser URL: https://www.supplementdecoded.com/api/service/verify?token=sd_live_xxx",
    },
    { status: 401 },
  );
}

/**
 * POST /api/service/verify
 * Also accepts POST for quick JSON body or webhook pings.
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
