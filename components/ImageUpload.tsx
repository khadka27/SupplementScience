"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Checking for reasonable file size (~5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
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
        toast.success("Image uploaded successfully");
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
      // Reset input value to allow uploading the same file again if removed
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative w-full aspect-video rounded-md overflow-hidden border">
          <Image
            fill
            className="object-cover"
            alt="Upload"
            src={value}
            unoptimized={value.startsWith("http")}
          />
          <div className="absolute top-2 right-2 flex gap-2">
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
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-40 rounded-md border-2 border-dashed border-input bg-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-muted/50 cursor-pointer",
            (disabled || isUploading) && "pointer-events-none opacity-50",
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
            )}
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              SVG, PNG, JPG or GIF (MAX. 5MB)
            </p>
            <p className="text-xs font-semibold text-primary mt-1">
              Ideal Size: 1200x628 pixels
            </p>
          </div>
          <input
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
