import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-3 sm:mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.url} className="flex items-center gap-1 sm:gap-1.5">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/60 shrink-0" />
            )}
            {index === 0 ? (
              <Link
                href={item.url}
                className="hover:text-primary transition-colors flex items-center gap-1"
                title="Home"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </Link>
            ) : index === items.length - 1 ? (
              <span
                className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-[220px] md:max-w-xs block"
                title={item.name}
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-primary transition-colors hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
