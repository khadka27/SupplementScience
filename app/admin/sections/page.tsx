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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
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

        {sections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Card key={section.id} className="relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-[10px] font-medium">
                  TOP-LEVEL HUB
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1 pr-20">
                      <Layers className="w-5 h-5 text-primary flex-shrink-0" />
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="font-mono text-xs flex items-center gap-1">
                    <span>/{section.slug}</span>
                    <ExternalLink className="w-3 h-3" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {section.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm border-t pt-3">
                    <span className="text-muted-foreground font-medium">
                      {section.postCount} articles
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(section.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/admin/blog/new?categoryId=${section.id}`}>
                        <PenLine className="w-4 h-4 mr-2" />
                        Write Article
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(section)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSectionToDelete(section.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layers className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Create your first authority section like "Ingredients", "Safety
                Measures", or "How to Choose" to organize your global content.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Section
              </Button>
            </CardContent>
          </Card>
        )}

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
