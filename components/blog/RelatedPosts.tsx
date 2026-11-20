import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Clock,
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { Post } from "@/lib/types";
import { getPostHref } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
  currentPostId?: string;
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
    return "Official recall notice details, lot numbers, potential contamination risks, and safety advice.";
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

export default function RelatedPosts({
  posts,
  currentPostId,
}: RelatedPostsProps) {
  const displayPosts = currentPostId
    ? posts.filter((p) => p.id !== currentPostId).slice(0, 3)
    : posts.slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <div className="my-8 sm:my-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {displayPosts.map((post) => {
          const imageSrc = post.cardImageUrl || post.featuredImageUrl;
          const badge = getBadgeInfo(post);
          const BadgeIcon = badge.icon;
          const excerpt = getCleanExcerpt(post);

          return (
            <Link
              key={post.id}
              href={getPostHref(post)}
              className="group block h-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
            >
              <article className="h-full flex flex-col bg-white dark:bg-[#0D1217] rounded-2xl border border-slate-200/85 dark:border-slate-800/80 overflow-hidden transition-all duration-300 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40 hover:-translate-y-1 active:scale-[0.99]">
                {/* Media Container */}
                <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/40 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950 overflow-hidden shrink-0">
                  {imageSrc ? (
                    <>
                      <Image
                        src={imageSrc}
                        alt={post.title}
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
                      <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-2 shadow-2xs">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                        {post.category?.name || "Supplement Dossier"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide uppercase border ${badge.badgeClass}`}
                      >
                        <BadgeIcon
                          className={`w-3 h-3 ${badge.iconClass} shrink-0`}
                        />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal mb-4">
                      {excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 mt-auto">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      <span className="hidden sm:inline">Read</span>
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
