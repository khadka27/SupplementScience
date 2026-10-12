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

  return null;
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
}

/**
 * Authenticates an incoming API request via either:
 * 1. Browser NextAuth session cookie
 * 2. Service Token (Bearer or X-Service-Token / X-API-Key)
 */
export async function authenticateApiRequest(
  req: Request | NextRequest,
): Promise<AuthenticatedResult> {
  // 1. Check for active NextAuth session
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
    // Session check failed or running in headless context, proceed to check token
  }

  // 2. Check for service token
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
