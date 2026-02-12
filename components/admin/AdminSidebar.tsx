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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "All Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "New Blog",
    href: "/admin/blog/new",
    icon: FileText,
  },
  {
    title: "New Review",
    href: "/admin/reviews/new",
    icon: Star,
  },
  {
    title: "New Guide",
    href: "/admin/guides/new",
    icon: BookOpen,
  },
  {
    title: "New Ingredient",
    href: "/admin/ingredients/new",
    icon: FlaskConical,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    title: "Authors",
    href: "/admin/authors",
    icon: Users,
  },
  {
    title: "Subscribers",
    href: "/admin/subscribers",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">SupplementDecoded</p>
          </div>
        </Link>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
