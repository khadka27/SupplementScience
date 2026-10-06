"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function NewsletterForm({
  variant = "default",
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to subscribe",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {message && (
          <p
            className={cn(
              "text-xs",
              message.type === "success"
                ? "text-primary font-bold"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {message.text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("w-full", className)}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="pl-10 h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="h-12 px-8"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {message && (
          <div
            className={cn(
              "mt-3 p-3 rounded-xl flex items-center gap-2 text-sm",
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50",
            )}
          >
            {message.type === "success" && (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}
      </div>
    );
  }

  // Default variant - full card
  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 p-4 sm:p-8 md:p-10 shadow-xs sm:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3.5 sm:gap-5 mb-5 sm:mb-8">
        <div className="bg-emerald-700 text-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md shrink-0">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
            Subscribe to the Science
          </h3>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Get the latest evidence-based research and supplement guides
            delivered directly to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1 h-11"
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="h-11 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {message && (
          <div
            className={cn(
              "p-3 rounded-xl flex items-center gap-2 text-sm",
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50",
            )}
          >
            {message.type === "success" && (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            {message.text}
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
