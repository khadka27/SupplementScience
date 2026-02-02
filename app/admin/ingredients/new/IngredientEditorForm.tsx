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
  ingredientName: z.string().min(2, "Ingredient name is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content is too short"),
  featuredImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  authorId: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  customAuthor: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).min(1, "Please select at least one tag"),
  status: z.enum(["draft", "published"]),
});

interface IngredientEditorFormProps {
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  initialData?: any;
}

export default function IngredientEditorForm({
  authors,
  categories,
  tags,
  initialData,
}: IngredientEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      ingredientName: initialData?.ingredientName || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      featuredImageUrl: initialData?.featuredImageUrl || "",
      tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
      authorId: initialData?.authorId || authors[0]?.id || "",
      categoryId: initialData?.categoryId || "",
      status: initialData?.status?.toLowerCase() || "draft",
    },
  });

  const ingredientName = form.watch("ingredientName");
  const slug = form.watch("slug");

  // Generate preview URL when slug changes
  useEffect(() => {
    if (slug) {
      const url = generatePreviewUrl("ingredient", slug);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [slug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const readTimeMinutes = calculateReadTime(values.content);

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
        isEditing
          ? "Ingredient page updated successfully!"
          : "Ingredient page created successfully!"
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
    const ingredient = ingredientName || form.getValues("ingredientName");
    if (!ingredient) {
      toast.error("Please enter an ingredient name first");
      return;
    }

    const generatedSlug = generateSlugForPostType("ingredient", ingredient);
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
                  name="ingredientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingredient Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Glucosamine" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the ingredient
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
                      <FormLabel>Page Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Glucosamine: Complete Guide"
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
                          Generate from ingredient name
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="glucosamine" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier for the ingredient
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
                          placeholder="A brief summary of the ingredient..."
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
                      <FormLabel>Ingredient Content *</FormLabel>
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
                      <FormLabel>Category (Optional)</FormLabel>
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
                        Optional. Ingredients are global and don't require a category.
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
                  {isEditing ? "Update Ingredient" : "Create Ingredient"}
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

