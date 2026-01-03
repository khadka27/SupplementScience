import prisma from "@/lib/prisma";
import BlogEditorForm from "./BlogEditorForm";

export default async function NewBlogPostPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish a new evidence-based article.
        </p>
      </div>

      <BlogEditorForm authors={authors} categories={categories} />
    </div>
  );
}
