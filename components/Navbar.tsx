"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  FlaskConical,
  ChevronRight,
  Microscope,
  Search,
  ShieldCheck,
  Sparkles,
  BookOpen,
  LifeBuoy,
  AlertOctagon,
  Info,
  Phone,
  Home,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { TextSizeControl } from "./TextSizeControl";
import { cn, getPostHref } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Ingredients", href: "/ingredients", icon: FlaskConical },
  { name: "Safety Guides", href: "/guides", icon: ShieldCheck },
  { name: "Scam Watch", href: "/category", icon: AlertOctagon },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

const trustBadges = [
  "Evidence-Based, Sources Cited",
  "Zero Sponsor Bias",
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 60);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  React.useEffect(() => {
    if (!searchOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      setIsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(-1);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Live search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query, searchOpen]);

  const handleSelectResult = (item: any) => {
    const href = getPostHref(item);
    router.push(href);
    setSearchOpen(false);
    setQuery("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setSelectedIndex((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setSelectedIndex((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelectResult(results[0]);
      } else if (query.trim()) {
        router.push(`/ingredients?search=${encodeURIComponent(query.trim())}`);
        setSearchOpen(false);
      }
    }
  };

  return (
    <>
      {/* Top announcement strip */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0E3B2F] via-[#1a5c4a] to-[#0E3B2F] text-white text-[11px] font-semibold tracking-wide py-1 text-center flex items-center justify-center gap-4 select-none">
        {trustBadges.map((badge, i) => (
          <span key={badge} className="flex items-center gap-1.5">
            {i > 0 && <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block opacity-60" />}
            <span className="opacity-90">{badge}</span>
          </span>
        ))}
      </div>

      {/* Main Navbar */}
      <header
        role="banner"
        className={cn(
          "fixed top-6 left-0 right-0 z-40 transition-all duration-500 w-full",
          scrolled
            ? "top-6 bg-white/85 dark:bg-[#070B0F]/90 backdrop-blur-2xl border-b border-white/30 dark:border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "top-6 bg-white/60 dark:bg-[#070B0F]/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50"
        )}
      >
        {/* Subtle top glow line on scroll */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
            "bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
          )}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4 justify-between" suppressHydrationWarning>

            {/* ── Logo ───────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center group shrink-0"
              aria-label="SupplementDecoded — Home"
            >
              <Image
                src="/logo.png"
                alt="SupplementDecoded"
                width={190}
                height={38}
                priority
                className="h-8 sm:h-9 w-auto object-contain dark:invert opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            {/* ── Desktop Nav Links ───────────────────────── */}
            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap group",
                      isActive
                        ? "text-[#0E3B2F] dark:text-emerald-400 bg-[#0E3B2F]/8 dark:bg-emerald-500/10"
                        : "text-slate-600 dark:text-slate-300 hover:text-[#0E3B2F] dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#0E3B2F] dark:bg-emerald-400" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Controls ───────────────────────────── */}
            <div className="flex items-center gap-2" suppressHydrationWarning>

              {/* Desktop inline search trigger */}
              <button
                id="navbar-search-trigger"
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchRef.current?.focus(), 50);
                }}
                className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 hover:border-[#0E3B2F]/50 dark:hover:border-emerald-500/50 hover:text-[#0E3B2F] dark:hover:text-emerald-400 transition-all duration-200 cursor-pointer min-w-[180px] group"
                aria-label="Open search"
                aria-expanded={searchOpen}
              >
                <Search className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors" />
                <span className="flex-1 text-left">Search ingredients…</span>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-xs text-slate-400">
                  ⌘K
                </kbd>
              </button>

              <div className="hidden sm:block">
                <TextSizeControl />
              </div>
              <ModeToggle />

              {/* Mobile search icon */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchRef.current?.focus(), 50);
                }}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#E7ECE9] dark:hover:bg-slate-700 transition-colors"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile hamburger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Open navigation menu"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#E7ECE9] dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    {mobileOpen ? (
                      <X className="w-4 h-4 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                    ) : (
                      <Menu className="w-4 h-4 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                    )}
                  </button>
                </SheetTrigger>

                {/* Mobile Sheet */}
                <SheetContent
                  side="right"
                  id="mobile-nav"
                  className="flex flex-col w-[85vw] max-w-sm p-0 bg-white dark:bg-[#070B0F] border-l border-slate-200 dark:border-slate-800"
                  aria-label="Site navigation"
                >
                  <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <SheetTitle className="text-left">
                      <Link
                        href="/"
                        onClick={() => setMobileOpen(false)}
                        aria-label="SupplementDecoded — Home"
                        className="inline-block"
                      >
                        <Image
                          src="/logo.png"
                          alt="SupplementDecoded"
                          width={160}
                          height={32}
                          priority
                          className="h-7 w-auto object-contain dark:invert"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Search */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setSearchOpen(true);
                        setTimeout(() => searchRef.current?.focus(), 80);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-left cursor-pointer"
                      aria-label="Open search dialog"
                    >
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Search ingredients, brands…</span>
                    </button>
                  </div>

                  {/* Mobile Links */}
                  <nav className="flex flex-col px-4 py-3 gap-1 flex-1 overflow-y-auto" aria-label="Main navigation">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-150 min-h-[52px]",
                            isActive
                              ? "bg-gradient-to-r from-[#0E3B2F] to-[#1a6b55] text-white shadow-md"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-4 h-4", isActive ? "text-emerald-200" : "text-slate-400 dark:text-slate-500")} />
                            {item.name}
                          </div>
                          <ChevronRight className={cn("w-4 h-4 opacity-40", isActive ? "text-emerald-200" : "")} aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile footer badges */}
                  <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                      Editorial Standards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trustBadges.map((b) => (
                        <span key={b} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E7ECE9] dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 border border-[#0E3B2F]/20">
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 flex gap-3 text-xs">
                      <Link href="/medical-disclaimer" className="font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 min-h-[44px] flex items-center">
                        Medical Disclaimer
                      </Link>
                      <Link href="/editorial-policy" className="font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 min-h-[44px] flex items-center">
                        Our Methodology
                      </Link>
                    </div>
                    <div className="pt-1">
                      <TextSizeControl />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* ── Global Search Modal Overlay ──────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-[12vh] px-3 sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Card */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1117] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">

            {/* Search input header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search an ingredient, symptom, or brand…"
                className="flex-1 bg-transparent text-sm sm:text-base text-[#0F172A] dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
                autoComplete="off"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {query && !isLoading && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Live Search Results or Quick Pills */}
            <div className="max-h-[65vh] overflow-y-auto">
              {query.trim().length > 0 ? (
                isLoading ? (
                  <div className="py-12 px-6 flex flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0E3B2F] dark:text-emerald-400" />
                    <span>Searching clinical monographs &amp; evidence database…</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>Clinical Research Matches ({results.length})</span>
                      <span className="hidden sm:inline font-mono text-[10px]">Use ↑↓ to select • ↵ to open</span>
                    </div>

                    {results.map((result, idx) => {
                      const isSelected = idx === selectedIndex;
                      const href = getPostHref(result);
                      const tier =
                        result.matchTier ||
                        (result.matchPercentage >= 88
                          ? "100% MATCH"
                          : result.matchPercentage >= 68
                          ? "70% MATCH"
                          : "50% MATCH");

                      const tierBadge =
                        tier === "100% MATCH"
                          ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                          : tier === "70% MATCH"
                          ? "bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800"
                          : "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800";

                      return (
                        <Link
                          key={result.id}
                          href={href}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className={`block p-4 sm:p-5 transition-colors ${
                            isSelected
                              ? "bg-emerald-50/70 dark:bg-emerald-950/40"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${tierBadge}`}
                                >
                                  {tier}
                                </span>
                                {result.category && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E3B2F] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                                    {result.category.name}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                                {result.title}
                              </h4>

                              {result.excerpt && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                                  {result.excerpt}
                                </p>
                              )}
                            </div>

                            <div className="shrink-0 pt-1 text-slate-400 dark:text-slate-500">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 sm:p-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      No direct match for &ldquo;{query.trim()}&rdquo;
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                      Try searching by compound, symptom, or active ingredient.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Green Tea", "Ashwagandha", "Creatine", "Magnesium", "Vitamin D", "Berberine"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          Search {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                /* Quick pills when query is empty */
                <div className="p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Popular Research Targets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Green Tea",
                      "Ashwagandha",
                      "Magnesium Glycinate",
                      "Creatine",
                      "Vitamin D3",
                      "L-Theanine",
                      "Berberine",
                      "Omega-3",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0E3B2F] dark:hover:border-emerald-500 hover:text-[#0E3B2F] dark:hover:text-emerald-400 hover:bg-[#F0FDF4] dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>Clinical monographs &amp; evidence evaluations</span>
              <span className="font-mono">Zero sponsor influence</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
