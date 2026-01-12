# Quick Customization Examples for Blog Content

## 🚀 Quick Start

Your blog content is now enhanced with automatic processing! The system will:

- Add IDs to headings for anchor links
- Enhance emojis to be larger
- Wrap tables in responsive containers
- Style HR tags beautifully
- Add `target="_blank"` to external links

---

## ✨ How to Use Special Styles in Your HTML Content

When editing blog posts in your database, you can use these special classes and structures:

### 1. **Info Boxes / Callouts**

```html
<div data-infobox="tip">
  This is a helpful tip that will appear in a blue box with an icon!
</div>

<div data-infobox="warning">
  This is a warning that will appear in a yellow box.
</div>

<div data-infobox="success">This is a success message in a green box.</div>

<div data-infobox="info">This is general info in a purple box.</div>
```

**Result:** Colored boxes with borders and icons automatically added!

---

### 2. **Checklist Style Lists**

```html
<ul class="checklist">
  <li>First item gets a ✅ automatically</li>
  <li>Second item also gets a ✅</li>
  <li>All items in this list get checkmarks</li>
</ul>
```

**Result:** A clean checklist with green checkmarks instead of bullets.

---

### 3. **Feature Lists with Icons**

```html
<ul class="features">
  <li>Choose a template - Gets a card background</li>
  <li>Upload branding elements - Each item styled beautifully</li>
  <li>Download in multiple formats - With target emoji</li>
</ul>
```

**Result:** Each item appears in a rounded card with a target emoji (🎯).

---

### 4. **Numbered Steps**

```html
<ol class="steps">
  <li>Connect to the database - Will show as step 1</li>
  <li>Configure your settings - Will show as step 2</li>
  <li>Start using the app - Will show as step 3</li>
</ol>
```

**Result:** Beautiful numbered steps with circular badges.

---

### 5. **Highlighted Text**

```html
<p>
  This is <span class="highlight">important highlighted text</span> in a
  paragraph.
</p>
```

**Result:** Yellow background highlight (adapts to dark mode).

---

### 6. **Pull Quotes**

```html
<p class="pull-quote">
  "CertifyPro makes certificate creation fast, modern, and professional."
</p>
```

**Result:** Large, centered, serif italic text with top/bottom borders.

---

### 7. **Call-to-Action Buttons**

```html
<a href="https://example.com" class="cta-button"> Get Started Now </a>

<a href="https://example.com" class="cta-button-outline"> Learn More </a>
```

**Result:** Styled buttons with hover effects.

---

### 8. **Comparison Tables**

```html
<div class="comparison-table">
  <div class="comparison-card">
    <h3>Option A</h3>
    <p>Description of option A with all its features...</p>
  </div>
  <div class="comparison-card">
    <h3>Option B</h3>
    <p>Description of option B with all its features...</p>
  </div>
</div>
```

**Result:** Two-column comparison layout with hover effects.

---

### 9. **Statistics Box**

```html
<div class="stat-box">
  <div class="number">10+</div>
  <div class="label">Certificate Templates</div>
</div>
```

**Result:** Eye-catching statistic display with gradient background.

---

### 10. **FAQ Styling**

```html
<div class="faq-item">
  <h4 class="faq-question">Can I use CMS content in CertifyPro?</h4>
  <p class="faq-answer">
    Yes, you can! You can directly paste content from your CMS...
  </p>
</div>
```

**Result:** Clean FAQ layout with separated questions and answers.

---

## 📊 Example: Update Your CertifyPro Post

Here's how to enhance sections of your existing CertifyPro content:

### Before:

```html
<h2>✅ What is CertifyPro?</h2>
<p>CertifyPro is a web-based certificate generator...</p>
```

### After (Enhanced):

```html
<h2>✅ What is CertifyPro?</h2>
<div data-infobox="info">
  <strong>TL;DR:</strong> CertifyPro is a modern, web-based certificate
  generator built with Next.js that lets you create professional certificates in
  seconds.
</div>
<p>CertifyPro is a web-based certificate generator...</p>
```

---

### Before:

```html
<ul>
  <li>Choose a template</li>
  <li>Paste or edit certificate content</li>
  <li>Upload branding elements</li>
</ul>
```

### After (Enhanced):

```html
<ol class="steps">
  <li>Choose a template from 10 unique designs</li>
  <li>Paste or edit certificate content with live preview</li>
  <li>Upload branding elements (logo, signature, stamp)</li>
  <li>Preview instantly and download in your preferred format</li>
</ol>
```

---

### Before:

```html
<p>
  ✅ PNG/JPG Image<br />
  ✅ PDF<br />
  ✅ DOCX (Word File)
</p>
```

### After (Enhanced):

```html
<ul class="checklist">
  <li><strong>PNG/JPG Image</strong> - Perfect for social media and web use</li>
  <li><strong>PDF</strong> - Print-ready and professional</li>
  <li>
    <strong>DOCX (Word File)</strong> - Editable format for further
    customization
  </li>
</ul>
```

---

## 🎨 Modify Prose Styling

Want to change how ALL content looks? Edit [BlogPostContent.tsx](components/blog/BlogPostContent.tsx):

### Make paragraphs larger:

Change `prose-p:text-xl` to `prose-p:text-2xl`

### Make headings colorful:

Add `prose-h2:text-primary` to make all H2s use your primary color

### Adjust spacing:

Change `prose-p:mb-8` to `prose-p:mb-12` for more space between paragraphs

---

## 📝 Update Database Content

### Option 1: Via Admin Panel

1. Go to `/admin/blog/new` or edit existing posts
2. Use the TiptapEditor to add content
3. Switch to HTML view to add custom classes

### Option 2: Direct SQL Update

```sql
UPDATE posts
SET content = '
  <h2>Updated Title</h2>
  <div data-infobox="tip">
    This is a new tip box!
  </div>
  <p>Regular content here...</p>
'
WHERE slug = 'certifypro-modern-product-certificate-generator';
```

### Option 3: Via Prisma Studio

```bash
pnpm prisma studio
```

Then edit the content field in the web UI.

---

## 🔧 Advanced: Add Custom Styles

To add your own custom styles:

1. **Create a new CSS rule** in `styles/blog-content-custom.css`:

```css
article .my-custom-box {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl my-8;
}
```

2. **Import it** in `app/globals.css`:

```css
@import "../styles/blog-content-custom.css";
```

3. **Use it** in your blog content:

```html
<div class="my-custom-box">
  This will have a purple-pink gradient background!
</div>
```

---

## 🎯 Real Example: Enhance Your CertifyPro Post

Run this SQL to update your existing post:

```sql
UPDATE posts
SET content = replace(
  content,
  '<h2>🌟 Key Features of CertifyPro</h2>',
  '<h2>🌟 Key Features of CertifyPro</h2>
  <div data-infobox="success">
    CertifyPro offers 10+ features designed to make certificate creation effortless and professional.
  </div>'
)
WHERE slug = 'your-post-slug';
```

---

## 📱 Test Your Changes

1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/blog/[your-slug]`
3. Check both light and dark modes
4. Test on mobile, tablet, and desktop
5. View in print preview

---

## ✅ Checklist for Great Content

- [ ] Use info boxes for important points
- [ ] Replace plain lists with styled lists (checklist, features, steps)
- [ ] Add pull quotes for key takeaways
- [ ] Use highlight for important terms
- [ ] Add CTA buttons where appropriate
- [ ] Include statistics boxes for metrics
- [ ] Format FAQs properly
- [ ] Add alt text to all images
- [ ] Test on mobile devices
- [ ] Check dark mode appearance

---

## 🆘 Need More Help?

- See [CONTENT_CUSTOMIZATION_GUIDE.md](CONTENT_CUSTOMIZATION_GUIDE.md) for detailed info
- Check [lib/content-processor.ts](lib/content-processor.ts) for processing functions
- View [styles/blog-content-custom.css](styles/blog-content-custom.css) for all available styles

---

**Last Updated:** January 2026
