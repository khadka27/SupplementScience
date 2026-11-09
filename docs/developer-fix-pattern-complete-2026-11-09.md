# Complete Developer Fix Pattern: All Remaining Open Items
SupplementDecoded, https://www.supplementdecoded.com/ (Next.js)
Prepared 2026-11-09. Every item below was verified live on 2026-11-09 before this document was written.

## How to use this document
- There are 4 fixes. They are independent and can ship in one deploy.
- Work in the order given: Fix 1 and Fix 2 affect AdSense review readiness, Fix 3 affects Bing crawling, Fix 4 is sitewide footer and header wording.
- Change nothing outside this document: no page titles, no slugs, no article content, no design or layout changes.
- For each fix, run its verification steps on production before reporting it done. A fix is done only when its acceptance checks pass on the live www.supplementdecoded.com host, not on staging, preview, or a local build.
- At the end, send one confirmation message listing each fix as done, in the format given in the final section.

---

## FIX 1: Deploy the full trust pages replacement content

### Pages and URLs
1. Privacy Policy: https://www.supplementdecoded.com/privacy
2. Terms of Use: https://www.supplementdecoded.com/terms
3. Medical / Expert Review Policy: https://www.supplementdecoded.com/medical-expert-review

### Source of the content
Use the document already provided: full-content-privacy-terms-medical-review-2026-10-26.md
It contains the complete body content for all three pages: Privacy Policy 18 sections, Terms of Use 18 sections, Medical / Expert Review Policy 11 sections. Do not use the older snippets only file (trust-pages-advertising-replacements-2026-10-26.md); the full document supersedes it.

### Problem (verified live 2026-11-09)
The three pages still carry the October 4, 2026 version. They contradict the Editorial Policy page, which correctly allows contextual network advertising such as Google AdSense. The contradicting live text today:
- /privacy: "does not sell products or operate commercial advertising programs" and "We do not use cookies for advertising or behavioral tracking"
- /terms: "This website does not operate advertising programs, affiliate partnerships, sponsored placements, or referral arrangements"
- /medical-expert-review: "This site does not maintain financial relationships with supplement companies or advertisers"

### Steps
1. Open the full content document and take the section headed PAGE 1: PRIVACY POLICY.
2. Replace the entire body content of /privacy with that content. Keep the existing page design, layout, and page title.
3. Repeat with PAGE 2 for /terms, and PAGE 3 for /medical-expert-review.
4. Set the Last Updated date on all three pages to October 26, 2026, as written in the document.
5. Deploy to production.

### Acceptance checks (all must hold on the live pages)
- None of the three contradicting phrases quoted above appears on any of the three pages.
- Each page states the aligned position from the document: no affiliate programs, no sponsored content, no paid product partnerships, no referral arrangements, no manufacturer compensation, and the site may display contextual third-party network advertising such as Google AdSense to support operating costs, with advertising never influencing content.
- /privacy includes the advertising cookie disclosure from the document (third-party networks may set cookies, with the Google advertising opt-out information given there).
- All sections are present: 18 on Privacy, 18 on Terms, 11 on Medical / Expert Review. No section from the document is dropped.
- Last Updated reads October 26, 2026 on all three pages.

---

## FIX 2: IndexNow key file (routing fix)

### Problem (verified live 2026-11-09, unchanged since 2026-10-26)
- https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt returns HTTP 307 redirecting to /e7e4a887634ba2e69a2c6e9c68029e30txt (the redirect strips the dot from .txt).
- That address returns HTTP 404.
- The request never reaches the file, so changing the file contents cannot fix this. It is a routing problem: the filename is being treated like a page slug.

### The key (do not change it)
Key: e7e4a887634ba2e69a2c6e9c68029e30
Filename: e7e4a887634ba2e69a2c6e9c68029e30.txt
The key is not a password. By design, search engines read it from a public text file to confirm submissions come from the site owner.

### Steps
1. Create a plain text UTF-8 file named exactly e7e4a887634ba2e69a2c6e9c68029e30.txt (exact key, dot, txt, no uppercase, no renaming).
2. Put only the key inside it. No heading, no label, no quotation marks, no HTML, no extra words.
3. Place the file directly in the Next.js public/ folder:
   public/e7e4a887634ba2e69a2c6e9c68029e30.txt
   Not in the app router, not in an API route, not in a subfolder, not as a CMS page.
4. If the file currently exists as a page, a CMS entry, or anywhere inside app routing, move it. While it sits in routing, the redirect will keep breaking it.
5. Check the redirect and rewrite setup: exclude this exact file from any rule that strips file extensions, applies clean URLs, rewrites unknown paths to a page route, or runs in middleware before static files. Files in public/ are served directly as static assets, so served from there the slug routing will not rewrite the address.
6. Deploy to production and purge any CDN, hosting, or application cache still serving the old redirect for this address.

### Acceptance checks (all four must hold at the same time)
Run on production, from outside the local environment:
- curl -I "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt" returns HTTP 200, Content-Type begins with text/plain, and there is no Location redirect header.
- curl "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt" returns a body that is exactly the key and nothing else.
- Opening the address in a browser lands on that exact address (the address bar does not change) and shows one line of plain text.
- Do not rename the file to the extensionless address to make the redirect pass. IndexNow requires the .txt address itself to work.

### After your confirmation
Rahul will tell Muse the key file is live. Muse will verify it independently, submit the homepage as one test, then submit the full sitemap once, and track the effect in Bing Webmaster Tools. You do not need to build any IndexNow submission automation.

---

## FIX 3: Add /medical-expert-review to the sitemap

### Problem (verified live 2026-11-09)
https://www.supplementdecoded.com/medical-expert-review is live and returns HTTP 200, but it does not appear in https://www.supplementdecoded.com/sitemap.xml (0 entries, sitemap currently 132 URLs). AdSense and search reviewers look for this page; a trust page missing from the sitemap is a needless gap.

### Steps
1. Find where the sitemap is generated (the static pages list in the sitemap route or generator).
2. Add https://www.supplementdecoded.com/medical-expert-review to that list, in the same format as the other trust pages (/medical-disclaimer and /editorial-policy are already listed; match their change frequency, priority, and lastmod handling).
3. Deploy to production.

### Acceptance checks
- curl -s https://www.supplementdecoded.com/sitemap.xml shows one entry for https://www.supplementdecoded.com/medical-expert-review.
- Total sitemap count goes from 132 to 133 URLs.
- No other sitemap entry is removed or changed.

---

## FIX 4: Footer and header claim replacements

### Scope (verified live 2026-11-09)
The footer is one shared component. All five items below appear in the footer of all 132 sitemap pages (132 of 132 checked), and item 6 appears in the header of all 132 pages. Fix the shared components once; do not edit individual pages.
Full detail, with every page URL and section, is in the document already provided: footer-claims-fix-2026-11-09.md

### Item 1: Evidence Library link text
- Location: footer, Evidence Library column, last link, target /ingredients
- Current: All 384 Compounds
- Problem: only 11 ingredient monographs are published. There is no database of 384 compounds on the site.
- Replace with: All Ingredient Monographs (link target unchanged)

### Item 2: Footer top trust strip, item 1 of 3
- Current heading: Peer-Reviewed Clinical Trials
- Current subtext: Double-blind, placebo-controlled human trial evidence only.
- Problem: the word only is not true. The site also uses FDA warning letters and recalls, NIH and NCCIH fact sheets, and observational research.
- Replace heading with: Evidence From Trusted Sources
- Replace subtext with: FDA, NIH, and peer-reviewed research, cited on every page.

### Item 3: Footer top trust strip, item 3 of 3
- Current heading: Whistleblower Protection
- Current subtext: Confidential triage for reporting tainted or spiked batches.
- Problem: Protection implies a formal protection program. What the site offers is a confidential contact route, described on the Contact page as an anonymous whistleblower intake.
- Replace heading with: Report a Suspicious Product
- Replace subtext with: Confidential contact for reporting tainted or mislabeled products.

### Item 4: Methodology column link text
- Location: footer, Methodology column, third link, target /medical-expert-review
- Current: Editorial Review Board
- Problem: the site publishes as a company voice with no named board.
- Replace with: Medical Review Policy (link target unchanged)

### Item 5: Methodology column link text, for consistency
- Location: footer, Methodology column, last link, target /contact
- Current: Whistleblower Intake
- No change required to the link. Keep its wording consistent with item 3 after that change.

### Item 6: Header top bar
- Location: site header, top bar, next to Zero Sponsor Bias
- Current: Peer-Reviewed Clinical Research
- Problem: same overstatement as item 2, at the top of every page.
- Replace with: Evidence-Based, Sources Cited

### Kept exactly as is
- Footer top trust strip, item 2 of 3: Zero Sponsor Funding, subtext No affiliate links, no brand sponsorships, no kickbacks. This one is true and is the site's core promise.

### One question back to us (answer in your confirmation message)
- The Contact page FAQ states whistleblower submissions are scrubbed of metadata and IP logs. Please confirm whether the form and inbox actually do that. If they do not, tell us, and we will provide softened wording for that sentence. Do not change that page text yet.

### Acceptance checks
- Fetch any three pages (homepage, one article, /about) after deploy: none of the old texts appear (All 384 Compounds, Peer-Reviewed Clinical Trials, Double-blind subtext, Whistleblower Protection, Editorial Review Board, Peer-Reviewed Clinical Research in the header).
- The replacement texts appear in the same locations.
- Zero Sponsor Funding and its subtext are unchanged.
- All footer link targets are unchanged.

---

## Final confirmation format
After deploying, please confirm in one message, only for fixes that pass their acceptance checks on production:

Fix 1, trust pages deployed: yes or no
Fix 2, IndexNow key file live (200, text/plain, exact key, no redirect): yes or no
Fix 3, /medical-expert-review in sitemap: yes or no
Fix 4, footer and header replacements live: yes or no
Contact page metadata scrubbing actually happens: yes or no

Muse will re-verify every item live from our side after your confirmation, the same way each problem above was verified before being listed.
