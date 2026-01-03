import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogListProps {
  posts: Post[];
  title?: string;
}

export default function BlogList({ posts, title }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              {post.featuredImageUrl && (
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <CardHeader>
                {post.category && (
                  <Badge variant="secondary" className="w-fit mb-2">
                    {post.category.name}
                  </Badge>
                )}

                <CardTitle className="line-clamp-2">{post.title}</CardTitle>

                {post.excerpt && (
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {post.author && (
                    <div className="flex items-center gap-1">
                      {post.author.avatarUrl && (
                        <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span>{post.author.name}</span>
                    </div>
                  )}

                  {post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <time dateTime={post.publishedAt.toISOString()}>
                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                      </time>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTimeMinutes} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
