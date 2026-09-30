# UI/UX Redesign Prompt: SupplementDecoded.com
## Optimized for elderly readers (US adults 60+)

Copy and paste the brief below into your designer handoff or AI builder.

---

## Project brief

Redesign the UI/UX of **SupplementDecoded.com**, an evidence-based, anti-scam supplement information website. The site publishes plain-language, research-backed guides about supplements: what the evidence supports, what it does not, dosage, safety, and how to avoid scams.

**Primary audience:** US adults aged 60 and older. Assume declining vision, reduced contrast sensitivity, arthritis or tremor affecting precise tapping, lower digital confidence, and in many cases slower internet. Many readers arrive worried they have been scammed or are about to buy something useless. The design must feel calm, trustworthy, and effortless.

**Non-negotiable brand traits:** honest, independent, zero affiliate links, zero sponsored content, company voice (no fake author personas). The design must never use dark patterns: no popups that are hard to close, no fake urgency, no disguised ads, no newsletter traps.

## Core principles

1. Readability beats beauty. If a design choice makes text even slightly harder to read, reject it.
2. One task per screen. Never make the reader hunt.
3. Trust is visual. Transparency elements (sources, methods, disclaimers) must be visible, not buried.
4. Forgiving interaction. Big targets, clear feedback, easy undo, no tiny controls.

## Typography and readability

- Body text minimum 18px (1.125rem), line height 1.6 or greater.
- Use a highly legible serif or humanist sans for body (e.g., Source Serif, Georgia, Atkinson Hyperlegible). Never use thin or light font weights for body text.
- Headings clearly larger than body with strong visual hierarchy. Maximum 3 heading levels visible on a page.
- Line length capped at 60 to 70 characters.
- Never set body text in light gray. Body text must meet WCAG AA contrast (4.5:1 minimum); aim for AAA (7:1) on main content.
- Support 200 percent browser zoom without horizontal scrolling or overlapping elements.
- Include a visible text-size control (A- / A+) in the header.

## Color and contrast

- High-contrast palette: dark text on off-white or white backgrounds. Avoid pure black on pure white if it causes glare complaints; very dark gray (#1a1a1a) on warm white (#fefefe) is fine.
- Never convey meaning by color alone. Pair every color cue with text or an icon (e.g., a warning is an icon plus the word "Warning", not just red text).
- Links must be obviously links: underlined, with a color distinct from body text, plus a clear hover and keyboard focus state (visible outline, never removed).
- Respect `prefers-reduced-motion` and `prefers-contrast` user settings.

## Navigation and wayfinding

- Maximum 5 to 6 top-level nav items with plain-language labels a 70-year-old would use (e.g., "Vitamins & Ingredients", "Safety Guides", "Avoiding Scams", "About Us"). No jargon, no clever labels.
- Sticky, slim header with: logo, nav, large search box, text-size control. Keep it under 80px tall.
- Prominent on-page search with a large input field, large button, and typo-tolerant results ("vitimin D" should find "vitamin D").
- Breadcrumbs on every article and guide (Home > Ingredients > Vitamin D).
- A clear "Back to top" button on long pages.
- Footer with large, well-spaced links: About, Editorial Policy, Medical Disclaimer, Contact, Privacy. The medical disclaimer must be reachable within one click from any article.

## Article and guide pages

- Start every article with a short "Key takeaways" box: 3 to 5 bullet points in plain language, readable in 30 seconds. Many elderly readers will read only this.
- Follow with a clear verdict-style summary where appropriate ("What the evidence shows"), then full detail for those who want it.
- Short paragraphs (2 to 4 sentences), frequent descriptive subheadings, generous whitespace. No walls of text.
- A visible "Talk to your doctor or pharmacist" callout box on every health article, placed near dosage and safety sections.
- Sources section: numbered, clickable, with publisher names shown in plain text (e.g., "National Institutes of Health"), not bare URLs.
- "Last reviewed" date displayed near the top of every article. Elderly readers check dates carefully.
- One primary call to action per page at most. No competing buttons.

## Touch, input, and interaction

- All buttons and links: minimum 48 by 48px touch target, with visible spacing between adjacent targets.
- Buttons look like buttons: solid fill, clear label verbs ("Read the safety guide", not "Submit").
- Forms (contact, search): large inputs, labels above fields (never placeholder-only), large error messages in plain language next to the field, and no timeouts that wipe entered text.
- No hover-dependent content. Everything must work with tap and keyboard.
- No autoplay video or audio. No infinite scroll. No carousels that move on their own.
- Any modal or popup must have a large, clearly labeled close button ("Close", with an X icon). Default to avoiding popups entirely.

## Trust and anti-scam signals (audience-specific)

- A short, plain-language trust statement near the top of the homepage: who we are, that we take no money from supplement companies, and how we are funded.
- "How we review evidence" linked from every article, written at an 8th-grade reading level.
- Scam-warning content styled distinctly (bordered callout with shield icon) so readers instantly recognize warnings.
- Testimonials, if used, must be real and labeled; never fabricate social proof. This audience has been burned by fake reviews.

## Accessibility compliance

- Meet WCAG 2.2 AA at minimum across the site.
- Full keyboard navigation with visible focus indicators on every interactive element.
- Semantic HTML: one H1 per page, logical heading order, landmark regions, skip-to-content link.
- Descriptive alt text on all informative images; decorative images marked empty.
- Screen-reader tested labels on icon-only buttons.
- Captions or transcripts for any video or audio.

## Performance

- Pages must load in under 3 seconds on a mid-range phone over 4G.
- Optimize and lazy-load images (WebP), but never at the cost of layout shift. Reserve image dimensions to prevent content jumping.
- No heavy animation libraries or blocking third-party scripts.

## Mobile experience

- Design mobile-first: most elderly readers browse on phones or tablets, often with system text enlarged.
- Single-column article layout on mobile. No sidebars squeezing content.
- Phone numbers and contact options tappable. Consider a prominent "Questions? Contact us" link, since this audience prefers asking a person over searching.

## What to avoid (explicit do-not list)

- Small gray text, thin fonts, low-contrast color schemes.
- Hamburger-only navigation with no visible labels.
- Jargon: "bioavailability", "nootropics", "adaptogens" without plain-language explanations on first use.
- Multiple competing calls to action, newsletter popups, exit-intent overlays.
- Stock photos of young fitness models. Use imagery reflecting adults 60+, or neutral illustrations.
- Auto-playing anything. Infinite scroll. Tiny close buttons.

## Acceptance criteria

1. A 70-year-old first-time visitor can find "is vitamin D safe?" and read the key takeaways within 60 seconds, on a phone, without help.
2. The site passes automated WCAG 2.2 AA checks (e.g., axe) with zero critical violations, plus a manual keyboard-only walkthrough.
3. Text remains fully readable and functional at 200 percent zoom.
4. A moderated usability test with at least 5 adults aged 65+ completes core tasks (find an ingredient, find the medical disclaimer, contact the site) with no assistance.
5. Lighthouse performance score 90+ on mobile, accessibility score 100.

## Deliverables

- Homepage, article page, guide/listing page, and category page mockups at mobile (360px), tablet (768px), and desktop (1280px).
- A simple component list: header, footer, takeaway box, warning callout, doctor callout, source list, buttons, form fields.
- A short style guide: type scale, color tokens with contrast ratios documented, spacing rules.
