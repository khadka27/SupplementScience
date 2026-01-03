import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              {post.featured_image_url && (
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {post.published_at && (
                    <time dateTime={post.published_at}>
                      {format(new Date(post.published_at), 'MMM d')}
                    </time>
                  )}
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time_minutes} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
