"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8] dark:bg-[#070A0E]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading Editorial Console…
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex h-full w-full bg-[#FAFAF8] dark:bg-[#070A0E] overflow-hidden text-slate-900 dark:text-slate-100 select-auto">
      
      {/* ── Desktop Static Sidebar ────────────────────────── */}
      <div className="hidden lg:block shrink-0 h-full">
        <AdminSidebar />
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────────────── */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r border-stone-200 dark:border-stone-800 z-50">
          <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
          <AdminSidebar onItemClick={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main Content Area ─────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <AdminNavbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />
        <main id="admin-main" className="flex-1 overflow-y-auto bg-stone-50/60 dark:bg-[#0A0D12] p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
