import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import Image from "next/image";
import { format } from "date-fns";
import { Globe, Mail, Link2, BadgeInfo } from "lucide-react";
import PaginationControls from "@/components/PaginationControls";
import { generateAuthorSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 43200;

const PAGE_SIZE = 50;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getAuthor(slug: string, page: number = 1) {
  const author = await prisma.author.findUnique({
    where: { slug },
  });

  if (!author) return null;

  const totalPosts = await prisma.post.count({
    where: {
      authorId: author.id,
      status: "PUBLISHED",
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const skip = (currentPage - 1) * PAGE_SIZE;

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
    skip,
    take: PAGE_SIZE,
  });

  return {
    author,
    totalPosts,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE,
    posts: (posts || []).map((p: (typeof posts)[number]) => ({
      ...p,
      tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    })),
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getAuthor(slug, page);

  if (!data) return { title: "Author Not Found" };

  const { author } = data;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    ) || "https://www.supplementdecoded.com";

  const title = page > 1 ? `${author.name} | Expert Author (Page ${page})` : `${author.name} | Expert Author`;
  const canonicalUrl = page > 1 ? `${baseUrl}/author/${author.slug}?page=${page}` : `${baseUrl}/author/${author.slug}`;

  return {
    title,
    description: author.bio || `Read articles written by ${author.name}`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: author.bio || `Read articles written by ${author.name}`,
      url: canonicalUrl,
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

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const pageParam = typeof sp.page === "string" ? parseInt(sp.page, 10) : 1;
  const requestedPage = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

  const data = await getAuthor(slug, requestedPage);

  if (!data) notFound();

  const { author, posts, totalPosts, totalPages, currentPage, pageSize } = data;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com",
    ) || "https://www.supplementdecoded.com";
  const authorSchema = generateAuthorSchema(author, baseUrl);

  const socialLinks = (author.socialLinks as Record<string, string>) || {};
  const authorDetails = [
    { label: "Slug", value: author.slug },
    { label: "Email", value: author.email || "Not provided" },
    { label: "Expertise", value: author.expertise || "Not provided" },
    { label: "Qualification", value: author.qualification || "Not provided" },
    {
      label: "Joined",
      value: author.createdAt
        ? format(new Date(author.createdAt), "MMMM d, yyyy")
        : "Not provided",
    },
    {
      label: "Last Profile Update",
      value: author.updatedAt
        ? format(new Date(author.updatedAt), "MMMM d, yyyy")
        : "Not provided",
    },
    {
      label: "Avatar URL",
      value: author.avatarUrl || "Not provided",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(authorSchema),
        }}
      />
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white dark:bg-[#0D1217] rounded-3xl border border-stone-200/90 dark:border-stone-800 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {author.avatarUrl ? (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shrink-0 border-4 border-emerald-500/20 shadow-md">
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={
                    author.avatarUrl.startsWith("http") ||
                    author.avatarUrl.startsWith("/images/")
                  }
                />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-4xl font-extrabold text-[#0E3B2F] dark:text-emerald-400 shrink-0 border-4 border-emerald-500/20">
                {author.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
                {author.qualification || "Contributing Author"}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-slate-900 dark:text-white">
                {author.name}
              </h1>
              {author.expertise && (
                <p className="text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
                  {author.expertise}
                </p>
              )}
              {author.bio && (
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-6 font-sans">
                  {author.bio}
                </p>
              )}

              {/* Social / Contact Links */}
              {(author.email ||
                Object.keys(socialLinks).length > 0) && (
                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
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
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      if (platform === "website") return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition-all capitalize"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          {platform}
                        </a>
                      );
                    })}
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
                {totalPosts} Published{" "}
                {totalPosts === 1 ? "Article" : "Articles"}
                {totalPages > 1 && (
                  <span className="text-slate-400 font-normal ml-1">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-16 pt-12 border-t border-stone-200/90 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-stone-200/90 dark:border-stone-800 gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Articles by {author.name}
            </h2>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Showing {totalPosts === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalPosts)} of {totalPosts} articles
            </span>
          </div>

          {posts.length > 0 ? (
            <BlogList posts={posts as any} showFeatured={false} />
          ) : (
            <p className="text-slate-500 italic">No articles published yet.</p>
          )}

          {totalPages > 1 && (
            <div className="pt-8 border-t border-stone-200/90 dark:border-stone-800">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/author/${author.slug}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
