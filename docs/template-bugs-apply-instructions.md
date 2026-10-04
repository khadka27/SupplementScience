# Template bugs fix: apply instructions for the developer

Date: 2026-10-03
Patch file: `template-bugs-fix.patch` (in the same folder as this file)
Repo: the Next.js app (tested against the public `khadka27/supplementscience` HEAD)

## What the patch fixes

**Bug 1: fabricated reviewer persona.** Every ingredient page showed "Fact-checked by
Dr. Sarah Lin" with a "PharmD Verified" chip, fake credentials, and a stock photo.
The seed file also planted two more invented people ("Dr. Marcus Vance, MD" and
"Elena Rostova, MS, RD") as reviewers, plus a fabricated author bio.

**Bug 2: fabricated clinical data on every ingredient page.** The ingredient template
rendered hardcoded ashwagandha statistics (48 RCTs, cortisol -27.9%, withanolides,
Solanaceae family, KSM-66/Thorne product references) under every ingredient's title,
including vitamin D and magnesium.

## Changes in the patch (5 files)

1. `components/redesign/EvidenceScorecard.tsx`
   - Badge now reads "Fact-checked by the SupplementDecoded Research Editorial Team".
   - Removed the portrait photo, the "PharmD Verified" chip, and the credentials line.
   - Removed the now-unused `next/image` import.
2. `components/redesign/ClinicalIngredientDossier.tsx`
   - Default reviewer props changed to the company wording (no persona).
3. `app/(public)/ingredients/[slug]/page.tsx`
   - Real ingredient articles now render with the standard `BlogPostContent` article
     template (the same one guides use), so no fabricated statistics are shown.
   - The ashwagandha blueprint fallback keeps the dossier layout (its data is
     ashwagandha-specific by design) but now shows the company badge.
4. `prisma/seed-ingredients.ts`
   - All `factCheckedBy` / `reviewedBy` values replaced with the company wording.
   - The fabricated "Dr. Sarah Lin" author seed replaced with the editorial team.
5. `components/contact/ContactForm.tsx`
   - Name field placeholder no longer uses an invented person's name.

## How to apply

```bash
cd /path/to/repo
git apply template-bugs-fix.patch   # or: patch -p1 < template-bugs-fix.patch
pnpm build                          # verify it compiles
# deploy as usual
```

## Database cleanup (do this too)

The patch fixes the code and future seeds, but rows already in the database may still
contain the fabricated names. Run these checks and clear/replace any hits:

- `Author` table: look for slug `dr-sarah-lin` or name containing "Sarah Lin".
  Repoint any linked posts to the editorial-team author (or remove the link).
- `Post` table: `factCheckedBy` / `reviewedBy` containing "Sarah Lin",
  "Marcus Vance", or "Elena Rostova". Replace with
  "SupplementDecoded Research Editorial Team" or clear the field.

## Verify after deploy

- [ ] No "Dr. Sarah Lin" text, portrait, "PharmD Verified" chip, or personal
      credentials on any ingredient page (check vitamin D, magnesium, creatine,
      whey, omega-3, turmeric, ashwagandha, probiotics).
- [ ] Badge reads "Fact-checked by the SupplementDecoded Research Editorial Team".
- [ ] Vitamin D / magnesium / other ingredient pages show their own article content
      only: no withanolides, cortisol, Solanaceae, KSM-66, or "48 RCTs" claims.
- [ ] Ingredient pages still show title, featured image, in-body images, sources,
      and metadata exactly as before (only the dossier/badge sections changed).
