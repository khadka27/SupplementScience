import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newUsername, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    // Get current admin
    const admin = await prisma.admin.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Check if new username already exists
    if (newUsername && newUsername !== admin.username) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { username: newUsername },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (newUsername) {
      updateData.username = newUsername;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update admin
    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Credentials updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing credentials:", error);
    return NextResponse.json(
      { error: "Failed to change credentials" },
      { status: 500 }
    );
  }
}
