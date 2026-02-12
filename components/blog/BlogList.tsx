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
import { cn, getPostHref } from "@/lib/utils";

interface BlogListProps {
  posts: Post[];
  title?: string;
}

export default function BlogList({ posts, title }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          We're constantly researching. Check back soon for new evidence-based
          guides!
        </p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="w-full space-y-16">
      {/* Header section - Only shown if title is present */}
      {title && (
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-6 ring-1 ring-emerald-100 shadow-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Scientifically Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Expert guides on clinical research, nutrition science, and
            supplement efficacy.
          </p>
        </div>
      )}

      {/* Main Featured Article */}
      <Link
        href={getPostHref(featuredPost)}
        className="block group transition-all duration-500"
      >
        <Card className="overflow-hidden border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white">
          <div className="grid lg:grid-cols-5 gap-0">
            {featuredPost.featuredImageUrl && (
              <div className="lg:col-span-3 relative w-full h-[300px] lg:h-[450px] overflow-hidden">
                <Image
                  src={featuredPost.featuredImageUrl}
                  alt={featuredPost.featuredImageAlt || featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
            )}

            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-slate-50/30">
              {featuredPost.category && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 inline-block">
                  {featuredPost.category.name}
                </span>
              )}

              <h2 className="text-3xl lg:text-4xl font-black mb-6 group-hover:text-emerald-700 transition-colors leading-[1.1] text-slate-900">
                {featuredPost.title}
              </h2>

              {featuredPost.excerpt && (
                <p className="text-slate-500 text-lg mb-8 line-clamp-3 leading-relaxed font-medium">
                  {featuredPost.excerpt}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                {featuredPost.author && (
                  <div className="flex items-center gap-2 text-slate-900">
                    <span className="w-6 h-px bg-slate-300"></span>
                    <span>{featuredPost.author.name}</span>
                  </div>
                )}
                {featuredPost.readTimeMinutes && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTimeMinutes} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>

      {/* All Other Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {remainingPosts.map((post, index) => (
          <Link key={post.id} href={getPostHref(post)} className="group block">
            <div className="h-full flex flex-col bg-white overflow-hidden transition-all duration-300 group-hover:-translate-y-2">
              {post.featuredImageUrl && (
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-sm ring-1 ring-slate-100/50">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col">
                {post.category && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                    {post.category.name}
                  </span>
                )}

                <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {format(new Date(post.publishedAt), "MMM d")}
                      </time>
                    )}
                    <span>•</span>
                    <span>{post.readTimeMinutes} min</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-600">
                    Read guide →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
