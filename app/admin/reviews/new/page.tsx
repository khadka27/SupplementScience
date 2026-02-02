import prisma from "@/lib/prisma";
import ReviewEditorForm from "./ReviewEditorForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function NewReviewPage() {
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
            Create New Product Review
          </h2>
          <p className="text-muted-foreground">
            Create a supplement product review within a category.
          </p>
        </div>

        <ReviewEditorForm
          authors={authors}
          categories={categories}
          tags={tags}
        />
      </div>
    </AdminLayout>
  );
}

