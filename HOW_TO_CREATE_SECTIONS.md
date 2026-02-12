# How to Create Global Authority Sections

## Quick Start Guide

### Step 1: Go to Sections Tab

1. Login to your Admin Panel
2. Click on **"Sections"** in the sidebar
3. Click **"Add Section"** button

### Step 2: Create a Section

Fill in the form:

- **Section Name**: e.g., "Ingredients", "Safety Measures", "How to Choose"
- **URL Slug**: Auto-generated (e.g., `ingredients`, `safety-measures`, `how-to-choose`)
- **Description**: Brief description of the section (optional)
- **Header Image URL**: Image for the section hub page (optional)
- **SEO Settings**: Meta title and description (optional - will auto-generate)

### Step 3: Create Articles

1. From the section card, click **"Write Article"**
2. Or go to **"New Blog Post"** → Select the section as the category
3. Write your article
4. Publish!

### Step 4: View Live

Your article will automatically appear at:

```
domain.com/{section-slug}/{article-slug}
```

Example:

```
domain.com/ingredients/glucosamine
domain.com/safety-measures/drug-interactions
domain.com/how-to-choose/read-labels
```

## Section Examples

### Example 1: Create "Ingredients" Section

```
Name: Ingredients
Slug: ingredients
Description: Comprehensive guides on supplement ingredients
```

Articles will appear at: `domain.com/ingredients/{article-name}`

### Example 2: Create "Safety Measures" Section

```
Name: Safety Measures
Slug: safety-measures
Description: Important safety information for supplements
```

Articles will appear at: `domain.com/safety-measures/{article-name}`

### Example 3: Create "How to Choose" Section

```
Name: How to Choose
Slug: how-to-choose
Description: Expert guides on selecting the right supplements
```

Articles will appear at: `domain.com/how-to-choose/{article-name}`

## Features

✅ **Clean URLs** - No `/category/` prefix, just `domain.com/{section}/{article}`  
✅ **Easy Management** - Dedicated Sections tab in admin  
✅ **Quick Article Creation** - "Write Article" button on each section card  
✅ **SEO Optimized** - Automatic sitemap, metadata, and schema generation  
✅ **Unlimited Sections** - Create as many authority hubs as you need

## Sections vs Categories

**Sections** (Top-Level Hubs):

- Clean URLs: `domain.com/ingredients/glucosamine`
- For global, cross-cutting topics
- Examples: Ingredients, Safety, How-To guides
- Managed in: Admin → **Sections**

**Categories** (Regular):

- Standard URLs: `/category/joint-pain`
- For product/topic grouping
- Examples: Joint Pain, Digestion, Energy
- Managed in: Admin → **Categories**

## Tips

1. **Use Sections for Universal Topics**: Things that apply across all product types
2. **Keep Slugs Short & Clear**: `ingredients` not `ingredients-database-complete`
3. **Pre-plan Your Sections**: Think about your content structure before creating many articles
4. **Mix Sections & Categories**: You can use both! They serve different purposes

## That's It!

You can now create unlimited authority sections directly from the admin panel without touching any code!
