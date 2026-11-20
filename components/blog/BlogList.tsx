import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Clock,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  FileText,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Post } from "@/lib/types";
import { getPostHref } from "@/lib/utils";

interface BlogListProps {
  posts: Post[];
  title?: string;
  showFeatured?: boolean;
}

function getCleanExcerpt(post: Post): string {
  if (post.excerpt && post.excerpt.trim().length > 0) {
    return post.excerpt.trim();
  }
  if (post.content && post.content.trim().length > 0) {
    const clean = post.content
      .replace(/<[^>]*>/g, " ")
      .replace(/#+\s+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (clean.length > 20) {
      return clean.length > 130 ? clean.slice(0, 127) + "..." : clean;
    }
  }
  const titleLower = (post.title || "").toLowerCase();
  if (titleLower.includes("recall")) {
    return "Official recall notice details, lot numbers, potential contamination risks, and consumer safety guidance.";
  }
  if (titleLower.includes("fda warning") || titleLower.includes("warning")) {
    return "Regulatory inspection findings, undisclosed active ingredients, and health risk analysis.";
  }
  if (titleLower.includes("review")) {
    return "Independent ingredient dosage audit, label claim verification, and clinical safety evaluation.";
  }
  return "Evidence-based synthesis, peer-reviewed clinical research breakdown, and safety findings.";
}

function getBadgeInfo(post: Post) {
  const titleLower = (post.title || "").toLowerCase();
  const slugLower = (post.slug || "").toLowerCase();

  if (titleLower.includes("recall") || slugLower.includes("recall")) {
    return {
      label: "Safety Recall",
      variant: "alert" as const,
      icon: AlertTriangle,
      badgeClass:
        "bg-amber-50 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/60",
      iconClass: "text-amber-600 dark:text-amber-400",
    };
  }

  if (
    titleLower.includes("fda warning") ||
    slugLower.includes("fda-warning") ||
    titleLower.includes("warning")
  ) {
    return {
      label: "FDA Warning",
      variant: "warning" as const,
      icon: ShieldAlert,
      badgeClass:
        "bg-rose-50 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200 border-rose-200/80 dark:border-rose-800/60",
      iconClass: "text-rose-600 dark:text-rose-400",
    };
  }

  if (titleLower.includes("review") || slugLower.includes("review")) {
    return {
      label: "Product Review",
      variant: "review" as const,
      icon: ShieldCheck,
      badgeClass:
        "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    };
  }

  return {
    label: post.category?.name || "Evidence Guide",
    variant: "guide" as const,
    icon: FileText,
    badgeClass:
      "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  };
}

export default function BlogList({
  posts,
  title,
  showFeatured = false,
}: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4 animate-pulse">
          <Sparkles className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          We&apos;re constantly researching. Check back soon for new evidence-based
          guides!
        </p>
      </div>
    );
  }

  const shouldShowFeatured = showFeatured && posts.length >= 4;
  const featuredPost = shouldShowFeatured ? posts[0] : null;
  const gridPosts = shouldShowFeatured ? posts.slice(1) : posts;
  const featuredPostImage = featuredPost
    ? featuredPost.cardImageUrl || featuredPost.featuredImageUrl
    : null;
  const featuredBadge = featuredPost ? getBadgeInfo(featuredPost) : null;
  const FeaturedBadgeIcon = featuredBadge ? featuredBadge.icon : null;

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      {/* Header section - Only shown if title is present */}
      {title && (
        <div className="text-center mb-10 sm:mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0E3B2F] dark:text-emerald-300 text-sm font-semibold mb-5 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
            <span>Scientifically Verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Expert guides on clinical research, nutrition science, and
            supplement efficacy.
          </p>
        </div>
      )}

      {/* Main Featured Article (When enabled) */}
      {shouldShowFeatured && featuredPost && featuredBadge && FeaturedBadgeIcon && (
        <Link
          href={getPostHref(featuredPost)}
          className="block group transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-3xl"
        >
          <div className="overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/50 bg-white dark:bg-[#0D1217] rounded-3xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {featuredPostImage && (
                <div className="lg:col-span-3 relative w-full h-[240px] sm:h-[320px] lg:h-auto lg:min-h-[420px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={featuredPostImage}
                    alt={featuredPost.featuredImageAlt || featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    unoptimized={
                      featuredPostImage.startsWith("http") ||
                      featuredPostImage.startsWith("/images/")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              <div className="lg:col-span-2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-slate-50/40 dark:bg-[#0F1720]/40">
                <div>
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase border ${featuredBadge.badgeClass}`}
                    >
                      <FeaturedBadgeIcon
                        className={`w-3.5 h-3.5 ${featuredBadge.iconClass} shrink-0`}
                      />
                      <span>{featuredBadge.label}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-[1.2] text-slate-900 dark:text-white tracking-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed font-normal">
                    {getCleanExcerpt(featuredPost)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {featuredPost.author && (
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {featuredPost.author.name}
                      </span>
                    )}
                    {featuredPost.publishedAt && (
                      <span className="text-slate-400">
                        {format(new Date(featuredPost.publishedAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <span>Read Full Dossier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Articles Grid - Balanced across all screens: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {gridPosts.map((post) => {
          const imageSrc = post.cardImageUrl || post.featuredImageUrl;
          const badge = getBadgeInfo(post);
          const BadgeIcon = badge.icon;
          const excerpt = getCleanExcerpt(post);

          return (
            <Link
              key={post.id}
              href={getPostHref(post)}
              className="group block h-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-2xl"
            >
              <article className="h-full flex flex-col bg-white dark:bg-[#0D1217] rounded-2xl border border-slate-200/85 dark:border-slate-800/80 overflow-hidden transition-all duration-300 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40 hover:-translate-y-1 active:scale-[0.99]">
                {/* Media Container - Seamless full-width top container */}
                <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/40 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950 overflow-hidden shrink-0">
                  {imageSrc ? (
                    <>
                      <Image
                        src={imageSrc}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={
                          imageSrc.startsWith("http") ||
                          imageSrc.startsWith("/images/")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-950/10 via-slate-100 to-slate-200/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-[#0A0E13]">
                      <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-2 shadow-2xs">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                        {post.category?.name || "Supplement Dossier"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category / Alert Badge */}
                    <div className="mb-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${badge.badgeClass}`}
                      >
                        <BadgeIcon
                          className={`w-3 h-3 ${badge.iconClass} shrink-0`}
                        />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 sm:line-clamp-3 mb-2.5">
                      {post.title}
                    </h3>

                    {/* Excerpt - Always informative and never an empty gap */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal mb-5">
                      {excerpt}
                    </p>
                  </div>

                  {/* Footer Metadata */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 mt-auto">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {post.publishedAt && (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <time
                            dateTime={new Date(post.publishedAt).toISOString()}
                          >
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </time>
                        </span>
                      )}
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{post.readTimeMinutes || 5} min</span>
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 shrink-0">
                      <span className="hidden sm:inline">
                        {badge.variant === "review"
                          ? "Read Review"
                          : "Read Guide"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
