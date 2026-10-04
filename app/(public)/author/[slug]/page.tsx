import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";
import { format } from "date-fns";
import { Globe, Mail, Link2, BadgeInfo } from "lucide-react";

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
    process.env.NEXT_PUBLIC_BASE_URL?.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    ) || "https://www.supplementdecoded.com";

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
  const authorDetails = [
    { label: "Slug", value: author.slug },
    { label: "Email", value: author.email || "Not provided" },
    { label: "Expertise", value: author.expertise || "Not provided" },
    {
      label: "Qualification",
      value: author.qualification || "Not provided",
    },
    {
      label: "Member Since",
      value: format(new Date(author.createdAt), "MMMM d, yyyy"),
    },
    {
      label: "Last Updated",
      value: format(new Date(author.updatedAt), "MMMM d, yyyy"),
    },
    {
      label: "Published Articles",
      value: String(posts.length),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-xl relative bg-slate-100 dark:bg-slate-800">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                  unoptimized={
                    author.avatarUrl.startsWith("http") ||
                    author.avatarUrl.startsWith("/images/")
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400 dark:text-slate-600">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
                Verified Author Profile
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
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
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all text-slate-600 dark:text-slate-300"
                    >
                      <Link2 className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all text-slate-600 dark:text-slate-300"
                    >
                      <Link2 className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all text-slate-600 dark:text-slate-300"
                    >
                      <Link2 className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all text-slate-600 dark:text-slate-300"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {author.bio && (
                <div className="prose prose-lg dark:prose-invert max-w-3xl mb-6">
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {author.bio}
                  </p>
                </div>
              )}

              {(author.expertise || author.qualification) && (
                <div className="mb-6 flex flex-wrap gap-2.5">
                  {author.expertise && (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full">
                      <span className="text-emerald-700 dark:text-emerald-400">Expertise:</span>
                      <span>{author.expertise}</span>
                    </div>
                  )}
                  {author.qualification && (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full">
                      <span className="text-emerald-700 dark:text-emerald-400">Qualification:</span>
                      <span>{author.qualification}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {authorDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0D1217] p-3.5 shadow-sm"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <BadgeInfo className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {detail.label}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white wrap-break-word">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>

              {Object.entries(socialLinks).some(([, url]) => Boolean(url)) && (
                <div className="mt-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0D1217] p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <Link2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Social Links
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.website && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Twitter/X
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        YouTube
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Instagram
                      </a>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {posts.length} Published{" "}
                {posts.length === 1 ? "Article" : "Articles"}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-16 pt-12 border-t border-stone-200/90 dark:border-stone-800">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/90 dark:border-stone-800">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Articles by {author.name}
            </h2>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Evidence-verified content
            </span>
          </div>

          {posts.length > 0 ? (
            <BlogList posts={posts as any} />
          ) : (
            <p className="text-slate-500 italic">No articles published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
