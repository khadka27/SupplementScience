import prisma from "@/lib/prisma";
import GuideEditorForm from "./GuideEditorForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function NewGuidePage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create New Category Guide
          </h2>
          <p className="text-muted-foreground">
            Create a category-specific guide (safety measures, how to choose, or ingredients used).
          </p>
        </div>

        <GuideEditorForm
          authors={authors}
          categories={categories}
          tags={tags}
        />
      </div>
    </AdminLayout>
  );
}

