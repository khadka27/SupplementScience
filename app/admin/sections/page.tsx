"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Layers,
  PenLine,
  ExternalLink,
  Globe,
  ImageIcon,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Section {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  imageUrl: string | null;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function SectionsManagementPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      setSections(data);
    } catch (error) {
      toast.error("Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingSection
        ? `/api/admin/sections/${editingSection.id}`
        : "/api/admin/sections";

      const method = editingSection ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save section");
      }

      toast.success(editingSection ? "Section updated" : "Section created");
      setDialogOpen(false);
      resetForm();
      fetchSections();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionToDelete) return;

    try {
      const res = await fetch(`/api/admin/sections/${sectionToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete section");
      }

      toast.success("Section deleted");
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
      fetchSections();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      description: section.description || "",
      metaTitle: section.metaTitle || "",
      metaDescription: section.metaDescription || "",
      imageUrl: section.imageUrl || "",
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSection(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      imageUrl: "",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Layers className="h-8 w-8" />
              Global Authority Sections
            </h2>
            <p className="text-muted-foreground">
              Create top-level content hubs like Ingredients, Safety Measures,
              How to Choose
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSection ? "Edit Section" : "Create Section"}
                </DialogTitle>
                <DialogDescription>
                  {editingSection
                    ? "Update section information"
                    : "Create a new global authority section with clean URLs like domain.com/{slug}"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ingredients, Safety Measures, How to Choose"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (!editingSection) {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., ingredients, safety-measures, how-to-choose"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Posts will appear at:{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      domain.com/{formData.slug || "{slug}"}/{"{post-slug}"}
                    </code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this section..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Header Image</Label>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="mb-3">
                      <TabsTrigger value="upload" className="gap-2">
                        <ImageIcon className="h-4 w-4" /> Upload
                      </TabsTrigger>
                      <TabsTrigger value="url" className="gap-2">
                        <Globe className="h-4 w-4" /> Link URL
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                      <ImageUpload
                        value={formData.imageUrl}
                        onChange={(url) =>
                          setFormData({ ...formData, imageUrl: url })
                        }
                      />
                    </TabsContent>
                    <TabsContent value="url">
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://..."
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-sm">
                    SEO Settings (Optional)
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="Leave blank to auto-generate"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Leave blank to auto-generate"
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metaDescription: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingSection ? "Update Section" : "Create Section"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search sections by name, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {sections.filter((s) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase().trim();
              return (
                s.name.toLowerCase().includes(q) ||
                s.slug.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q)
              );
            }).length} of {sections.length} hubs
          </span>
        </div>

        {(() => {
          const filtered = sections.filter((s) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            return (
              s.name.toLowerCase().includes(q) ||
              s.slug.toLowerCase().includes(q) ||
              s.description?.toLowerCase().includes(q)
            );
          });

          if (filtered.length > 0) {
            return (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((section) => (
                  <Card key={section.id} className="relative overflow-hidden border border-stone-200/90 dark:border-stone-800 hover:shadow-md transition-shadow">
                    <div className="absolute top-3 right-3 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-200 dark:border-blue-800/40">
                      TOP-LEVEL HUB
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 pr-24">
                          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <CardTitle className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {section.name}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="font-mono text-xs flex items-center gap-1 text-slate-500 mt-1">
                        <a
                          href={`/${section.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1 hover:text-emerald-600"
                        >
                          <span>/{section.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {section.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs border-t border-stone-200/80 dark:border-stone-800 pt-3">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">
                          {section.postCount} articles
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(section.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs font-semibold h-8"
                          asChild
                        >
                          <Link href={`/admin/blog/new?categoryId=${section.id}`}>
                            <PenLine className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            Write Article
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(section)}
                          title="Edit Section"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                          onClick={() => {
                            setSectionToDelete(section.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          }

          if (sections.length > 0) {
            return (
              <Card className="border border-dashed border-stone-300 dark:border-stone-800">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No sections match &quot;{searchQuery}&quot;
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Layers className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  Create your first authority section like &quot;Ingredients&quot;, &quot;Safety
                  Measures&quot;, or &quot;How to Choose&quot; to organize your global content.
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Section
                </Button>
              </CardContent>
            </Card>
          );
        })()}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section? This will not
                delete the articles, but they will lose their section
                association.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
