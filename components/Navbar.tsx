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
        "fixed top-4 left-0 right-0 z-50 transition-all duration-300 mx-auto max-w-6xl w-[calc(100%-2rem)] rounded-full",
        scrolled
          ? "bg-white/80 backdrop-blur-md py-3 border border-[#D9CFC7] shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          : "bg-white/50 backdrop-blur-sm py-4 border border-[#D9CFC7]/50 shadow-sm",
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
          <SearchBar />
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
    </header>
  );
}
