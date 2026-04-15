import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image,
  Quote,
  Code,
  Text,
} from "lucide-react";
import { toast } from "sonner";

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: Text,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setParagraph().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: Heading1,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleHeading({ level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: Heading2,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleHeading({ level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: Heading3,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleHeading({ level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bulleted list.",
      searchTerms: ["unordered", "point"],
      icon: List,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: ListOrdered,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quotation.",
      searchTerms: ["blockquote"],
      icon: Quote,
      command: ({ editor, range }: any) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: Code,
      command: ({ editor, range }: any) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Image Upload",
      description: "Upload from device and insert image.",
      searchTerms: ["photo", "picture", "media"],
      icon: Image,
      command: async ({ editor, range }: any) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.onchange = async () => {
          const file = fileInput.files?.[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            toast.error("Please choose a valid image file");
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
          }

          try {
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

            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setImage({ src: data.url })
              .run();

            toast.success("Image uploaded to /public/images");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to upload image",
            );
          }
        };

        fileInput.click();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.searchTerms?.some((term: string) => term.includes(search))
      );
    }
    return true;
  });
};
