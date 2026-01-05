import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Check if any admin exists
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 400 }
      );
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
        name: "Administrator",
        role: "admin",
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: "Default admin created successfully",
        username: admin.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
