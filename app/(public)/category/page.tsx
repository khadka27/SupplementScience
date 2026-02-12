import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 43200;

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Browse All Categories | SupplementDecoded",
  description:
    "Explore our comprehensive collection of health and supplement categories. Find evidence-based guides tailored to your wellness goals.",
  alternates: {
    canonical: `${baseUrl}/categories`,
  },
  openGraph: {
    title: "Browse All Categories | SupplementDecoded",
    description:
      "Explore our comprehensive collection of health and supplement categories.",
    url: `${baseUrl}/categories`,
    type: "website",
  },
};

async function getAllCategories(): Promise<any[]> {
  const data = await prisma.category.findMany({
    where: {
      postCount: {
        gte: 1,
      },
    },
    orderBy: [
      {
        postCount: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return data || [];
}

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Health Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our comprehensive collection of supplement and health
            guides, organized by your wellness goals.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
            <span className="font-semibold">{categories.length}</span>
            {categories.length === 1 ? "category" : "categories"} available
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              No categories available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/${category.slug}`}>
                <Card className="group hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 h-full cursor-pointer">
                  <CardContent className="p-0">
                    {category.imageUrl && (
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.postCount}{" "}
                        {category.postCount === 1 ? "article" : "articles"}
                      </p>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-muted/30 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse all our articles or use the search to find specific
            supplements and health topics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                View All Articles
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-6 py-3 border border-border rounded-full font-semibold hover:bg-accent transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
