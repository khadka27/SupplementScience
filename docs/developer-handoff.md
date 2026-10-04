# SupplementDecoded: developer handoff (repo-only fixes)

Date: 2026-10-03
Site: https://www.supplementdecoded.com/ (Next.js)

Everything in this document requires code or infrastructure access. Content, metadata, and images that could be fixed through the admin panel have already been handled.

## P0, urgent: trust and safety

### 1. Wrong ingredient data on ingredient pages (data mix-up)
- `/ingredients/vitamin-d` and `/ingredients/magnesium` render ashwagandha clinical data (cortisol, withanolides, "Solanaceae family", "Therapeutic Indication Verified", 48 RCTs) under their own titles. The new "Clinical Monograph" template is binding the wrong ingredient dataset to these pages.
- Fix: each ingredient page must render its own ingredient's dataset. Verify by checking that no ashwagandha terms (withanolides, cortisol, Solanaceae) appear on non-ashwagandha ingredient pages.
- This is the most dangerous bug on the site: wrong medical data under the right title, served to a largely elderly readership.

### 2. Fabricated reviewer persona on ingredient pages
- Every ingredient page renders: "Fact-checked by Dr. Sarah Lin", a "PharmD Verified" chip, "PharmD, BCPS • Clinical Pharmacology • Updated Q4 2026", and a circular stock portrait (Unsplash photo-1559839734-2b71ea197ec2, alt "Dr. Sarah Lin"). Embedded page data has `"reviewerName":"Dr. Sarah Lin","reviewerCredentials":"PharmD, BCPS • Clinical Pharmacology","lastUpdated":"Q4 2026"`.
- The admin "Fact Checked By" / "Reviewed By" fields are EMPTY on these posts and the name appears nowhere in the admin, so this is hardcoded in the template (or its default). There is no reviewer avatar field in the admin.
- Required change: replace the entire badge with company wording, no named person, no photo, no personal credentials:
  - Badge text: "Fact-checked by the SupplementDecoded Research Editorial Team"
  - Remove the portrait, the "PharmD Verified" chip, the "PharmD, BCPS • Clinical Pharmacology" credentials line, and the "Updated Q4 2026" date (or use the article's real last-updated date)
  - Clear the hardcoded `reviewerName` / `reviewerCredentials` values in the embedded page data
  - If the template falls back to a default reviewer when the post field is empty, change that default to the company wording above
- Why: the site's editorial policy forbids invented personas and publishes as a company voice. A fictional clinician with specific credentials, presented as fact-checker, is deceptive.

## P1: media and social

### 3. Uploaded images are deleted on redeploy (persistent storage needed)
- All 22 images uploaded via the admin on 2026-09-30 were deleted from `/images/` during the redesign deploy; their URLs returned a placeholder SVG ("Image not available"). They were re-uploaded on 2026-10-02 and are live now, but will break again on the next deploy.
- Fix: move admin uploads to persistent object storage (S3 / R2 / Vercel Blob or equivalent) instead of ephemeral local disk.

### 4. Broken default social image
- `https://www.supplementdecoded.com/og-default.jpg` redirects to `/og-defaultjpg`, which 404s. Every article's `og:image` points at this broken file. The homepage `og:image` tag was removed instead of fixed, and `/contact` has no `og:image`.
- Fix: restore a valid default share image and point all pages' `og:image` at a working file (per-page images where available, default otherwise).

### 5. Stale Twitter card metadata
- All pages still render the old generic Twitter title ("SupplementDecoded | Evidence-Based Supplement Information") and description, and `twitter:image` points at the broken `og-default.jpg`.
- Fix: generate Twitter card title/description/image from the same per-page metadata used for Open Graph.

## P2: SEO technical

### 6. Sitemap cleanup
- Remove the dead URL `https://www.supplementdecoded.com/ingredients/omega 3 fatty acids` (returns 404; note the literal spaces).
- Add the missing pages `/medical-disclaimer` and `/editorial-policy`.

### 7. Redirects
- 301 redirect `/ingredients/omega 3 fatty acids` (URL-encoded) to `/ingredients/omega-3`.
- 301 redirect `/how-to-choose-the-best-joint-pain-supplement-safely` to `/joint-pain/joint-pain-management-guide` (site owner decision: the management guide is the primary page; it is more readable and has stronger E-E-A-T signals). Remove the old URL from the sitemap after redirecting.

### 8. Doubled brand name in titles (template bug)
- The site appends " | SupplementDecoded" to the meta title. On article/blog/guide pages this renders correctly (single brand). On static pages (`/about`, `/contact`, `/category`) and category pages, the stored title already contains the brand, so it renders twice (e.g. "About Us | SupplementDecoded | SupplementDecoded").
- Fix: make title generation consistent, single source of the brand suffix. Note: `/about`, `/contact`, and `/category` are not editable in the admin, so their titles/descriptions can only be fixed here.

### 9. Homepage metadata
- Homepage title is 91 characters with a doubled brand name; description is 185 characters (truncates in search). The homepage is not editable in the admin.
- Suggested: title "Independent Supplement Research & Scam Analysis | SupplementDecoded" (or shorter), description under 155 characters in the same vein.

### 10. Ingredients index page
- `https://www.supplementdecoded.com/ingredients` shows "No ingredients found" plus a stale card linking to the 404 omega-3 URL. The four ingredient articles exist as Blog posts with Category = Ingredients but the index does not list them.
- Fix: make the index query published posts with Category = Ingredients, and drop the stale card.

## Verification checklist (after deploy)
- [ ] Vitamin D page shows vitamin D data only (no withanolides/cortisol/Solanaceae); same check for magnesium, turmeric, creatine, whey, omega-3, probiotics
- [ ] No "Dr. Sarah Lin" text or portrait anywhere on ingredient pages; companywording badge present
- [ ] All `/images/*` URLs referenced by pages return real images (not the placeholder SVG), including after a fresh deploy
- [ ] Social share debugger shows a valid image for homepage, articles, and contact page
- [ ] Sitemap contains no 404 URLs and includes the disclaimer/editorial pages
- [ ] Old omega-3 and old joint-pain URLs return 301 to their new locations
- [ ] No page title contains the brand name twice

## Context for the developer
- Admin panel capabilities and limits were inventoried on 2026-09-30: per-post SEO fields (meta title/description), featured image upload, rich text body. No site-wide SEO settings, no homepage editor, no redirects manager, no sitemap/robots controls, no media library. Anything not listed here as admin-editable needs code.
- The site owner (non-technical) has approved all items above. Questions about editorial wording go to him; questions about implementation are yours to decide.
