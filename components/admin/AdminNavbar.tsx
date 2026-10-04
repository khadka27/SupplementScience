"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ExternalLink,
  Plus,
  PenLine,
  Sparkles,
  FlaskConical,
  Star,
  Menu,
  ChevronRight,
  ShieldCheck,
  Search,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageMeta: Record<
  string,
  { title: string; category: string; description: string }
> = {
  "/admin": {
    title: "Dashboard Overview",
    category: "HQ",
    description: "Real-time statistics, publication status, and quick shortcuts.",
  },
  "/admin/blogs": {
    title: "All Articles",
    category: "Content",
    description: "Manage, filter, and review all published and draft articles.",
  },
  "/admin/blog/new": {
    title: "Create Article",
    category: "Drafting",
    description: "Compose a new clinical monograph or editorial breakdown.",
  },
  "/admin/guides": {
    title: "Safety Guides",
    category: "Guides",
    description: "Comprehensive consumer guides and supplement safety protocols.",
  },
  "/admin/guides/new": {
    title: "Publish Safety Guide",
    category: "Drafting",
    description: "Draft an evidence-verified comprehensive wellness guide.",
  },
  "/admin/ingredients": {
    title: "Clinical Ingredients",
    category: "Encyclopedia",
    description: "Browse and maintain condition-agnostic ingredient profiles.",
  },
  "/admin/ingredients/new": {
    title: "New Monograph",
    category: "Ingredients",
    description: "Index a new raw ingredient with RCT dosage analysis.",
  },
  "/admin/reviews": {
    title: "Product Reviews",
    category: "Testing",
    description: "Third-party lab evaluations, brand scores, and compliance.",
  },
  "/admin/reviews/new": {
    title: "New Product Review",
    category: "Testing",
    description: "Evaluate third-party lab tests and brand compliance.",
  },
  "/admin/sections": {
    title: "Content Sections",
    category: "Layout",
    description: "Manage homepage sections, featured feeds, and modules.",
  },
  "/admin/categories": {
    title: "Topic Categories",
    category: "Taxonomy",
    description: "Organize medical topics and hub landing pages.",
  },
  "/admin/tags": {
    title: "Tags & Ingredients",
    category: "Taxonomy",
    description: "Ingredient dictionary and keyword linkages.",
  },
  "/admin/authors": {
    title: "Expert Authors",
    category: "People",
    description: "Manage credentials, bios, and reviewer attributions.",
  },
  "/admin/subscribers": {
    title: "Newsletter Audience",
    category: "Subscribers",
    description: "Export email subscribers and track growth metrics.",
  },
  "/admin/settings": {
    title: "Platform Settings",
    category: "System",
    description: "SEO defaults, branding, and environment configurations.",
  },
};

function getPageMeta(pathname: string): {
  title: string;
  category: string;
  description: string;
} {
  if (pageMeta[pathname]) return pageMeta[pathname];

  if (pathname.startsWith("/admin/ingredients/")) {
    return {
      title: "Edit Ingredient Monograph",
      category: "Encyclopedia",
      description: "Manage clinical dosages, mechanisms, and evidence grade.",
    };
  }
  if (pathname.startsWith("/admin/reviews/")) {
    return {
      title: "Edit Product Review",
      category: "Testing",
      description: "Manage lab evaluation, brand rating, and evidence score.",
    };
  }
  if (pathname.startsWith("/admin/guides/")) {
    return {
      title: "Edit Safety Guide",
      category: "Guides",
      description: "Manage consumer protocols and safety guidelines.",
    };
  }
  if (pathname.startsWith("/admin/blog/")) {
    return {
      title: "Edit Article",
      category: "Content",
      description: "Update clinical article details and editorial metadata.",
    };
  }

  return {
    title: "Editorial Panel",
    category: "Admin",
    description: "Manage website content and evidence archives.",
  };
}

interface AdminNavbarProps {
  onMobileMenuToggle?: () => void;
}

export function AdminNavbar({ onMobileMenuToggle }: AdminNavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const currentMeta = getPageMeta(pathname || "");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-[#070A0E]/90 backdrop-blur-md px-4 sm:px-6 transition-colors">
      
      {/* ── Left: Breadcrumb & Title ────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {currentMeta.category}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* ── Right Controls ───────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5 h-9 px-3.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Create Content</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border border-stone-200 dark:border-stone-800">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
              New Content Type
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/admin/blog/new" className="flex items-center gap-2.5 py-2">
                <PenLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">Standard Article</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/admin/guides/new" className="flex items-center gap-2.5 py-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-semibold">Safety Guide</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/admin/ingredients/new" className="flex items-center gap-2.5 py-2">
                <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">Ingredient Monograph</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/admin/reviews/new" className="flex items-center gap-2.5 py-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Product Review</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Public Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live site in new tab"
          className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800/60 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </a>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors cursor-pointer outline-none">
              <Avatar className="h-8 w-8 rounded-lg border border-emerald-500/20">
                <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold rounded-lg">
                  {session?.user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border border-stone-200 dark:border-stone-800">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {session?.user?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {session?.user?.email || "editorial@supplementdecoded.com"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/admin/settings" className="flex items-center gap-2 py-1.5 text-xs font-medium">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1.5 text-xs font-medium">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>View Public Website</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="rounded-xl cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 py-1.5 text-xs font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
