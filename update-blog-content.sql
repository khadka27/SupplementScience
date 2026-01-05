-- SQL Script to Update CertifyPro Blog Post with Enhanced Styling
-- Use this script to add custom classes and styling to your existing blog content

-- ============================================
-- BACKUP FIRST (Always recommended!)
-- ============================================
-- Run this to backup your current content:
-- SELECT id, slug, content INTO posts_backup FROM posts WHERE slug = 'your-post-slug';

-- ============================================
-- Example 1: Add info box to introduction
-- ============================================
UPDATE posts 
SET content = replace(
  content,
  '<h2>✅ What is CertifyPro?</h2>',
  '<h2>✅ What is CertifyPro?</h2>
  <div data-infobox="info">
    <strong>Quick Summary:</strong> CertifyPro is a modern web-based certificate generator built with Next.js that helps you create professional product certificates instantly.
  </div>'
)
WHERE content LIKE '%What is CertifyPro%';

-- ============================================
-- Example 2: Convert plain list to checklist
-- ============================================
UPDATE posts 
SET content = replace(
  content,
  '<ul><li><p>Choose a template</p></li><li><p>Paste or edit certificate content</p></li><li><p>Upload branding elements (logo, signature, stamp)</p></li><li><p>Preview instantly</p></li><li><p>Download in your required format</p></li></ul>',
  '<ol class="steps">
    <li>Choose from 10 unique certificate templates</li>
    <li>Paste or edit your certificate content with live preview</li>
    <li>Upload branding elements (logo, signature, stamp)</li>
    <li>Preview your certificate in real-time</li>
    <li>Download in PDF, PNG/JPG, or DOCX format</li>
  </ol>'
)
WHERE content LIKE '%Choose a template%';

-- ============================================
-- Example 3: Enhance benefits list
-- ============================================
UPDATE posts 
SET content = replace(
  content,
  '<h2>🌟 Key Features of CertifyPro</h2>',
  '<h2>🌟 Key Features of CertifyPro</h2>
  <div data-infobox="success">
    CertifyPro is packed with 10+ powerful features designed to make certificate creation effortless and professional.
  </div>'
)
WHERE content LIKE '%Key Features%';

-- ============================================
-- Example 4: Add warning/tip boxes
-- ============================================
UPDATE posts 
SET content = replace(
  content,
  '<h2>⚙️ Tech Stack Used in CertifyPro</h2>',
  '<h2>⚙️ Tech Stack Used in CertifyPro</h2>
  <div data-infobox="tip">
    <strong>💡 Developer Note:</strong> CertifyPro uses modern, production-ready technologies that ensure fast performance and scalability.
  </div>'
)
WHERE content LIKE '%Tech Stack%';

-- ============================================
-- Example 5: Create a comparison section
-- ============================================
-- Add at the end of content before "Final Thoughts"
UPDATE posts
SET content = replace(
  content,
  '<h2>Final Thoughts</h2>',
  '<h2>📊 CertifyPro vs Traditional Methods</h2>
  <div class="comparison-table">
    <div class="comparison-card">
      <h3>Traditional Design Tools</h3>
      <ul>
        <li>❌ Requires design skills</li>
        <li>❌ Time-consuming</li>
        <li>❌ Need separate software</li>
        <li>❌ Manual exports</li>
      </ul>
    </div>
    <div class="comparison-card">
      <h3>CertifyPro</h3>
      <ul class="checklist">
        <li>No design skills needed</li>
        <li>Generate in seconds</li>
        <li>Web-based, no installation</li>
        <li>Multiple export formats</li>
      </ul>
    </div>
  </div>
  
  <h2>Final Thoughts</h2>'
)
WHERE content LIKE '%Final Thoughts%';

-- ============================================
-- Example 6: Add statistics boxes
-- ============================================
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
WHERE content LIKE '%10 Unique Certificate Templates%';

-- ============================================
-- Complete Rewrite Example
-- ============================================
-- If you want to completely rewrite a specific post with enhanced styling:

/*
UPDATE posts 
SET content = '
<p>In today's digital world, trust and authenticity matter more than ever. Whether you are a brand owner, manufacturer, reseller, or service provider, having a professional product certificate adds value and credibility.</p>

<div data-infobox="info">
  <strong>Why Certificates Matter:</strong> Certificates build customer trust, add professional value, and help prevent fraud.
</div>

<hr>

<h2>✅ What is CertifyPro?</h2>
<p><strong>CertifyPro</strong> is a web-based certificate generator where users can create and customize product certificates with a clean, modern, and professional UI.</p>

<ol class="steps">
  <li>Choose from 10 professional templates</li>
  <li>Customize your content with live preview</li>
  <li>Upload branding assets (logo, signature, badge)</li>
  <li>Export in PDF, PNG/JPG, or DOCX</li>
</ol>

<hr>

<h2>🎯 Why Product Certificates are Important?</h2>

<div class="comparison-table">
  <div class="comparison-card">
    <h3>✅ Builds Customer Trust</h3>
    <p>Customers feel more confident purchasing a product when they receive proof of authenticity or warranty.</p>
  </div>
  <div class="comparison-card">
    <h3>💼 Adds Professional Value</h3>
    <p>Well-designed certificates make your brand look premium and reliable.</p>
  </div>
</div>

<hr>

<h2>🌟 Key Features of CertifyPro</h2>

<div class="stat-box">
  <div class="number">10+</div>
  <div class="label">Unique Templates</div>
</div>

<ul class="features">
  <li><strong>Live Editing + Instant Preview</strong> - See changes in real-time as you type</li>
  <li><strong>Multiple Export Formats</strong> - Download as PDF, PNG/JPG, or DOCX</li>
  <li><strong>Brand Customization</strong> - Upload logos, signatures, and stamps</li>
  <li><strong>Save & Load Data</strong> - Export/import certificate data as JSON</li>
</ul>

<div data-infobox="tip">
  <strong>💡 Pro Tip:</strong> Use the JSON export feature to create templates for frequently-generated certificates!
</div>

<hr>

<h2>⚙️ Tech Stack Used</h2>

<ul class="checklist">
  <li><strong>Next.js App Router</strong> - Modern React framework</li>
  <li><strong>TypeScript</strong> - Type-safe development</li>
  <li><strong>Tailwind CSS</strong> - Utility-first styling</li>
  <li><strong>shadcn/ui</strong> - Beautiful components</li>
  <li><strong>Framer Motion</strong> - Smooth animations</li>
</ul>

<hr>

<h2>🚀 Who Can Use CertifyPro?</h2>

<p class="pull-quote">
  "Perfect for anyone who needs to generate professional certificates quickly and efficiently."
</p>

<ul class="checklist">
  <li>Product manufacturers</li>
  <li>Online brands and ecommerce sellers</li>
  <li>Warranty providers</li>
  <li>Quality assurance companies</li>
  <li>Training & certificate providers</li>
  <li>Compliance and documentation teams</li>
</ul>

<hr>

<h2>Final Thoughts</h2>

<div data-infobox="success">
  CertifyPro makes certificate creation simple, fast, and premium. Generate professional certificates instantly using modern templates and export in the format you need.
</div>

<p>With features like editable content, badge/signature upload, instant preview, and downloads in PDF/Image/DOCX, CertifyPro becomes a powerful tool for businesses and individuals who value professionalism and speed.</p>
'
WHERE slug = 'your-post-slug';
*/

-- ============================================
-- View your changes
-- ============================================
-- SELECT slug, substring(content, 1, 200) as preview 
-- FROM posts 
-- WHERE slug = 'your-post-slug';

-- ============================================
-- Rollback (if needed)
-- ============================================
-- If you backed up your data, you can restore it:
-- UPDATE posts 
-- SET content = (SELECT content FROM posts_backup WHERE slug = 'your-post-slug')
-- WHERE slug = 'your-post-slug';
