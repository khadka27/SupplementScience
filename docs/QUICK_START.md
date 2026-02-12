# Quick Start Guide

Get your SEO-optimized blog up and running in minutes.

## Step 1: Add Sample Content

You need to add at least one author, category, and post to see the blog in action.

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run this SQL to create sample content:

```sql
-- 1. Create an author
INSERT INTO authors (name, slug, bio, avatar_url, email)
VALUES (
  'Dr. Jane Smith',
  'dr-jane-smith',
  'Certified nutritionist and health researcher with 10+ years of experience in supplement science.',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  'jane@example.com'
);

-- 2. Create categories
INSERT INTO categories (name, slug, description, meta_title, meta_description, post_count)
VALUES
  ('Vitamins', 'vitamins', 'Evidence-based guides on vitamin supplementation', 'Vitamin Guides | Your Site', 'Expert guides on vitamin supplementation backed by science', 1),
  ('Minerals', 'minerals', 'Complete information about mineral supplements', 'Mineral Supplements | Your Site', 'Learn about essential minerals and supplementation', 0),
  ('Protein', 'protein', 'Everything about protein supplements', 'Protein Supplements | Your Site', 'Complete guides to protein supplementation', 0);

-- 3. Create tags
INSERT INTO tags (name, slug, post_count)
VALUES
  ('Vitamin D', 'vitamin-d', 1),
  ('Immune Health', 'immune-health', 1),
  ('Bone Health', 'bone-health', 1);

-- 4. Create a sample blog post
INSERT INTO posts (
  title,
  slug,
  meta_title,
  meta_description,
  content,
  excerpt,
  featured_image_url,
  featured_image_alt,
  author_id,
  category_id,
  status,
  published_at,
  read_time_minutes,
  is_featured
)
VALUES (
  'Complete Guide to Vitamin D Supplementation',
  'complete-guide-vitamin-d',
  'Vitamin D Supplement Guide: Benefits, Dosage & Safety',
  'Discover everything about Vitamin D supplementation including benefits, proper dosage, safety considerations, and who should take it.',
  '<h2>What is Vitamin D?</h2>
  <p>Vitamin D is a fat-soluble vitamin that plays a crucial role in calcium absorption, bone health, and immune function. Often called the "sunshine vitamin," it can be synthesized by your skin when exposed to sunlight.</p>

  <h2>Why Supplement with Vitamin D?</h2>
  <p>Many people have insufficient vitamin D levels, especially those who:</p>
  <ul>
    <li>Live in northern latitudes with limited sunlight</li>
    <li>Spend most time indoors</li>
    <li>Have darker skin</li>
    <li>Are over 65 years old</li>
    <li>Follow a vegan diet</li>
  </ul>

  <h2>Health Benefits</h2>
  <h3>Bone Health</h3>
  <p>Vitamin D is essential for calcium absorption and bone mineralization. Research shows adequate vitamin D levels reduce the risk of osteoporosis and fractures.</p>

  <h3>Immune Function</h3>
  <p>Vitamin D supports immune system function. Studies suggest it may help reduce the risk of respiratory infections and support overall immune health.</p>

  <h2>Recommended Dosage</h2>
  <p>The recommended dietary allowance (RDA) for vitamin D is:</p>
  <ul>
    <li>Adults under 70: 600 IU (15 mcg) daily</li>
    <li>Adults over 70: 800 IU (20 mcg) daily</li>
    <li>Therapeutic doses: 1000-4000 IU daily (consult healthcare provider)</li>
  </ul>

  <h2>Safety Considerations</h2>
  <p>While vitamin D is generally safe, excessive intake can lead to toxicity. The tolerable upper limit is 4000 IU per day for adults. Always consult a healthcare provider before starting supplementation.</p>

  <h2>Best Time to Take</h2>
  <p>Vitamin D is fat-soluble, so take it with a meal containing healthy fats for optimal absorption.</p>

  <h2>Conclusion</h2>
  <p>Vitamin D supplementation can be beneficial for many people, especially those at risk of deficiency. Always test your levels and work with a healthcare provider to determine the right dosage for your needs.</p>',
  'Everything you need to know about vitamin D supplementation, including benefits, proper dosage, safety considerations, and who should supplement.',
  'https://images.pexels.com/photos/3683061/pexels-photo-3683061.jpeg',
  'Vitamin D supplement capsules on a white surface',
  (SELECT id FROM authors WHERE slug = 'dr-jane-smith'),
  (SELECT id FROM categories WHERE slug = 'vitamins'),
  'published',
  NOW(),
  8,
  true
);

-- 5. Link tags to the post
INSERT INTO post_tags (post_id, tag_id)
SELECT
  (SELECT id FROM posts WHERE slug = 'complete-guide-vitamin-d'),
  id
FROM tags
WHERE slug IN ('vitamin-d', 'immune-health', 'bone-health');
```

### Option B: Using the Supabase JavaScript Client

Create a file `scripts/seed-data.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedData() {
  // Create author
  const { data: author } = await supabase
    .from('authors')
    .insert({
      name: 'Dr. Jane Smith',
      slug: 'dr-jane-smith',
      bio: 'Certified nutritionist and health researcher',
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    })
    .select()
    .single();

  console.log('Author created:', author.name);

  // Create category
  const { data: category } = await supabase
    .from('categories')
    .insert({
      name: 'Vitamins',
      slug: 'vitamins',
      description: 'Evidence-based guides on vitamin supplementation',
      post_count: 1
    })
    .select()
    .single();

  console.log('Category created:', category.name);

  // Create tags
  const { data: tags } = await supabase
    .from('tags')
    .insert([
      { name: 'Vitamin D', slug: 'vitamin-d', post_count: 1 },
      { name: 'Immune Health', slug: 'immune-health', post_count: 1 },
      { name: 'Bone Health', slug: 'bone-health', post_count: 1 }
    ])
    .select();

  console.log('Tags created:', tags.length);

  // Create post
  const { data: post } = await supabase
    .from('posts')
    .insert({
      title: 'Complete Guide to Vitamin D Supplementation',
      slug: 'complete-guide-vitamin-d',
      content: '...',
      excerpt: 'Everything you need to know about vitamin D',
      author_id: author.id,
      category_id: category.id,
      status: 'published',
      published_at: new Date().toISOString(),
      read_time_minutes: 8,
      featured_image_url: 'https://images.pexels.com/photos/3683061/pexels-photo-3683061.jpeg'
    })
    .select()
    .single();

  console.log('Post created:', post.title);

  // Link tags
  await supabase.from('post_tags').insert(
    tags.map(tag => ({
      post_id: post.id,
      tag_id: tag.id
    }))
  );

  console.log('Sample data created successfully!');
}

seedData();
```

## Step 2: Configure Your Site

1. Update `NEXT_PUBLIC_BASE_URL` in `.env` with your actual domain
2. Update site name and branding in `app/layout.tsx`
3. Update social links in `lib/schema.ts`
4. Update contact emails in trust pages

## Step 3: Test Your Site

Run the development server:
```bash
npm run dev
```

Visit these URLs to verify everything works:
- http://localhost:3000 - Homepage
- http://localhost:3000/blog - Blog listing
- http://localhost:3000/blog/complete-guide-vitamin-d - Sample post
- http://localhost:3000/category/vitamins - Category page
- http://localhost:3000/tag/vitamin-d - Tag page
- http://localhost:3000/sitemap.xml - Sitemap
- http://localhost:3000/robots.txt - Robots.txt

## Step 4: Verify SEO Implementation

Test your pages:

1. **Rich Results Test**
   - Go to https://search.google.com/test/rich-results
   - Enter your blog post URL
   - Verify BlogPosting schema is detected

2. **PageSpeed Insights**
   - Go to https://pagespeed.web.dev/
   - Test your pages
   - Aim for 90+ scores

3. **View Page Source**
   - Right-click → View Page Source
   - Verify meta tags are present
   - Check JSON-LD structured data

## Step 5: Deploy

Deploy to Vercel or Netlify:

```bash
# Vercel
vercel

# Netlify
netlify deploy --prod
```

## Step 6: Submit to Google

1. Add site to [Google Search Console](https://search.google.com/search-console)
2. Submit your sitemap: `https://www.supplementdecoded.com/sitemap.xml`
3. Request indexing for your key pages

---

## Adding More Content

### Create Posts via Supabase Dashboard

Use the Supabase dashboard to add posts through the visual interface, or run INSERT queries in the SQL editor.

### Important Fields

Required fields:
- `title` - Your post title
- `slug` - URL-friendly version (e.g., "my-post-title")
- `content` - Full post content (HTML)
- `status` - Set to 'published'
- `published_at` - Publication date
- `author_id` - Link to author
- `category_id` - Link to category

Recommended fields:
- `meta_title` - SEO title (60 chars)
- `meta_description` - SEO description (160 chars)
- `excerpt` - Short summary
- `featured_image_url` - Featured image (use Pexels)
- `featured_image_alt` - Image alt text
- `read_time_minutes` - Estimated read time

### Finding Stock Images

Use [Pexels](https://www.pexels.com) for free stock photos:
- Search for your topic
- Copy the image URL
- Paste into `featured_image_url`

---

## Troubleshooting

### Posts not showing up?
- Verify status is 'published'
- Check published_at is not in the future
- Clear Next.js cache: `rm -rf .next`

### Sitemap empty?
- Make sure you have published posts
- Check published_at dates
- Verify Supabase connection

### Images not loading?
- Verify image URLs are valid
- Check image domains in next.config.js
- Use Pexels or other reliable CDNs

### Build errors?
- Run `npm run build` to see specific errors
- Check TypeScript errors
- Verify all required fields

---

## Need Help?

- Check `SEO_IMPLEMENTATION.md` for full documentation
- Review Next.js documentation
- Check Supabase dashboard for data issues
