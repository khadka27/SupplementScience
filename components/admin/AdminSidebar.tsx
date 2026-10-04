"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Folder,
  Users,
  Mail,
  Settings,
  LogOut,
  Star,
  BookOpen,
  FlaskConical,
  Layers,
  ExternalLink,
  PlusCircle,
  PenLine,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
    isCreateAction?: boolean;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Content & Publishing",
    items: [
      {
        title: "All Content",
        href: "/admin/blogs",
        icon: FileText,
      },
      {
        title: "Safety Guides",
        href: "/admin/guides",
        icon: BookOpen,
      },
      {
        title: "Clinical Ingredients",
        href: "/admin/ingredients",
        icon: FlaskConical,
      },
      {
        title: "Product Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
      {
        title: "Content Sections",
        href: "/admin/sections",
        icon: Layers,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Folder,
      },
      {
        title: "Tags & Topics",
        href: "/admin/tags",
        icon: Tags,
      },
    ],
  },
  {
    label: "Quick Creation",
    items: [
      {
        title: "New Article",
        href: "/admin/blog/new",
        icon: PenLine,
        isCreateAction: true,
      },
      {
        title: "New Safety Guide",
        href: "/admin/guides/new",
        icon: Sparkles,
        isCreateAction: true,
      },
      {
        title: "New Ingredient",
        href: "/admin/ingredients/new",
        icon: FlaskConical,
        isCreateAction: true,
      },
      {
        title: "New Product Review",
        href: "/admin/reviews/new",
        icon: Star,
        isCreateAction: true,
      },
    ],
  },
  {
    label: "People & Audience",
    items: [
      {
        title: "Expert Authors",
        href: "/admin/authors",
        icon: Users,
      },
      {
        title: "Subscribers",
        href: "/admin/subscribers",
        icon: Mail,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function AdminSidebar({ onItemClick, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col bg-white dark:bg-[#070A0E] border-r border-stone-200/90 dark:border-stone-800 transition-colors select-none",
        className
      )}
    >
      {/* ── Brand Header ────────────────────────────────────── */}
      <div className="p-5 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/admin"
            onClick={onItemClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-[#0E3B2F] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                SupplementDecoded
              </h2>
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Editorial Headquarters
              </p>
            </div>
          </Link>
        </div>

        {/* Live Website Quick Link Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-stone-100/80 dark:bg-stone-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all group"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>View Live Site</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
        </a>
      </div>

      {/* ── Grouped Navigation ──────────────────────────────── */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-6" aria-label="Admin Sidebar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                {group.label}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isExact = pathname === item.href;
                  const isNested =
                    item.href !== "/admin" &&
                    pathname?.startsWith(item.href) &&
                    !item.isCreateAction;
                  const isActive = isExact || isNested;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold border border-emerald-200/70 dark:border-emerald-800/60"
                          : "text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-stone-900/60 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : item.isCreateAction
                              ? "text-emerald-600/70 dark:text-emerald-400/80 group-hover:text-emerald-600"
                              : "text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {item.isCreateAction ? (
                        <PlusCircle className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-emerald-600 dark:text-emerald-400 transition-opacity" />
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ── User & Logout Footer ────────────────────────────── */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/60 dark:bg-[#0A0E13]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0D1217] border border-stone-200/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 rounded-lg shrink-0 border border-emerald-500/20">
              <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold rounded-lg">
                {session?.user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {session?.user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {session?.user?.email || "Editor-in-Chief"}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
