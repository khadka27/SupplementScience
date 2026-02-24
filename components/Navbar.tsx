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
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  <User className="w-4 h-4" />
                  {session.user?.name || "Admin"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/blogs" className="cursor-pointer">
                    All Blogs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/blog/new" className="cursor-pointer">
                    Write Article
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/categories" className="cursor-pointer">
                    Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/tags" className="cursor-pointer">
                    Tags
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/authors" className="cursor-pointer">
                    Authors
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    View Public Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin/login">
              <Button
                size="sm"
                className="rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Login
              </Button>
            </Link>
          )}
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
                {session ? (
                  <>
                    <Link href="/admin" className="block">
                      <Button className="w-full rounded-xl py-6" size="lg">
                        Admin Dashboard
                      </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/admin/blogs" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          All Blogs
                        </Button>
                      </Link>
                      <Link href="/admin/blog/new" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          New Post
                        </Button>
                      </Link>
                      <Link href="/admin/categories" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          Categories
                        </Button>
                      </Link>
                      <Link href="/admin/tags" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          Tags
                        </Button>
                      </Link>
                      <Link href="/admin/authors" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          Authors
                        </Button>
                      </Link>
                      <Link href="/" className="block">
                        <Button variant="outline" className="w-full" size="sm">
                          View Site
                        </Button>
                      </Link>
                    </div>
                    <Link href="/admin/settings" className="block">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl py-6"
                        size="lg"
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full rounded-xl py-6"
                      size="lg"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/admin/login" className="block">
                    <Button className="w-full rounded-xl py-6" size="lg">
                      Admin Login
                    </Button>
                  </Link>
                )}
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
