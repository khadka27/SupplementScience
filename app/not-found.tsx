import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";

async function getCategories(): Promise<any[]> {
  try {
    const data = await prisma.category.findMany({
      where: { postCount: { gte: 1 } },
      select: { id: true, name: true, slug: true },
      orderBy: { postCount: "desc" },
      take: 6,
    });
    return data || [];
  } catch {
    return [];
  }
}

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated 404 Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EFE9E3]0/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Animated Search Icon */}
          <div className="inline-block animate-bounce-slow">
            <Search
              className="w-32 h-32 md:w-48 md:h-48 animate-spin-slow"
              style={{
                filter:
                  "drop-shadow(2px 2px 0 #ef4444) drop-shadow(-2px -2px 0 #22c55e) drop-shadow(6px 0 0 #8b5cf6) drop-shadow(-6px 0 0 #eab308) drop-shadow(0 -6px 0 #06b6d4) drop-shadow(0 6px 0 #84cc16)",
                strokeWidth: 1.5,
              }}
            />
          </div>

          {/* 404 Text with Animation */}
          <h1
            className="text-[15vw] md:text-[20vw] lg:text-[300px] font-bold leading-none animate-slide-down"
            style={{
              textShadow:
                "4px 4px 0 rgba(239, 68, 68, 0.3), -4px -4px 0 rgba(34, 197, 94, 0.3)",
            }}
          >
            404
          </h1>

          {/* Not Found Text */}
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold animate-fade-in-up"
            style={{
              textShadow:
                "2px 2px 0 #ef4444, -2px -2px 0 #22c55e, 6px 0 0 #8b5cf6, -6px 0 0 #eab308, 0 -6px 0 #06b6d4, 0 6px 0 #84cc16",
            }}
          >
            Not Found
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            The page you are looking for does not exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in-up delay-300">
            <Link href="/">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Browse Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Or Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="hover:shadow-xl hover:border-primary transition-all duration-300 hover:scale-105 h-full">
                  <CardHeader className="text-center">
                    <CardTitle className="text-base md:text-lg">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
