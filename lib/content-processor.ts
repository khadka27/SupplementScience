/**
 * Content Processing Utilities
 *
 * These functions help enhance and customize blog post content
 * before it's rendered on the page.
 */

/**
 * Process HTML content with custom enhancements
 */
export function processContent(html: string): string {
  let processed = html;

  // 1. Wrap tables in responsive containers
  processed = processed.replaceAll(
    /<table>/g,
    '<div class="overflow-x-auto rounded-lg border border-border my-8"><table class="w-full">'
  );
  processed = processed.replaceAll(/<\/table>/g, "</table></div>");

  // 2. Enhance HR tags
  processed = processed.replaceAll(
    /<hr>/g,
    '<hr class="my-16 border-t-2 border-primary/20" />'
  );
  processed = processed.replaceAll(
    /<hr\/>/g,
    '<hr class="my-16 border-t-2 border-primary/20" />'
  );

  // 3. Add emoji styling (optional - makes emojis larger)
  processed = processed.replaceAll(
    /(✅|❌|⭐|💡|🎯|📋|👣|💊|🌟|🚀|⚙️|🧠)/g,
    '<span class="text-2xl">$1</span>'
  );

  // 4. Style special paragraphs (starting with "Note:" or "Important:")
  processed = processed.replaceAll(
    /<p>(Note:|Important:|Warning:|Tip:)/g,
    '<p class="font-bold text-primary"><span class="bg-primary/10 px-2 py-1 rounded">$1</span>'
  );

  // 5. Add target="_blank" to external links (security best practice)
  processed = processed.replaceAll(
    /<a href="http/g,
    '<a target="_blank" rel="noopener noreferrer" href="http'
  );

  return processed;
}

/**
 * Add custom info boxes to content
 * Usage in HTML: <div data-infobox="tip">Your content</div>
 */
export function enhanceInfoBoxes(html: string): string {
  const types = {
    tip: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-l-4 border-blue-500",
      icon: "💡",
      title: "Pro Tip",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-l-4 border-yellow-500",
      icon: "⚠️",
      title: "Warning",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-l-4 border-green-500",
      icon: "✅",
      title: "Success",
    },
    info: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-l-4 border-purple-500",
      icon: "ℹ️",
      title: "Info",
    },
  };

  let processed = html;

  Object.entries(types).forEach(([type, style]) => {
    const regex = new RegExp(`<div data-infobox="${type}">(.*?)</div>`, "gs");
    processed = processed.replace(
      regex,
      `<div class="${style.bg} ${style.border} p-6 rounded-r-xl my-8 shadow-sm">
        <div class="flex items-start gap-3">
          <span class="text-2xl">${style.icon}</span>
          <div class="flex-1">
            <strong class="text-lg block mb-2">${style.title}</strong>
            $1
          </div>
        </div>
      </div>`
    );
  });

  return processed;
}

/**
 * Extract and auto-generate table of contents from H2/H3 headings
 */
export function extractHeadings(html: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const headingRegex = /<h([23])>(.*?)<\/h\1>/g;

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = Number.parseInt(match[1], 10);
    const text = match[2].replaceAll(/<[^>]*>/g, ""); // Remove HTML tags
    const id = text
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/(^-|-$)/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Add IDs to headings for anchor linking
 */
export function addHeadingIds(html: string): string {
  return html.replaceAll(/<h([23])>(.*?)<\/h\1>/g, (match, level, content) => {
    const text = content.replaceAll(/<[^>]*>/g, "");
    const id = text
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/(^-|-$)/g, "");

    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

/**
 * Calculate estimated read time from content
 */
export function calculateReadTime(html: string): number {
  const text = html.replaceAll(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min
  return readTimeMinutes;
}

/**
 * Sanitize and prepare content for safe rendering
 */
export function prepareContent(html: string): string {
  let processed = html;

  // Apply all enhancements
  processed = addHeadingIds(processed);
  processed = processContent(processed);
  processed = enhanceInfoBoxes(processed);

  return processed;
}

/**
 * Content templates for common blog post types
 */
export const contentTemplates = {
  productReview: `
    <h2>✅ Product Overview</h2>
    <p>{{overview}}</p>
    
    <h2>🎯 Key Features</h2>
    <ul>
      {{features}}
    </ul>
    
    <h2>💊 Ingredients & Formula</h2>
    <p>{{ingredients}}</p>
    
    <h2>⭐ Pros and Cons</h2>
    <div data-infobox="success">
      <strong>Pros:</strong>
      <ul>{{pros}}</ul>
    </div>
    <div data-infobox="warning">
      <strong>Cons:</strong>
      <ul>{{cons}}</ul>
    </div>
    
    <h2>💰 Pricing & Where to Buy</h2>
    <p>{{pricing}}</p>
    
    <h2>🏆 Our Verdict</h2>
    <p>{{verdict}}</p>
  `,

  howToGuide: `
    <h2>📋 What You'll Need</h2>
    <ul>{{requirements}}</ul>
    
    <h2>👣 Step-by-Step Guide</h2>
    {{steps}}
    
    <div data-infobox="tip">
      <strong>💡 Pro Tips</strong>
      {{tips}}
    </div>
    
    <h2>❓ Common Questions</h2>
    {{faqs}}
  `,

  supplement101: `
    <h2>🧬 What is {{supplement}}?</h2>
    <p>{{definition}}</p>
    
    <h2>💊 How Does It Work?</h2>
    <p>{{mechanism}}</p>
    
    <h2>✅ Potential Benefits</h2>
    <ul>{{benefits}}</ul>
    
    <h2>⚠️ Side Effects & Safety</h2>
    <p>{{safety}}</p>
    
    <h2>💰 Recommended Dosage</h2>
    <p>{{dosage}}</p>
  `,
};

/**
 * Replace template variables
 */
export function fillTemplate(
  template: string,
  data: Record<string, string>
): string {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replaceAll(new RegExp(`{{${key}}}`, "g"), value);
  });
  return result;
}
