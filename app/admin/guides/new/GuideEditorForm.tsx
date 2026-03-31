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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import {
  generateSlugForPostType,
  validateSlugForPostType,
  GUIDE_TYPES,
} from "@/lib/admin-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const calculateReadTime = (content: string): number => {
  const text = content.replaceAll(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
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
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  authorId: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  customAuthor: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).optional().default([]),
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
      tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
      authorId: initialData?.authorId || authors[0]?.id || "",
      categoryId: initialData?.categoryId || "",
      status: initialData?.status?.toLowerCase() || "draft",
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const slug = form.watch("slug");

  // Generate preview URL from slug
  useEffect(() => {
    if (slug) {
      const url = `/guides/${slug}`;
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [slug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const readTimeMinutes = calculateReadTime(values.content);

      // Validate slug format
      const validation = validateSlugForPostType(
        "guide",
        values.slug,
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
        body: JSON.stringify({ ...values, readTimeMinutes, postType: "guide" }),
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="guideType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guide type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GUIDE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of guide you're creating
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
                      <FormLabel className="flex justify-between items-center">
                        <span>Slug *</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateSlug}
                          className="text-xs h-auto py-1"
                        >
                          Auto-generate
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="guide-title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Auto-generated from guide title
                      </FormDescription>
                      {previewUrl && (
                        <Alert>
                          <LinkIcon className="h-4 w-4" />
                          <AlertDescription>
                            Preview URL:{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
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
                      <FormLabel>Excerpt (Short Summary)</FormLabel>
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

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title (SEO)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to use guide title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 50-60 characters
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
                      <FormLabel>Meta Description (SEO)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to auto-generate from excerpt/content"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 140-160 characters
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
                        onValueChange={(value) => {
                          field.onChange(value === "none" ? "" : value);
                        }}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="No category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional for guide classification.
                      </FormDescription>
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                  {isEditing ? "Update Guide" : "Create Guide"}
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
