"use client";

import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { prepareContent } from "@/lib/content-processor";
import {
  Clock,
  Calendar,
  Share2,
  Info,
  Microscope,
  ExternalLink,
  ArrowLeft,
  Menu,
  List,
  ArrowRight,
  AlertTriangle,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogPostContentProps {
  post: Post;
  relatedPosts?: Post[];
  prevPost?: {
    title: string;
    slug: string;
    featuredImageUrl?: string | null;
  } | null;
  nextPost?: {
    title: string;
    slug: string;
    featuredImageUrl?: string | null;
  } | null;
}

export default function BlogPostContent({
  post,
  relatedPosts,
  prevPost,
  nextPost,
}: BlogPostContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category
      ? [{ name: post.category.name, url: `/category/${post.category.slug}` }]
      : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <div className="min-h-screen bg-background relative pb-20 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Scroll Progress Bar & Sticky Header */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 transform",
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <h2 className="font-bold text-lg truncate max-w-2xl text-foreground/90">
            {post.title}
          </h2>
          <div className="flex items-center gap-4">
            {post.author && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
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
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-muted">
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

        {/* Modern Hero Section with Image Background */}
        {post.featuredImageUrl ? (
          <header className="relative w-full overflow-hidden rounded-3xl border-2 border-green-200/40 dark:border-green-800/40 mb-16 max-w-7xl mx-auto shadow-2xl">
            {/* Background Image with Strong Blur */}
            <div className="absolute inset-0">
              <Image
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover blur-[8px]"
                priority
                sizes="100vw"
              />
              {/* Wellness-friendly gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-emerald-50/85 to-teal-50/90 dark:from-green-950/85 dark:via-emerald-950/80 dark:to-teal-950/85" />
            </div>

            {/* Content Over Image */}
            <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <div className="max-w-4xl">
                {/* Category Badge */}
                {post.category && (
                  <Link
                    href={`/category/${post.category.slug}`}
                    className="inline-block mb-5 hover:scale-105 transition-transform animate-in fade-in zoom-in duration-500 delay-100"
                  >
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-xs sm:text-sm font-bold rounded-full uppercase tracking-wider bg-primary/10 backdrop-blur-md text-primary dark:bg-white/10 dark:text-white border border-primary/30 dark:border-white/20 shadow-lg hover:bg-primary/20 dark:hover:bg-white/20"
                    >
                      {post.category.name}
                    </Badge>
                  </Link>
                )}

                {/* Title - Responsive Typography with Dark Text in Light Mode */}
                <h1
                  ref={titleRef}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white mb-5"
                >
                  {post.title}
                </h1>

                {/* Subtitle - Dark in Light Mode, Light in Dark Mode */}
                {post.excerpt && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-white/80 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Row - Theme Aware */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {post.author && (
                    <div className="flex items-center gap-2 rounded-full bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10 shadow-sm">
                      {post.author.avatarUrl ? (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <Link
                        href={`/author/${post.author.slug}`}
                        className="font-medium hover:text-primary dark:hover:text-white transition-colors"
                      >
                        {post.author.name}
                      </Link>
                    </div>
                  )}

                  {post.publishedAt && (
                    <span className="flex items-center gap-2 rounded-full bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10 shadow-sm">
                      <Calendar className="w-4 h-4" />
                      Published{" "}
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </span>
                  )}

                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span className="flex items-center gap-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm px-4 py-2 text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                      <Info className="w-4 h-4" />
                      Updated {format(new Date(post.updatedAt), "MMM d, yyyy")}
                    </span>
                  )}

                  <span className="flex items-center gap-2 rounded-full bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10 shadow-sm">
                    <Clock className="w-4 h-4" />
                    {post.readTimeMinutes} min read
                  </span>

                  {post.author && post.author.bio && (
                    <span className="flex items-center gap-2 rounded-full bg-green-100/80 dark:bg-green-900/30 backdrop-blur-sm px-4 py-2 text-sm text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Expert Reviewed
                    </span>
                  )}

                  {/* Reviewed By Badge */}
                  {(post as any).reviewedBy && (
                    <span className="flex items-center gap-2 rounded-full bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm px-4 py-2 text-sm text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-sm">
                      <Microscope className="w-4 h-4" />
                      Reviewed by {(post as any).reviewedBy}
                      {(post as any).reviewedAt &&
                        ` (${format(
                          new Date((post as any).reviewedAt),
                          "MMM yyyy"
                        )})`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>
        ) : (
          /* Fallback Header Without Image */
          <header className="mb-20 text-center max-w-5xl mx-auto relative">
            <div className="absolute inset-0 -top-20 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent rounded-[4rem] blur-3xl -z-10" />

            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="inline-block mb-8 hover:opacity-80 transition-opacity animate-in fade-in zoom-in duration-500 delay-100"
              >
                <Badge
                  variant="secondary"
                  className="px-5 py-2 text-sm font-bold rounded-full uppercase tracking-wider bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 border border-primary/20 shadow-sm"
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}

            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-10 leading-[1.08] tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 mb-12 leading-relaxed max-w-4xl mx-auto text-balance font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Data */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto animate-in fade-in duration-700 delay-500">
              {post.author && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-border/60 shadow-lg hover:shadow-xl transition-all group">
                  {post.author.avatarUrl ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-background ring-2 ring-primary/30 shadow-md group-hover:ring-primary/50 transition-all">
                      <Image
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center font-black text-xl ring-2 ring-primary/30">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <Link
                      href={`/author/${post.author.slug}`}
                      className="font-bold text-foreground hover:text-primary transition-colors block text-base leading-tight"
                    >
                      {post.author.name}
                    </Link>
                    <div className="text-xs text-muted-foreground font-medium mt-1">
                      Medical Reviewer
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm px-8 py-4 rounded-2xl border border-primary/20 shadow-lg">
                {post.publishedAt && (
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <time
                      dateTime={post.publishedAt.toISOString()}
                      className="font-bold text-foreground text-sm"
                    >
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                  </div>
                )}
                <div className="w-px h-5 bg-primary/30" />
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-bold text-foreground text-sm">
                    {post.readTimeMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Grid Layout with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          {/* LEFT SIDEBAR: Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 relative animate-in fade-in slide-in-from-left-8 duration-700 delay-700">
            <div className="sticky top-28">
              {/* TOC Section */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/3 backdrop-blur-sm p-6 rounded-2xl border border-primary/20 shadow-sm max-h-[calc(100vh-8rem)] flex flex-col">
                <div className="flex items-center gap-2 font-black text-sm text-foreground mb-5 uppercase tracking-wide shrink-0">
                  <List className="w-4 h-4 text-primary" />
                  <span>Contents</span>
                </div>
                <div className="overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
                  <TableOfContents />
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <article className="max-w-4xl">
              {/* Mobile TOC */}
              <div className="lg:hidden mb-16 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-7 rounded-2xl border border-primary/20 shadow-md backdrop-blur-sm">
                <h3 className="font-black text-lg mb-5 flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <List className="w-5 h-5 text-primary" />
                  </div>
                  <span>Table of Contents</span>
                </h3>
                <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                  <TableOfContents />
                </div>
              </div>

              {/* Quick Summary Card */}
              {post.excerpt && (
                <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-green-900 dark:text-green-100 mb-2">
                        Quick Summary
                      </h3>
                      <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="mb-12 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-lg p-5 shadow-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                      Medical Disclaimer
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      This article is for informational purposes only and does
                      not constitute medical advice. Always consult with a
                      qualified healthcare professional before starting any new
                      supplement regimen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Article Content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none blog-content-enhanced
                /* === HEADINGS === */
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-28
                prose-h1:text-[2.5rem] prose-h1:leading-[1.2] prose-h1:mb-4 prose-h1:mt-8 prose-h1:font-bold prose-h1:text-[var(--text)]
                prose-h2:text-[1.75rem] prose-h2:leading-[1.3] prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-bold prose-h2:text-[var(--text)] prose-h2:border-b-2 prose-h2:border-[var(--border)] prose-h2:pb-2
                prose-h3:text-[1.375rem] prose-h3:leading-[1.4] prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-semibold prose-h3:text-[var(--text)] prose-h3:flex prose-h3:items-center prose-h3:gap-2 prose-h3:before:content-['▸'] prose-h3:before:text-[var(--primary)]
                prose-h4:text-[1.125rem] prose-h4:leading-[1.5] prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-semibold prose-h4:text-[var(--text)]
                prose-h5:text-[1rem] prose-h5:leading-[1.6] prose-h5:mt-4 prose-h5:mb-2 prose-h5:font-semibold prose-h5:text-[var(--text)]
                
                /* === PARAGRAPHS === */
                prose-p:text-[1.125rem] prose-p:leading-[1.75] prose-p:mb-5 prose-p:text-[var(--text)]
                
                /* === LINKS === */
                prose-a:text-[var(--link)] prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:font-medium hover:prose-a:text-[var(--link-hover)] prose-a:transition-colors
                
                /* === STRONG/BOLD === */
                prose-strong:font-bold prose-strong:text-[var(--text)]
                
                /* === LISTS - FIX DOUBLE DOTS === */
                prose-ul:my-5 prose-ul:pl-6 prose-ul:list-disc
                prose-ol:my-5 prose-ol:pl-6 prose-ol:list-decimal
                prose-li:my-2.5 prose-li:text-[1.125rem] prose-li:leading-[1.7] prose-li:text-[var(--text)] prose-li:marker:text-[var(--primary)]
                prose-ul:prose-li:pl-0 prose-ol:prose-li:pl-0
                prose-li:prose-li:marker:font-normal
                
                /* === IMAGES === */
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8 prose-img:border-2 prose-img:border-[var(--border)] prose-img:mx-auto
                
                /* === BLOCKQUOTES === */
                prose-blockquote:border-l-[5px] prose-blockquote:border-[var(--accent)] prose-blockquote:bg-[var(--accent-soft)] prose-blockquote:py-4 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:my-7 prose-blockquote:text-[1.125rem] prose-blockquote:leading-[1.7] prose-blockquote:text-[var(--text)] prose-blockquote:not-italic
                
                /* === CODE === */
                prose-code:bg-[rgba(229,194,135,0.25)] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9375rem] prose-code:font-mono prose-code:text-[var(--text)] prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#1e1e1e] prose-pre:text-[#f5f5f5] prose-pre:rounded-2xl prose-pre:p-5 prose-pre:my-6 prose-pre:text-[0.9375rem] prose-pre:leading-[1.6] prose-pre:overflow-x-auto
                
                /* === HORIZONTAL RULES === */
                prose-hr:border-0 prose-hr:h-[1px] prose-hr:bg-[var(--border)] prose-hr:my-8
                
                /* === TABLES === */
                prose-table:w-full prose-table:my-7 prose-table:rounded-2xl prose-table:overflow-hidden prose-table:bg-[var(--surface)]
                prose-thead:bg-[var(--surface-2)]
                prose-th:px-4 prose-th:py-3.5 prose-th:text-left prose-th:font-semibold prose-th:text-[0.9375rem] prose-th:text-[var(--text)]
                prose-td:px-4 prose-td:py-3.5 prose-td:border-t prose-td:border-[var(--border)] prose-td:text-[0.9375rem] prose-td:text-[var(--text)]"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(prepareContent(post.content)),
                }}
              />

              {/* Citations / Sources */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-20 bg-gradient-to-br from-muted/30 via-muted/20 to-transparent border-2 border-border/60 rounded-3xl p-10 overflow-hidden relative group hover:border-primary/30 transition-all shadow-lg hover:shadow-xl">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-primary/70 to-primary/40 group-hover:w-2.5 transition-all" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                  <div className="flex items-center gap-4 mb-10 text-foreground relative z-10">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl shadow-md">
                      <Microscope className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black m-0 tracking-tight">
                      Scientific Sources
                    </h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                    {post.sources.map((source: Source, index: number) => (
                      <div
                        key={index}
                        className="flex gap-5 group/source p-4 rounded-xl hover:bg-muted/30 transition-all"
                      >
                        <span className="text-primary/60 font-mono text-base font-bold mt-0.5 shrink-0 w-8">
                          [{index + 1}]
                        </span>
                        <div className="flex-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary font-bold flex items-center gap-2 transition-colors group-hover/source:underline decoration-primary/40 underline-offset-4 text-base md:text-lg leading-snug"
                          >
                            {source.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover/source:opacity-100 transition-opacity" />
                          </a>
                          {source.description && (
                            <p className="text-sm md:text-base text-muted-foreground mt-2.5 leading-relaxed">
                              {source.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-7 border-t-2 border-border/50 flex gap-3 text-sm text-muted-foreground bg-background/60 -mx-10 -mb-10 p-8 rounded-b-3xl backdrop-blur-sm">
                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <p className="leading-relaxed font-medium">
                      This article is based on scientific evidence, written by
                      experts, and fact-checked by our editorial team.
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="my-16">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-7 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span>Related Topics</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge
                          variant="secondary"
                          className="text-sm py-2.5 px-6 rounded-full hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border-2 border-border/50 hover:border-primary font-bold shadow-sm hover:shadow-md hover:scale-105"
                        >
                          #{tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-20" />

              {/* Author Box Large */}
              <div className="bg-gradient-to-br from-primary/5 via-muted/40 to-primary/5 backdrop-blur-sm border-2 border-border/60 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all hover:border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                {post.author && <AuthorBox author={post.author} />}
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-16">
                <NewsletterForm />
              </div>

              {/* New Prev/Next Navigation */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-12">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group flex flex-col items-start text-left space-y-3 p-6 rounded-2xl border border-border/50 hover:bg-muted/30 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium group-hover:text-primary">
                      <ArrowLeft className="w-4 h-4" /> Previous Article
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group flex flex-col items-end text-right space-y-3 p-6 rounded-2xl border border-border/50 hover:bg-muted/30 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium group-hover:text-primary">
                      Next Article <ArrowRight className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="mt-24">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold tracking-tight">
                    Read Next
                  </h3>
                  <Link
                    href="/blog"
                    className="text-primary hover:underline font-medium"
                  >
                    View all articles
                  </Link>
                </div>
                {relatedPosts && relatedPosts.length > 0 ? (
                  <RelatedPosts posts={relatedPosts} />
                ) : (
                  <p className="text-muted-foreground italic">
                    No related articles found.
                  </p>
                )}
              </div>

              {/* Share Section at Bottom */}
              <div className="mt-20 pt-12 border-t-2 border-border">
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-xl transition-all text-center">
                  <div className="flex items-center justify-center gap-3 text-lg font-black text-foreground uppercase tracking-widest mb-6">
                    <Share2 className="w-6 h-6 text-primary" />
                    <span>Share This Article</span>
                  </div>
                  <div className="flex justify-center">
                    <ShareButtons
                      title={post.title}
                      slug={post.slug}
                      orientation="horizontal"
                      className="flex-wrap justify-center gap-4"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 font-medium">
                    Help others discover this valuable information
                  </p>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
