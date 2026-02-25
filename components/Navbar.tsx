"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Microscope,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "/category" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl py-3 border-b border-[#D9CFC7] dark:border-zinc-800 shadow-sm"
          : "bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md py-4 border-b border-transparent dark:border-transparent",
      )}
    >
      <div className="px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Supplement Science Logo"
            width={240}
            height={60}
            className="w-auto h-8 md:h-10 lg:h-12 transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-semibold transition-all px-4 py-2 rounded-full",
                pathname === item.href
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#EFE9E3] hover:text-black",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-primary" />
                  <span>SupplementDecoded</span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Search */}
              <div className="mb-6">
                <SearchBar />
              </div>

              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between py-2 text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-primary border-b-2 border-primary w-fit"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4 pb-8">
                <p className="text-center text-xs text-muted-foreground font-medium">
                  Evidence-based wellness.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      <div
        className={cn(
          "absolute left-0 right-0 w-full transition-all duration-300 ease-in-out z-[-1] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-md border-b border-[#D9CFC7] dark:border-zinc-800",
          isSearchOpen
            ? "top-full opacity-100 translate-y-0 py-3 pointer-events-auto"
            : "top-[80%] opacity-0 -translate-y-2 pointer-events-none py-0 h-0 overflow-hidden border-b-0",
        )}
      >
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-center gap-3">
          <div className="flex-1 max-w-2xl relative">
            <SearchBar />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(false)}
            className="rounded-full shrink-0 text-muted-foreground hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
