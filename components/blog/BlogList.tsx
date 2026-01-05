import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: Post[];
  title?: string;
}

export default function BlogList({ posts, title }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Check back soon for new content!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Evidence-Based Content</span>
          </div>
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              {title}
            </h1>
          )}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive guides on supplements, nutrition, and
            wellness backed by scientific research.
          </p>
        </div>

        {/* Featured Post */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="block mb-16 group animate-fadeInUp"
        >
          <Card className="overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              {featuredPost.featuredImageUrl && (
                <div className="relative w-full h-64 md:h-full min-h-[300px] overflow-hidden">
                  <Image
                    src={featuredPost.featuredImageUrl}
                    alt={featuredPost.featuredImageAlt || featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              <div className="p-8 lg:p-10 flex flex-col justify-center">
                {featuredPost.category && (
                  <Badge
                    variant="secondary"
                    className="w-fit mb-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  >
                    {featuredPost.category.name}
                  </Badge>
                )}

                <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {featuredPost.author && (
                    <div className="flex items-center gap-2">
                      {featuredPost.author.avatarUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-green-200 dark:ring-green-800">
                          <Image
                            src={featuredPost.author.avatarUrl}
                            alt={featuredPost.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-medium">
                        {featuredPost.author.name}
                      </span>
                    </div>
                  )}

                  {featuredPost.publishedAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={featuredPost.publishedAt.toISOString()}>
                        {format(
                          new Date(featuredPost.publishedAt),
                          "MMM d, yyyy"
                        )}
                      </time>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTimeMinutes} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Grid Posts */}
        {remainingPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-green-200 dark:hover:border-green-800">
                  {post.featuredImageUrl && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  <CardHeader className="space-y-3">
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="w-fit bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        {post.category.name}
                      </Badge>
                    )}

                    <CardTitle className="line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {post.title}
                    </CardTitle>

                    {post.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          {post.author.avatarUrl && (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-border">
                              <Image
                                src={post.author.avatarUrl}
                                alt={post.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">
                            {post.author.name}
                          </span>
                        </div>
                      )}

                      <span className="text-muted-foreground/50">•</span>

                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </time>
                      )}

                      <span className="text-muted-foreground/50">•</span>

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
        )}
      </div>
    </div>
  );
}
