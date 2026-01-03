import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(1000);

  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .gte('post_count', 1)
    .limit(100);

  const { data: tags } = await supabase
    .from('tags')
    .select('slug, updated_at')
    .gte('post_count', 3)
    .limit(200);

  const postUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));

  const categoryUrls = (categories || []).map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const tagUrls = (tags || []).map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: new Date(tag.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    },
    ...postUrls,
    ...categoryUrls,
    ...tagUrls
  ];
}
