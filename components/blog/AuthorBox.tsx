import Image from "next/image";
import Link from "next/link";
import { Author } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface AuthorBoxProps {
  author: Author;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {author.avatarUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="font-semibold text-sm text-muted-foreground mb-1">
              Written by
            </div>
            <Link href={`/author/${author.slug}`} className="hover:underline">
              <h3 className="text-xl font-bold mb-2">{author.name}</h3>
            </Link>
            {author.bio && (
              <p className="text-sm text-muted-foreground">{author.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
