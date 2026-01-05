"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    <nav className="relative flex flex-col gap-3 text-sm">
      {/* Active Indicator Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border/40 rounded-full" />

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
            "relative pl-4 transition-all duration-300 hover:text-primary leading-relaxed block",
            item.level === 3 && "pl-8 text-xs",
            activeId === item.id
              ? "text-primary font-bold scale-105 origin-left"
              : "text-muted-foreground"
          )}
        >
          {activeId === item.id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-full bg-primary rounded-full transition-all duration-300" />
          )}
          {item.text}
        </a>
      ))}
    </nav>
  );
}
