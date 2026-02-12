import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Please set it in .env.local");
}
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findFirst();

  if (existingAdmin) {
    console.log("✅ Admin already exists. Skipping admin seed.");
  } else {
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

  // Create sample categories
  const categories = [
    {
      name: "Joint Pain",
      slug: "joint-pain",
      description:
        "Comprehensive guides and reviews for joint pain supplements, including glucosamine, chondroitin, and other joint health solutions.",
      metaTitle: "Joint Pain Supplements | Reviews & Guides",
      metaDescription:
        "Expert reviews and guides for joint pain supplements. Find the best products for joint health and mobility.",
    },
    {
      name: "Arthritis",
      slug: "arthritis",
      description:
        "Evidence-based information about arthritis supplements, natural remedies, and treatment options.",
      metaTitle: "Arthritis Supplements | Expert Reviews",
      metaDescription:
        "Discover the best arthritis supplements with our comprehensive reviews and expert guides.",
    },
    {
      name: "Bone Health",
      slug: "bone-health",
      description:
        "Supplements and nutrients for maintaining strong bones, including calcium, vitamin D, and magnesium.",
      metaTitle: "Bone Health Supplements | Reviews",
      metaDescription:
        "Expert reviews of bone health supplements to support strong bones and prevent osteoporosis.",
    },
  ];

  for (const categoryData of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: categoryData.slug },
    });

    if (!existing) {
      await prisma.category.create({
        data: categoryData,
      });
      console.log(`✅ Created category: ${categoryData.name}`);
    } else {
      console.log(`⏭️  Category already exists: ${categoryData.name}`);
    }
  }

  // Create sample author
  const author = await prisma.author.findUnique({
    where: { slug: "supplement-science-team" },
  });

  if (!author) {
    await prisma.author.create({
      data: {
        name: "Supplement Decoded Team",
        slug: "supplement-science-team",
        bio: "Our team of health and nutrition experts provides evidence-based reviews and guides on supplements.",
        email: "team@supplementdecoded.com",
      },
    });
    console.log("✅ Created default author");
  } else {
    console.log("⏭️  Author already exists");
  }

  // Create sample tags
  const tags = [
    { name: "Glucosamine", slug: "glucosamine" },
    { name: "Chondroitin", slug: "chondroitin" },
    { name: "Turmeric", slug: "turmeric" },
    { name: "Collagen", slug: "collagen" },
    { name: "MSM", slug: "msm" },
    { name: "Vitamin D", slug: "vitamin-d" },
    { name: "Calcium", slug: "calcium" },
    { name: "Omega-3", slug: "omega-3" },
    { name: "Joint Health", slug: "joint-health" },
    { name: "Bone Health", slug: "bone-health" },
  ];

  for (const tagData of tags) {
    const existing = await prisma.tag.findUnique({
      where: { slug: tagData.slug },
    });

    if (!existing) {
      await prisma.tag.create({
        data: tagData,
      });
      console.log(`✅ Created tag: ${tagData.name}`);
    } else {
      console.log(`⏭️  Tag already exists: ${tagData.name}`);
    }
  }

  // Get category IDs for post creation
  const jointPainCat = await prisma.category.findUnique({
    where: { slug: "joint-pain" },
  });
  const arthritisCat = await prisma.category.findUnique({
    where: { slug: "arthritis" },
  });
  const boneHealthCat = await prisma.category.findUnique({
    where: { slug: "bone-health" },
  });
  const teamAuthor = await prisma.author.findUnique({
    where: { slug: "supplement-science-team" },
  });

  // Create sample posts
  const posts = [
    {
      title: "Top 5 Supplements for Bone Health in 2024",
      slug: "top-5-bone-health-supplements",
      excerpt:
        "Maintain strong bones with these scientifically-backed supplements. We review calcium, Vitamin D, and more.",
      content:
        "<p>Bone health is crucial as we age. Here are the top supplements you should consider...</p><h2>1. Calcium</h2><p>Calcium is the building block of bones...</p><h2>2. Vitamin D</h2><p>Vitamin D helps your body absorb calcium...</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      categoryId: boneHealthCat?.id,
      authorId: teamAuthor?.id,
      metaTitle: "Best Bone Health Supplements 2024",
      metaDescription:
        "Read our expert guide on the best supplements for maintaining strong and healthy bones.",
    },
    {
      title: "How to Keep Your Bones Strong Naturally",
      slug: "keep-bones-strong-naturally",
      excerpt:
        "Beyond supplements, discover lifestyle choices that support long-term bone density.",
      content:
        "<p>While supplements help, natural lifestyle choices are just as important for bone health...</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      categoryId: boneHealthCat?.id,
      authorId: teamAuthor?.id,
      metaTitle: "Natural Ways to Support Bone Health",
      metaDescription:
        "Learn how diet and exercise play a role in maintaining bone density.",
    },
    {
      title: "The Ultimate Guide to Managing Joint Pain",
      slug: "joint-pain-management-guide",
      excerpt:
        "Everything you need to know about reducing joint inflammation and improving mobility.",
      content:
        "<p>Joint pain can be debilitating. This guide covers the best supplements and exercises...</p>",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      categoryId: jointPainCat?.id,
      authorId: teamAuthor?.id,
      metaTitle: "Joint Pain Management Guide",
      metaDescription:
        "A comprehensive guide to managing joint pain through supplementation and lifestyle changes.",
    },
  ];

  for (const postData of posts) {
    const existing = await prisma.post.findUnique({
      where: { slug: postData.slug },
    });

    if (!existing) {
      await prisma.post.create({
        data: postData,
      });
      console.log(`✅ Created post: ${postData.title}`);
    } else {
      console.log(`⏭️  Post already exists: ${postData.title}`);
    }
  }

  // Update category post counts
  const allCategories = await prisma.category.findMany();
  for (const cat of allCategories) {
    const count = await prisma.post.count({
      where: { categoryId: cat.id, status: "PUBLISHED" },
    });
    await prisma.category.update({
      where: { id: cat.id },
      data: { postCount: count },
    });
  }

  console.log("\n✅ Database seeding completed!");
  console.log("\n📝 Next steps:");
  console.log("   1. Login to admin panel: /admin/login");
  console.log("   2. Create your first review, guide, or ingredient");
  console.log("   3. Update admin credentials in Settings");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
