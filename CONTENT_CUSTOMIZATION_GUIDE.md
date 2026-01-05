# Blog Content Customization Guide

## Overview

Your blog posts are stored in PostgreSQL database as HTML content and rendered with custom styling using Tailwind CSS prose classes. This guide explains how to customize the appearance and styling of your blog content.

---

## Current Setup

### 1. **Database Structure**

- Content is stored in `Post.content` field as HTML text
- Located in: `prisma/schema.prisma` → `Post` model → `content` field

### 2. **Rendering Location**

- File: `components/blog/BlogPostContent.tsx` (Line ~270)
- Uses `dangerouslySetInnerHTML` with DOMPurify sanitization
- Applies Tailwind CSS typography (`prose`) classes

---

## Customization Options

### Option 1: Modify Prose Styling (Current HTML)

**Location:** `components/blog/BlogPostContent.tsx` (Lines 260-275)

The prose classes control how your HTML content looks. You can customize:

#### Headings:

```tsx
prose-h2:text-3xl             // H2 font size
prose-h2:mt-16                // H2 top margin
prose-h2:border-b             // H2 bottom border
prose-h2:font-extrabold       // H2 font weight
```

#### Paragraphs:

```tsx
prose-p:leading-loose         // Line height
prose-p:text-muted-foreground // Text color
prose-p:mb-8                  // Bottom margin
prose-p:text-xl               // Font size
```

#### Lists:

```tsx
prose-ul:list-disc            // Bullet style
prose-li:text-lg              // List item size
prose-li:marker:text-primary  // Bullet color
```

#### Links, Code, Images, Blockquotes - all customizable!

---

### Option 2: Add Custom Components to Content

Instead of plain HTML, you can create special components for callouts, info boxes, etc.

**Example:** Create an info box component:

```tsx
// components/blog/InfoBox.tsx
export function InfoBox({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    success: "bg-green-50 border-green-200 text-green-900",
  };

  return (
    <div className={`border-l-4 p-6 rounded-r-xl my-8 ${colors[type]}`}>
      {children}
    </div>
  );
}
```

---

### Option 3: Process Content Before Rendering

Add custom processing to enhance HTML:

```tsx
// Example: Wrap tables in responsive containers
function processContent(html: string): string {
  // Wrap tables
  html = html.replace(/<table>/g, '<div class="overflow-x-auto"><table>');
  html = html.replace(/<\/table>/g, "</table></div>");

  // Add custom classes to specific elements
  html = html.replace(/<hr>/g, '<hr class="my-12 border-primary/20" />');

  return html;
}

// Then use: dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processContent(post.content)) }}
```

---

### Option 4: Custom CSS Classes for Specific Elements

Add targeted styling in your `globals.css`:

```css
/* Add to app/globals.css */

/* Style all blog post tables */
article table {
  @apply w-full border-collapse my-8;
}

article table th {
  @apply bg-primary/10 px-4 py-3 text-left font-bold;
}

article table td {
  @apply border border-border/30 px-4 py-3;
}

/* Custom horizontal rule */
article hr {
  @apply my-16 border-t-2 border-primary/20;
}

/* Highlight boxes for tips/notes */
article .tip {
  @apply bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg;
}

article .warning {
  @apply bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg;
}
```

Then in your database content, you can use:

```html
<div class="tip"><strong>💡 Pro Tip:</strong> This is a helpful tip!</div>
```

---

### Option 5: Rich Text Editor Enhancement

If you're using the TiptapEditor for creating posts, you can add custom extensions:

**Location:** `components/editor/TiptapEditor.tsx`

Add custom nodes for:

- Info boxes / callouts
- YouTube embeds
- Code blocks with syntax highlighting
- Custom button styles
- Image galleries

---

## Quick Styling Changes

### Make headings more colorful:

```tsx
// In BlogPostContent.tsx, modify:
prose-h2:text-primary  // Makes H2 headings use primary color
prose-h3:text-primary/80
```

### Increase paragraph spacing:

```tsx
prose-p:mb-12  // Instead of mb-8
```

### Style strong/bold text:

```tsx
prose-strong:text-primary prose-strong:font-extrabold
```

### Custom link hover effects:

```tsx
hover:prose-a:text-primary/60 hover:prose-a:scale-105
```

---

## Database Content Update

To update the HTML content in your database:

### Option 1: Via Admin Panel

Navigate to: `/admin/blog/new` or edit existing posts

### Option 2: Direct Database Update (PostgreSQL)

```sql
UPDATE posts
SET content = '<p>Your new HTML content here...</p>'
WHERE slug = 'your-post-slug';
```

### Option 3: Via Prisma

```typescript
await prisma.post.update({
  where: { slug: "your-post-slug" },
  data: {
    content: "<p>New HTML content...</p>",
  },
});
```

---

## Advanced: Content Templates

Create reusable content templates for consistency:

```typescript
// lib/content-templates.ts
export const templates = {
  productReview: `
    <h2>✅ Product Overview</h2>
    <p>{{overview}}</p>
    
    <h2>🎯 Key Features</h2>
    <ul>
      {{features}}
    </ul>
    
    <h2>💊 Ingredients</h2>
    <p>{{ingredients}}</p>
    
    <h2>⭐ Our Verdict</h2>
    <p>{{verdict}}</p>
  `,

  howToGuide: `
    <h2>📋 What You'll Need</h2>
    <ul>{{requirements}}</ul>
    
    <h2>👣 Step-by-Step Guide</h2>
    {{steps}}
    
    <h2>💡 Pro Tips</h2>
    <div class="tip">{{tips}}</div>
  `,
};
```

---

## Recommended Customizations

Based on your CertifyPro content, here are specific improvements:

### 1. **Add Icon Support**

```tsx
// Replace checkmarks with actual icons
content = content.replace(/✅/g, '<span class="text-green-500">✅</span>');
```

### 2. **Style HR tags better**

```tsx
prose-hr:border-t-2 prose-hr:border-primary/30 prose-hr:my-16
```

### 3. **Make UL/OL lists more prominent**

```tsx
prose-li:text-xl prose-li:leading-relaxed
```

### 4. **Add code block styling** (for technical posts)

```tsx
prose-pre:bg-gray-900 prose-pre:text-gray-100
```

---

## Testing Your Changes

1. **Local development:**

   ```bash
   pnpm dev
   ```

   Navigate to: `http://localhost:3000/blog/[your-slug]`

2. **Check responsive design:** Test on mobile, tablet, desktop

3. **Dark mode:** Toggle between light/dark to ensure readability

4. **Print preview:** Use browser print preview to check print styles

---

## Need Help?

- Tailwind Typography docs: https://tailwindcss.com/docs/typography-plugin
- DOMPurify docs: https://github.com/cure53/DOMPurify
- Next.js Image optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images

---

## Common Issues

### Issue 1: Styles not applying

**Solution:** Make sure classes are in the prose configuration and rebuild the project

### Issue 2: Content looks broken

**Solution:** Check DOMPurify sanitization - it may be removing certain tags/attributes

### Issue 3: Images not showing

**Solution:** Use Next.js Image component or ensure image URLs are absolute paths

---

**Last Updated:** January 2026
