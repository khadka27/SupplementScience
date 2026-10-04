import prisma from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { notFound } from "next/navigation";
import ReviewEditorForm from "../new/ReviewEditorForm";

interface EditReviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditReviewPage({
  params,
}: EditReviewPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug,
      postType: "review",
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
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product Review</h2>
          <p className="text-muted-foreground">
            Update third-party lab evaluation and brand compliance.
          </p>
        </div>

        <ReviewEditorForm
          authors={authors}
          categories={categories}
          tags={tags}
          initialData={post}
        />
      </div>
    </AdminLayout>
  );
}
