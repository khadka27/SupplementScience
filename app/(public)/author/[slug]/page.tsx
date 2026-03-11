import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";
import { Twitter, Youtube, Instagram, Mail, Globe } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 43200;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getAuthor(slug: string) {
  const author = await prisma.author.findUnique({
    where: { slug },
  });

  if (!author) return null;

  const posts = await prisma.post.findMany({
    where: {
      authorId: author.id,
      status: "PUBLISHED",
    },
    include: {
      author: { select: { name: true, slug: true, avatarUrl: true } },
      category: { select: { name: true, slug: true, isHub: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return {
    author,
    posts: (posts || []).map((p: (typeof posts)[number]) => ({
      ...p,
      tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthor(slug);

  if (!data) return { title: "Author Not Found" };

  const { author } = data;
  const baseUrl =
    (((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || "https://www.supplementdecoded.com") as string);

  return {
    title: `${author.name} | Expert Author`,
    description: author.bio || `Read articles written by ${author.name}`,
    alternates: { canonical: `${baseUrl}/author/${author.slug}` },
    openGraph: {
      title: `${author.name} | Expert Author`,
      description: author.bio || `Read articles written by ${author.name}`,
      url: `${baseUrl}/author/${author.slug}`,
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  try {
    const authors = await prisma.author.findMany({
      select: { slug: true },
      where: {
        posts: {
          some: { status: "PUBLISHED" },
        },
      },
    });
    return authors.map((a: (typeof authors)[number]) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const data = await getAuthor(slug);

  if (!data) notFound();

  const { author, posts } = data;

  const socialLinks = (author.socialLinks as Record<string, string>) || {};

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20 min-h-[60vh]">
      <div className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shrink-0 border-4 border-white shadow-xl relative bg-[#EFE9E3]">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#D9CFC7]">
                {author.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-sm text-black">
              {author.name}
            </h1>

            {(socialLinks.twitter ||
              socialLinks.linkedin ||
              socialLinks.website) && (
              <div className="flex items-center gap-3 mb-6">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-slate-100 hover:bg-black hover:text-white transition-all text-gray-600"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {author.bio && (
              <div className="prose prose-lg prose-gray max-w-3xl">
                <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {author.bio}
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-gray-600 bg-[#EFE9E3] px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              {posts.length} Published{" "}
              {posts.length === 1 ? "Article" : "Articles"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-16 pt-12 border-t border-[#D9CFC7]">
        <div className="flex items-center justify-between mb-8 pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
            <span className="w-8 h-1 bg-[#D9CFC7] rounded-full" />
            Articles by {author.name}
          </h2>
        </div>

        {posts.length > 0 ? (
          <BlogList posts={posts as any} />
        ) : (
          <p className="text-gray-500 italic">No articles published yet.</p>
        )}
      </div>
    </div>
  );
}
