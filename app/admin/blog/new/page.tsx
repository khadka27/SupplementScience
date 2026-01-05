import prisma from "@/lib/prisma";
import BlogEditorForm from "./BlogEditorForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function NewBlogPostPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create New Blog Post
          </h2>
          <p className="text-muted-foreground">
            Write and publish a new evidence-based article.
          </p>
        </div>

        <BlogEditorForm authors={authors} categories={categories} />
      </div>
    </AdminLayout>
  );
}
