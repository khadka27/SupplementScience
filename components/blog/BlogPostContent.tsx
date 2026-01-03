"use client";

import { useEffect, useState } from "react";
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

interface BlogPostContentProps {
  post: Post;
  relatedPosts?: Post[];
}

export default function BlogPostContent({
  post,
  relatedPosts,
}: BlogPostContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
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
    <div className="min-h-screen bg-background relative pb-20">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-100">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Header */}
        <header className="mb-12 text-center max-w-5xl mx-auto">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block mb-6 hover:opacity-80 transition-opacity"
            >
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium rounded-full uppercase tracking-wider"
              >
                {post.category.name}
              </Badge>
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight text-foreground text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto text-balance">
              {post.excerpt}
            </p>
          )}

          {/* Author & Meta Data */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-6 max-w-4xl mx-auto backdrop-blur-sm">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-border/50 shadow-sm">
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
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
                      {format(new Date(post.publishedAt), "MMMM d, yyyy")}
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
          <div className="relative w-full aspect-21/9 mb-16 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/10 max-w-6xl mx-auto">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* LEFT SIDEBAR: Table of Contents & Share */}
          <aside className="hidden lg:block lg:col-span-3 relative">
            <div className="sticky top-28 space-y-8 pl-2">
              {/* Quick Actions */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-bold text-lg text-primary mb-2">
                  <List className="w-5 h-5" /> Contents
                </div>
                <TableOfContents />
              </div>

              <Separator className="my-6 w-1/2" />

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-4">
                  Share this article
                </p>
                <ShareButtons
                  title={post.title}
                  slug={post.slug}
                  orientation="horizontal"
                  className="justify-start flex-wrap gap-3"
                />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="lg:col-span-8 lg:col-start-4">
            <article>
              {/* Mobile TOC */}
              <div className="lg:hidden mb-10 bg-muted/30 p-6 rounded-xl border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <List className="w-4 h-4" /> Table of Contents
                </h3>
                <TableOfContents />
              </div>

              <div
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-32 prose-headings:text-foreground
                prose-h1:text-4xl lg:prose-h1:text-6xl lg:prose-h1:leading-tight
                prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/40 prose-h2:font-extrabold
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:font-bold
                prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-4 prose-h4:font-bold
                prose-p:leading-loose prose-p:text-muted-foreground prose-p:mb-8 prose-p:text-lg md:prose-p:text-xl
                prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:text-primary/80 prose-a:transition-colors prose-a:decoration-primary/30 prose-a:underline-offset-4 hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-foreground prose-strong:text-lg
                prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-ul:space-y-3
                prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-ol:space-y-3
                prose-li:text-lg md:prose-li:text-xl prose-li:text-muted-foreground prose-li:marker:text-primary prose-li:marker:font-bold
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12 prose-img:border prose-img:border-border/50
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/20 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:text-foreground/80
                prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted/50 prose-pre:backdrop-blur-sm prose-pre:border prose-pre:border-border/50 prose-pre:rounded-2xl prose-pre:p-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Citations / Sources */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-20 bg-muted/30 border border-border rounded-2xl p-8 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                  <div className="flex items-center gap-3 mb-6 text-primary">
                    <Microscope className="w-6 h-6" />
                    <h3 className="text-2xl font-bold m-0">
                      Scientific Sources & Citations
                    </h3>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {post.sources.map((source: Source, index: number) => (
                      <div key={index} className="flex gap-4 group">
                        <span className="text-muted-foreground/60 font-mono text-xs mt-1 shrink-0 bg-background border border-border px-1.5 rounded h-fit">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors group-hover:underline decoration-primary/30 underline-offset-4 text-sm md:text-base"
                          >
                            {source.title}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          {source.description && (
                            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                              {source.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border/50 flex gap-3 text-xs text-muted-foreground italic">
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
                <div className="my-12">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Related Topics
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge
                          variant="secondary"
                          className="text-sm py-1.5 px-4 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
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
              <div className="bg-linear-to-br from-muted/50 to-background border border-border rounded-3xl p-8 shadow-sm">
                {post.author && <AuthorBox author={post.author} />}
              </div>

              <div className="mt-20">
                <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
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
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4">
        <span className="text-sm font-medium mr-2">Share</span>
        <ShareButtons
          title={post.title}
          slug={post.slug}
          orientation="horizontal"
        />
      </div>
    </div>
  );
}
