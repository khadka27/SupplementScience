import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, TrendingUp, Sparkles } from "lucide-react";
import { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { getPostHref } from "@/lib/utils";

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
  const featuredPostImage =
    featuredPost.cardImageUrl || featuredPost.featuredImageUrl;

  return (
    <div className="w-full space-y-16">
      {/* Header section - Only shown if title is present */}
      {title && (
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 text-sm font-semibold mb-6 border border-emerald-200/80 dark:border-emerald-800 shadow-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Scientifically Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
        <Card className="overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-emerald-600/60 dark:hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 bg-white dark:bg-[#0D1217] rounded-[2rem] transition-all duration-500">
          <div className="grid lg:grid-cols-5 gap-0">
            {featuredPostImage && (
              <div className="lg:col-span-3 relative w-full h-[300px] lg:h-[450px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                <Image
                  src={featuredPostImage}
                  alt={featuredPost.featuredImageAlt || featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  unoptimized={
                    featuredPostImage.startsWith("http") ||
                    featuredPostImage.startsWith("/images/")
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </div>
            )}

            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-slate-50/50 dark:bg-[#0F1720]/50">
              {featuredPost.category && (
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E3B2F] dark:text-emerald-400 mb-4 inline-block bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full w-fit border border-emerald-200/60 dark:border-emerald-900/60">
                  {featuredPost.category.name}
                </span>
              )}

              <h2 className="text-3xl lg:text-4xl font-extrabold mb-5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-[1.2] text-slate-900 dark:text-white tracking-tight">
                {featuredPost.title}
              </h2>

              {featuredPost.excerpt && (
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed font-medium">
                  {featuredPost.excerpt}
                </p>
              )}

              <div className="flex items-center gap-5 text-sm font-bold text-slate-500 dark:text-slate-400 mt-auto">
                {featuredPost.author && (
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
                    <span>{featuredPost.author.name}</span>
                  </div>
                )}
                {!!featuredPost.readTimeMinutes && (
                  <div className="flex items-center gap-1.5 font-medium ml-auto">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
        {remainingPosts.map((post) => (
          <Link key={post.id} href={getPostHref(post)} className="group block">
            <div className="h-full flex flex-col bg-white dark:bg-[#0D1217] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 rounded-[1.5rem] p-4 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 group-hover:shadow-xl group-hover:shadow-slate-900/5 dark:group-hover:shadow-black/40">
              {(post.cardImageUrl || post.featuredImageUrl) && (
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6 shadow-xs bg-slate-100 dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800">
                  <Image
                    src={post.cardImageUrl || post.featuredImageUrl || ""}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
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
                </div>
              )}

              <div className="flex-1 flex flex-col">
                {post.category && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0E3B2F] dark:text-emerald-400 mb-3">
                    {post.category.name}
                  </span>
                )}

                <h3 className="text-xl font-extrabold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-2">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {format(new Date(post.publishedAt), "MMM d")}
                      </time>
                    )}
                    <span>•</span>
                    <span>{post.readTimeMinutes} min</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-700 dark:text-emerald-400 font-bold">
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
