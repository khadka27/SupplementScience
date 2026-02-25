const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const posts = await prisma.post.findMany({ select: { slug: true, categoryId: true, tags: { include: { tag: true } } } });
    const c = await prisma.category.findMany();
    console.log("Categories:", c);
    console.log("Posts:", posts.slice(0, 5)); // log first 5 to see
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
