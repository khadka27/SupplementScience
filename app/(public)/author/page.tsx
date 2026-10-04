import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Expert Authors | Supplement Science",
  description: "Meet the experts behind Supplement Science.",
};

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    where: {
      posts: {
        some: {
          status: "PUBLISHED",
        },
      },
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div
      className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-slate-100 pt-20 sm:pt-[84px] pb-20"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl" suppressHydrationWarning>
        <div className="mb-12 text-center lg:text-left" suppressHydrationWarning>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-4">
            Research Contributors
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Our Experts
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            The clinical minds behind Supplement Science. Browse our researchers,
            writers, and medical reviewers who bring you evidence-based insights.
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          suppressHydrationWarning
        >
          {authors.length === 0 ? (
            <p className="text-slate-500 italic">No authors found.</p>
          ) : (
            authors.map((author: (typeof authors)[number]) => (
              <Link
                key={author.id}
                href={`/author/${author.slug}`}
                className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-[#0D1217] border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500/80 hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-300"
              >
                <div
                  className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-md relative bg-slate-100 dark:bg-slate-800 mb-5"
                  suppressHydrationWarning
                >
                  {author.avatarUrl ? (
                    <Image
                      src={author.avatarUrl}
                      alt={author.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized={
                        author.avatarUrl.startsWith("http") ||
                        author.avatarUrl.startsWith("/images/")
                      }
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400 dark:text-slate-600"
                      suppressHydrationWarning
                    >
                      {author.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {author.name}
                </h3>
                {author.bio && (
                  <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-2 leading-relaxed text-sm">
                    {author.bio}
                  </p>
                )}
                <div
                  className="mt-auto inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  <span>{author._count.posts || 0}</span>
                  <span>
                    {(author._count.posts || 0) === 1 ? "Article" : "Articles"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
