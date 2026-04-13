"use client";

import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { prepareContent } from "@/lib/content-processor";
import {
  List,
  Clock,
  Calendar,
  Share2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Table as TableIcon,
  MessageSquare,
  Bookmark,
  Microscope,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Post, Source } from "@/lib/types";
import AuthorBox from "./AuthorBox";
import RelatedPosts from "./RelatedPosts";
import Breadcrumbs from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";
import ShareButtons from "./ShareButtons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, getPostHref } from "@/lib/utils";

interface AdjacentPost {
  title: string;
  slug: string;
  featuredImageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
}

interface BlogPostContentProps {
  post: Post;
  relatedPosts?: Post[];
  prevPost?: AdjacentPost | null;
  nextPost?: AdjacentPost | null;
}

export default function BlogPostContent({
  post,
  relatedPosts,
  prevPost,
  nextPost,
}: BlogPostContentProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [currentArticleUrl, setCurrentArticleUrl] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const articleContentRef = useRef<HTMLDivElement>(null);

  const getSummaryLinks = (articleUrl: string) => {
    const query = encodeURIComponent(
      `Summarize this article and key takeaways: ${articleUrl}`,
    );

    return {
      chatgpt: `https://chatgpt.com/?q=${query}`,
      perplexity: `https://www.perplexity.ai/search/new?q=${query}`,
      copilot: `https://copilot.microsoft.com/?q=${query}`,
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      if (titleRef.current) {
        const titleBottom = titleRef.current.getBoundingClientRect().bottom;
        setShowStickyHeader(titleBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentArticleUrl(window.location.href);

    const container = articleContentRef.current;
    if (!container) return;

    const articleUrl = window.location.href;
    const linkByProvider = getSummaryLinks(articleUrl);

    const cleanupFns: Array<() => void> = [];

    const resolveProvider = (rawText: string) => {
      const text = rawText.toLowerCase();
      const normalized = text.replaceAll(/[^a-z]/g, "");

      if (
        text.includes("chatgpt") ||
        text.includes("chat gpt") ||
        normalized.includes("chatgpt")
      ) {
        return "chatgpt";
      }

      if (text.includes("perplexity") || normalized.includes("perplexity")) {
        return "perplexity";
      }

      if (text.includes("copilot") || normalized.includes("copilot")) {
        return "copilot";
      }

      return null;
    };

    container.querySelectorAll("a, button").forEach((element) => {
      const label = [
        element.textContent || "",
        element.getAttribute("aria-label") || "",
        element.getAttribute("title") || "",
      ]
        .join(" ")
        .trim();
      const provider = resolveProvider(label);

      if (!provider) return;
      const targetUrl = linkByProvider[provider];

      if (element instanceof HTMLAnchorElement) {
        element.href = targetUrl;
        element.target = "_blank";
        element.rel = "noopener noreferrer";
        return;
      }

      if (element instanceof HTMLButtonElement) {
        const clickHandler = () => {
          window.open(targetUrl, "_blank", "noopener,noreferrer");
        };
        element.type = "button";
        element.addEventListener("click", clickHandler);
        cleanupFns.push(() =>
          element.removeEventListener("click", clickHandler),
        );
      }
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [post.slug]);

  const summaryLinks = getSummaryLinks(currentArticleUrl || getPostHref(post));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    ...(post.category?.slug === "ingredients"
      ? [{ name: "Ingredients", url: "/ingredients" }]
      : post.category
        ? [
            {
              name: post.category.name,
              url: `/${post.category.slug}`,
            },
          ]
        : []),
    { name: post.title, url: getPostHref(post) },
  ];

  return (
    <div
      className="min-h-screen bg-[#F5F3F0] dark:bg-[#0D0C09] text-black dark:text-zinc-100 relative pb-24 font-sans selection:bg-primary/20 selection:text-primary"
      style={
        {
          "--text": "#111111",
          "--foreground": "#111111",
          "--muted-foreground": "#4b5563",
          "--border": "#D9CFC7",
          "--primary": "hsl(var(--primary))",
          "--accent": "hsl(var(--primary))",
          "--accent-soft": "rgba(16,185,129,0.06)",
          "--link": "hsl(var(--primary))",
          "--link-hover": "hsl(var(--primary))",
          "--surface": "#ffffff",
          "--surface-2": "#f5f0eb",
        } as React.CSSProperties
      }
    >
      {/* Scroll Progress Bar & Sticky Header */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 bg-[#F9F8F6]/80 backdrop-blur-md border-b border-[#D9CFC7] transition-all duration-300 transform",
          showStickyHeader ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <h2 className="font-bold text-lg truncate max-w-2xl text-black">
            {post.title}
          </h2>
          <div className="flex items-center gap-4">
            {post.author && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
                <span>{post.author.name}</span>
              </div>
            )}
            <ShareButtons
              title={post.title}
              slug={post.slug}
              orientation="horizontal"
              className="hidden sm:flex"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <header className="mb-10 lg:mb-16 max-w-7xl mx-auto bg-white dark:bg-[#17120D] rounded-[2rem] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1 p-8 md:p-10 lg:p-12">
              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    {post.category.name}
                  </span>
                </Link>
              )}

              {/* Title */}
              <h1
                ref={titleRef}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black dark:text-white leading-[1.15] tracking-tight"
              >
                {post.title}
              </h1>

              {/* Author & Meta Info Block */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 py-4 border-y border-black/10 dark:border-white/10">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.avatarUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-black border-2 border-primary/20">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5">
                        Written by
                      </div>
                      <Link
                        href={`/author/${post.author.slug}`}
                        className="font-bold text-black dark:text-zinc-100 hover:text-primary transition-colors block leading-none text-sm"
                      >
                        {post.author.name}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="hidden sm:block w-px h-8 bg-black/10 dark:bg-white/10" />

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-zinc-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <time
                      dateTime={
                        post.updatedAt?.toString() ||
                        post.publishedAt?.toString()
                      }
                    >
                      {post.updatedAt
                        ? format(new Date(post.updatedAt), "MMM d, yyyy")
                        : format(
                            new Date(post.publishedAt || new Date()),
                            "MMM d, yyyy",
                          )}
                    </time>
                  </div>
                  <span className="text-black/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                  {post.reviewedBy && (
                    <>
                      <span className="text-black/20">·</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        ✓ Reviewed by {post.reviewedBy}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
                  Summarize:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={summaryLinks.chatgpt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-semibold rounded-md border border-[#D9CFC7] hover:border-black/40 dark:border-[#3B2E22] dark:hover:border-zinc-400 bg-white dark:bg-[#17120D] transition-colors"
                  >
                    ChatGPT
                  </a>
                  <a
                    href={summaryLinks.perplexity}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-semibold rounded-md border border-[#D9CFC7] hover:border-black/40 dark:border-[#3B2E22] dark:hover:border-zinc-400 bg-white dark:bg-[#17120D] transition-colors"
                  >
                    Perplexity
                  </a>
                  <a
                    href={summaryLinks.copilot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-semibold rounded-md border border-[#D9CFC7] hover:border-black/40 dark:border-[#3B2E22] dark:hover:border-zinc-400 bg-white dark:bg-[#17120D] transition-colors"
                  >
                    Copilot
                  </a>
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative h-64 lg:h-full min-h-[320px] overflow-hidden bg-gradient-to-br from-[#EFE9E3] to-[#D9CFC7] dark:from-[#1D150E] dark:to-[#2C2218]">
                {post.featuredImageUrl && !imgError ? (
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                    quality={85}
                    unoptimized={
                      post.featuredImageUrl?.startsWith("http") ||
                      post.featuredImageUrl?.startsWith("https")
                    }
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    onError={() => {
                      console.warn(
                        `Failed to load image: ${post.featuredImageUrl}`,
                      );
                      setImgError(true);
                    }}
                  />
                ) : null}

                {/* Fallback pattern and icon if image is missing or broken */}
                {(imgError || !post.featuredImageUrl) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 ring-8 ring-primary/5">
                      <Microscope className="w-12 h-12 text-primary" />
                    </div>
                    <span className="text-primary/40 font-black uppercase tracking-[0.2em] text-[10px]">
                      Scientific Resource
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto px-4 lg:px-6 mt-10">
          {/* LEFT SIDEBAR: Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 relative">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-[#17120D] p-5 rounded-2xl shadow-sm max-h-[calc(100vh-7rem)] flex flex-col">
                <div className="flex items-center gap-2 font-black text-xs text-black dark:text-zinc-100 mb-4 uppercase tracking-widest shrink-0 border-b border-[#D9CFC7] dark:border-[#3B2E22] pb-3">
                  <List className="w-3.5 h-3.5 text-primary" />
                  <span>Contents</span>
                </div>
                <div className="overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                  <TableOfContents />
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="lg:col-span-9 min-w-0">
            <article className="w-full max-w-4xl mx-auto bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden transition-all duration-500">
              <div className="px-8 md:px-16 lg:px-20 py-10 md:py-20">
                {/* Mobile TOC */}
                <div className="lg:hidden mb-12 bg-[#F5F3F0] dark:bg-[#1A1612] p-6 rounded-[1.5rem] animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="font-black text-lg mb-4 flex items-center gap-3 text-black dark:text-white">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <List className="w-5 h-5 text-primary" />
                    </div>
                    <span>Table of Contents</span>
                  </h3>
                  <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/30">
                    <TableOfContents />
                  </div>
                </div>

                {/* Quick Summary Card */}
                {post.excerpt && (
                  <div className="mb-12 bg-primary/[0.03] dark:bg-primary/[0.05] border-2 border-primary/10 rounded-[2rem] p-7 lg:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <Bookmark className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                      <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-black dark:text-white mb-3 tracking-tight">
                          Key Insights
                        </h3>
                        <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical Disclaimer */}
                <div className="mb-12 bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-amber-500 rounded-r-2xl p-6 shadow-sm flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-2">
                      Medical Disclaimer
                    </h4>
                    <p className="text-[13px] md:text-sm text-amber-900/80 dark:text-amber-200/60 leading-relaxed italic">
                      This article is for informational purposes only and does
                      not constitute medical advice. Always consult with a
                      qualified healthcare professional before starting any new
                      supplement regimen.
                    </p>
                    <p className="text-[13px] md:text-sm text-amber-900/90 dark:text-amber-200/70 leading-relaxed mt-3">
                      Read our{" "}
                      <Link
                        href="/medical-expert-review"
                        className="font-semibold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        Medical / Expert Review Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/medical-disclaimer"
                        className="font-semibold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        Medical Disclaimer
                      </Link>{" "}
                      for details.
                    </p>
                  </div>
                </div>

                {/* Main Article Content */}
                <div
                  ref={articleContentRef}
                  className="prose prose-lg dark:prose-invert max-w-none blog-content-enhanced
                  /* Headings and Spacing handled by global css */"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(prepareContent(post.content)),
                  }}
                />

                {/* Citations / Sources */}
                {post.sources && post.sources.length > 0 && (
                  <div className="mt-20 pt-16 border-t border-[#D9CFC7] dark:border-[#3B2E22]">
                    <div className="flex items-center gap-4 mb-10 text-black dark:text-white">
                      <div className="bg-primary/10 p-4 rounded-2xl shadow-inner">
                        <Microscope className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black m-0 tracking-tight">
                          Evidence Based
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
                          Scientific References
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-5">
                      {post.sources.map((source: Source, index: number) => (
                        <div
                          key={index}
                          className="flex gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-lg transition-all duration-300 group/source"
                        >
                          <span className="text-primary font-mono text-lg font-black mt-0.5 shrink-0 w-8">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black dark:text-zinc-100 hover:text-primary font-bold flex items-center gap-2 transition-colors text-base md:text-lg leading-snug"
                            >
                              {source.title}
                              <ExternalLink className="w-4 h-4 opacity-0 group-hover/source:opacity-40 transition-opacity" />
                            </a>
                            {source.description && (
                              <p className="text-sm md:text-base text-gray-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                {source.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Tags Section - Outside but below the card */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 mb-16 px-6">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1" />
                  Explore Related Topics
                  <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1" />
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {post.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#D9CFC7] dark:border-[#3B2E22] rounded-xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:border-primary hover:text-primary hover:shadow-md transition-all"
                    >
                      # {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Subscription */}
            <div className="mt-8 mb-16 px-6">
              <NewsletterForm />
            </div>

            {/* Prev/Next Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#D9CFC7] dark:border-[#3B2E22] pt-12 px-6">
                {prevPost ? (
                  <Link
                    href={getPostHref(prevPost)}
                    className="group flex flex-col items-start text-left space-y-3 p-6 rounded-2xl border border-[#D9CFC7] dark:border-[#3B2E22] bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 text-sm font-bold group-hover:text-primary">
                      <ArrowLeft className="w-4 h-4" /> Previous Article
                    </div>
                    <h4 className="text-lg font-black text-black dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    href={getPostHref(nextPost)}
                    className="group flex flex-col items-end text-right space-y-3 p-6 rounded-2xl border border-[#D9CFC7] dark:border-[#3B2E22] bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 text-sm font-bold group-hover:text-primary">
                      Next Article <ArrowRight className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-black text-black dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-8 px-6">
                  <h3 className="text-2xl font-black tracking-tight">
                    Recommended Reading
                  </h3>
                  <Link
                    href="/blog"
                    className="text-primary hover:underline font-bold text-sm tracking-widest uppercase"
                  >
                    View All
                  </Link>
                </div>
                <div className="px-6">
                  <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
                </div>
              </div>
            )}

            {/* Footer Share Block */}
            <div className="mt-24 px-6">
              <div className="bg-[#EFE9E3] dark:bg-[#1A1612] p-10 rounded-[2.5rem] shadow-lg text-center">
                <div className="flex items-center justify-center gap-3 text-lg font-black text-black dark:text-white uppercase tracking-widest mb-6">
                  <Share2 className="w-6 h-6 text-primary" />
                  <span>Share This Scientific Review</span>
                </div>
                <div className="flex justify-center">
                  <ShareButtons
                    title={post.title}
                    slug={post.slug}
                    orientation="horizontal"
                    className="flex-wrap justify-center gap-4"
                  />
                </div>
                <p className="text-sm text-gray-700 dark:text-zinc-400 mt-6 font-bold italic">
                  "Knowledge is meant to be shared."
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
