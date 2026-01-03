"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Post, Source } from "@/lib/types";
import AuthorBox from "./AuthorBox";
import RelatedPosts from "./RelatedPosts";
import Breadcrumbs from "./Breadcrumbs";
import TableOfContents from "./TableOfContents";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Microscope, Info } from "lucide-react";

interface BlogPostContentProps {
  post: Post;
  relatedPosts?: Post[];
}

export default function BlogPostContent({
  post,
  relatedPosts,
}: BlogPostContentProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yoursite.com";

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category
      ? [{ name: post.category.name, url: `/category/${post.category.slug}` }]
      : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <article className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-8 mt-6">
          {post.category && (
            <Link href={`/category/${post.category.slug}`}>
              <Badge variant="secondary" className="mb-4">
                {post.category.name}
              </Badge>
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </time>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTimeMinutes} min read</span>
            </div>
          </div>

          {post.updatedAt &&
            post.publishedAt &&
            post.updatedAt.getTime() !== post.publishedAt.getTime() && (
              <div className="mt-2 text-sm text-muted-foreground">
                Last updated: {format(new Date(post.updatedAt), "MMMM d, yyyy")}
              </div>
            )}
        </header>

        {post.featuredImageUrl && (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        <TableOfContents />

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.sources && post.sources.length > 0 && (
          <div className="bg-muted/30 border border-border/50 rounded-xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Microscope className="w-6 h-6" />
              <h2 className="text-2xl font-bold m-0!">Scientific Citations</h2>
            </div>
            <div className="space-y-4">
              {post.sources.map((source: Source, index: number) => (
                <div key={index} className="flex gap-4 group">
                  <span className="text-muted-foreground/50 font-mono text-sm mt-0.5">
                    [{index + 1}]
                  </span>
                  <div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {source.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {source.description && (
                      <p className="text-sm text-muted-foreground mt-1 mb-0">
                        {source.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-8 italic flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              Note: Every claim on SupplementScience is backed by high-quality
              studies, including peer-reviewed papers and clinical trials, to
              ensure provide you with the most accurate, science-based health
              information.
            </p>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <Badge variant="outline">#{tag.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Medical Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            The information provided in this article is for educational purposes
            only and is not intended as medical advice. Always consult with a
            healthcare professional before making changes to your health regimen
            or starting any new supplement.
          </p>
        </div>

        {post.author && <AuthorBox author={post.author} />}

        {relatedPosts && relatedPosts.length > 0 && (
          <>
            <Separator className="my-12" />
            <RelatedPosts posts={relatedPosts} />
          </>
        )}
      </div>
    </article>
  );
}
