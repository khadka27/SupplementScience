import prisma from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { notFound } from "next/navigation";
import IngredientEditorForm from "../new/IngredientEditorForm";

interface EditIngredientPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditIngredientPage({
  params,
}: EditIngredientPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      postType: "ingredient",
    },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

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
        initialData={post}
      />
    </AdminLayout>
  );
}
