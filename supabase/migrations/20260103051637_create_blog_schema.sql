/*
  # Create Blog Content Schema

  ## New Tables
  
  ### `authors`
  - `id` (uuid, primary key)
  - `name` (text, required) - Author display name
  - `slug` (text, unique, required) - URL-friendly author identifier
  - `bio` (text) - Author biography
  - `avatar_url` (text) - Profile image URL
  - `email` (text) - Contact email
  - `social_links` (jsonb) - Social media profiles
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `categories`
  - `id` (uuid, primary key)
  - `name` (text, required) - Category name
  - `slug` (text, unique, required) - URL-friendly category identifier
  - `description` (text) - Category description for SEO
  - `meta_title` (text) - SEO meta title
  - `meta_description` (text) - SEO meta description
  - `image_url` (text) - Category featured image
  - `post_count` (integer, default 0) - Cached post count
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `tags`
  - `id` (uuid, primary key)
  - `name` (text, required) - Tag name
  - `slug` (text, unique, required) - URL-friendly tag identifier
  - `description` (text) - Tag description
  - `post_count` (integer, default 0) - Cached post count
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `posts`
  - `id` (uuid, primary key)
  - `title` (text, required) - Post title
  - `slug` (text, unique, required) - URL-friendly post identifier
  - `meta_title` (text) - SEO meta title
  - `meta_description` (text) - SEO meta description
  - `content` (text, required) - Main post content (HTML or Markdown)
  - `excerpt` (text) - Short summary
  - `featured_image_url` (text) - Featured image
  - `featured_image_alt` (text) - Image alt text for accessibility
  - `author_id` (uuid, foreign key to authors)
  - `category_id` (uuid, foreign key to categories)
  - `status` (text) - published, draft, scheduled
  - `published_at` (timestamptz) - Publication date
  - `updated_at` (timestamptz) - Last modification date
  - `created_at` (timestamptz)
  - `read_time_minutes` (integer) - Estimated reading time
  - `view_count` (integer, default 0) - Page views
  - `is_featured` (boolean, default false) - Featured post flag
  
  ### `post_tags` (junction table)
  - `post_id` (uuid, foreign key to posts)
  - `tag_id` (uuid, foreign key to tags)
  - `created_at` (timestamptz)
  - Primary key: (post_id, tag_id)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Authenticated write access for content management
*/

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  email text,
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  meta_title text,
  meta_description text,
  image_url text,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  meta_title text,
  meta_description text,
  content text NOT NULL,
  excerpt text,
  featured_image_url text,
  featured_image_alt text,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  read_time_minutes integer DEFAULT 5,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for published content
CREATE POLICY "Public can view all authors"
  ON authors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view all categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view all tags"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  TO public
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Public can view post tags"
  ON post_tags FOR SELECT
  TO public
  USING (true);

-- RLS Policies: Authenticated users can manage content
CREATE POLICY "Authenticated users can insert authors"
  ON authors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update authors"
  ON authors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete authors"
  ON authors FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage post tags"
  ON post_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();