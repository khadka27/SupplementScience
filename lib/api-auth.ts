import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface AuthenticatedResult {
  authenticated: boolean;
  type?: "session" | "service_token";
  user?: any;
  serviceToken?: {
    id: string;
    name: string;
    tokenHint: string;
    description: string | null;
    expiresAt: Date | null;
    lastUsedAt: Date | null;
    isActive: boolean;
    createdAt: Date;
  };
  error?: string;
  status?: number;
}

/**
 * Extracts a service token from HTTP request headers.
 * Looks for:
 * 1. Authorization: Bearer <token>
 * 2. X-Service-Token: <token>
 * 3. X-API-Key: <token>
 */
export function extractServiceToken(req: Request | NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  const customHeader =
    req.headers.get("x-service-token") || req.headers.get("x-api-key");
  if (customHeader) {
    const token = customHeader.trim();
    if (token) return token;
  }

  // Also check URL query params for easy browser address-bar verification
  try {
    const url = new URL(req.url);
    const queryToken =
      url.searchParams.get("token") || url.searchParams.get("api_key");
    if (queryToken) return queryToken.trim();
  } catch {
    // Ignore URL parse error
  }

  return null;
}

/**
 * Ensures the service_tokens table exists in PostgreSQL.
 * Automatically runs if Prisma throws P2021 (table does not exist in production database).
 */
export async function ensureServiceTokensTable(): Promise<boolean> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "service_tokens" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "token_hint" TEXT NOT NULL,
        "description" TEXT,
        "expires_at" TIMESTAMP(3),
        "last_used_at" TIMESTAMP(3),
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_by" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (err) {
    console.error("Failed to auto-create service_tokens table:", err);
    return false;
  }
}

/**
 * Validates a raw service token against the database.
 */
export async function validateServiceToken(
  rawToken: string,
): Promise<{
  valid: boolean;
  error?: string;
  serviceToken?: any;
}> {
  if (!rawToken || typeof rawToken !== "string") {
    return { valid: false, error: "No token provided" };
  }

  try {
    const tokenRecord = await prisma.serviceToken.findUnique({
      where: { token: rawToken },
    });

    if (!tokenRecord) {
      return { valid: false, error: "Invalid service token" };
    }

    if (!tokenRecord.isActive) {
      return { valid: false, error: "Service token has been deactivated or revoked" };
    }

    if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
      return {
        valid: false,
        error: `Service token expired on ${new Date(tokenRecord.expiresAt).toLocaleDateString()}`,
      };
    }

    // Update lastUsedAt in the background without blocking execution
    prisma.serviceToken
      .update({
        where: { id: tokenRecord.id },
        data: { lastUsedAt: new Date() },
      })
      .catch((err) => {
        console.error("Failed to update service token lastUsedAt timestamp:", err);
      });

    return { valid: true, serviceToken: tokenRecord };
  } catch (error: any) {
    if (error?.code === "P2021" || error?.message?.includes("service_tokens")) {
      const created = await ensureServiceTokensTable();
      if (created) {
        try {
          const retriedRecord = await prisma.serviceToken.findUnique({
            where: { token: rawToken },
          });
          if (retriedRecord) {
            if (!retriedRecord.isActive) {
              return { valid: false, error: "Service token has been deactivated or revoked" };
            }
            if (retriedRecord.expiresAt && new Date(retriedRecord.expiresAt) < new Date()) {
              return {
                valid: false,
                error: `Service token expired on ${new Date(retriedRecord.expiresAt).toLocaleDateString()}`,
              };
            }
            return { valid: true, serviceToken: retriedRecord };
          }
        } catch {
          // Fall through to error response below
        }
      }
      return {
        valid: false,
        error: "Service tokens table was just initialized. Please re-try.",
      };
    }
    return { valid: false, error: "Database error validating service token" };
  }
}

/**
 * Authenticates an incoming API request via either:
 * 1. Service Token (Bearer or X-Service-Token / X-API-Key / ?token=) - prioritized
 * 2. Browser NextAuth session cookie (fallback for admin users)
 */
export async function authenticateApiRequest(
  req: Request | NextRequest,
): Promise<AuthenticatedResult> {
  // 1. Prioritize explicit service token if provided in headers or query params
  const token = extractServiceToken(req);
  if (token) {
    const result = await validateServiceToken(token);
    if (result.valid && result.serviceToken) {
      return {
        authenticated: true,
        type: "service_token",
        serviceToken: {
          id: result.serviceToken.id,
          name: result.serviceToken.name,
          tokenHint: result.serviceToken.tokenHint,
          description: result.serviceToken.description,
          expiresAt: result.serviceToken.expiresAt,
          lastUsedAt: result.serviceToken.lastUsedAt,
          isActive: result.serviceToken.isActive,
          createdAt: result.serviceToken.createdAt,
        },
      };
    }
    return {
      authenticated: false,
      error: result.error || "Invalid service token",
      status: 401,
    };
  }

  // 2. Fall back to active NextAuth session cookie for browser admins
  try {
    const session = await auth();
    if (session?.user) {
      return {
        authenticated: true,
        type: "session",
        user: session.user,
      };
    }
  } catch (err) {
    // Session check failed or running in headless context
  }

  return {
    authenticated: false,
    error: "Unauthorized: Missing authentication session or service token",
    status: 401,
  };
}

/**
 * Helper to produce standard 401 unauthorized response.
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}
