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
    ...(post.category?.slug === "ingredients"
      ? [{ name: "Ingredients", url: "/ingredients" }]
      : post.category
        ? [
            { name: "Blog", url: "/blog" },
            {
              name: post.category.name,
              url: `/${post.category.slug}`,
            },
          ]
        : [{ name: "Blog", url: "/blog" }]),
    { name: post.title, url: getPostHref(post) },
  ];

  return (
    <div
      className="min-h-screen bg-[#F9F8F6] text-black relative pb-24 font-sans selection:bg-primary/20 selection:text-primary"
      style={
        {
          "--text": "#000000",
          "--foreground": "#000000",
          "--muted-foreground": "#4b5563",
          "--border": "#D9CFC7",
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

        {/* Modern SEO-Friendly Hero Section */}
        <header className="mb-12 lg:mb-20 max-w-7xl mx-auto bg-[#EFE9E3] p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-[#D9CFC7] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="inline-block hover:opacity-80 transition-opacity"
                >
                  <span className="text-primary font-bold tracking-wide uppercase text-sm border-b-2 border-primary/20 hover:border-primary transition-colors pb-0.5">
                    {post.category.name}
                  </span>
                </Link>
              )}

              {/* Title */}
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black leading-[1.1] tracking-tight text-balance"
              >
                {post.title}
              </h1>

              {/* Author & Meta Info Block */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-4 border-y border-black/10">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 ring-2 ring-[#EFE9E3]">
                        <Image
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border-2 border-[#EFE9E3] ring-2 ring-primary/10">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-0.5">
                        Written by
                      </div>
                      <Link
                        href={`/author/${post.author.slug}`}
                        className="font-bold text-black hover:text-primary transition-colors block leading-none text-base"
                      >
                        {post.author.name}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="hidden sm:block w-px h-10 bg-black/10" />

                <div className="flex flex-col justify-center gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium text-black">
                      Updated{" "}
                      <time
                        dateTime={
                          post.updatedAt?.toString() ||
                          post.publishedAt?.toString()
                        }
                      >
                        {post.updatedAt
                          ? format(new Date(post.updatedAt), "MMMM d, yyyy")
                          : format(
                              new Date(post.publishedAt || new Date()),
                              "MMMM d, yyyy",
                            )}
                      </time>
                    </span>
                    <span className="text-black/20">•</span>
                    <span>{post.readTimeMinutes} min read</span>
                  </div>

                  {/* Reviewed By Badge - Dynamic */}
                  {post.reviewedBy && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 bg-[#D9CFC7]/50 px-2.5 py-1 rounded-full self-start">
                      <div className="p-0.5 bg-primary/20 rounded-full">
                        <svg
                          className="w-2 h-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={4}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      Reviewed by {post.reviewedBy}
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-balance">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 order-1 lg:order-2 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl border border-border/40 bg-muted">
                {post.featuredImageUrl ? (
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 text-primary/20">
                    <Microscope className="w-24 h-24" />
                  </div>
                )}

                {/* Image Badge/Overlay (Optional) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid Layout with Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          {/* LEFT SIDEBAR: Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 relative animate-in fade-in slide-in-from-left-8 duration-700 delay-700">
            <div className="sticky top-28">
              {/* TOC Section */}
              <div className="bg-[#EFE9E3] backdrop-blur-sm p-6 rounded-2xl border border-[#D9CFC7] shadow-sm max-h-[calc(100vh-8rem)] flex flex-col">
                <div className="flex items-center gap-2 font-black text-sm text-black mb-5 uppercase tracking-wide shrink-0">
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
              <div className="lg:hidden mb-16 bg-[#EFE9E3] p-7 rounded-2xl border border-[#D9CFC7] shadow-md backdrop-blur-sm">
                <h3 className="font-black text-lg mb-5 flex items-center gap-3 text-black">
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
                <div className="mb-12 bg-white/50 border-2 border-[#D9CFC7] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-primary"
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
                      <h3 className="text-lg font-black text-black mb-2">
                        Quick Summary
                      </h3>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="mb-12 bg-[#EFE9E3]/50 border-l-4 border-[#D9CFC7] rounded-lg p-5 shadow-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-black mb-1">
                      Medical Disclaimer
                    </h4>
                    <p className="text-xs text-gray-800 leading-relaxed">
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
                className="prose prose-lg max-w-none blog-content-enhanced
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
                prose-a:text-primary prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:font-bold hover:prose-a:text-primary/80 prose-a:transition-colors
                
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
                prose-code:bg-black/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9375rem] prose-code:font-mono prose-code:text-black prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#1e1e1e] prose-pre:text-[#f5f5f5] prose-pre:rounded-2xl prose-pre:p-5 prose-pre:my-6 prose-pre:text-[0.9375rem] prose-pre:leading-[1.6] prose-pre:overflow-x-auto
                
                /* === HORIZONTAL RULES === */
                prose-hr:border-0 prose-hr:h-[1px] prose-hr:bg-[var(--border)] prose-hr:my-8
                
                /* === TABLES === */
                prose-table:w-full prose-table:my-7 prose-table:rounded-2xl prose-table:overflow-hidden prose-table:bg-white/50
                prose-thead:bg-[#EFE9E3]
                prose-th:px-4 prose-th:py-3.5 prose-th:text-left prose-th:font-black prose-th:text-[0.9375rem] prose-th:text-black
                prose-td:px-4 prose-td:py-3.5 prose-td:border-t prose-td:border-[#D9CFC7] prose-td:text-[0.9375rem] prose-td:text-black"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(prepareContent(post.content)),
                }}
              />

              {/* Citations / Sources */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-20 bg-white/40 backdrop-blur-sm border-2 border-[#D9CFC7] rounded-[2.5rem] p-10 overflow-hidden relative group hover:border-primary/30 transition-all shadow-lg hover:shadow-xl">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/70 group-hover:w-2.5 transition-all" />

                  <div className="flex items-center gap-4 mb-10 text-black relative z-10">
                    <div className="bg-primary/10 p-3 rounded-2xl shadow-sm">
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
                        className="flex gap-5 group/source p-5 rounded-2xl hover:bg-[#EFE9E3]/50 transition-all border border-transparent hover:border-[#D9CFC7]"
                      >
                        <span className="text-primary/70 font-mono text-base font-bold mt-0.5 shrink-0 w-8">
                          [{index + 1}]
                        </span>
                        <div className="flex-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-primary font-bold flex items-center gap-2 transition-colors group-hover/source:underline decoration-primary/40 underline-offset-4 text-base md:text-lg leading-snug"
                          >
                            {source.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover/source:opacity-100 transition-opacity" />
                          </a>
                          {source.description && (
                            <p className="text-sm md:text-base text-gray-700 mt-2.5 leading-relaxed">
                              {source.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-7 border-t border-[#D9CFC7] flex gap-3 text-sm text-gray-700 bg-[#EFE9E3]/30 -mx-10 -mb-10 p-8 rounded-b-[2.5rem] backdrop-blur-sm">
                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <p className="leading-relaxed font-semibold">
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
                          className="text-sm py-2.5 px-6 rounded-full bg-white hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-[#D9CFC7] hover:border-primary font-bold shadow-sm hover:shadow-md hover:scale-105"
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
              <div className="bg-[#EFE9E3] backdrop-blur-sm border-2 border-[#D9CFC7] rounded-[2.5rem] p-12 shadow-xl hover:shadow-2xl transition-all hover:border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                {post.author && <AuthorBox author={post.author} />}
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-16">
                <NewsletterForm />
              </div>

              {/* New Prev/Next Navigation */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#D9CFC7] pt-12">
                {prevPost ? (
                  <Link
                    href={getPostHref(prevPost)}
                    className="group flex flex-col items-start text-left space-y-3 p-6 rounded-2xl border border-[#D9CFC7] bg-white/40 hover:bg-[#EFE9E3] transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-bold group-hover:text-primary">
                      <ArrowLeft className="w-4 h-4" /> Previous Article
                    </div>
                    <h4 className="text-lg font-black text-black group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    href={getPostHref(nextPost)}
                    className="group flex flex-col items-end text-right space-y-3 p-6 rounded-2xl border border-[#D9CFC7] bg-white/40 hover:bg-[#EFE9E3] transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-bold group-hover:text-primary">
                      Next Article <ArrowRight className="w-4 h-4" />
                    </div>
                    <h4 className="text-lg font-black text-black group-hover:text-primary transition-colors line-clamp-2">
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
              <div className="mt-20 pt-12 border-t-2 border-[#D9CFC7]">
                <div className="bg-[#EFE9E3] p-10 rounded-[2.5rem] border border-[#D9CFC7] shadow-lg hover:shadow-xl transition-all text-center">
                  <div className="flex items-center justify-center gap-3 text-lg font-black text-black uppercase tracking-widest mb-6">
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
                  <p className="text-sm text-gray-700 mt-6 font-bold">
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
