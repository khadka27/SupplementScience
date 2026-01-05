"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
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
} from "lucide-react";
import { Post, Source } from "@/lib/types";
import AuthorBox from "./AuthorBox";
import RelatedPosts from "./RelatedPosts";
import Breadcrumbs from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";
import ShareButtons from "./ShareButtons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogPostContentProps {
  post: Post;
  relatedPosts?: Post[];
  prevPost?: { title: string; slug: string; featuredImageUrl?: string | null } | null;
  nextPost?: { title: string; slug: string; featuredImageUrl?: string | null } | null;
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
               <ShareButtons title={post.title} slug={post.slug} orientation="horizontal" className="hidden sm:flex" />
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
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Header */}
        <header className="mb-16 text-center max-w-4xl mx-auto">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block mb-6 hover:opacity-80 transition-opacity animate-in fade-in zoom-in duration-500 delay-100"
            >
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium rounded-full uppercase tracking-wider bg-primary/5 text-primary hover:bg-primary/10"
              >
                {post.category.name}
              </Badge>
            </Link>
          )}

          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-foreground text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {post.excerpt}
            </p>
          )}

          {/* Author & Meta Data */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-6 max-w-3xl mx-auto backdrop-blur-sm animate-in fade-in duration-700 delay-500">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-primary/20 shadow-sm">
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <Link
                    href={`/author/${post.author.slug}`}
                    className="font-bold text-foreground hover:text-primary transition-colors block text-base"
                  >
                    {post.author.name}
                  </Link>
                  <div className="text-xs opacity-70">Medical Reviewer</div>
                </div>
              </div>
            )}

            <div className="hidden sm:block">
              <div className="flex items-center gap-6 bg-muted/30 px-6 py-2 rounded-full border border-border/50">
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <time
                      dateTime={post.publishedAt.toISOString()}
                      className="font-medium"
                    >
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                  </div>
                )}
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {post.readTimeMinutes} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="relative w-full aspect-21/9 mb-20 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/10 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500 group">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* LEFT SIDEBAR: Table of Contents & Share */}
          <aside className="hidden lg:block lg:col-span-3 relative animate-in fade-in slide-in-from-left-8 duration-700 delay-700">
            <div className="sticky top-32 space-y-8 pl-2">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pl-1">
                  Share
                </p>
                <ShareButtons
                  title={post.title}
                  slug={post.slug}
                  orientation="vertical"
                  className="items-start"
                />
              </div>

              <Separator className="w-12" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground mb-2 pl-1">
                  <List className="w-4 h-4 text-primary" /> TABLE OF CONTENTS
                </div>
                <TableOfContents />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="lg:col-span-8 lg:col-start-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <article>
              {/* Mobile TOC */}
              <div className="lg:hidden mb-12 bg-muted/30 p-6 rounded-xl border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <List className="w-4 h-4" /> Table of Contents
                </h3>
                <TableOfContents />
              </div>

              <div
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-32 prose-headings:text-foreground
                prose-h1:text-4xl lg:prose-h1:text-5xl lg:prose-h1:leading-tight
                prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/40 prose-h2:font-extrabold
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-bold
                prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-4 prose-h4:font-bold
                prose-p:leading-loose prose-p:text-muted-foreground prose-p:mb-8 prose-p:text-xl
                prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:text-primary/80 prose-a:transition-colors prose-a:decoration-primary/30 prose-a:underline-offset-4 hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-foreground prose-strong:text-lg
                prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-ul:space-y-3
                prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-ol:space-y-3
                prose-li:text-lg md:prose-li:text-xl prose-li:text-muted-foreground prose-li:marker:text-primary prose-li:marker:font-bold
                prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-12 prose-img:border prose-img:border-border/50
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-foreground/90 prose-blockquote:shadow-sm
                prose-code:bg-muted/50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-bold prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-zinc-950 prose-pre:text-zinc-50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Citations / Sources */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-24 bg-muted/20 border border-border/60 rounded-3xl p-8 overflow-hidden relative group hover:border-border/80 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  <div className="flex items-center gap-3 mb-8 text-foreground/80">
                    <div className="bg-primary/10 p-2 rounded-full">
                       <Microscope className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold m-0 tracking-tight">
                      Scientific Sources
                    </h3>
                  </div>
                  <div className="space-y-5">
                    {post.sources.map((source: Source, index: number) => (
                      <div key={index} className="flex gap-4 group/source">
                        <span className="text-muted-foreground/60 font-mono text-sm mt-0.5 shrink-0 w-6">
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        <div className="flex-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors group-hover/source:underline decoration-primary/30 underline-offset-4 text-base md:text-lg"
                          >
                            {source.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover/source:opacity-100 transition-opacity translate-y-0.5" />
                          </a>
                          {source.description && (
                            <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
                              {source.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/50 flex gap-3 text-sm text-muted-foreground italic bg-background/50 -mx-8 -mb-8 p-6">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      This article is based on scientific evidence, written by
                      experts, and fact-checked by our editorial team.
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="my-16">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
                    Related Topics
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge
                          variant="secondary"
                          className="text-sm py-2 px-5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-border/50"
                        >
                          #{tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-16" />

              {/* Author Box Large */}
              <div className="bg-linear-to-br from-background via-muted/30 to-background border border-border/60 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-shadow duration-500">
                {post.author && <AuthorBox author={post.author} />}
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
                   ) : <div />}

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
                   ) : <div />}
               </div>

              <div className="mt-24">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-3xl font-bold tracking-tight">Read Next</h3>
                   <Link href="/blog" className="text-primary hover:underline font-medium">View all articles</Link>
                </div>
                {relatedPosts && relatedPosts.length > 0 ? (
                  <RelatedPosts posts={relatedPosts} />
                ) : (
                  <p className="text-muted-foreground italic">
                    No related articles found.
                  </p>
                )}
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Floating Mobile Share Bar */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-background/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full px-8 py-4 flex items-center gap-4 animate-in slide-in-from-bottom-20 duration-1000 delay-1000">
        <span className="text-sm font-bold mr-2 text-foreground/80">Share</span>
        <ShareButtons
          title={post.title}
          slug={post.slug}
          orientation="horizontal"
        />
      </div>
    </div>
  );
}
