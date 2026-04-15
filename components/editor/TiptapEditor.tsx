"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { NodeSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import Underline from "@tiptap/extension-underline";
import { suggestion } from "@/lib/editor-suggestion";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Upload,
  FolderOpen,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.dataset.width ||
          element.style.width ||
          element.getAttribute("width") ||
          "100%",
        renderHTML: (attributes) => {
          const width = attributes.width || "100%";
          return {
            "data-width": width,
            style: `width: ${width}; height: auto;`,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => element.dataset.align || "center",
        renderHTML: (attributes) => {
          const align = attributes.align || "center";
          const alignmentStyles: Record<string, string> = {
            left: "display: block; margin-left: 0; margin-right: auto;",
            center: "display: block; margin-left: auto; margin-right: auto;",
            right: "display: block; margin-left: auto; margin-right: 0;",
            full: "display: block; margin-left: 0; margin-right: 0; width: 100%;",
          };

          return {
            "data-align": align,
            style: alignmentStyles[align] || alignmentStyles.center,
          };
        },
      },
    };
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

interface EditorImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertImage: (image: { src: string; alt?: string }) => void;
}

function EditorImageDialog({
  open,
  onOpenChange,
  onInsertImage,
}: EditorImageDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return false;
    }

    return true;
  };

  const uploadImage = async (file: File) => {
    if (!validateImage(file)) {
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to upload image");
      }

      onInsertImage({ src: data.url, alt: imageAlt.trim() || undefined });
      onOpenChange(false);
      setImageUrl("");
      setImageAlt("");
      toast.success("Image uploaded to /public/images");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);

    if (isUploadingImage) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await uploadImage(file);
  };

  const insertImageFromUrl = () => {
    const value = imageUrl.trim();
    if (!value) {
      toast.error("Please enter an image URL");
      return;
    }

    onInsertImage({ src: value, alt: imageAlt.trim() || undefined });
    onOpenChange(false);
    setImageUrl("");
    setImageAlt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload from your device to public/images or paste an existing URL.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card/60 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Local CMS Storage</p>
            <p>
              Uploaded images are saved in{" "}
              <span className="font-mono">public/images</span> and used as{" "}
              <span className="font-mono">/images/&lt;file&gt;</span>.
            </p>
          </div>

          <label
            htmlFor="editor-image-upload"
            aria-label="Upload image for editor"
            onDragOver={(e) => {
              e.preventDefault();
              if (!isUploadingImage) setIsDraggingImage(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingImage(false);
            }}
            onDrop={handleImageDrop}
            className={cn(
              "block rounded-xl border-2 border-dashed p-6 transition-all",
              "bg-linear-to-b from-muted/20 to-background",
              isDraggingImage
                ? "border-primary bg-primary/5 shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
                : "border-input",
              isUploadingImage && "pointer-events-none opacity-60",
            )}
          >
            <span className="sr-only">Upload image</span>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isUploadingImage ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isUploadingImage
                    ? "Uploading image..."
                    : "Drop image here to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP, SVG, GIF up to 5MB
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                disabled={isUploadingImage}
              >
                <FolderOpen className="h-4 w-4 mr-1.5" /> Choose From Device
              </Button>
            </div>
            <input
              id="editor-image-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await uploadImage(file);
              }}
              disabled={isUploadingImage}
            />
          </label>

          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Insert From URL
            </p>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={insertImageFromUrl}
              >
                Insert
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-sm font-medium">Image Alt Text</p>
            <Input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Describe this image for accessibility"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: concise, specific description for screen readers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Press '/' for commands...",
}: TiptapEditorProps) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: {
          ...suggestion,
          char: "/",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] border border-border rounded-md p-6 bg-background",
      },
      handleClickOn(view, _pos, node, nodePos) {
        if (node.type.name !== "image") {
          return false;
        }

        const transaction = view.state.tr.setSelection(
          NodeSelection.create(view.state.doc, nodePos),
        );
        view.dispatch(transaction);
        view.focus();
        return true;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = globalThis.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    editor.commands.blur();
    setIsImageDialogOpen(true);
  };

  const setSelectedImageWidth = (width: string) => {
    editor.chain().focus().updateAttributes("image", { width }).run();
  };

  const setSelectedImageAlign = (
    align: "left" | "center" | "right" | "full",
  ) => {
    const updates: Record<string, string> = { align };
    if (align === "full") {
      updates.width = "100%";
    }

    editor.chain().focus().updateAttributes("image", updates).run();
  };

  const editSelectedImageAlt = () => {
    const currentAlt = editor.getAttributes("image")?.alt || "";
    const nextAlt = globalThis.prompt("Image alt text", currentAlt);
    if (nextAlt === null) return;
    editor.chain().focus().updateAttributes("image", { alt: nextAlt }).run();
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="relative w-full space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border border-border rounded-md">
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-accent" : ""}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-accent" : ""}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-accent" : ""}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "bg-accent" : ""}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-accent" : ""}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link and Media */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-accent" : ""}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTable}
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Other */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => {
            return editor.isActive("image") || !editor.state.selection.empty;
          }}
          className="flex items-center gap-1 p-1 bg-popover border border-border rounded-md shadow-md animate-in fade-in zoom-in duration-100"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-accent" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-accent" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-accent" : ""}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive("link") ? "bg-accent" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {editor.isActive("image") && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageAlign("left")}
              >
                Left
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageAlign("center")}
              >
                Center
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageAlign("right")}
              >
                Right
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageAlign("full")}
              >
                Full
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageWidth("33%")}
              >
                33%
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageWidth("50%")}
              >
                50%
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageWidth("75%")}
              >
                75%
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageWidth("100%")}
              >
                100%
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={editSelectedImageAlt}
              >
                Alt
              </Button>
            </>
          )}
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      <EditorImageDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onInsertImage={({ src, alt }) => {
          editor
            .chain()
            .focus()
            .setImage({ src, alt })
            .updateAttributes("image", { width: "100%" })
            .run();
        }}
      />

      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        <kbd className="px-2 py-1 bg-muted border border-border rounded text-[10px]">
          /
        </kbd>
        <span>Type '/' to open the command menu</span>
      </div>
    </div>
  );
};

export default TiptapEditor;
