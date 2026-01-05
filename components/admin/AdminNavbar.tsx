"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/blogs": "Blog Posts",
  "/admin/blog/new": "Create New Blog Post",
  "/admin/categories": "Categories",
  "/admin/tags": "Tags",
  "/admin/authors": "Authors",
  "/admin/subscribers": "Subscribers",
  "/admin/settings": "Settings",
};

export function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Admin Panel";

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right">
              <p className="text-sm font-medium">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {session?.user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
