import Image from "next/image";
import Link from "next/link";
import { Author } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AuthorBoxProps {
  author: Author;
  className?: string; // Allow passing className
}

export default function AuthorBox({ author, className }: AuthorBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-8 items-center md:items-start",
        className,
      )}
    >
      {author.avatarUrl && (
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-background shadow-lg ring-1 ring-border/20 group">
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="font-bold text-sm text-primary uppercase tracking-widest mb-1">
          About the Author
        </div>
        <Link href={`/author/${author.slug}`} className="group inline-block">
          <h3 className="text-3xl font-extrabold text-gray-800 group-hover:text-primary transition-colors">
            {author.name}
          </h3>
        </Link>
        {author.bio && (
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0 font-medium">
            {author.bio}
          </p>
        )}
        <div className="pt-2">
          <Link
            href={`/author/${author.slug}`}
            className="text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            View full profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
