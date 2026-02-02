# Routing Structure Guide

This document outlines the complete routing structure for the Next.js App Router supplement review site.

## 📁 Route Structure

### Public Routes (`app/(public)/`)

```
app/(public)/
├── category/
│   ├── [slug]/
│   │   ├── page.tsx                    # Category hub page
│   │   └── [review-slug]/
│   │       └── page.tsx                # Review/guide pages
│   └── page.tsx                        # Categories listing
├── ingredients/
│   ├── [slug]/
│   │   └── page.tsx                    # Individual ingredient page
│   └── page.tsx                        # Ingredients listing
└── blog/
    ├── [slug]/
    │   └── page.tsx                    # General blog posts
    └── page.tsx                        # Blog listing
```

---

## 🎯 URL Patterns

### Category Hub
```
/category/{category-slug}/
```
**Example:** `/category/joint-pain/`

**Purpose:** Displays all posts (reviews, guides) for a specific category.

**File:** `app/(public)/category/[slug]/page.tsx`

---

### Category Review
```
/category/{category-slug}/{product-name}-review/
```
**Example:** `/category/joint-pain/flexitrinol-review/`

**Purpose:** Individual supplement review within a category.

**File:** `app/(public)/category/[slug]/[review-slug]/page.tsx`

**Slug Pattern:** `{product-name}-review`

---

### Category Guides
```
/category/{category-slug}/safety-measures-for-{category-slug}-supplements/
/category/{category-slug}/how-to-choose-{category-slug}-supplements/
/category/{category-slug}/ingredients-used-in-{category-slug}-supplements/
```

**Examples:**
- `/category/joint-pain/safety-measures-for-joint-pain-supplements/`
- `/category/joint-pain/how-to-choose-joint-pain-supplements/`
- `/category/joint-pain/ingredients-used-in-joint-pain-supplements/`

**Purpose:** Category-specific guide pages.

**File:** `app/(public)/category/[slug]/[review-slug]/page.tsx`

**Slug Patterns:**
- `safety-measures-for-{category-slug}-supplements`
- `how-to-choose-{category-slug}-supplements`
- `ingredients-used-in-{category-slug}-supplements`

---

### Ingredient Pages
```
/ingredients/{ingredient-slug}/
```
**Examples:**
- `/ingredients/glucosamine/`
- `/ingredients/turmeric/`
- `/ingredients/collagen/`

**Purpose:** Global, condition-agnostic ingredient information.

**File:** `app/(public)/ingredients/[slug]/page.tsx`

---

## 🔗 Internal Linking

Use the utilities from `lib/internal-linking.ts`:

```typescript
import {
  getIngredientUrl,
  getReviewUrl,
  getGuideUrl,
  getCategoryUrl,
  getProductReviewSlug,
  getGuideSlug,
} from "@/lib/internal-linking";

// Ingredient link
const ingredientLink = getIngredientUrl("glucosamine");
// Returns: "/ingredients/glucosamine"

// Review link
const reviewLink = getReviewUrl("joint-pain", "flexitrinol-review");
// Returns: "/category/joint-pain/flexitrinol-review"

// Guide link
const safetyGuide = getGuideUrl("joint-pain", "safety-measures");
// Returns: "/category/joint-pain/safety-measures-for-joint-pain-supplements"

// Category link
const categoryLink = getCategoryUrl("joint-pain");
// Returns: "/category/joint-pain"

// Generate slugs
const reviewSlug = getProductReviewSlug("Flexitrinol");
// Returns: "flexitrinol-review"

const guideSlug = getGuideSlug("joint-pain", "safety-measures");
// Returns: "safety-measures-for-joint-pain-supplements"
```

---

## 📝 Content Creation Guidelines

### Creating a Review Post

1. **Category Slug:** Determine the category (e.g., `joint-pain`)
2. **Product Name:** Get the product name (e.g., `Flexitrinol`)
3. **Generate Slug:** Use `getProductReviewSlug("Flexitrinol")` → `flexitrinol-review`
4. **Final URL:** `/category/joint-pain/flexitrinol-review/`
5. **Post Slug in DB:** Store as `flexitrinol-review` (the `[review-slug]` part)

### Creating a Guide Post

1. **Category Slug:** Determine the category (e.g., `joint-pain`)
2. **Guide Type:** Choose type (`safety-measures`, `how-to-choose`, `ingredients-used`)
3. **Generate Slug:** Use `getGuideSlug("joint-pain", "safety-measures")` → `safety-measures-for-joint-pain-supplements`
4. **Final URL:** `/category/joint-pain/safety-measures-for-joint-pain-supplements/`
5. **Post Slug in DB:** Store as `safety-measures-for-joint-pain-supplements`

### Creating an Ingredient Post

1. **Ingredient Name:** Get the ingredient (e.g., `Glucosamine`)
2. **Generate Slug:** Use `getIngredientSlug("Glucosamine")` → `glucosamine`
3. **Final URL:** `/ingredients/glucosamine/`
4. **Post Slug in DB:** Store as `glucosamine`
5. **Category:** Optionally assign to an "ingredients" category or use a tag

---

## 🗄️ Database Structure

### Post Model Fields

```prisma
model Post {
  slug        String     // The review-slug or ingredient-slug
  categoryId  String?    // For category-based posts
  // ... other fields
}
```

### Examples

**Review Post:**
```json
{
  "title": "Flexitrinol Review: Complete Analysis",
  "slug": "flexitrinol-review",
  "categoryId": "<joint-pain-category-id>"
}
```

**Guide Post:**
```json
{
  "title": "Safety Measures for Joint Pain Supplements",
  "slug": "safety-measures-for-joint-pain-supplements",
  "categoryId": "<joint-pain-category-id>"
}
```

**Ingredient Post:**
```json
{
  "title": "Glucosamine: Complete Guide",
  "slug": "glucosamine",
  "categoryId": null // or ingredients category
}
```

---

## 🚀 Static Generation

All routes support static generation via `generateStaticParams()`:

- **Category Pages:** Generates params for all category slugs
- **Review Pages:** Generates params for all category + review-slug combinations
- **Ingredient Pages:** Generates params for all ingredient slugs

---

## ✅ Best Practices

1. **Always use utility functions** for URL generation
2. **Keep slugs consistent** - use the utility functions to generate them
3. **Store the full slug** in the database (not just the product name)
4. **Link internally** using the utility functions
5. **Follow the slug patterns** exactly as defined
6. **Use category slugs** dynamically, never hard-code them

---

## 🔍 Route Resolution

The Next.js router resolves routes in this order:

1. Exact matches (e.g., `/category/joint-pain/`)
2. Dynamic segments (e.g., `/category/[slug]/`)
3. Nested dynamic segments (e.g., `/category/[slug]/[review-slug]/`)

All routes are pre-rendered at build time via `generateStaticParams()`.

