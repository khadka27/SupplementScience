"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article .prose");
    if (!article) return;

    const headings = Array.from(article.querySelectorAll("h2, h3"));
    const items: TOCItem[] = headings.map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      };
    });

    setToc(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

  return (
    <nav className="space-y-0.5 relative">
      {/* Optional: Add a continuous vertical line background if desired, but individual item borders work well for 'active' state indication in a rail */}
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "block py-2 pr-4 text-sm transition-all duration-200 border-l-2 pl-4",
            item.level === 3 && "pl-8",
            activeId === item.id
              ? "border-primary text-primary font-semibold bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
