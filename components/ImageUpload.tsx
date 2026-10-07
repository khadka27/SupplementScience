"use client";

import { useId, useRef, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  FolderOpen,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  compact?: boolean;
  recommendedSize?: string;
  hideStorageNotice?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  compact = false,
  recommendedSize,
  hideStorageNotice = false,
}: ImageUploadProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return false;
    }

    // Checking for reasonable file size (~5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    if (!validateImage(file)) {
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();

      if (data.url) {
        onChange(data.url);
        toast.success("Image uploaded to /public/images");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
    } finally {
      // Reset input value to allow uploading the same file again if removed
      e.target.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const copyImageUrl = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Image URL copied");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-3 w-full">
      {value ? (
        <div className="space-y-2">
          <div className="group relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted/20 shadow-xs">
            <Image
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              alt="Upload"
              src={value}
              unoptimized={value.startsWith("http")}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5" />
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                size="sm"
                className="h-7 px-2.5 text-xs shadow-xs bg-background/90 hover:bg-background backdrop-blur-xs"
                disabled={disabled || isUploading}
              >
                <Upload className="h-3.5 w-3.5 mr-1" /> Replace
              </Button>
              <Button
                type="button"
                onClick={() => onChange("")}
                variant="destructive"
                size="icon"
                className="h-7 w-7 shadow-xs"
                disabled={disabled || isUploading}
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-2.5 py-1.5">
            <code className="flex-1 truncate font-mono text-[11px] text-muted-foreground">
              {value}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={copyImageUrl}
              disabled={disabled || isUploading}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </>
              )}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </div>
      ) : (
        <label
          htmlFor={inputId}
          aria-label="Upload image file"
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "group relative flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed transition-all",
            compact ? "p-4 gap-2" : "p-6 gap-3",
            "bg-muted/15 hover:bg-muted/30 hover:border-primary/50",
            isDragging
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border",
            (disabled || isUploading) && "pointer-events-none opacity-60",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110",
              compact ? "h-9 w-9" : "h-11 w-11",
            )}
          >
            {isUploading ? (
              <Loader2 className={cn("animate-spin", compact ? "h-4 w-4" : "h-5 w-5")} />
            ) : (
              <ImageIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />
            )}
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">
              {isUploading
                ? "Uploading image..."
                : isDragging
                  ? "Drop image here"
                  : "Click to upload or drag & drop"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              JPG, PNG, WEBP, SVG up to 5MB
            </p>
          </div>

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            variant="outline"
            size="sm"
            className={cn("text-xs font-medium", compact ? "h-7 px-3" : "h-8 px-4")}
            disabled={disabled || isUploading}
          >
            <FolderOpen className="h-3.5 w-3.5 mr-1.5" /> Browse Files
          </Button>

          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </label>
      )}

      {!hideStorageNotice && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
          <span>{recommendedSize || "Ideal size: 1200 × 628 px"}</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/75">
            <FolderOpen className="h-3 w-3" /> public/images
          </span>
        </div>
      )}
    </div>
  );
}
