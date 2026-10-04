import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (search) {
      where.email = { contains: search, mode: "insensitive" };
    }
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("[ADMIN_SUBSCRIBERS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: id and isActive" },
        { status: 400 }
      );
    }

    const updated = await prisma.subscriber.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ADMIN_SUBSCRIBERS_PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("[ADMIN_SUBSCRIBERS_DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
