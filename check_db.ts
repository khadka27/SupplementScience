import prisma from "./lib/prisma";

async function main() {
  const tags = await prisma.tag.findMany();
  console.log("TAGS:", tags);

  const posts = await prisma.post.findMany({
    include: {
      tags: true,
      category: true,
    },
  });
  console.log("POSTS:", JSON.stringify(posts, null, 2));
}

main().catch(console.error);
