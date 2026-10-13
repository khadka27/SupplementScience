"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
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
  FlaskConical,
  ExternalLink,
  PlusCircle,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Folder,
  SlidersHorizontal,
  Layers,
  X,
} from "lucide-react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface IngredientPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  viewCount: number;
  createdAt: string;
  author: { name: string } | null;
  category: { id?: string; name: string; slug: string } | null;
}

function IngredientsContent() {
  const [ingredients, setIngredients] = useState<IngredientPost[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<IngredientPost | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [ingredients, searchQuery, statusFilter, categoryFilter]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const [ingredientsRes, categoriesRes] = await Promise.all([
        fetch("/api/blog/posts?postType=ingredient"),
        fetch("/api/admin/categories"),
      ]);

      if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");
      const ingredientsData = await ingredientsRes.json();
      setIngredients(ingredientsData || []);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ingredients");
    } finally {
      setLoading(false);
    }
  };

  const filterIngredients = () => {
    let result = [...ingredients];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status.toLowerCase() === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (i) =>
          i.category?.slug?.toLowerCase() === categoryFilter.toLowerCase() ||
          i.category?.id === categoryFilter ||
          i.category?.name?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.excerpt?.toLowerCase().includes(q) ||
          i.slug?.toLowerCase().includes(q) ||
          i.category?.name?.toLowerCase().includes(q)
      );
    }

    setFilteredIngredients(result);
  };

  const handleStatusChange = async (ingredientId: string, newStatus: string) => {
    setChangingStatus(ingredientId);
    try {
      const res = await fetch(`/api/admin/posts/${ingredientId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      toast.success(
        newStatus === "PUBLISHED" ? "Ingredient page published" : "Ingredient moved to draft"
      );
      setIngredients((prev) =>
        prev.map((i) => (i.id === ingredientId ? { ...i, status: newStatus } : i))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setChangingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!ingredientToDelete) return;
    try {
      const res = await fetch(`/api/admin/posts/${ingredientToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete ingredient");

      toast.success("Ingredient deleted successfully");
      setDeleteDialogOpen(false);
      setIngredientToDelete(null);
      setIngredients((prev) => prev.filter((i) => i.id !== ingredientToDelete.id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete ingredient");
    }
  };

  // Compute category ingredient counts
  const categoryCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of ingredients) {
      if (item.category?.slug) {
        map.set(item.category.slug, (map.get(item.category.slug) || 0) + 1);
      }
    }
    return map;
  }, [ingredients]);

  const publishedCount = ingredients.filter((i) => i.status === "PUBLISHED").length;
  const draftCount = ingredients.filter((i) => i.status !== "PUBLISHED").length;
  const activeCategoriesCount = new Set(
    ingredients.map((i) => i.category?.name).filter(Boolean)
  ).size;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/40">
                <FlaskConical className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Clinical Ingredients Directory
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Evidence-based ingredient scientific profiles and monograph breakdowns categorized by therapeutic application.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIngredients}
              disabled={loading}
              className="border-slate-200 dark:border-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/admin/ingredients/new">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2 text-violet-400 dark:text-violet-600" />
                New Ingredient Page
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total Ingredients
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {ingredients.length}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                <FlaskConical className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Live & Indexed
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
                  Drafting Phase
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

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Categories Covered
                </p>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {activeCategoriesCount}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Folder className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Category Navigation */}
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search ingredients by title, chemical name, slug, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Dropdown */}
              <div className="w-full sm:w-56">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="all">
                      All Categories ({ingredients.length})
                    </SelectItem>
                    {categories.map((cat) => {
                      const count = categoryCountMap.get(cat.slug) || 0;
                      return (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name} {count > 0 ? `(${count})` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter Dropdown */}
              <div className="w-full sm:w-44">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published ({publishedCount})</SelectItem>
                    <SelectItem value="draft">Drafts ({draftCount})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="h-3 w-3" />
                  Category:
                </span>
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    categoryFilter === "all"
                      ? "bg-violet-700 text-white shadow-xs"
                      : "bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  All ({ingredients.length})
                </button>
                {categories.map((cat) => {
                  const count = categoryCountMap.get(cat.slug) || 0;
                  const isSelected = categoryFilter.toLowerCase() === cat.slug.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.slug)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? "bg-violet-700 text-white shadow-xs"
                          : count > 0
                          ? "bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          : "bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 hover:text-slate-600"
                      }`}
                    >
                      {cat.name}
                      {count > 0 && (
                        <span
                          className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                            isSelected
                              ? "bg-violet-800 text-violet-100"
                              : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-2" />
            <p className="text-sm text-slate-500">Loading ingredient monographs...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <FlaskConical className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No ingredient profiles found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try resetting your category, search, or status filter."
                  : "Add evidence-backed ingredient pages to build your clinical encyclopedia."}
              </p>
              <div className="flex items-center gap-2 mt-4">
                {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
                <Link href="/admin/ingredients/new">
                  <Button size="sm" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    Create First Ingredient
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredIngredients.map((item) => {
              const isPublished = item.status === "PUBLISHED";
              const liveUrl = `/ingredients/${item.slug}`;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
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

                        {/* Format Badge */}
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200/60 dark:bg-violet-950/40 dark:text-violet-400 font-semibold">
                          Clinical Monograph
                        </span>

                        {/* Category Badge */}
                        {item.category?.name ? (
                          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 font-medium">
                            <Folder className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                            <span>{item.category.name}</span>
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100/60 text-slate-400 dark:bg-slate-800/40 italic">
                            No Category
                          </span>
                        )}

                        {changingStatus === item.id && (
                          <span className="text-xs text-slate-400 flex items-center">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Updating...
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        <Link
                          href={`/admin/ingredients/${item.slug}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      {item.excerpt && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        {item.category?.name && (
                          <>
                            <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                              <Folder className="h-3 w-3 text-slate-400" />
                              {item.category.name}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        {item.author?.name && <span>Reviewed by {item.author.name}</span>}
                        {item.author?.name && <span>•</span>}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.viewCount || 0} views
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          /ingredients/{item.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <Link href={`/admin/ingredients/${item.slug}`}>
                        <Button size="sm" variant="outline" className="h-8.5 px-3">
                          <Pencil className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                          Edit
                        </Button>
                      </Link>

                      <Link href={liveUrl} target="_blank">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8.5 px-2.5"
                          title="View live page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleStatusChange(
                            item.id,
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
                          setIngredientToDelete(item);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8.5 w-8.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
            <AlertDialogTitle>Delete ingredient profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{ingredientToDelete?.title}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 text-white">
              Delete Ingredient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function IngredientsManagementPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        </AdminLayout>
      }
    >
      <IngredientsContent />
    </Suspense>
  );
}
