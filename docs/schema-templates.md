# SupplementDecoded Schema Templates

JSON-LD templates for the site rebuild. Replace every `ALL-CAPS` placeholder.
All URLs must be absolute (`https://www.supplementdecoded.com/...`), never relative.
Entities link together with `@id` references. Do not invent authors, reviewers, or credentials.

---

## 1. Organization (every page, in `<head>`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.supplementdecoded.com/#organization",
  "name": "SupplementDecoded",
  "url": "https://www.supplementdecoded.com/",
  "logo": "https://www.supplementdecoded.com/logo.png",
  "description": "Independent, evidence-based supplement information. No affiliate links, no sponsored content, no manufacturer compensation.",
  "publishingPrinciples": "https://www.supplementdecoded.com/editorial-policy",
  "correctionsPolicy": "https://www.supplementdecoded.com/editorial-policy",
  "ethicsPolicy": "https://www.supplementdecoded.com/editorial-independence",
  "knowsAbout": [
    "Dietary Supplements",
    "Clinical Trial Evidence",
    "Supplement Safety & Bioavailability",
    "Pharmacology & Nutrient Interactions",
    "Evidence-Based Nutritional Science"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "editorial research inquiries",
    "url": "https://www.supplementdecoded.com/contact"
  }
}
```

Notes:
- Omit `sameAs` entirely until the site has real social profiles. Never ship placeholder URLs.
- `logo.png` must return HTTP 200 (verified 2026-10-12).
- Links directly to `publishingPrinciples` and `ethicsPolicy` for maximum E-E-A-T trust signals.

## 2. Editorial team entity (every article page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.supplementdecoded.com/#editorial-team",
  "name": "SupplementDecoded Research Editorial Team",
  "url": "https://www.supplementdecoded.com/about",
  "parentOrganization": { "@id": "https://www.supplementdecoded.com/#organization" },
  "description": "Editorial team that checks supplement marketing claims against published research and regulator guidance from the FDA, NIH, NCCIH, CDC, and peer-reviewed journals.",
  "publishingPrinciples": "https://www.supplementdecoded.com/editorial-policy",
  "knowsAbout": [
    "Systematic Reviews & Meta-Analyses",
    "Randomized Controlled Trial (RCT) Evaluation",
    "Supplement Claim Verification",
    "Regulatory Guidance (FDA, FTC, EFSA)"
  ]
}
```

This replaces the old pattern of typing the team as a `Person`. Article `author` fields point at this `@id`.

## 3. WebSite (homepage only)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.supplementdecoded.com/#website",
  "name": "SupplementDecoded",
  "url": "https://www.supplementdecoded.com/",
  "publisher": { "@id": "https://www.supplementdecoded.com/#organization" }
}
```

Notes:
- No `potentialAction` / `SearchAction` until a working search page exists (the old one pointed at a 404).

## 4. BlogPosting (every article, review, and guide page)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://www.supplementdecoded.com/ARTICLE-SLUG#article",
  "headline": "ARTICLE HEADLINE",
  "description": "ARTICLE META DESCRIPTION",
  "image": ["https://www.supplementdecoded.com/images/FEATURED-IMAGE.webp"],
  "datePublished": "2026-10-12T00:00:00Z",
  "dateModified": "2026-10-12T00:00:00Z",
  "author": { "@id": "https://www.supplementdecoded.com/#editorial-team" },
  "publisher": { "@id": "https://www.supplementdecoded.com/#organization" },
  "isPartOf": { "@id": "https://www.supplementdecoded.com/#website" },
  "inLanguage": "en-US",
  "mainEntityOfPage": "https://www.supplementdecoded.com/ARTICLE-SLUG",
  "articleSection": "CATEGORY NAME"
}
```

Notes:
- `image` must be an absolute URL, not a relative path.
- Keep `BlogPosting`. Do not upgrade to `MedicalWebPage`; the content is editorial analysis, not medical advice, and the schema should say so honestly.

## 5. BreadcrumbList (every article, review, and guide page)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.supplementdecoded.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "CATEGORY NAME",
      "item": "https://www.supplementdecoded.com/category/CATEGORY-SLUG"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "ARTICLE HEADLINE",
      "item": "https://www.supplementdecoded.com/ARTICLE-SLUG"
    }
  ]
}
```

Notes:
- Every `item` must be an absolute URL (the old markup used relative paths).
- The middle item must point at the canonical category URL (e.g. `/category/supplement-safety`), never at a URL that redirects.

## 6. ClaimReview (teardown articles only)

Repeat this block once per major claim the article debunks (2 to 4 per article is typical). This is the schema built for fact-checking, and it matches the site's "the page claims X, the evidence shows Y" format exactly.

```json
{
  "@context": "https://schema.org",
  "@type": "ClaimReview",
  "url": "https://www.supplementdecoded.com/ARTICLE-SLUG",
  "claimReviewed": "CONCISE WORDING OF THE CLAIM, e.g. Melt away stubborn fat in less than a month with no diet or exercise",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 1,
    "bestRating": 5,
    "worstRating": 1,
    "alternateName": "False"
  },
  "author": { "@id": "https://www.supplementdecoded.com/#editorial-team" },
  "datePublished": "2026-10-12T00:00:00Z",
  "itemReviewed": {
    "@type": "Claim",
    "author": {
      "@type": "Organization",
      "name": "PRODUCT NAME product landing page"
    }
  }
}
```

Rating guidance:
- `alternateName` should be one of: `False`, `Mostly false`, `Unproven`, `Misleading`, `Mostly true`, `True`. Use the one the article's evidence section actually supports.
- `ratingValue`: 1 for False, 2 for Mostly false / Misleading, 3 for Unproven, 4 for Mostly true, 5 for True.
- `claimReviewed` is a plain-text summary of the marketing claim, not a quote of the whole sales page.

Hard rules:
- NEVER include the seller's landing-page URL anywhere in the schema. No `appearance` field, no link in `itemReviewed.author`. The claim text is described; the seller is never linked. This is a standing editorial rule.
- Never mark up claims the article does not actually evaluate with cited evidence.

---

## What was deliberately left out

- **Review / AggregateRating stars.** The site's job is critiquing products, not recommending them. Star markup would look manipulative and invites spam-policy scrutiny.
- **FAQPage.** Google rarely shows FAQ rich results outside large authoritative sites; not worth the markup.
- **MedicalWebPage.** Over-claims medical authority the site does not assert.

## Validation

After deploying, check any URL with Google's Rich Results Test (https://search.google.com/test/rich-results) and confirm zero errors before considering the work done.
