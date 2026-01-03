import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Category, Post } from '@/lib/supabase'; // Using types for compatibility
import BlogList from '@/components/blog/BlogList';

export const dynamic = 'force-static';
export const revalidate = 43200;

type Props = {
  params: { slug: string };
};

async function getCategory(slug: string): Promise<any | null> {
  const data = await prisma.category.findUnique({
    where: {
      slug
    }
  });

  return data;
}

async function getCategoryPosts(categoryId: string): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: 'published',
      categoryId,
      publishedAt: {
        lte: new Date()
      }
    },
    include: {
      author: {
        select: { name: true, slug: true, avatarUrl: true }
      },
      category: {
        select: { name: true, slug: true }
      },
      tags: {
        include: {
          tag: {
            select: { name: true, slug: true }
          }
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: 50
  });

  return (data || []).map(post => ({
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const url = `${baseUrl}/category/${category.slug}`;

  return {
    title: category.meta_title || `${category.name} | Blog`,
    description: category.meta_description || category.description || `Browse articles in ${category.name}`,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: category.meta_title || category.name,
      description: category.meta_description || category.description || `Browse articles in ${category.name}`,
      url: url,
      type: 'website',
      images: category.image_url ? [
        {
          url: category.image_url,
          width: 1200,
          height: 630,
          alt: category.name
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: category.meta_title || category.name,
      description: category.meta_description || category.description || `Browse articles in ${category.name}`
    }
  };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true
    },
    take: 100
  });

  return categories.map((category) => ({
    slug: category.slug
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(category.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">{category.description}</p>
        )}
      </div>
      <BlogList posts={posts} />
    </div>
  );
}
