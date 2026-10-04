"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Author, Category, Tag } from "@/lib/types";
import TiptapEditor from "@/components/editor/TiptapEditor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Globe,
  ImageIcon,
  Sparkles,
  ArrowLeft,
  FileText,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { isValidFeaturedImageSource } from "@/lib/admin-utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Calculate read time based on word count (avg 200 words per minute)
const calculateReadTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes); // Minimum 1 minute
};

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  content: z.string().min(10, "Content is too short"),
  featuredImageUrl: z
    .string()
    .refine(isValidFeaturedImageSource, {
      message: "Must be a valid URL or /images path",
    })
    .optional()
    .or(z.literal("")),
  featuredImageAlt: z.string().optional().or(z.literal("")),
  cardImageUrl: z
    .string()
    .refine(isValidFeaturedImageSource, {
      message: "Must be a valid URL or /images path",
    })
    .optional()
    .or(z.literal("")),
  authorId: z.string().optional().or(z.literal("")),
  factCheckedById: z.string().optional().or(z.literal("")),
  reviewedById: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  customAuthor: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()),
  status: z.enum(["draft", "published"]),
});

interface BlogEditorFormProps {
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  initialData?: any;
  initialCategoryId?: string;
}

export default function BlogEditorForm({
  authors,
  categories,
  tags,
  initialData,
  initialCategoryId,
}: BlogEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;
  const [isSlugCustomized, setIsSlugCustomized] = useState(
    isEditing && !!initialData?.slug
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      content: initialData?.content || "",
      featuredImageUrl: initialData?.featuredImageUrl || "",
      featuredImageAlt: initialData?.featuredImageAlt || "",
      cardImageUrl: initialData?.cardImageUrl || "",
      tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
      authorId: initialData?.authorId || authors[0]?.id || "",
      factCheckedById:
        authors.find((author) => author.name === initialData?.factCheckedBy)
          ?.id || "",
      reviewedById:
        authors.find((author) => author.name === initialData?.reviewedBy)?.id ||
        "",
      categoryId:
        initialData?.categoryId || initialCategoryId || categories[0]?.id || "",
      status: initialData?.status?.toLowerCase() || "draft",
    },
  });

  const selectedAuthorId = form.watch("authorId");
  const selectedFactCheckerId = form.watch("factCheckedById");
  const selectedReviewerId = form.watch("reviewedById");

  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");
  const watchedMetaTitle = form.watch("metaTitle") || "";
  const watchedMetaDescription = form.watch("metaDescription") || "";
  const watchedExcerpt = form.watch("excerpt") || "";
  const watchedStatus = form.watch("status");

  // Word count & read time live stats
  const wordCount = watchedContent
    ? watchedContent
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-sync slug from title if not customized
  useEffect(() => {
    if (!isSlugCustomized && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug, { shouldValidate: false });
    }
  }, [watchedTitle, isSlugCustomized, form]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty, isSubmitting]);

  // Shortcut: Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const autoGenerateSEO = () => {
    const title = form.getValues("title");
    const content = form.getValues("content");
    const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    if (title && !form.getValues("metaTitle")) {
      form.setValue("metaTitle", title.slice(0, 60), { shouldValidate: true });
    }

    if (plainText && !form.getValues("metaDescription")) {
      const desc = plainText.slice(0, 155) + (plainText.length > 155 ? "..." : "");
      form.setValue("metaDescription", desc, { shouldValidate: true });
    }

    if (plainText && !form.getValues("excerpt")) {
      const excerpt = plainText.slice(0, 200) + (plainText.length > 200 ? "..." : "");
      form.setValue("excerpt", excerpt, { shouldValidate: true });
    }

    toast.success("Generated SEO metadata from title & content!");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const defaultEditorial = "SupplementDecoded Research Editorial Team";
      const factCheckedBy = values.factCheckedById
        ? authors.find((author) => author.id === values.factCheckedById)
            ?.name || defaultEditorial
        : defaultEditorial;
      const reviewedBy = values.reviewedById
        ? authors.find((author) => author.id === values.reviewedById)?.name ||
          defaultEditorial
        : defaultEditorial;
      const { factCheckedById, reviewedById, ...payload } = values;

      // Calculate read time from content
      const readTimeMinutes = calculateReadTime(values.content);

      const url = isEditing
        ? `/api/admin/posts/${initialData.id}`
        : "/api/blog/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          postType: initialData?.postType || "blog",
          factCheckedBy,
          reviewedBy,
          readTimeMinutes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to save (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      toast.success(
        isEditing ? "Post updated successfully!" : "Post created successfully!",
      );
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (!title) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    form.setValue("slug", slug, { shouldValidate: true });
    setIsSlugCustomized(false);
    toast.success("Slug re-synced with title");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Sticky Top Action Bar ────────────────────────── */}
        <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 dark:bg-[#070A0E]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 transition-colors shadow-2xs">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/blogs")}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white h-8 px-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              All Content
            </Button>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block" />
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40 text-xs font-semibold gap-1 py-0.5"
            >
              <FileText className="w-3 h-3" />
              Article
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
              {wordCount} words · {readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Status Toggle */}
            <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-900 p-1 border border-stone-200/80 dark:border-stone-800">
              <button
                type="button"
                onClick={() =>
                  form.setValue("status", "draft", { shouldDirty: true })
                }
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                  watchedStatus === "draft"
                    ? "bg-white dark:bg-stone-800 text-slate-900 dark:text-white shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() =>
                  form.setValue("status", "published", { shouldDirty: true })
                }
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                  watchedStatus === "published"
                    ? "bg-emerald-600 text-white shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Published
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autoGenerateSEO}
              className="text-xs h-8 gap-1.5 text-emerald-700 dark:text-emerald-400 border-emerald-300/70 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-Fill SEO</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Update Post" : "Save Post"}</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-emerald-900/40 rounded text-emerald-200">
                ⌘S
              </kbd>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Slug</FormLabel>
                        {isSlugCustomized ? (
                          <button
                            type="button"
                            onClick={generateSlug}
                            className="text-xs text-primary hover:underline flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Re-sync with title
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">
                            Auto-syncs from title
                          </span>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          placeholder="post-url-slug"
                          {...field}
                          onChange={(e) => {
                            setIsSlugCustomized(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Excerpt (Short Summary)</FormLabel>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            (field.value?.length || 0) > 200
                              ? "text-amber-600 dark:text-amber-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {field.value?.length || 0}/200 chars
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="A brief summary of the post..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-2 pb-1">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Search Engine Optimization
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoGenerateSEO}
                    className="text-xs h-7 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Fill SEO
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Meta Title (SEO)</FormLabel>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            (field.value?.length || 0) > 60
                              ? "text-amber-600 dark:text-amber-400 font-semibold"
                              : (field.value?.length || 0) >= 40
                              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {field.value?.length || 0}/60 chars
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to use post title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ideal length: 50-60 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Meta Description (SEO)</FormLabel>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            (field.value?.length || 0) > 160
                              ? "text-amber-600 dark:text-amber-400 font-semibold"
                              : (field.value?.length || 0) >= 120
                              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {field.value?.length || 0}/160 chars
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to auto-generate from excerpt/content"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ideal length: 140-160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No author</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="factCheckedById"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fact Checked By</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fact checker" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Editorial Team (Default)</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewedById"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewed By</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Editorial Team (Default)</SelectItem>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="upload" className="gap-2">
                            <ImageIcon className="h-4 w-4" /> Upload
                          </TabsTrigger>
                          <TabsTrigger value="url" className="gap-2">
                            <Globe className="h-4 w-4" /> Link URL
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                          <ImageUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </TabsContent>
                        <TabsContent value="url">
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            URL for the main post image (Ideal size: 1200x628)
                          </FormDescription>
                        </TabsContent>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe the image for accessibility"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Used by screen readers and search engines.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Card Image</FormLabel>
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="upload" className="gap-2">
                            <ImageIcon className="h-4 w-4" /> Upload
                          </TabsTrigger>
                          <TabsTrigger value="url" className="gap-2">
                            <Globe className="h-4 w-4" /> Link URL
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                          <ImageUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </TabsContent>
                        <TabsContent value="url">
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Used in article cards, related posts, and listing
                            cards. If blank, the hero image will be used.
                          </FormDescription>
                        </TabsContent>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="tagIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-3">
                        <FormLabel>Tags</FormLabel>
                        <FormDescription className="text-xs">
                          Optional. Leave unselected if not needed.
                        </FormDescription>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-3 bg-muted/30">
                        {tags.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No tags available. Create tags first.
                          </p>
                        ) : (
                          tags.map((tag) => (
                            <FormField
                              key={tag.id}
                              control={form.control}
                              name="tagIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={tag.id}
                                    className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2 hover:bg-accent transition-colors"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(tag.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                tag.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== tag.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-1">
                                      {tag.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isEditing ? "Update Post" : "Save Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/admin/blogs")}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
