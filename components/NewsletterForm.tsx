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
              "mt-3 p-3 rounded-lg flex items-center gap-2",
              message.type === "success"
                ? "bg-[#F7ECDE] text-primary border border-[#E9DAC1]"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
            )}
          >
            {message.type === "success" && (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
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
        "rounded-[2rem] bg-white/40 backdrop-blur-sm p-8 md:p-10 border-2 border-[#E9DAC1] shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-5 mb-8">
        <div className="bg-primary text-primary-foreground p-3.5 rounded-[1.25rem] shadow-lg shadow-primary/20">
          <Mail className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-black mb-2">
            Subscribe to the Science
          </h3>
          <p className="text-gray-700 font-medium leading-relaxed">
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
            className="flex-1 h-11 bg-background"
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="h-11 px-6"
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
              "p-3 rounded-lg flex items-center gap-2 text-sm",
              message.type === "success"
                ? "bg-[#F7ECDE] text-primary border border-[#E9DAC1]"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
            )}
          >
            {message.type === "success" && (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
