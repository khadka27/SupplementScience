import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
  searchParams?: Record<string, string | undefined>;
}

export function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  className = "",
  searchParams = {},
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Preserve any existing search params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (key !== "page" && val) {
        params.set(key, val);
      }
    });

    if (page > 1) {
      params.set("page", page.toString());
    }

    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  };

  // Generate pagination items with ellipses
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}
    >
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 order-2 sm:order-1">
        Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
      </div>

      <ul className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2 flex-wrap justify-center">
        {/* Previous Button */}
        <li>
          {hasPrevious ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1217] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:shadow-xs transition-all"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <span
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/50 dark:border-slate-800/50 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </span>
          )}
        </li>

        {/* Page Number Links */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`} className="px-1 text-slate-400 select-none">
                <MoreHorizontal className="w-4 h-4" />
              </li>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <li key={page}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="flex items-center justify-center min-w-9 h-9 px-3 rounded-xl text-xs sm:text-sm font-bold bg-[#0E3B2F] text-white dark:bg-emerald-600 dark:text-white border border-[#0E3B2F] dark:border-emerald-600 shadow-xs select-none"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={createPageUrl(page)}
                  className="flex items-center justify-center min-w-9 h-9 px-3 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-[#0D1217] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:shadow-xs transition-all"
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}

        {/* Next Button */}
        <li>
          {hasNext ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#0D1217] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:shadow-xs transition-all"
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-200/50 dark:border-slate-800/50 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PaginationControls;
