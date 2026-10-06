import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPostHref } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
  currentPostId?: string;
}

export default function RelatedPosts({
  posts,
  currentPostId,
}: RelatedPostsProps) {
  const displayPosts = currentPostId
    ? posts.filter((p) => p.id !== currentPostId).slice(0, 3)
    : posts.slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <div className="my-8 sm:my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {displayPosts.map((post) => (
          <Link
            key={post.id}
            href={getPostHref(post)}
            className="group h-full block"
          >
            <article className="h-full flex flex-col space-y-3 sm:space-y-4 p-3.5 sm:p-0 rounded-2xl sm:rounded-none bg-white sm:bg-transparent dark:bg-[#0D1217] sm:dark:bg-transparent border sm:border-0 border-slate-200 dark:border-slate-800 shadow-2xs sm:shadow-none">
              {(post.cardImageUrl || post.featuredImageUrl) && (
                <div className="relative w-full aspect-video overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 shadow-xs group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={post.cardImageUrl || post.featuredImageUrl || ""}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={
                      (
                        post.cardImageUrl ||
                        post.featuredImageUrl ||
                        ""
                      ).startsWith("http") ||
                      (
                        post.cardImageUrl ||
                        post.featuredImageUrl ||
                        ""
                      ).startsWith("/images/")
                    }
                  />
                  {post.category && (
                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-sm text-[10px] sm:text-xs font-bold shadow-xs"
                      >
                        {post.category.name}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString()}>
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                  )}
                </div>

                <h4 className="text-base sm:text-xl font-black leading-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>

                {post.excerpt && (
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 flex-1 font-medium">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 pt-1 sm:pt-2">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{post.readTimeMinutes} min read</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
