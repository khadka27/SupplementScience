import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Author = {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  post_count: number;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  featured_image_alt?: string;
  author_id?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  updated_at: string;
  created_at: string;
  read_time_minutes: number;
  view_count: number;
  is_featured: boolean;
  author?: Author;
  category?: Category;
  tags?: Tag[];
};
