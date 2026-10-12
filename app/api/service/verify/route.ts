import { NextRequest, NextResponse } from "next/server";
import { authenticateApiRequest, extractServiceToken } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/service/verify
 * Verification & ping endpoint for testing Service Tokens.
 * Usage:
 *   curl -H "Authorization: Bearer sd_live_..." https://www.supplementdecoded.com/api/service/verify
 */
export async function GET(req: NextRequest) {
  const token = extractServiceToken(req);

  if (!token) {
    // If an administrator is currently logged in via browser cookie, return helpful diagnostics
    const authResult = await authenticateApiRequest(req);
    if (authResult.authenticated && authResult.type === "session") {
      return NextResponse.json({
        valid: true,
        authType: "admin_session",
        message: "You are authenticated via your Administrator browser session.",
        instructions:
          "To test a specific Service Token, append ?token=sd_live_... to the URL, or use the header 'Authorization: Bearer sd_live_...'.",
        adminUser: {
          name: authResult.user?.name,
          email: authResult.user?.email,
          role: authResult.user?.role,
        },
      });
    }

    return NextResponse.json(
      {
        valid: false,
        error:
          "Missing service token. Provide it via header 'Authorization: Bearer <token>', header 'X-Service-Token: <token>', or query parameter '?token=<token>'.",
        usageTip:
          "CLI: curl -H 'Authorization: Bearer sd_live_xxx' http://localhost:3000/api/service/verify",
        browserTip:
          "Browser URL: http://localhost:3000/api/service/verify?token=sd_live_xxx",
      },
      { status: 401 },
    );
  }

  const authResult = await authenticateApiRequest(req);

  if (!authResult.authenticated || !authResult.serviceToken) {
    return NextResponse.json(
      {
        valid: false,
        error: authResult.error || "Invalid, revoked, or expired service token.",
      },
      { status: 401 },
    );
  }

  const tokenRecord = authResult.serviceToken;
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
      "upload_media",
      "view_metrics",
      "automated_sync",
    ],
  });
}

/**
 * POST /api/service/verify
 * Also accepts POST for quick JSON body or webhook pings.
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
