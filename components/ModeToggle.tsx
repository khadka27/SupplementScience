"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title={mounted && resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-emerald-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
