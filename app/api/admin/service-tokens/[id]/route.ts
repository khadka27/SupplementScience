import { NextRequest, NextResponse } from "next/server";
import {
  authenticateApiRequest,
  unauthorizedResponse,
  ensureServiceTokensTable,
} from "@/lib/api-auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/admin/service-tokens/[id]
 * Permanently deletes / revokes a service token.
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await params;
    let token;
    try {
      token = await prisma.serviceToken.findUnique({
        where: { id },
      });
    } catch (err: any) {
      if (err?.code === "P2021" || err?.message?.includes("service_tokens")) {
        await ensureServiceTokensTable();
        return NextResponse.json(
          { error: "Service token not found" },
          { status: 404 },
        );
      }
      throw err;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Service token not found" },
        { status: 404 },
      );
    }

    await prisma.serviceToken.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Service token "${token.name}" revoked and deleted.`,
    });
  } catch (error) {
    console.error("Error deleting service token:", error);
    return NextResponse.json(
      { error: "Failed to delete service token" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/service-tokens/[id]
 * Toggles token active/inactive state or updates metadata.
 */
export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const authResult = await authenticateApiRequest(req);
    if (!authResult.authenticated) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await params;
    const body = await req.json();

    let existing;
    try {
      existing = await prisma.serviceToken.findUnique({
        where: { id },
      });
    } catch (err: any) {
      if (err?.code === "P2021" || err?.message?.includes("service_tokens")) {
        await ensureServiceTokensTable();
        return NextResponse.json(
          { error: "Service token not found" },
          { status: 404 },
        );
      }
      throw err;
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Service token not found" },
        { status: 404 },
      );
    }

    const updateData: any = {};
    if (typeof body.isActive === "boolean") {
      updateData.isActive = body.isActive;
    }
    if (body.name && typeof body.name === "string") {
      updateData.name = body.name.trim();
    }
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    const updated = await prisma.serviceToken.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        tokenHint: true,
        description: true,
        expiresAt: true,
        lastUsedAt: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Service token updated.`,
      token: updated,
    });
  } catch (error) {
    console.error("Error updating service token:", error);
    return NextResponse.json(
      { error: "Failed to update service token" },
      { status: 500 },
    );
  }
}
