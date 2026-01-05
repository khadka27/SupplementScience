import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findFirst();

  if (existingAdmin) {
    console.log("✅ Admin already exists. Skipping seed.");
    return;
  }

  // Create default admin
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      email: "admin@supplementscience.com",
      role: "admin",
      isActive: true,
    },
  });

  console.log("✅ Default admin created:");
  console.log("   Username: admin");
  console.log("   Password: admin123");
  console.log("   Please change these credentials after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
