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
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
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
    <div className="space-y-4 w-full">
      <div className="rounded-lg border bg-card/60 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">CMS Image Storage</p>
        <p>
          Local uploads are saved to{" "}
          <span className="font-mono">public/images</span> and served as{" "}
          <span className="font-mono">/images/&lt;file&gt;</span>.
        </p>
      </div>

      {value ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            <Image
              fill
              className="object-cover"
              alt="Upload"
              src={value}
              unoptimized={value.startsWith("http")}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                size="sm"
                className="h-8"
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4 mr-1.5" /> Replace
              </Button>
              <Button
                type="button"
                onClick={() => onChange("")}
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-muted/30 p-3 space-y-2">
            <p className="text-xs text-muted-foreground">Image URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-background px-2 py-1.5 text-xs">
                {value}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyImageUrl}
                disabled={disabled || isUploading}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" /> Copy
                  </>
                )}
              </Button>
            </div>
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
            "w-full rounded-xl border-2 border-dashed p-8 transition-all",
            "bg-linear-to-b from-muted/20 to-background",
            isDragging
              ? "border-primary bg-primary/5 shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
              : "border-input",
            (disabled || isUploading) && "pointer-events-none opacity-60",
          )}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary">
              {isUploading ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <ImageIcon className="h-7 w-7" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {isUploading ? "Uploading image..." : "Drop image to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WEBP, SVG, GIF up to 5MB
              </p>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              variant="default"
              size="sm"
              className="min-w-36"
              disabled={disabled || isUploading}
            >
              <FolderOpen className="h-4 w-4 mr-1.5" /> Choose From Device
            </Button>

            <p className="text-xs text-muted-foreground">
              Ideal size: 1200 x 628 px
            </p>
          </div>

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
    </div>
  );
}
