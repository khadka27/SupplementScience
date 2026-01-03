import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabase, Tag, Post } from '@/lib/supabase';
import BlogList from '@/components/blog/BlogList';

export const dynamic = 'force-static';
export const revalidate = 43200;

type Props = {
  params: { slug: string };
};

async function getTag(slug: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Tag;
}

async function getTagPosts(tagId: string): Promise<Post[]> {
  const { data } = await supabase
    .from('post_tags')
    .select(`
      post:posts(
        *,
        author:authors(name, slug, avatar_url),
        category:categories(name, slug),
        tags:post_tags(tag:tags(name, slug))
      )
    `)
    .eq('tag_id', tagId)
    .eq('post.status', 'published')
    .lte('post.published_at', new Date().toISOString())
    .order('post.published_at', { ascending: false })
    .limit(50);

  if (!data) return [];

  return data
    .map((item: any) => item.post)
    .filter(Boolean)
    .map((post: any) => ({
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
    })) as Post[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag(params.slug);

  if (!tag) {
    return {
      title: 'Tag Not Found'
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
  const url = `${baseUrl}/tag/${tag.slug}`;

  if (tag.post_count < 3) {
    return {
      title: tag.name,
      description: tag.description || `Articles tagged with ${tag.name}`,
      robots: {
        index: false,
        follow: true
      }
    };
  }

  return {
    title: `${tag.name} | Blog`,
    description: tag.description || `Browse articles tagged with ${tag.name}`,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: tag.name,
      description: tag.description || `Browse articles tagged with ${tag.name}`,
      url: url,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: tag.name,
      description: tag.description || `Browse articles tagged with ${tag.name}`
    }
  };
}

export async function generateStaticParams() {
  const { data: tags } = await supabase
    .from('tags')
    .select('slug')
    .gte('post_count', 3)
    .limit(200);

  return (tags || []).map((tag) => ({
    slug: tag.slug
  }));
}

export default async function TagPage({ params }: Props) {
  const tag = await getTag(params.slug);

  if (!tag) {
    notFound();
  }

  const posts = await getTagPosts(tag.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">#{tag.name}</h1>
        {tag.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">{tag.description}</p>
        )}
      </div>
      <BlogList posts={posts} />
    </div>
  );
}
