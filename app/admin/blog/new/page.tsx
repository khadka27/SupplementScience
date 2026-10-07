import prisma from "@/lib/prisma";
import BlogEditorForm from "./BlogEditorForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

type Props = {
  searchParams: Promise<{ categoryId?: string }>;
};

export default async function NewBlogPostPage({ searchParams }: Props) {
  const { categoryId } = await searchParams;

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
      <BlogEditorForm
        authors={authors}
        categories={categories}
        tags={tags}
        initialCategoryId={categoryId}
      />
    </AdminLayout>
  );
}
