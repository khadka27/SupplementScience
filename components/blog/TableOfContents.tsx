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
    <div className="bg-muted/30 rounded-xl p-6 mb-8 border border-border/50">
      <div className="flex items-center gap-2 mb-4 text-primary font-bold">
        <List className="w-5 h-5" />
        <h2 className="text-lg m-0!">Table of Contents</h2>
      </div>
      <nav className="space-y-1">
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
              "flex items-center gap-2 py-1.5 px-3 rounded-md transition-colors text-sm hover:bg-muted group",
              item.level === 3 && "ml-4",
              activeId === item.id
                ? "text-primary font-medium bg-muted/50"
                : "text-muted-foreground"
            )}
          >
            <ChevronRight
              className={cn(
                "w-3 h-3 transition-transform",
                activeId === item.id
                  ? "rotate-90 text-primary"
                  : "text-muted-foreground/30 group-hover:text-muted-foreground"
              )}
            />
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
