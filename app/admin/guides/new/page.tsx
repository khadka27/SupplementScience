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
      <GuideEditorForm
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </AdminLayout>
  );
}

