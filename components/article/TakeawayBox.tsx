import { CheckCircle2 } from "lucide-react";

interface TakeawayBoxProps {
  items: string[];
  title?: string;
}

/**
 * TakeawayBox — "Key Takeaways" summary at the top of every article.
 * Brief (3–5 bullets), plain language, readable in 30 seconds.
 * WCAG AA contrast, semantic <section> with aria-label.
 */
export function TakeawayBox({ items, title = "Key Takeaways" }: TakeawayBoxProps) {
  if (!items?.length) return null;
  return (
    <section
      className="takeaway-box"
      aria-label="Key takeaways summary"
    >
      <div className="takeaway-box-header">
        <CheckCircle2 aria-hidden="true" size={16} />
        <span>{title}</span>
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
