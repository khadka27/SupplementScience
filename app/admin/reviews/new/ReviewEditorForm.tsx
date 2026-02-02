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
import { Save, Loader2, Link as LinkIcon } from "lucide-react";
import {
  generateSlugForPostType,
  generatePreviewUrl,
  validateSlugForPostType,
} from "@/lib/admin-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const calculateReadTime = (content: string): number => {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
};

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  productName: z.string().min(2, "Product name is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content is too short"),
  featuredImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  authorId: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required for reviews"),
  customAuthor: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).min(1, "Please select at least one tag"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      productName: initialData?.productName || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      featuredImageUrl: initialData?.featuredImageUrl || "",
      tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
      authorId: initialData?.authorId || authors[0]?.id || "",
      categoryId: initialData?.categoryId || categories[0]?.id || "",
      status: initialData?.status?.toLowerCase() || "draft",
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const productName = form.watch("productName");
  const slug = form.watch("slug");

  // Generate preview URL when category or slug changes
  useEffect(() => {
    if (slug && selectedCategory?.slug) {
      const url = generatePreviewUrl("review", slug, selectedCategory.slug);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [slug, selectedCategory?.slug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const readTimeMinutes = calculateReadTime(values.content);

      // Validate slug format
      const validation = validateSlugForPostType(
        "review",
        values.slug,
        selectedCategory?.slug
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
        body: JSON.stringify({ ...values, readTimeMinutes }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Failed to save (${response.status})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success(
        isEditing ? "Review updated successfully!" : "Review created successfully!"
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
    const product = productName || form.getValues("productName");
    if (!product) {
      toast.error("Please enter a product name first");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    const generatedSlug = generateSlugForPostType("review", product);
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
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Flexitrinol"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of the supplement product being reviewed
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
                          placeholder="e.g., Flexitrinol Review: Complete Analysis"
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
                          Generate from product name
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="flexitrinol-review" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier. Must end with "-review"
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
                          placeholder="A brief summary of the review..."
                          {...field}
                        />
                      </FormControl>
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
                      <FormLabel>Category *</FormLabel>
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
                      <FormDescription>
                        Required for reviews. Determines the URL structure.
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
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
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
                        <FormLabel>Tags *</FormLabel>
                        <FormDescription className="text-xs">
                          Select at least one tag
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
                                                  (value) => value !== tag.id
                                                )
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
                  {isEditing ? "Update Review" : "Create Review"}
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

