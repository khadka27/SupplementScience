import prisma from "@/lib/prisma";
import IngredientEditorForm from "./IngredientEditorForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function NewIngredientPage() {
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
      <IngredientEditorForm
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </AdminLayout>
  );
}

