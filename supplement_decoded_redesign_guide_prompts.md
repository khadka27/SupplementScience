# Supplement Decoded: Complete UI/UX Redesign Blueprint & AI Prompts

A guide and prompt library for redesigning **Supplement Decoded** into a modern, clinical-editorial, high-authority platform that eliminates the "generic AI-generated affiliate blog" look.

---

## 1. Core Visual Identity & Anti-"AI Slop" Strategy

### What Makes Supplement Sites Look "AI-Generated":
1. **Unrealistic 3D Renderings:** Floating glass pills, glowing DNA double helixes, electric liquid drops.
2. **Neon Gradient Mesh Overload:** Saturated purples, cyans, and aggressive drop shadows common in pre-made templates.
3. **Walls of SEO Monologues:** Burying the answer under 2,000 words of introductory fluff before getting to the dosage or verdict.
4. **Lack of Transparent Authority:** Generic author bylines ("Written by Admin" or "Health Team") without verifiable credentials, reviewer disclosures, or DOI links.

### The "Clinical Editorial" Fix:
* **Color Palette:**
  - Base Background: Canvas/Off-White (`#F9FAFB` or `#FBFBFA`)
  - Primary Typography: Deep Slate/Charcoal (`#0F172A`)
  - Authority Accent: Deep Forest/Pine Green (`#0E3B2F` or `#134E4A`)
  - Warning/Watchout Accent: Warm Ochre/Amber (`#D97706`)
  - Border Lines: Subdued Warm Slate (`#E2E8F0` / 1px stroke)
* **Typography:**
  - Headlines: Editorial Serif (e.g., *Fraunces*, *Newsreader*, or *Instrument Serif*) to convey journalistic rigor.
  - Interface & Body: Crisp Sans-Serif (e.g., *Plus Jakarta Sans* or *Inter*) for high-density tabular data.
* **Trust Accents:**
  - Direct PubMed/DOI link tags.
  - Reviewer avatars with linked credentials (PharmD, MD, MS, RD).
  - Explicit dosage efficacy meters (Underdosed vs. Clinically Effective vs. Ineffective).

---

## 2. Page Wireframes

### A. Supplement Detail Page (PDP) Desktop Layout

```
+-------------------------------------------------------------------------------+
| BREADCRUMBS: Home > Ingredients > Ashwagandha (Withania somnifera)             |
+-------------------------------------------------------------------------------+
| [EDITORIAL META & HERO BLOCK]                                                 |
| H1: Ashwagandha: Human Evidence, Dosage & Safety Analysis                     |
| Author: Dr. Sarah Lin, PharmD • Medically Reviewed • Updated Q4 2026          |
|                                                                               |
| +-----------------------------------+ +-------------------------------------+ |
| | CLINICAL EVIDENCE SCORE: [ A ]    | | AT-A-GLANCE CLINICAL DOSAGE         | |
| | 48 Human RCTs Analyzed            | | Therapeutic Range: 300 - 600 mg/day | |
| | Consensus: High Cortisol Efficacy | | Optimal Form: KSM-66 / Sensoril     | |
| +-----------------------------------+ +-------------------------------------+ |
+-------------------------------------------------------------------------------+
| [STICKY SUB-NAV]: 1. Overview | 2. Claims Matrix | 3. Dosage | 4. Safety | 5. Picks |
+-------------------------------------------------------------------------------+
| MAIN CONTENT (65% Col)             | SIDEBAR / STICKY DRAWER (35% Col)       |
|                                    |                                         |
| 1. EVIDENCE SCORECARD TABLE        | +-------------------------------------+ |
| Outcome       | Consensus | Effect | | "THE DECODED VERDICT"               | |
| --------------+-----------+------- | | Strong clinical proof for stress    | |
| Cortisol/Anx. | High      | Mod.   | | reduction. Overhyped for testosterone| |
| Sleep Latency | Moderate  | Small  | | in young, healthy cohorts.          | |
| Muscle Power  | Low       | Inconc.| | [Download Research Digest (PDF)]    | |
|                                    | +-------------------------------------+ |
| 2. INTERACTIVE DOSE EVALUATOR      |                                         |
| Form selector + mg input slider    | TOP LAB-TESTED PRODUCTS                 |
| Instant underdose / safety alerts  | 1. Pure Encapsulations (Best Pure)      |
|                                    | 2. Thorne Research (Best Overall)       |
| 3. ADULTERATION & CONTRAINDICATIONS| 3. Nootropics Depot (Best Value)        |
| - Thyroid interaction checklist    |                                         |
| - Liver enzyme monitoring warnings |                                         |
+------------------------------------+-----------------------------------------+
```

---

### B. Mobile Layout & UX Behavior

```
+------------------------------+
| [=] SupplementDecoded    [Q] |  <-- 52px Slim Navigation Bar
+------------------------------+
| Home > Ingredients           |
| Ashwagandha Breakdown        |
| Reviewed by Dr. Lin, PharmD  |
+------------------------------+
| [ A ] EVIDENCE GRADE         |  <-- Compact Clinical Badge
| 48 Human Trials Analyzed     |
+------------------------------+
| [Overview] [Dose] [Risks]    |  <-- Horizontal Scroll Sticky Pills
+------------------------------+
| CLINICAL OUTCOMES            |
| +--------------------------+ |
| | Stress & Cortisol        | |  <-- Swipeable Outcome Cards
| | Evidence: High           | |
| | Dose Needed: 300-600mg   | |
| +--------------------------+ |
+------------------------------+
| SAFETY & CONTRAINDICATIONS   |
| [!] Mild thyroid stimulation |  <-- Accordion Component
| [v] Show 3 Drug Interactions |
+------------------------------+
|                              |
+------------------------------+
| [ Top Brand: Thorne ($24)  ] |  <-- Persistent Sticky Bottom Drawer
| [ Read Full Verdict       ^] |      (Swipe up for quick-summary)
+------------------------------+
```

---

## 3. Production-Ready AI Generation Prompts

Feed these prompts directly into **v0.dev**, **Claude (Cursor / Artifacts)**, or provide them to your front-end team.

### Prompt 1: Homepage Hero & Clinical Search Engine
```markdown
Act as a senior principal UI/UX designer and frontend engineer specializing in medical and editorial health publications (similar to Examine.com, Labdoor, and The New England Journal of Medicine's interactive components).

Build a responsive, modern Homepage Hero section in Next.js (App Router), Tailwind CSS, and Lucide React icons for "Supplement Decoded".

Aesthetic constraints:
- Strictly NO generic AI-generated aesthetics (no floating 3D pills, no neon cyan/purple gradients, no abstract tech hexagons).
- Style: Academic-editorial meets modern utilitarian SaaS.
- Colors: Off-white canvas (#F8F9FA), slate dark typography (#0F172A), deep forest green accents (#0E3B2F), muted sage badges (#E7ECE9).
- Typography: Serif display headlines (Fraunces or Instrument Serif feel) combined with crisp sans body text.

Key components required:
1. Navigation Bar:
   - Brand logo "SUPPLEMENT DECODED" (clean bold serif with a minimalist clinical dot accent).
   - Links: "Database", "Brand Audits", "Dosage Calculators", "Methodology".
   - Search trigger button with keyboard shortcut (Cmd + K).
2. Hero Headline & Hook:
   - Punchy editorial statement emphasizing independent, lab-tested, human-trial-backed analysis.
   - Live research counter pill: "Analyzed: 1,420+ Clinical Trials • Zero Brand Sponsorships".
3. High-Utility Search Bar:
   - Prominent input field with placeholder: "Search an ingredient, symptom, or brand (e.g., Creatine, Sleep, Thorne)..."
   - Quick-filter tags underneath: "Sleep & Anxiety", "Cognitive Health", "Hormones", "Sports Performance".
4. Trust Verification Strip:
   - 4-item inline audit guarantee: "100% Peer-Reviewed", "Elemental Dosage Verification", "Heavy Metal Screen Database", "PharmD Fact-Checked".
```

---

### Prompt 2: Detail Page Hero & Evidence Matrix Component
```markdown
Build a responsive, high-credibility Supplement Detail Page (PDP) Hero and Evidence Scorecard component using Next.js (Tailwind CSS + Lucide icons).

Design Specifications:
- Tone: High-trust scientific dossier. Clean borders (1px solid #E2E8F0), no harsh dropshadows.
- Layout: Asymmetric 2-column grid.

Elements to code:
1. Header Meta Strip:
   - Breadcrumbs: Home / Ingredients / Ashwagandha (Withania somnifera)
   - Medical Reviewer Tag: Avatar, "Fact-checked by Dr. Sarah Lin, PharmD", timestamp, and link to verification audit.
2. Evidence Summary Card:
   - Big bold letter grade indicator: "[ A ] Strong Clinical Evidence".
   - 3-metric quick-bar: Human RCT Count (48), Primary Proven Outcome (Cortisol Reduction), Standard Therapeutic Dose (300–600 mg).
3. "Claims vs. Science" Data Matrix Table:
   - Columns: Claimed Outcome, Clinical Consensus (Strong / Preliminary / Ineffective), Effect Size (Pill-meter visual bar), Direct Reference (clickable DOI/PubMed micro-badge).
   - Rows: "Cortisol & Stress (High / Moderate Effect)", "Sleep Latency (Moderate / Small Effect)", "Testosterone in Healthy Men (Low / Inconclusive)".
4. Sidebar "Decoded Verdict" Block:
   - High-contrast summary box summarizing: What works, what is overhyped, and who should avoid it.
   - Clean export action: "Download 1-Page Summary PDF".
```

---

### Prompt 3: Interactive Dosage & Efficacy Evaluator
```markdown
Create an interactive React component using Tailwind CSS and Radix UI / shadcn primitives titled "Dosage & Form Evaluator".

Requirements:
1. Interactive Controls:
   - Form selection via segmented tab control:
     * Full Spectrum Root Powder
     * KSM-66 Standardized Extract (5% Withanolides)
     * Sensoril Extract (10% Withanolides)
   - Interactive dosage input: Numerical input with linked range slider (0 mg to 1200 mg).
2. Reactive Clinical Feedback State:
   - Underdosed state (<300mg): Yellow/Amber badge warning "Sub-therapeutic: Below threshold observed in stress reduction trials."
   - Optimal state (300mg - 600mg): Forest Green badge "Clinically Validated Dose: Matches 82% of peer-reviewed human trials."
   - Excessive state (>600mg): Slate/Alert badge "Diminishing Returns: No additional benefit observed in trials; potential GI discomfort."
3. Administration Checklist:
   - "Take With": Suggestion for dietary fats for lipophilic bio-actives.
   - "Optimal Timing": Evening / Post-meal guidelines.
   - "Adulteration Alert": Brief note on verifying standardized withanolide yield.
```

---

### Prompt 4: Mobile Sticky Navigation & Dynamic Bottom Sheet
```markdown
Build a mobile-first responsive sticky navigation and expandable bottom sheet component using Tailwind CSS for a medical review site.

Features:
1. Horizontal Scroll Anchor Strip:
   - Sticky top bar (`top-0 z-40 bg-white/95 backdrop-blur-md border-b`).
   - Frictionless horizontal scroll pills: "Consensus", "Dosage Table", "Adulteration Watch", "Best Brands".
   - Active state styling with a clean underline or pill fill.
2. Progressive Disclosure Accordions:
   - Collapsible sections for: "Contraindications & Drug Interactions" and "Clinical Trial Methodology".
3. Bottom Action Sheet:
   - Fixed at `bottom-0`, full width, subtle border-t and soft shadow.
   - Collapsed preview (56px): Shows #1 Rated Brand icon, name, price per effective day ($0.38/day), and an arrow toggle.
   - Expanded state (on swipe or tap): Displays quick pros/cons bullet points, third-party lab batch test date, and "Check Price" CTA.
   - Optimized for touch targets (minimum 44x44px).
```

---

### Prompt 5: Multi-Form Comparison Matrix Table
```markdown
Create a responsive comparison table component in React + Tailwind CSS that compares multiple chemical forms of a supplement (e.g., Magnesium: Glycinate vs. Citrate vs. L-Threonate vs. Oxide).

Structure:
- Sticky first column (Form Name) on mobile viewports.
- Columns:
  1. Supplement Form (with chemical formula / ionic state)
  2. Primary Clinical Indication (e.g., Sleep, Digestion, Cognition)
  3. Bioavailability Score (Visual segmented rating bar: 1 to 5 bars)
  4. Elemental Yield % (e.g., 14% elemental magnesium)
  5. GI Tolerance (High / Moderate / Laxative Risk)
  6. Supplement Decoded Verdict Badge ("Editor's Choice", "Budget Pick", "Avoid")
- Interactive Feature: Expandable row detail on click revealing study citations for that specific form.
```