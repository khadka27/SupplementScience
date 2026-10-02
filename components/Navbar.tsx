"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { TextSizeControl } from "./TextSizeControl";
import { cn } from "@/lib/utils";
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
  "1,420+ RCTs Analyzed",
  "Zero Sponsor Bias",
  "PharmD Reviewed",
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
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
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="SupplementDecoded — Home"
            >
              {/* Icon mark */}
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E3B2F] to-[#1a6b55] flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow duration-300">
                <FlaskConical className="w-4 h-4 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text mark */}
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black text-[15px] tracking-tight text-[#0F172A] dark:text-white group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors duration-200">
                  Supplement<span className="text-[#0E3B2F] dark:text-emerald-400">Decoded</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                  Independent Clinical Research
                </span>
              </div>
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
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E3B2F] to-[#1a6b55] flex items-center justify-center shadow-md">
                          <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-black text-sm text-[#0F172A] dark:text-white">
                            Supplement<span className="text-[#0E3B2F] dark:text-emerald-400">Decoded</span>
                          </div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                            Clinical Research Platform
                          </div>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile Search */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search ingredients…"
                        className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none w-full"
                      />
                    </div>
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
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Card */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1117] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">

            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search an ingredient, symptom, or brand…"
                className="flex-1 bg-transparent text-base text-[#0F172A] dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-slate-700 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Quick pills */}
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Popular Research Targets
              </p>
              <div className="flex flex-wrap gap-2">
                {["Ashwagandha", "Magnesium Glycinate", "Creatine", "Vitamin D3", "L-Theanine", "Berberine", "Omega-3"].map((s) => (
                  <Link
                    key={s}
                    href={`/ingredients?search=${encodeURIComponent(s)}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0E3B2F] dark:hover:border-emerald-500 hover:text-[#0E3B2F] dark:hover:text-emerald-400 hover:bg-[#F0FDF4] dark:hover:bg-emerald-950/20 transition-all"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>1,420+ clinical monographs indexed</span>
              <span className="font-mono">Zero sponsor influence</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
