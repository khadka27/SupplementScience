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
  Link as LinkIcon,
  Globe,
  ImageIcon,
  Sparkles,
  ArrowLeft,
  Star,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorSidebar } from "@/components/admin/EditorSidebar";
import {
  generateSlugForPostType,
  generatePreviewUrl,
  validateSlugForPostType,
  isValidFeaturedImageSource,
} from "@/lib/admin-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const calculateReadTime = (content: string): number => {
  const text = content.replaceAll(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
};

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  productName: z.string().min(2, "Product name is required"),
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
  categoryId: z.string().min(1, "Category is required for reviews"),
  customAuthor: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()),
  status: z.enum(["draft", "published"]),
});

interface ReviewEditorFormProps {
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  initialData?: any;
}

export default function ReviewEditorForm({
  authors,
  categories,
  tags,
  initialData,
}: ReviewEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const isEditing = !!initialData;
  const [isSlugCustomized, setIsSlugCustomized] = useState(
    isEditing && !!initialData?.slug
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      productName: initialData?.productName || "",
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
      categoryId: initialData?.categoryId || categories[0]?.id || "",
      status: initialData?.status?.toLowerCase() || "draft",
    },
  });

  const selectedAuthorId = form.watch("authorId");
  const selectedFactCheckerId = form.watch("factCheckedById");
  const selectedReviewerId = form.watch("reviewedById");

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const productName = form.watch("productName");
  const watchedTitle = form.watch("title");
  const watchedContent = form.watch("content");
  const watchedMetaTitle = form.watch("metaTitle") || "";
  const watchedMetaDescription = form.watch("metaDescription") || "";
  const watchedExcerpt = form.watch("excerpt") || "";
  const watchedStatus = form.watch("status");
  const slug = form.watch("slug");

  // Word count & read time live stats
  const wordCount = watchedContent
    ? watchedContent
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-sync slug from productName or title if not customized
  useEffect(() => {
    if (!isSlugCustomized && (productName || watchedTitle)) {
      const source = productName || watchedTitle.replace(/review/gi, "").trim();
      if (source) {
        const generatedSlug = generateSlugForPostType("review", source);
        if (generatedSlug) {
          form.setValue("slug", generatedSlug, { shouldValidate: false });
        }
      }
    }
  }, [productName, watchedTitle, isSlugCustomized, form]);

  // Generate preview URL when category or slug changes
  useEffect(() => {
    if (slug && selectedCategory?.slug) {
      const url = generatePreviewUrl("review", slug, selectedCategory.slug);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [slug, selectedCategory?.slug]);

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

      const readTimeMinutes = calculateReadTime(values.content);

      // Normalize slug to always end with -review
      let finalSlug = values.slug.trim().toLowerCase();
      if (!finalSlug.endsWith("-review")) {
        finalSlug = `${finalSlug}-review`;
      }

      // Validate slug format
      const validation = validateSlugForPostType(
        "review",
        finalSlug,
        selectedCategory?.slug,
      );
      if (!validation.valid) {
        toast.error(validation.error || "Invalid slug format");
        setIsSubmitting(false);
        return;
      }

      const url = isEditing
        ? `/api/admin/posts/${initialData.id}`
        : "/api/blog/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          slug: finalSlug,
          postType: "review",
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

      toast.success(
        isEditing
          ? "Review updated successfully!"
          : "Review created successfully!",
      );
      router.push("/admin/reviews");
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
    const product = productName || form.getValues("productName") || form.getValues("title");
    if (!product) {
      toast.error("Please enter a product name first");
      return;
    }

    const generatedSlug = generateSlugForPostType("review", product);
    form.setValue("slug", generatedSlug, { shouldValidate: true });
    setIsSlugCustomized(false);
    toast.success("Slug re-synced with product name");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Top Action Header ────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-card text-card-foreground border border-border shadow-xs mb-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/reviews")}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              All Reviews
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <Badge
              variant="outline"
              className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40 text-xs font-semibold gap-1 py-0.5"
            >
              <Star className="w-3 h-3" />
              Product Review
            </Badge>
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">
              {wordCount} words · {readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Status Toggle */}
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border">
              <button
                type="button"
                onClick={() =>
                  form.setValue("status", "draft", { shouldDirty: true })
                }
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                  watchedStatus === "draft"
                    ? "bg-card text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
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
                    ? "bg-rose-600 text-white shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
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
              className="text-xs h-8 gap-1.5 text-rose-700 dark:text-rose-400 border-rose-300/70 dark:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-Fill SEO</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 px-3.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Update Review" : "Save Review"}</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-rose-900/40 rounded text-rose-200">
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
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Flexitrinol"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!form.getValues("title")) {
                              form.setValue(
                                "title",
                                `${e.target.value} Review: Clinical Analysis & Evidence`
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        The brand or supplement product being evaluated
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Flexitrinol Review: Complete Analysis & Lab Scores"
                          {...field}
                        />
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
                        <FormLabel>Slug *</FormLabel>
                        {isSlugCustomized ? (
                          <button
                            type="button"
                            onClick={generateSlug}
                            className="text-xs text-primary hover:underline flex items-center gap-1 text-rose-600 dark:text-rose-400"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Re-sync with product name
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">
                            Auto-syncs from product name
                          </span>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          placeholder="flexitrinol-review"
                          {...field}
                          onChange={(e) => {
                            setIsSlugCustomized(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (auto-appends "-review" if omitted)
                      </FormDescription>
                      {previewUrl && (
                        <Alert className="mt-2 py-2">
                          <LinkIcon className="h-3.5 w-3.5 text-rose-600" />
                          <AlertDescription className="text-xs">
                            Public URL:{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
                              {previewUrl}
                            </code>
                          </AlertDescription>
                        </Alert>
                      )}
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
                          placeholder="A brief summary of the review..."
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
                    className="text-xs h-7 gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {field.value?.length || 0}/60 chars
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to use review title"
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
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
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
                      <FormLabel>Review Content *</FormLabel>
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

          <div>
            <EditorSidebar
              form={form}
              authors={authors}
              categories={categories}
              tags={tags}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              entityLabel="Review"
              cancelUrl="/admin/reviews"
              categoryRequired={true}
              categoryDescription="Required for reviews. Determines the URL structure."
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
