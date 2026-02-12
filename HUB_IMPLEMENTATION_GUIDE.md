# Global Authority Hubs - Implementation Guide

## Overview

The admin can now create **Top-Level Hub** categories that generate clean, SEO-friendly URLs without the `/category/` prefix.

## How It Works

### Creating a Hub

1. Go to **Admin Panel** → **Categories**
2. Click **"Add Category"**
3. Fill in the category details (name, slug, description, etc.)
4. **Enable "Top-Level Hub"** checkbox
5. Click **Create**

### URL Structure

#### Regular Category (Hub Disabled)

- Category Hub: `domain.com/category/joint-pain`
- Posts: `domain.com/blog/post-title`

#### Hub Category (Hub Enabled)

- Category Hub: `domain.com/ingredients` (clean top-level URL)
- Posts: `domain.com/ingredients/glucosamine` (nested under hub)

## Examples

### Example 1: Ingredients Hub

1. Create category with slug `ingredients`
2. Enable "Top-Level Hub"
3. Create post "Glucosamine Guide"
4. Assign to "Ingredients" category
5. **Result**: `domain.com/ingredients/glucosamine`

### Example 2: Safety Measures Hub

1. Create category with slug `safety-measures`
2. Enable "Top-Level Hub"
3. Create post "Supplement Side Effects"
4. Assign to "Safety Measures" category
5. **Result**: `domain.com/safety-measures/supplement-side-effects`

### Example 3: How to Choose Hub

1. Create category with slug `how-to-choose`
2. Enable "Top-Level Hub"
3. Create post "Reading Supplement Labels"
4. Assign to "How to Choose" category
5. **Result**: `domain.com/how-to-choose/reading-supplement-labels`

## Features

✅ **Completely Dynamic** - No hardcoded slugs, create any hub you want  
✅ **Admin UI Badge** - Hub categories show "HUB (Top Level)" badge  
✅ **Automatic Redirects** - Posts in hub categories automatically redirect to correct URLs  
✅ **SEO Optimized** - Proper canonical URLs, sitemaps, and breadcrumbs  
✅ **Flexible** - Can have regular categories and hub categories side-by-side

## Technical Details

### Database Schema

- Added `isHub` boolean field to Category model (default: false)

### URL Generation

- `getPostHref()` checks `category.isHub` flag
- If true: `/{category-slug}/{post-slug}`
- If false: `/blog/{post-slug}` or `/category/{category-slug}`

### Routing

- Dynamic route: `[categorySlug]/[slug]/page.tsx` handles all hub posts
- Auto-generates static params for all hub categories and their posts
- Proper metadata and schema markup

### Sitemap

- Hub category URLs: `domain.com/{category-slug}`
- Regular category URLs: `domain.com/category/{category-slug}`
- Post URLs respect hub structure automatically

## Best Practices

1. **Use Hub for Global Topics**: Ingredients, safety measures, how-to guides
2. **Use Regular Categories for Product Lines**: Joint pain, digestion, energy
3. **Keep Hub Slugs Short**: `ingredients` not `all-ingredients-database`
4. **SEO Benefit**: Clean URLs get better click-through rates in search results

## Admin Workflow

```
1. Create Hub Category
   ↓
2. Write Posts
   ↓
3. Assign to Hub Category
   ↓
4. Publish
   ↓
5. Automatically appears at domain.com/{hub-slug}/{post-slug}
```

That's it! No manual configuration needed - everything is handled automatically.
