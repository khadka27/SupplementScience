# 📋 Step-by-Step Guide: Customize Your Blog Content

This guide will walk you through customizing your blog post content with beautiful styling, using your CertifyPro post as an example.

---

## 🎯 What We'll Do

1. Preview available styles
2. Update your database content
3. Test the changes
4. Fine-tune the styling

**Time Required:** 15-30 minutes

---

## Step 1: Preview Available Styles

### Open the preview file

1. Navigate to your project folder: `d:\office\SupplementDecoded`
2. Double-click `styling-preview.html`
3. Your browser will open showing all available styles

**What you'll see:**

- Info boxes (blue, yellow, green, purple)
- Checklists with checkmarks
- Feature lists with cards
- Numbered steps
- Statistics boxes
- Comparison layouts
- And more!

---

## Step 2: Choose Styles for Your Content

Look at your current CertifyPro post content and decide where to add styles:

### Recommended Enhancements:

| Current Section       | Suggested Style                       |
| --------------------- | ------------------------------------- |
| "What is CertifyPro?" | Add info box with TL;DR               |
| Features list         | Convert to checklist or feature cards |
| Step-by-step usage    | Use numbered steps                    |
| "10 Unique Templates" | Add statistics box                    |
| Tech stack list       | Use checklist with ✅                 |
| Benefits section      | Use feature cards                     |

---

## Step 3: Connect to Your Database

### Option A: Using PostgreSQL GUI (pgAdmin, DBeaver, etc.)

1. Open your database tool
2. Connect to your database
3. Find the `posts` table
4. Locate your post by slug

### Option B: Using Prisma Studio

```bash
cd d:\office\SupplementDecoded
pnpm prisma studio
```

This opens a web interface at `http://localhost:5555`

### Option C: Using SQL Command Line

```bash
psql -U your_username -d your_database_name
```

---

## Step 4: Update Your Content

### Start with Simple Changes

Copy this SQL and adjust the slug to match your post:

```sql
-- Add an info box to the introduction
UPDATE posts
SET content = replace(
  content,
  '<h2>✅ What is CertifyPro?</h2>
<p><strong>CertifyPro</strong> is a web-based certificate generator',
  '<h2>✅ What is CertifyPro?</h2>
<div data-infobox="info">
  <strong>TL;DR:</strong> Modern web app that generates professional product certificates in seconds using Next.js. Choose templates, customize content, export as PDF/Image/DOCX.
</div>
<p><strong>CertifyPro</strong> is a web-based certificate generator'
)
WHERE slug = 'your-certifypro-post-slug';
```

**Replace:** `'your-certifypro-post-slug'` with your actual post slug!

---

### Add Checklist to Features

```sql
-- Convert features list to checklist
UPDATE posts
SET content = replace(
  content,
  '<ul>
<li><p>Choose a template</p></li>
<li><p>Paste or edit certificate content</p></li>
<li><p>Upload branding elements (logo, signature, stamp)</p></li>
<li><p>Preview instantly</p></li>
<li><p>Download in your required format</p></li>
</ul>',
  '<ul class="checklist">
<li><strong>Choose a template</strong> - Select from 10 unique designs</li>
<li><strong>Customize content</strong> - Edit certificate text with live preview</li>
<li><strong>Upload branding</strong> - Add logo, signature, and stamp</li>
<li><strong>Preview instantly</strong> - See changes in real-time</li>
<li><strong>Download</strong> - Export as PDF, PNG/JPG, or DOCX</li>
</ul>'
)
WHERE slug = 'your-certifypro-post-slug';
```

---

### Add Statistics Box

```sql
-- Add a stat box for templates count
UPDATE posts
SET content = replace(
  content,
  '<h3>✅ 10 Unique Certificate Templates</h3>',
  '<h3>✅ 10 Unique Certificate Templates</h3>
<div class="stat-box">
  <div class="number">10+</div>
  <div class="label">Professional Templates</div>
</div>'
)
WHERE slug = 'your-certifypro-post-slug';
```

---

### Convert to Numbered Steps

```sql
-- Add step-by-step instructions
UPDATE posts
SET content = replace(
  content,
  '<h2>🚀 How to Use CertifyPro</h2>',
  '<h2>🚀 How to Use CertifyPro</h2>
<ol class="steps">
  <li>Navigate to CertifyPro and choose your favorite template from 10 options</li>
  <li>Enter or paste your certificate content in the editor</li>
  <li>Upload your branding elements (company logo, signature, stamp)</li>
  <li>Preview your certificate with live updates</li>
  <li>Download in your preferred format (PDF, PNG/JPG, or DOCX)</li>
</ol>'
)
WHERE slug = 'your-certifypro-post-slug';
```

---

## Step 5: Test Your Changes

### Start the development server:

```bash
cd d:\office\SupplementDecoded
pnpm dev
```

### Open your browser:

Navigate to: `http://localhost:3000/blog/[your-slug]`

Replace `[your-slug]` with your actual post slug.

---

## Step 6: Check the Results

### What to verify:

- [ ] **Info boxes** display with colored borders
- [ ] **Checklists** show green checkmarks (✅)
- [ ] **Statistics boxes** have large numbers
- [ ] **Numbered steps** show circular badges
- [ ] **All content** is readable and properly formatted
- [ ] **Mobile view** looks good (resize browser)
- [ ] **Dark mode** works (toggle theme)

---

## Step 7: Fine-Tune (Optional)

### If something doesn't look right:

#### Info box colors not showing?

Check if you used the correct attribute:

```html
<div data-infobox="tip">
  <!-- Correct -->
  <div class="infobox-tip"><!-- Wrong --></div>
</div>
```

#### Checklist not showing checkmarks?

Make sure the class is correct:

```html
<ul class="checklist">
  <!-- Correct -->
  <ul class="check-list">
    <!-- Wrong -->
  </ul>
</ul>
```

#### Styles not applying at all?

1. Clear browser cache (Ctrl + Shift + R)
2. Restart dev server (Ctrl + C, then `pnpm dev`)
3. Check `app/globals.css` was updated

---

## Step 8: Deploy Changes

### When you're happy with the results:

1. **Commit your changes:**

```bash
git add .
git commit -m "Enhanced blog content styling"
git push
```

2. **Database changes:**

   - If using remote database, run the same SQL queries on production
   - Or export/import the updated content

3. **Deploy your app:**

```bash
pnpm build
# Then deploy to your hosting (Vercel, Netlify, etc.)
```

---

## 📊 Before & After Example

### Before:

```html
<h2>Key Features</h2>
<ul>
  <li>10 templates</li>
  <li>Live preview</li>
  <li>Multiple formats</li>
</ul>
```

### After:

```html
<h2>🌟 Key Features</h2>
<div data-infobox="success">CertifyPro offers 10+ powerful features!</div>
<ul class="features">
  <li><strong>10 Unique Templates</strong> - Choose from diverse designs</li>
  <li><strong>Live Preview</strong> - See changes instantly</li>
  <li><strong>Multiple Formats</strong> - Export as PDF, Image, or DOCX</li>
</ul>
<div class="stat-box">
  <div class="number">3</div>
  <div class="label">Export Formats</div>
</div>
```

---

## 🎨 Quick Reference: HTML to Copy

### Info Box (Blue)

```html
<div data-infobox="tip"><strong>💡 Pro Tip:</strong> Your helpful tip here</div>
```

### Info Box (Yellow Warning)

```html
<div data-infobox="warning">
  <strong>⚠️ Warning:</strong> Important notice here
</div>
```

### Checklist

```html
<ul class="checklist">
  <li>Item one</li>
  <li>Item two</li>
</ul>
```

### Feature List

```html
<ul class="features">
  <li><strong>Feature Name</strong> - Description here</li>
</ul>
```

### Numbered Steps

```html
<ol class="steps">
  <li>First step description</li>
  <li>Second step description</li>
</ol>
```

### Statistics Box

```html
<div class="stat-box">
  <div class="number">10+</div>
  <div class="label">Templates Available</div>
</div>
```

### Comparison

```html
<div class="comparison-table">
  <div class="comparison-card">
    <h3>Option A</h3>
    <p>Description of option A</p>
  </div>
  <div class="comparison-card">
    <h3>Option B</h3>
    <p>Description of option B</p>
  </div>
</div>
```

---

## 🆘 Troubleshooting

### Problem: Styles not showing

**Solution:**

1. Check browser console for errors (F12)
2. Verify custom CSS is in `app/globals.css`
3. Clear cache and hard reload (Ctrl + Shift + R)

### Problem: Content looks broken

**Solution:**

1. Check HTML syntax (matching opening/closing tags)
2. Verify quotes are properly escaped in SQL
3. Test in `styling-preview.html` first

### Problem: Database update didn't work

**Solution:**

1. Check if slug matches exactly
2. Look for SQL syntax errors
3. Use `LIKE` operator for partial matching:

```sql
WHERE slug LIKE '%certify%'
```

---

## ✅ Checklist: Did You Complete Everything?

- [ ] Viewed `styling-preview.html`
- [ ] Connected to database
- [ ] Updated content with new styles
- [ ] Tested on `localhost:3000`
- [ ] Checked mobile view
- [ ] Verified dark mode
- [ ] Committed changes
- [ ] Deployed to production

---

## 🎉 Congratulations!

You've successfully customized your blog content with professional styling!

### Next Steps:

1. Apply these styles to other blog posts
2. Create templates for common post types
3. Customize colors in `globals.css` to match your brand
4. Share your beautiful content!

---

## 📚 More Resources

- [CUSTOMIZATION_SUMMARY.md](CUSTOMIZATION_SUMMARY.md) - Overview of all changes
- [QUICK_CUSTOMIZATION_EXAMPLES.md](QUICK_CUSTOMIZATION_EXAMPLES.md) - Copy-paste examples
- [CONTENT_CUSTOMIZATION_GUIDE.md](CONTENT_CUSTOMIZATION_GUIDE.md) - Detailed guide
- [update-blog-content.sql](update-blog-content.sql) - SQL templates

---

**Need help?** Review the documentation files or check the inline comments in the code!
