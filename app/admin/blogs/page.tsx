"use client";

import { useEffect, useState, Suspense } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  FileText,
  BookOpen,
  FlaskConical,
  ExternalLink,
  PlusCircle,
  Copy,
  ChevronDown,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  postType: string;
  excerpt: string;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: { name: string; slug?: string } | null;
  category: { name: string; slug?: string } | null;
}

const POST_TYPES = [
  { id: "all", label: "All Content", icon: FolderOpen },
  { id: "blog", label: "Articles", icon: FileText },
  { id: "guide", label: "Safety Guides", icon: BookOpen },
  { id: "ingredient", label: "Ingredients", icon: FlaskConical },
  { id: "review", label: "Reviews", icon: Star },
] as const;

function getPublicUrl(post: Post): string {
  const type = post.postType?.toLowerCase() || "blog";
  if (type === "guide") {
    return `/guides/${post.slug}`;
  }
  if (type === "ingredient") {
    return `/ingredients/${post.slug}`;
  }
  if (post.category?.slug) {
    return `/${post.category.slug}/${post.slug}`;
  }
  return `/${post.slug}`;
}

function getEditUrl(post: Post): string {
  const type = post.postType?.toLowerCase() || "blog";
  if (type === "guide") {
    return `/admin/guides/${post.slug}`;
  }
  if (type === "ingredient") {
    return `/admin/ingredients/${post.slug}`;
  }
  if (type === "review") {
    return `/admin/reviews/${post.slug}`;
  }
  return `/admin/blog/${post.slug}`;
}

function getPostTypeBadge(postType: string) {
  const t = postType?.toLowerCase() || "blog";
  switch (t) {
    case "guide":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/40">
          <BookOpen className="h-3 w-3" />
          Safety Guide
        </span>
      );
    case "ingredient":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/70 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/40">
          <FlaskConical className="h-3 w-3" />
          Ingredient
        </span>
      );
    case "review":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40">
          <Star className="h-3 w-3" />
          Review
        </span>
      );
    case "blog":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40">
          <FileText className="h-3 w-3" />
          Article
        </span>
      );
  }
}

function BlogsManagementContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [changingType, setChangingType] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [activeTypeTab]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url =
        activeTypeTab === "all"
          ? "/api/blog/posts"
          : `/api/blog/posts?postType=${activeTypeTab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (post) => post.status?.toLowerCase() === statusFilter
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q) ||
          post.slug?.toLowerCase().includes(q) ||
          post.author?.name?.toLowerCase().includes(q) ||
          post.category?.name?.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(filtered);
  };

  const handleStatusChange = async (postId: string, newStatus: string) => {
    setChangingStatus(postId);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        newStatus === "PUBLISHED"
          ? "Published to live website"
          : "Moved to draft status"
      );

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setChangingStatus(null);
    }
  };

  const handlePostTypeChange = async (postId: string, newType: string) => {
    setChangingType(postId);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/type`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postType: newType }),
      });

      if (!res.ok) throw new Error("Failed to update post type");

      toast.success(`Post moved to ${newType}`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, postType: newType } : p))
      );
    } catch (error) {
      console.error(error);
      toast.error(`Failed to move post to ${newType}`);
    } finally {
      setChangingType(null);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const res = await fetch(`/api/admin/posts/${postToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    }
  };

  const copyLiveLink = (post: Post) => {
    const url = `${window.location.origin}${getPublicUrl(post)}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard");
  };

  // KPI Calculations
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = posts.filter((p) => p.status !== "PUBLISHED").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header & Fast Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Editorial Content Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/40">
                {posts.length} entries
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Browse, filter, edit, and publish clinical articles, guides, ingredients, and reviews.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
              disabled={loading}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm font-medium"
                >
                  <PlusCircle className="h-4 w-4 mr-2 text-teal-400 dark:text-teal-600" />
                  Create Content
                  <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2">
                  Select Format
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2.5 px-2 py-2 cursor-pointer font-medium"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>New Article</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/guides/new"
                    className="flex items-center gap-2.5 px-2 py-2 cursor-pointer font-medium"
                  >
                    <BookOpen className="h-4 w-4 text-teal-500" />
                    <span>New Safety Guide</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/ingredients/new"
                    className="flex items-center gap-2.5 px-2 py-2 cursor-pointer font-medium"
                  >
                    <FlaskConical className="h-4 w-4 text-violet-500" />
                    <span>New Ingredient Page</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/reviews/new"
                    className="flex items-center gap-2.5 px-2 py-2 cursor-pointer font-medium"
                  >
                    <Star className="h-4 w-4 text-rose-500" />
                    <span>New Product Review</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total in View
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {posts.length}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <FolderOpen className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Published Live
                </p>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {publishedCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Drafts & Review
                </p>
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {draftCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Accumulated Views
                </p>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {totalViews.toLocaleString()}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Eye className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Type Navigation */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3.5">
            {/* Type Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = activeTypeTab === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveTypeTab(type.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                        : "bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Status Select */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by title, excerpt, author, or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published Only</SelectItem>
                    <SelectItem value="draft">Drafts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400 mb-2" />
            <p className="text-sm text-slate-500">Loading publications...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No content matching filters
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {searchQuery || statusFilter !== "all" || activeTypeTab !== "all"
                  ? "Try resetting your search query or switching content types."
                  : "You haven't created any publications in this format yet."}
              </p>
              <div className="flex items-center gap-2 mt-4">
                {(searchQuery || statusFilter !== "all" || activeTypeTab !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setActiveTypeTab("all");
                    }}
                  >
                    Reset All Filters
                  </Button>
                )}
                <Link
                  href={
                    activeTypeTab === "guide"
                      ? "/admin/guides/new"
                      : activeTypeTab === "ingredient"
                      ? "/admin/ingredients/new"
                      : activeTypeTab === "review"
                      ? "/admin/reviews/new"
                      : "/admin/blog/new"
                  }
                >
                  <Button size="sm" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    Create New
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const isPublished = post.status === "PUBLISHED";
              const editUrl = getEditUrl(post);
              const liveUrl = getPublicUrl(post);

              return (
                <div
                  key={post.id}
                  className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Metadata & Titles */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getPostTypeBadge(post.postType)}

                        <Badge
                          variant="secondary"
                          className={
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40"
                              : "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40"
                          }
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              isPublished ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {isPublished ? "Published" : "Draft"}
                        </Badge>

                        {post.category && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium">
                            {post.category.name}
                          </span>
                        )}

                        {changingStatus === post.id && (
                          <span className="inline-flex items-center text-xs text-slate-400">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Updating status...
                          </span>
                        )}
                        {changingType === post.id && (
                          <span className="inline-flex items-center text-xs text-slate-400">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Moving post...
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        <Link href={editUrl}>{post.title}</Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        {post.author?.name && (
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            By {post.author.name}
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {post.viewCount || 0} views
                        </span>
                        <span>•</span>
                        <span>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          /{post.slug}
                        </span>
                      </div>
                    </div>

                    {/* Right: Fast 1-Click Action Toolbar */}
                    <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/80">
                      {/* Fast Edit Button */}
                      <Link href={editUrl}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8.5 px-3 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                          Edit
                        </Button>
                      </Link>

                      {/* Fast View Live Link */}
                      <Link href={liveUrl} target="_blank">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8.5 px-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                          title="View on public site"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>

                      {/* Fast 1-Click Status Switcher */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleStatusChange(
                            post.id,
                            isPublished ? "DRAFT" : "PUBLISHED"
                          )
                        }
                        disabled={changingStatus === post.id}
                        className={`h-8.5 px-2.5 text-xs font-medium ${
                          isPublished
                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        }`}
                        title={isPublished ? "Convert to Draft" : "Publish to live website"}
                      >
                        {isPublished ? "Unpublish" : "Publish"}
                      </Button>

                      {/* More Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8.5 w-8.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-400">
                            Quick Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => copyLiveLink(post)}
                            className="cursor-pointer text-xs"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2 text-slate-500" />
                            Copy Public URL
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-400">
                            Convert Post Type
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handlePostTypeChange(post.id, "blog")}
                            disabled={post.postType === "blog" || changingType === post.id}
                            className="cursor-pointer text-xs"
                          >
                            <FileText className="h-3.5 w-3.5 mr-2 text-blue-500" />
                            Set as Article
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePostTypeChange(post.id, "guide")}
                            disabled={post.postType === "guide" || changingType === post.id}
                            className="cursor-pointer text-xs"
                          >
                            <BookOpen className="h-3.5 w-3.5 mr-2 text-teal-500" />
                            Set as Safety Guide
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePostTypeChange(post.id, "ingredient")}
                            disabled={post.postType === "ingredient" || changingType === post.id}
                            className="cursor-pointer text-xs"
                          >
                            <FlaskConical className="h-3.5 w-3.5 mr-2 text-violet-500" />
                            Set as Ingredient
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePostTypeChange(post.id, "review")}
                            disabled={post.postType === "review" || changingType === post.id}
                            className="cursor-pointer text-xs"
                          >
                            <Star className="h-3.5 w-3.5 mr-2 text-rose-500" />
                            Set as Review
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setPostToDelete(post);
                              setDeleteDialogOpen(true);
                            }}
                            className="cursor-pointer text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Statistics */}
        {filteredPosts.length > 0 && (
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Displaying {filteredPosts.length} of {posts.length} entries
            </span>
            <span>All content changes sync instantly with edge sitemaps</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete publication?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900 dark:text-white">
                &quot;{postToDelete?.title}&quot;
              </strong>
              ? This removes the article, images links, and all associated analytics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Delete Publication
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function BlogsManagementPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="flex items-center justify-center h-full py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        </AdminLayout>
      }
    >
      <BlogsManagementContent />
    </Suspense>
  );
}
