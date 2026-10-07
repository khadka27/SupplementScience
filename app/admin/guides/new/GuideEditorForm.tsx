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
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorSidebar } from "@/components/admin/EditorSidebar";
import {
  generateSlugForPostType,
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
  guideType: z.enum(["safety-measures", "how-to-choose", "ingredients-used"]),
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

interface GuideEditorFormProps {
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  initialData?: any;
}

export default function GuideEditorForm({
  authors,
  categories,
  tags,
  initialData,
}: GuideEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const isEditing = !!initialData;
  const [isSlugCustomized, setIsSlugCustomized] = useState(
    isEditing && !!initialData?.slug
  );

  const defaultCategory =
    initialData?.categoryId ||
    categories.find(
      (c) => c.slug === "guides" || c.name.toLowerCase().includes("guide")
    )?.id ||
    categories[0]?.id ||
    "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      guideType: initialData?.guideType || "safety-measures",
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
      categoryId: defaultCategory,
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

  // Auto-sync slug from title if not customized
  useEffect(() => {
    if (!isSlugCustomized && watchedTitle) {
      const generatedSlug = generateSlugForPostType("guide", watchedTitle);
      if (generatedSlug) {
        form.setValue("slug", generatedSlug, { shouldValidate: false });
      }
    }
  }, [watchedTitle, isSlugCustomized, form]);

  // Generate preview URL from slug
  useEffect(() => {
    if (slug) {
      const url = `/guides/${slug}`;
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [slug]);

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

      // Validate slug format
      const validation = validateSlugForPostType("guide", values.slug);
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
          factCheckedBy,
          reviewedBy,
          readTimeMinutes,
          postType: "guide",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to save (${response.status})`;
        throw new Error(errorMessage);
      }

      await response.json();
      toast.success(
        isEditing
          ? "Guide updated successfully!"
          : "Guide created successfully!",
      );
      router.push("/admin/guides");
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
    if (!title) {
      toast.error("Please enter a guide title first");
      return;
    }

    const generatedSlug = generateSlugForPostType("guide", title);

    if (!generatedSlug) {
      toast.error("Failed to generate slug. Please check your selections.");
      return;
    }

    form.setValue("slug", generatedSlug, { shouldValidate: true });
    setIsSlugCustomized(false);
    toast.success("Slug re-synced with guide title");
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
              onClick={() => router.push("/admin/guides")}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              All Guides
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <Badge
              variant="outline"
              className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40 text-xs font-semibold gap-1 py-0.5"
            >
              <BookOpen className="w-3 h-3" />
              Safety Guide
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
                    ? "bg-teal-600 text-white shadow-2xs font-bold"
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
              className="text-xs h-8 gap-1.5 text-teal-700 dark:text-teal-400 border-teal-300/70 dark:border-teal-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-Fill SEO</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 px-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Update Guide" : "Save Guide"}</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-teal-900/40 rounded text-teal-200">
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
                      <FormLabel>Guide Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Safety Measures for Joint Pain Supplements"
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
                            className="text-xs text-primary hover:underline flex items-center gap-1 text-teal-600 dark:text-teal-400"
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
                          placeholder="guide-title"
                          {...field}
                          onChange={(e) => {
                            setIsSlugCustomized(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        URL slug for this guide
                      </FormDescription>
                      {previewUrl && (
                        <Alert className="mt-2 py-2">
                          <LinkIcon className="h-3.5 w-3.5 text-teal-600" />
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
                          placeholder="A brief summary of the guide..."
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
                    className="text-xs h-7 gap-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40"
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
                              ? "text-teal-600 dark:text-teal-400 font-semibold"
                              : "text-slate-400"
                          )}
                        >
                          {field.value?.length || 0}/60 chars
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to use guide title"
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
                              ? "text-teal-600 dark:text-teal-400 font-semibold"
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
                      <FormLabel>Guide Content *</FormLabel>
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
              entityLabel="Guide"
              cancelUrl="/admin/guides"
              categoryDescription="Optional for guide classification."
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
