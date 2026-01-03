import { Metadata } from 'next';
import { supabase, Post } from '@/lib/supabase';
import BlogList from '@/components/blog/BlogList';

export const dynamic = 'force-static';
export const revalidate = 43200;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: 'Blog | Your Site Name',
  description: 'Discover expert articles, guides, and insights about supplements and health.',
  alternates: {
    canonical: `${baseUrl}/blog`
  },
  openGraph: {
    title: 'Blog | Your Site Name',
    description: 'Discover expert articles, guides, and insights about supplements and health.',
    url: `${baseUrl}/blog`,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Your Site Name',
    description: 'Discover expert articles, guides, and insights about supplements and health.'
  }
};

async function getPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(name, slug, avatar_url),
      category:categories(name, slug),
      tags:post_tags(tag:tags(name, slug))
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(50);

  return ((data || []) as any[]).map(post => ({
    ...post,
    tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
  })) as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogList posts={posts} title="Latest Articles" />;
}
