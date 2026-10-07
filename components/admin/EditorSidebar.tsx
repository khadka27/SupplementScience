"use client";

import { useState } from "react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { Author, Category, Tag } from "@/lib/types";
import {
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import { cn } from "@/lib/utils";
import {
  Save,
  Loader2,
  Sparkles,
  ShieldCheck,
  User,
  CheckCircle2,
  Image as ImageIcon,
  Globe,
  Tags as TagsIcon,
  Search,
  Check,
  Plus,
  X,
  Folder,
  Command,
  Layers,
} from "lucide-react";

interface EditorSidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  isSubmitting: boolean;
  isEditing: boolean;
  entityLabel: string;
  cancelUrl: string;
  categoryRequired?: boolean;
  categoryDescription?: string;
}

export function EditorSidebar({
  form,
  authors,
  categories,
  tags,
  isSubmitting,
  isEditing,
  entityLabel,
  cancelUrl,
  categoryRequired = false,
  categoryDescription,
}: EditorSidebarProps) {
  const [tagSearch, setTagSearch] = useState("");
  const [mediaTab, setMediaTab] = useState<"hero" | "card">("hero");
  const [heroMode, setHeroMode] = useState<"upload" | "url">("upload");
  const [cardMode, setCardMode] = useState<"upload" | "url">("upload");

  const watchedStatus = form.watch("status");
  const watchedHeroImage = form.watch("featuredImageUrl");
  const watchedCardImage = form.watch("cardImageUrl");
  const selectedTagIds: string[] = form.watch("tagIds") || [];

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.trim().toLowerCase()),
  );

  return (
    <div className="space-y-5">
      {/* 1. Publication & Classification Card */}
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
              Publication Settings
            </h3>
          </div>
          <Badge
            variant={watchedStatus === "published" ? "default" : "secondary"}
            className={cn(
              "text-[10px] px-2 py-0.5 font-medium tracking-wide capitalize",
              watchedStatus === "published"
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            ● {watchedStatus || "draft"}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Status Segmented Control */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-foreground">
                  Status
                </FormLabel>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-muted/40 border border-border/60">
                  <button
                    type="button"
                    onClick={() => field.onChange("draft")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all select-none",
                      field.value === "draft"
                        ? "bg-card text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("published")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all select-none",
                      field.value === "published"
                        ? "bg-emerald-500 text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Published
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Select */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                  <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                  Category {categoryRequired && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }
                  value={field.value || (categoryRequired ? "" : "none")}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!categoryRequired && (
                      <SelectItem value="none" className="text-xs">
                        No category
                      </SelectItem>
                    )}
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-xs"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categoryDescription && (
                  <FormDescription className="text-[11px] text-muted-foreground">
                    {categoryDescription}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 2. Editorial Governance & Authorship Card */}
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
              Editorial & Review
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">E-E-A-T Quality</span>
        </CardHeader>
        <CardContent className="p-4 space-y-3.5">
          {/* Author */}
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Primary Author
                </FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">
                      No author assigned
                    </SelectItem>
                    {authors.map((author) => (
                      <SelectItem
                        key={author.id}
                        value={author.id}
                        className="text-xs"
                      >
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fact Checked By */}
          <FormField
            control={form.control}
            name="factCheckedById"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Fact Checked By
                </FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select fact checker" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">
                      Editorial Team (Default)
                    </SelectItem>
                    {authors.map((author) => (
                      <SelectItem
                        key={author.id}
                        value={author.id}
                        className="text-xs"
                      >
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reviewed By */}
          <FormField
            control={form.control}
            name="reviewedById"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                  Medical / Reviewer
                </FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">
                      Editorial Team (Default)
                    </SelectItem>
                    {authors.map((author) => (
                      <SelectItem
                        key={author.id}
                        value={author.id}
                        className="text-xs"
                      >
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 3. Featured Media Manager Card */}
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-violet-500" />
            <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
              Featured Media
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {watchedHeroImage && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="h-3 w-3" /> Cover
              </span>
            )}
            {watchedCardImage && (
              <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium">
                <Check className="h-3 w-3" /> Card
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3.5">
          {/* Sub-tab navigation between Hero Image and Card Thumbnail */}
          <div className="flex rounded-lg bg-muted/40 p-1 border border-border/60">
            <button
              type="button"
              onClick={() => setMediaTab("hero")}
              className={cn(
                "flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5",
                mediaTab === "hero"
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Cover Image
              {watchedHeroImage && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMediaTab("card")}
              className={cn(
                "flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5",
                mediaTab === "card"
                  ? "bg-card text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              Card Thumbnail
              {watchedCardImage && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              )}
            </button>
          </div>

          {/* Tab 1: Hero / Cover Image */}
          {mediaTab === "hero" && (
            <div className="space-y-3 animate-in fade-in-50 duration-200">
              <FormField
                control={form.control}
                name="featuredImageUrl"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-medium text-foreground">
                        Main Article Banner
                      </FormLabel>
                      {/* Compact Upload / URL toggle */}
                      <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5 border border-border/60">
                        <button
                          type="button"
                          onClick={() => setHeroMode("upload")}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded font-medium transition-all",
                            heroMode === "upload"
                              ? "bg-card text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroMode("url")}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded font-medium transition-all",
                            heroMode === "url"
                              ? "bg-card text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          URL
                        </button>
                      </div>
                    </div>

                    {heroMode === "upload" ? (
                      <ImageUpload
                        compact
                        recommendedSize="Ideal: 1200 × 628 px"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    ) : (
                      <div className="space-y-1.5">
                        <FormControl>
                          <Input
                            placeholder="https://... or /images/..."
                            className="h-8 text-xs font-mono"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-[11px] text-muted-foreground">
                          Direct URL for header banner and social sharing
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alt Text right under Cover Image */}
              <FormField
                control={form.control}
                name="featuredImageAlt"
                render={({ field }) => (
                  <FormItem className="space-y-1 pt-1">
                    <FormLabel className="text-[11px] font-medium text-foreground">
                      Cover Image Alt Text (SEO)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe the image for accessibility"
                        className="h-8 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] text-muted-foreground">
                      Used by screen readers and Google image search
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Tab 2: Card Thumbnail */}
          {mediaTab === "card" && (
            <div className="space-y-3 animate-in fade-in-50 duration-200">
              <FormField
                control={form.control}
                name="cardImageUrl"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-medium text-foreground">
                        Card Thumbnail (Optional)
                      </FormLabel>
                      {/* Compact Upload / URL toggle */}
                      <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5 border border-border/60">
                        <button
                          type="button"
                          onClick={() => setCardMode("upload")}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded font-medium transition-all",
                            cardMode === "upload"
                              ? "bg-card text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardMode("url")}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded font-medium transition-all",
                            cardMode === "url"
                              ? "bg-card text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          URL
                        </button>
                      </div>
                    </div>

                    {cardMode === "upload" ? (
                      <ImageUpload
                        compact
                        recommendedSize="Ideal: 600 × 400 px"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    ) : (
                      <div className="space-y-1.5">
                        <FormControl>
                          <Input
                            placeholder="https://... or /images/..."
                            className="h-8 text-xs font-mono"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      Used in article cards and grid lists. If omitted, the Cover
                      Image will be used.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Tags & Taxonomy Card (Interactive Pill Cloud) */}
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <TagsIcon className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
              Tags & Topics
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono px-2 py-0.5 border-border"
          >
            {selectedTagIds.length} selected
          </Badge>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/20 border-border"
            />
            {tagSearch && (
              <button
                type="button"
                onClick={() => setTagSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem className="space-y-2">
                {/* Interactive Chip Cloud */}
                <div className="max-h-52 overflow-y-auto p-2 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                  {tags.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No tags available.
                    </p>
                  ) : filteredTags.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No tags matching &ldquo;{tagSearch}&rdquo;
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {filteredTags.map((tag) => {
                        const isSelected = field.value?.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.onChange(
                                  field.value?.filter(
                                    (id: string) => id !== tag.id,
                                  ),
                                );
                              } else {
                                field.onChange([
                                  ...(field.value || []),
                                  tag.id,
                                ]);
                              }
                            }}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all select-none active:scale-95",
                              isSelected
                                ? "bg-primary text-primary-foreground font-medium shadow-xs ring-1 ring-primary/40"
                                : "bg-card text-foreground/80 hover:text-foreground hover:bg-accent border border-border/80",
                            )}
                          >
                            {isSelected ? (
                              <Check className="h-3 w-3 shrink-0" />
                            ) : (
                              <Plus className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                            )}
                            <span>{tag.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Clear helper */}
                {selectedTagIds.length > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5 pt-0.5">
                    <span>Click tag to toggle</span>
                    <button
                      type="button"
                      onClick={() => field.onChange([])}
                      className="text-muted-foreground hover:text-destructive underline transition-colors"
                    >
                      Clear all ({selectedTagIds.length})
                    </button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 5. Save & Publish Actions Card */}
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-4 space-y-2.5">
          <Button
            type="submit"
            className="w-full h-10 font-semibold shadow-xs"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? `Update ${entityLabel}` : `Publish ${entityLabel}`}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-9 text-xs"
            asChild
          >
            <Link href={cancelUrl}>Cancel & Discard</Link>
          </Button>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 px-1 border-t border-border/50">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              Live preview enabled
            </span>
            <span className="flex items-center gap-0.5 font-mono text-[10px]">
              <Command className="h-2.5 w-2.5" />S to save
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
