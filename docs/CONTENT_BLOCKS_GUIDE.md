# Content Blocks Usage Guide

## Overview

This guide shows you how to use the special content blocks in your blog posts to create professional supplement articles.

## Available Content Blocks

### 1. Quick Summary Block

**Purpose**: Provide a TL;DR at the start of your article

**Usage**:

```html
<div class="content-block quick-summary">
  <h3>Quick Summary</h3>
  <ul>
    <li>Creatine monohydrate is the most researched supplement</li>
    <li>Increases strength by 5-15% in most users</li>
    <li>Recommended dose: 3-5g daily</li>
    <li>Safe for long-term use</li>
  </ul>
</div>
```

---

### 2. Benefits Block

**Purpose**: Highlight key benefits of a supplement

**Usage**:

```html
<div class="content-block benefits-block">
  <h3>Key Benefits</h3>
  <ul>
    <li><strong>Muscle Growth</strong>: Increases lean muscle mass</li>
    <li><strong>Performance</strong>: Improves high-intensity exercise</li>
    <li><strong>Recovery</strong>: Reduces muscle damage</li>
    <li><strong>Brain Health</strong>: May improve cognitive function</li>
  </ul>
</div>
```

---

### 3. Dosage & Timing Block

**Purpose**: Provide clear dosing instructions

**Usage**:

```html
<div class="content-block dosage-block">
  <h3>How to Take</h3>
  <p><strong>Standard Dose:</strong> 3-5g daily</p>
  <p>
    <strong>Loading Phase (Optional):</strong> 20g daily for 5-7 days, split
    into 4 doses
  </p>
  <p><strong>Timing:</strong> Take with meals or post-workout</p>
  <p><strong>Mix With:</strong> Water, juice, or protein shake</p>
</div>
```

---

### 4. Warnings & Side Effects Block

**Purpose**: Clearly communicate potential risks

**Usage**:

```html
<div class="content-block warning-block">
  <h3>Warnings & Side Effects</h3>
  <p><strong>Common Side Effects:</strong></p>
  <ul>
    <li>Mild stomach discomfort (rare)</li>
    <li>Water retention</li>
    <li>Weight gain (from muscle growth)</li>
  </ul>
  <p><strong>Who Should Avoid:</strong></p>
  <ul>
    <li>People with kidney disease</li>
    <li>Pregnant or nursing women</li>
    <li>Children under 18</li>
  </ul>
  <p>
    <strong>Important:</strong> Consult your doctor before starting any new
    supplement.
  </p>
</div>
```

---

### 5. Timeline/Schedule Block

**Purpose**: Show when to take supplements throughout the day

**Usage**:

```html
<div class="content-block timeline-block">
  <h3>Daily Schedule</h3>
  <ul>
    <li><strong>Morning (7 AM):</strong> 1,000mg Vitamin D + Omega-3</li>
    <li><strong>Pre-Workout (5 PM):</strong> 5g Creatine + 200mg Caffeine</li>
    <li><strong>Post-Workout (6:30 PM):</strong> 25g Protein Powder</li>
    <li><strong>Evening (9 PM):</strong> 400mg Magnesium + 5mg Melatonin</li>
  </ul>
</div>
```

---

## Comparison Tables

### Usage in Editor:

```html
<table>
  <thead>
    <tr>
      <th>Supplement</th>
      <th>Dosage</th>
      <th>Best For</th>
      <th>Price Range</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Creatine Monohydrate</td>
      <td>3-5g/day</td>
      <td>Strength & Muscle Growth</td>
      <td>$</td>
    </tr>
    <tr>
      <td>Beta-Alanine</td>
      <td>2-5g/day</td>
      <td>Endurance</td>
      <td>$$</td>
    </tr>
    <tr>
      <td>Citrulline Malate</td>
      <td>6-8g/day</td>
      <td>Pump & Recovery</td>
      <td>$$</td>
    </tr>
  </tbody>
</table>
```

---

## Complete Article Example

```html
<h2>What is Creatine?</h2>
<p>Creatine is one of the most researched and effective supplements...</p>

<div class="content-block quick-summary">
  <h3>Quick Summary</h3>
  <ul>
    <li>Safe and effective for most people</li>
    <li>Increases strength by 5-15%</li>
    <li>Take 3-5g daily</li>
  </ul>
</div>

<h2>How Does It Work?</h2>
<p>Creatine helps regenerate ATP...</p>

<div class="content-block benefits-block">
  <h3>Key Benefits</h3>
  <ul>
    <li>Enhanced muscle growth</li>
    <li>Improved exercise performance</li>
  </ul>
</div>

<h2>Dosage & Timing</h2>
<div class="content-block dosage-block">
  <h3>How to Take</h3>
  <p><strong>Standard:</strong> 3-5g daily with meals</p>
  <p><strong>Loading:</strong> 20g for 5 days (optional)</p>
</div>

<h2>Safety & Side Effects</h2>
<div class="content-block warning-block">
  <h3>Important Warnings</h3>
  <p>Avoid if you have kidney disease</p>
  <p>Consult your doctor before starting</p>
</div>
```

---

## Best Practices

### Do's ✅

- Use Quick Summary at the start of long articles
- Include References section at the end
- Add Warnings block for any supplement with contraindications
- Use Dosage block for all supplement recommendations
- Include comparison tables when discussing multiple options

### Don'ts ❌

- Don't overuse blocks (max 2-3 per article)
- Don't skip the warnings for risky supplements
- Don't provide medical advice (use disclaimers)
- Don't forget to cite sources in References section

---

## Styling Notes

All content blocks are automatically styled with:

- Color-coded borders (green, blue, purple, amber)
- Icons for visual hierarchy
- Responsive padding
- Dark mode support
- Hover effects

No additional CSS needed - just use the HTML structure above!

---

## References Section

Always include at the end of your article:

```html
<h2>References</h2>
<ol>
  <li>
    <a href="https://example.com/study" target="_blank">
      Smith et al. (2023). Creatine Supplementation and Exercise Performance
    </a>
    - Journal of Sports Science
  </li>
  <li>
    <a href="https://example.com/meta" target="_blank">
      Meta-analysis of creatine effects on muscle mass
    </a>
    - American Journal of Clinical Nutrition
  </li>
</ol>
```

---

## FAQ Section

```html
<h2>Frequently Asked Questions</h2>

<h3>Is creatine safe?</h3>
<p>Yes, creatine monohydrate has been extensively studied...</p>

<h3>When should I take creatine?</h3>
<p>Timing doesn't matter much - consistency is key...</p>

<h3>Can women take creatine?</h3>
<p>Absolutely! Creatine works the same way for everyone...</p>
```

---

## Need Help?

If you're unsure how to structure your article:

1. Start with an introduction
2. Add Quick Summary block
3. Explain the topic
4. Add Benefits block
5. Include Dosage & Timing
6. Add Warnings if applicable
7. Conclude with key takeaways
8. Include References section

Happy writing! 📝
