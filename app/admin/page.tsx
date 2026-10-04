"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  FileText,
  Eye,
  Users,
  Mail,
  Folder,
  Tags,
  TrendingUp,
  Sparkles,
  BookOpen,
  FlaskConical,
  ExternalLink,
  PlusCircle,
  Pencil,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalCategories: number;
    totalTags: number;
    totalAuthors: number;
    totalSubscribers: number;
    guideCount?: number;
    blogCount?: number;
    reviewCount?: number;
    ingredientCount?: number;
  };
  recentPosts: any[];
  popularPosts: any[];
  recentSubscribers?: any[];
}

function getEditUrl(post: any): string {
  const type = post.postType?.toLowerCase() || "blog";
  if (type === "guide") return `/admin/guides/${post.slug}`;
  if (type === "ingredient") return `/admin/ingredients/${post.slug}`;
  if (type === "review") return `/admin/reviews/${post.slug}`;
  return `/admin/blog/${post.slug}`;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fetching real-time editorial metrics…
          </p>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalAuthors: 0,
    totalSubscribers: 0,
    guideCount: 0,
    blogCount: 0,
    reviewCount: 0,
    ingredientCount: 0,
  };

  const publishRate = stats.totalPosts > 0
    ? Math.round((stats.publishedPosts / stats.totalPosts) * 100)
    : 100;

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* ── 1. WELCOME & SYSTEM HEALTH BANNER ────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0B231B] to-[#07130F] text-white p-6 sm:p-8 border border-emerald-900/60 shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Platform Status
                </span>
                <span className="text-xs text-emerald-200/70 font-medium">
                  {todayStr}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {session?.user?.name || "Editor"} 👋
              </h2>
              <p className="text-sm text-emerald-100/80 mt-1.5 max-w-2xl leading-relaxed">
                SupplementDecoded editorial console is online. You have{" "}
                <span className="font-bold text-white">{stats.publishedPosts} published monographs</span>{" "}
                and <span className="font-bold text-emerald-300">{stats.draftPosts} drafts</span> in progress.
              </p>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href="/admin/blog/new">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-10 px-3.5 rounded-xl shadow-md transition-all active:scale-95">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  New Article
                </Button>
              </Link>
              <Link href="/admin/guides/new">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-xs h-10 px-3.5 rounded-xl transition-all">
                  <Sparkles className="w-4 h-4 mr-1.5 text-emerald-300" />
                  New Guide
                </Button>
              </Link>
              <Link href="/admin/ingredients/new">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-xs h-10 px-3.5 rounded-xl transition-all">
                  <FlaskConical className="w-4 h-4 mr-1.5 text-violet-300" />
                  New Ingredient
                </Button>
              </Link>
              <Link href="/admin/reviews/new">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-xs h-10 px-3.5 rounded-xl transition-all">
                  <Star className="w-4 h-4 mr-1.5 text-rose-300" />
                  New Review
                </Button>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                title="View Public Site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ── 2. PRIMARY KPI STATS GRID ───────────────────────────── */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Total Content */}
          <Link href="/admin/blogs" className="block group">
            <Card className="h-full rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  Total Content
                </CardTitle>
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {stats.totalPosts}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {publishRate}% Published
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    style={{ width: `${publishRate}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2">
                  {stats.publishedPosts} live • {stats.draftPosts} in draft
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Safety Guides */}
          <Link href="/admin/guides" className="block group">
            <Card className="h-full rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  Safety Guides
                </CardTitle>
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/40 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {stats.guideCount ?? 0}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[11px] font-semibold text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/50">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Clinical Protocols</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2">
                  Comprehensive consumer guides
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Categories & Taxonomy */}
          <Link href="/admin/categories" className="block group">
            <Card className="h-full rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  Taxonomy & Index
                </CardTitle>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {stats.totalTags}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                  <span>{stats.totalCategories} Topic Categories</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2">
                  Monograph tags & raw ingredients
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Card 4: Subscribers */}
          <Link href="/admin/subscribers" className="block group">
            <Card className="h-full rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  Audience Intake
                </CardTitle>
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {stats.totalSubscribers}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[11px] font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50">
                  <span>{stats.totalAuthors} Expert Authors</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2">
                  Direct newsletter subscriber roster
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* ── 3. QUICK ACTIONS GRID ───────────────────────────────── */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Editorial Workflows & Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-click access to common editorial management routines
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/blog/new"
              className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-[#121820] hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800/60 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  Compose Article
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Draft clinical monographs with citations
                </p>
              </div>
            </Link>

            <Link
              href="/admin/guides/new"
              className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-[#121820] hover:bg-teal-50/60 dark:hover:bg-teal-950/30 border border-stone-200/80 dark:border-stone-800 hover:border-teal-300 dark:hover:border-teal-800/60 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  Publish Safety Guide
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Create comprehensive topic guides
                </p>
              </div>
            </Link>

            <Link
              href="/admin/ingredients/new"
              className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-[#121820] hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800/60 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-[#0E3B2F] text-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  Index Raw Ingredient
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Add ingredient dosage profiles
                </p>
              </div>
            </Link>

            <Link
              href="/admin/subscribers"
              className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-[#121820] hover:bg-purple-50/60 dark:hover:bg-purple-950/30 border border-stone-200/80 dark:border-stone-800 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                  Newsletter Audience
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Export email roster & subscribers
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── 4. ANALYTICS & LIVE ACTIVITY (DUAL COLUMNS) ─────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Column A: Most Viewed Articles */}
          <Card className="rounded-3xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Most Popular Articles
                </CardTitle>
                <CardDescription className="text-xs">
                  Highest reader viewership and engagement
                </CardDescription>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {data?.popularPosts && data.popularPosts.length > 0 ? (
                  data.popularPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={getEditUrl(post)}
                            className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {post.category?.name || "General"} • By {post.author?.name || "Editorial Staff"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount.toLocaleString()}</span>
                        </span>
                        <Link
                          href={getEditUrl(post)}
                          className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-6 text-center">
                    No articles published yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Column B: Recent Content Updates */}
          <Card className="rounded-3xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Recent Publications & Drafts
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest content created or modified
                </CardDescription>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Manage all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {data?.recentPosts && data.recentPosts.length > 0 ? (
                  data.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={getEditUrl(post)}
                          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {post.category?.name || "General"} • Type: {post.postType || "blog"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                          className={
                            post.status === "PUBLISHED"
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold"
                              : "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800/50"
                          }
                        >
                          {post.status}
                        </Badge>
                        <Link
                          href={getEditUrl(post)}
                          className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-6 text-center">
                    No articles found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 5. RECENT SUBSCRIBERS STRIP ──────────────────────────── */}
        {data?.recentSubscribers && data.recentSubscribers.length > 0 && (
          <div className="rounded-3xl p-6 bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Recent Newsletter Subscribers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest verified readers who subscribed to research digests
                </p>
              </div>
              <Link
                href="/admin/subscribers"
                className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>View all subscribers</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {data.recentSubscribers.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-[#121820] border border-stone-200/80 dark:border-stone-800 truncate"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {sub.email}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(sub.subscribedAt || sub.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
