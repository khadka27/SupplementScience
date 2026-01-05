"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Microscope, ChevronRight } from "lucide-react";
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

const navItems = [
  { name: "Home", href: "/" },
  { name: "All Articles", href: "/blog" },
  { name: "Categories", href: "/#categories" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md py-3 border-border"
          : "bg-transparent py-5 border-transparent"
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-transform group-hover:rotate-12">
            <Microscope className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight font-heading">
            Supplement<span className="text-primary">Science</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-1",
                pathname === item.href
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <SearchBar />
          <ModeToggle />
          <Link href="/admin/blog/new">
            <Button size="sm" className="rounded-full px-5">
              Write Article
            </Button>
          </Link>
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
                  <span>SupplementScience</span>
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
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4 pb-8">
                <Link href="/admin/blog/new" className="block">
                  <Button className="w-full rounded-xl py-6" size="lg">
                    Write Article
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground font-medium">
                  Evidence-based wellness.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
