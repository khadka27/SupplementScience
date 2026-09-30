"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Microscope, ChevronRight } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { SearchBar } from "./SearchBar";
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
  { name: "Home", href: "/" },
  { name: "Vitamins & Ingredients", href: "/ingredients" },
  { name: "Safety Guides", href: "/guides" },
  { name: "Avoiding Scams", href: "/category" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-white/95 dark:bg-[#0F0E0A]/95 backdrop-blur-xl py-2 border-b border-[#D9CFC7] dark:border-[#3B3028] shadow-sm"
          : "bg-white/80 dark:bg-[#0F0E0A]/80 backdrop-blur-md py-3 border-b border-[#D9CFC7]/50 dark:border-[#3B3028]/50",
      )}
    >
      <div className="px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Top row: logo + search + controls */}
        <div className="flex items-center gap-4 justify-between" suppressHydrationWarning>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="SupplementDecoded — Home"
          >
            <Image
              src="/logo.png"
              alt="SupplementDecoded logo"
              width={200}
              height={50}
              className="w-auto h-8 md:h-10 transition-transform group-hover:scale-105 dark:invert"
              priority
            />
          </Link>

          {/* Search — always visible on desktop */}
          <div className="hidden md:block flex-1 max-w-md" suppressHydrationWarning>
            <SearchBar />
          </div>

          {/* Controls: text size, dark mode, mobile menu */}
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <div className="hidden sm:block">
              <TextSizeControl />
            </div>
            <ModeToggle />

            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open navigation menu"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav"
                  className="md:hidden flex items-center justify-center w-12 h-12 rounded-lg border border-[#D9CFC7] dark:border-[#3B3028] bg-white dark:bg-[#211A13] hover:bg-[#EFE9E3] dark:hover:bg-[#2E2418] transition-colors"
                >
                  {mobileOpen
                    ? <X className="w-6 h-6" aria-hidden="true" />
                    : <Menu className="w-6 h-6" aria-hidden="true" />}
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                id="mobile-nav"
                className="flex flex-col w-[85vw] max-w-sm p-0"
                aria-label="Site navigation"
              >
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#D9CFC7] dark:border-[#3B3028]">
                  <SheetTitle className="text-left flex items-center gap-2 text-lg">
                    <Microscope className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span>SupplementDecoded</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="px-6 py-4 border-b border-[#D9CFC7] dark:border-[#3B3028]">
                  <SearchBar />
                </div>

                {/* Mobile nav links — large touch targets */}
                <nav className="flex flex-col px-4 py-4 gap-1 flex-1 overflow-y-auto" aria-label="Main navigation">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-4 rounded-xl text-[1.0625rem] font-semibold transition-colors min-h-[56px]",
                        pathname === item.href
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-gray-800 dark:text-zinc-200 hover:bg-[#EFE9E3] dark:hover:bg-[#211A13]",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                      <ChevronRight className="w-4 h-4 opacity-40" aria-hidden="true" />
                    </Link>
                  ))}
                </nav>

                {/* Footer links in mobile menu */}
                <div className="px-6 py-4 border-t border-[#D9CFC7] dark:border-[#3B3028] space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-3">
                    Important Information
                  </p>
                  <Link
                    href="/medical-disclaimer"
                    className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white underline underline-offset-2 py-1 min-h-[44px] flex items-center"
                  >
                    Medical Disclaimer
                  </Link>
                  <Link
                    href="/editorial-policy"
                    className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white underline underline-offset-2 py-1 min-h-[44px] flex items-center"
                  >
                    How We Review Evidence
                  </Link>
                  <div className="pt-2">
                    <TextSizeControl />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop nav row */}
        <nav
          className="hidden md:flex items-center gap-1 pt-1 pb-1"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "text-sm font-semibold transition-all px-3 py-2 rounded-lg min-h-[44px] flex items-center whitespace-nowrap",
                pathname === item.href
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-[#EFE9E3] dark:hover:bg-[#211A13] hover:text-black dark:hover:text-white",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

