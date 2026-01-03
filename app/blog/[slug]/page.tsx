import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabase, Post } from '@/lib/supabase';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/schema';

export const dynamic = 'force-static';
export const revalidate = 21600;

type Props = {
  params: { slug: string };
};

async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*),
      category:categories(*),
      tags:post_tags(tag:tags(*))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;

  const post = {
    ...data,
    tags: data.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
  };

  return post as Post;
}

async function getRelatedPosts(categoryId?: string, currentPostId?: string): Promise<Post[]> {
  if (!categoryId) return [];

  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image_url, published_at, read_time_minutes')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', currentPostId || '')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(3);

  return (data || []) as Post[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const url = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featured_image_url || `${baseUrl}/og-default.jpg`;

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    alternates: {
      canonical: url
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      url: url,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author.name] : [],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.featured_image_alt || post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      images: [imageUrl]
    }
  };
}

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .limit(1000);

  return (posts || []).map((post) => ({
    slug: post.slug
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category_id, post.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

  const blogPostSchema = generateBlogPostSchema(post, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: post.category?.name || 'Uncategorized', url: `${baseUrl}/category/${post.category?.slug}` },
    { name: post.title, url: `${baseUrl}/blog/${post.slug}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}
