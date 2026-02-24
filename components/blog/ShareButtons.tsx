"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Linkedin,
  Mail,
  Twitter,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  slug: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export default function ShareButtons({
  title,
  slug,
  className = "",
  orientation = "vertical",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = mounted
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || "https://supplementscience.com";

  const url = `${baseUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-sky-500 hover:bg-sky-500/10",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-blue-600 hover:bg-blue-600/10",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:text-blue-700 hover:bg-blue-700/10",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=Check out this article: ${url}`,
      color: "hover:text-red-500 hover:bg-red-500/10",
    },
  ];

  if (!mounted) {
    return null; // or return a skeleton/placeholder to avoid layout shift, but null avoids mismatch
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div
      className={`flex ${
        orientation === "vertical" ? "flex-col" : "flex-row"
      } gap-2 ${className}`}
    >
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full transition-all duration-300 ${link.color}`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4" />
            <span className="sr-only">Share on {link.name}</span>
          </Button>
        </a>
      ))}

      <Button
        variant="outline"
        size="icon"
        className={`rounded-full transition-all duration-300 hover:text-black hover:bg-[#E9DAC1]/50 ${
          copied ? "text-primary bg-primary/10 border-primary/20" : ""
        }`}
        onClick={handleCopyLink}
        title="Copy Link"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
        <span className="sr-only">Copy Link</span>
      </Button>
    </div>
  );
}
