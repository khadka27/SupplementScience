import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
    <div className="my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayPosts.map((post, index) => (
          <Link
            key={post.id}
            href={getPostHref(post)}
            className="group h-full block"
          >
            <article className="h-full flex flex-col space-y-4">
              {post.featuredImageUrl && (
                <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-border/50 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={post.featuredImageUrl.startsWith("http")}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-sm text-xs font-bold shadow-sm"
                      >
                        {post.category.name}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 flex flex-col space-y-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt.toISOString()}>
                      {format(new Date(post.publishedAt), "MMM d, yyyy")}
                    </time>
                  )}
                </div>

                <h4 className="text-xl font-black leading-tight text-black group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>

                {post.excerpt && (
                  <p className="text-gray-700 line-clamp-3 text-sm leading-relaxed mb-4 flex-1 font-medium">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 pt-2">
                  <Clock className="w-3.5 h-3.5" />
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
