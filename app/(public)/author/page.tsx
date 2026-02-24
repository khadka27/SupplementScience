import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-static";
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
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-20 min-h-[60vh]">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-black">
          Our Experts
        </h1>
        <p className="text-xl text-gray-800 max-w-3xl leading-relaxed">
          The brilliant minds behind Supplement Science. Browse our researchers,
          writers, and reviewers who bring you evidence-based insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {authors.length === 0 ? (
          <p className="text-gray-500 italic">No authors found.</p>
        ) : (
          authors.map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.slug}`}
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/70 backdrop-blur-sm border border-[#D9CFC7] hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl relative bg-[#EFE9E3] mb-6">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#D9CFC7]">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-black">
                {author.name}
              </h3>
              {author.bio && (
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {author.bio}
                </p>
              )}
              <div className="mt-auto inline-flex flex-wrap items-center gap-2 bg-[#EFE9E3] text-black px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-black group-hover:text-white transition-colors">
                <span>{author._count.posts || 0}</span>
                <span>
                  {(author._count.posts || 0) === 1 ? "Article" : "Articles"}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
