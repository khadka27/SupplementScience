"use client";

import { useEffect, useState, Suspense } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  Loader2,
  Search,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  PlusCircle,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface ReviewPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  viewCount: number;
  createdAt: string;
  author: { name: string } | null;
  category: { name: string; slug: string } | null;
}

function ReviewsContent() {
  const [reviews, setReviews] = useState<ReviewPost[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewPost | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchQuery, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog/posts?postType=review");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product reviews");
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let result = [...reviews];
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status.toLowerCase() === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.excerpt?.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q)
      );
    }
    setFilteredReviews(result);
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    setChangingStatus(reviewId);
    try {
      const res = await fetch(`/api/admin/posts/${reviewId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        newStatus === "PUBLISHED" ? "Review published live" : "Review moved to draft"
      );
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setChangingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await fetch(`/api/admin/posts/${reviewToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted successfully");
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    }
  };

  const publishedCount = reviews.filter((r) => r.status === "PUBLISHED").length;
  const draftCount = reviews.filter((r) => r.status !== "PUBLISHED").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
                <Star className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Product Reviews
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Independent evaluations, clinical grade assessments, and brand breakdowns.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReviews}
              disabled={loading}
              className="border-slate-200 dark:border-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/admin/reviews/new">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2 text-rose-400 dark:text-rose-600" />
                New Product Review
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total Reviews
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {reviews.length}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <Star className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Published Live
                </p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {publishedCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Drafts
                </p>
                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {draftCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search reviews by brand, title, or keyword..."
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
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600 mb-2" />
            <p className="text-sm text-slate-500">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No product reviews found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Create in-depth reviews covering clinical safety, testing certifications, and dosing accuracy.
              </p>
              <Link href="/admin/reviews/new" className="mt-4">
                <Button size="sm" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  Create First Review
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => {
              const isPublished = review.status === "PUBLISHED";
              const liveUrl = review.category?.slug
                ? `/${review.category.slug}/${review.slug}`
                : `/${review.slug}`;

              return (
                <div
                  key={review.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400"
                          }
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              isPublished ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {isPublished ? "Published" : "Draft"}
                        </Badge>
                        {review.category && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium">
                            {review.category.name}
                          </span>
                        )}
                        {changingStatus === review.id && (
                          <span className="text-xs text-slate-400 flex items-center">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Updating...
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        <Link href={`/admin/reviews/${review.slug}`} className="hover:text-rose-600 transition-colors">
                          {review.title}
                        </Link>
                      </h3>

                      {review.excerpt && (
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                          {review.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        {review.author?.name && <span>By {review.author.name}</span>}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {review.viewCount || 0} views
                        </span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <Link href={`/admin/reviews/${review.slug}`}>
                        <Button size="sm" variant="outline" className="h-8.5 px-3">
                          <Pencil className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                          Edit
                        </Button>
                      </Link>

                      <Link href={liveUrl} target="_blank">
                        <Button size="sm" variant="ghost" className="h-8.5 px-2.5" title="View live">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleStatusChange(
                            review.id,
                            isPublished ? "DRAFT" : "PUBLISHED"
                          )
                        }
                        className={`h-8.5 px-2.5 text-xs font-medium ${
                          isPublished ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        {isPublished ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setReviewToDelete(review);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8.5 w-8.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product review?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{reviewToDelete?.title}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 text-white">
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function ReviewsManagementPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
          </div>
        </AdminLayout>
      }
    >
      <ReviewsContent />
    </Suspense>
  );
}
