import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Post, Category } from "@/lib/types";
import BlogList from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPostHref } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Heart,
  Brain,
  Dumbbell,
  Moon,
  Shield,
  Leaf,
  Zap,
  Mail,
} from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 43200;

async function getFeaturedPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: { name: true, slug: true, avatarUrl: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });

  return data || [];
}

async function getRecentPosts(): Promise<any[]> {
  const data = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      author: {
        select: { name: true, slug: true, avatarUrl: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  });

  return data || [];
}

async function getCategories(): Promise<any[]> {
  const data = await prisma.category.findMany({
    where: {
      postCount: {
        gte: 1,
      },
    },
    orderBy: {
      postCount: "desc",
    },
    take: 6,
  });

  return data || [];
}

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();
  const recentPosts = await getRecentPosts();
  const categories = await getCategories();

  const mainFeaturedPost = featuredPosts[0] || recentPosts[0];
  const postsToShow = recentPosts.slice(0, 6);

  const categoryIcons: Record<string, any> = {
    "Muscle & Strength": Dumbbell,
    "Sleep & Stress": Moon,
    Immunity: Shield,
    "Gut Health": Heart,
    "Brain Health": Brain,
    "Skin & Hair": Sparkles,
    "Weight Loss": TrendingUp,
    Vitamins: Leaf,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FBF8F1] via-[#F7ECDE] to-[#E9DAC1]  py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.2),transparent)]" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#E9DAC1] dark:border-[#E9DAC1] mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary dark:text-primary" />
              <span className="text-sm font-medium text-primary dark:text-gray-800">
                Evidence-Based • Updated Weekly • Beginner-Friendly
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary  bg-clip-text text-transparent leading-tight">
              Science-Backed Supplement Guides for Real Results
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Understand what works, how to take it safely, and what to avoid —
              based on research, not hype.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blog">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Browse Supplements
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#E9DAC1] text-primary dark:text-primary hover:bg-[#F7ECDE] dark:hover:bg-[#E9DAC1]"
                >
                  Beginner Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {mainFeaturedPost && (
        <section className="py-16 px-4 -mt-8 relative z-20">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="text-3xl font-bold">Featured Guide</h2>
            </div>

            <Link href={getPostHref(mainFeaturedPost)}>
              <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-[#E9DAC1] dark:border-[#E9DAC1] bg-gradient-to-br from-white to-green-50/50 dark:from-gray-950 dark:to-green-950/20">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {mainFeaturedPost.featuredImageUrl && (
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <Image
                        src={mainFeaturedPost.featuredImageUrl}
                        alt={mainFeaturedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    {mainFeaturedPost.category && (
                      <Badge className="w-fit mb-4 bg-primary text-white">
                        {mainFeaturedPost.category.name}
                      </Badge>
                    )}

                    <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      {mainFeaturedPost.title}
                    </h3>

                    {mainFeaturedPost.excerpt && (
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {mainFeaturedPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {mainFeaturedPost.readTimeMinutes} min read
                      </div>
                      {mainFeaturedPost.publishedAt && (
                        <span>
                          {new Date(
                            mainFeaturedPost.publishedAt,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Explore by Goal
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Find supplement guides tailored to your health objectives
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category.name] || Leaf;
                return (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="group hover:shadow-lg hover:border-[#E9DAC1] dark:hover:border-[#E9DAC1] transition-all duration-300 h-full cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#E9DAC1]  flex items-center justify-center group-hover:bg-[#E9DAC1] dark:group-hover:bg-[#E9DAC1] transition-colors">
                          <Icon className="w-6 h-6 text-primary dark:text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.postCount}{" "}
                          {category.postCount === 1 ? "guide" : "guides"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quick Filters */}
      <section className="py-12 px-4 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4 text-center">
            Quick Topics
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Beginner",
              "Dosage",
              "Side Effects",
              "Best Supplements",
              "Men",
              "Women",
              "Athletes",
              "Safety",
            ].map((topic) => (
              <Link key={topic} href={`/blog?q=${topic.toLowerCase()}`}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-[#F7ECDE] dark:hover:bg-[#E9DAC1] hover:border-[#E9DAC1] dark:hover:border-[#E9DAC1] cursor-pointer transition-colors text-sm"
                >
                  {topic}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {postsToShow.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
                <p className="text-muted-foreground">
                  Fresh research and supplement guides
                </p>
              </div>
              <Link href="/blog">
                <Button variant="ghost" className="hidden md:flex">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <BlogList posts={postsToShow} />

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#E9DAC1] text-primary dark:text-primary"
                >
                  View All Articles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Editor's Picks */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#FBF8F1] to-[#F7ECDE] ">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-8">
            <CheckCircle2 className="w-6 h-6 text-primary dark:text-primary" />
            <h2 className="text-3xl font-bold">Top Picks This Month</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Best Supplements for Better Sleep",
                icon: Moon,
                category: "Sleep",
              },
              {
                title: "Creatine Guide: Benefits, Dosage & Side Effects",
                icon: Dumbbell,
                category: "Strength",
              },
              {
                title: "Magnesium: Which Type Should You Choose?",
                icon: Sparkles,
                category: "Minerals",
              },
              {
                title: "Omega-3: What to Look For (EPA/DHA)",
                icon: Heart,
                category: "Heart Health",
              },
            ].map((pick, index) => (
              <Link key={index} href="/blog">
                <Card className="group hover:shadow-lg hover:border-[#E9DAC1] dark:hover:border-[#E9DAC1] transition-all cursor-pointer">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#E9DAC1]  flex items-center justify-center shrink-0 group-hover:bg-[#E9DAC1] dark:group-hover:bg-[#E9DAC1] transition-colors">
                      <pick.icon className="w-6 h-6 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs">
                        {pick.category}
                      </Badge>
                      <h3 className="font-bold text-lg group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        {pick.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E9DAC1]  mb-6">
            <ShieldCheck className="w-8 h-8 text-primary dark:text-primary" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Our Promise</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            We publish evidence-based supplement guides written for real people.
            Articles are updated regularly and include safety tips, dosage
            guidance, and references.
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-lg">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-900 dark:text-amber-200 font-medium text-left">
              <strong>Disclaimer:</strong> This site does not provide medical
              advice. Always consult a healthcare professional.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#E9DAC1] to-[#F7ECDE] text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Supplement Guides That Actually Help
          </h2>
          <p className="text-lg mb-8 text-black">
            Weekly summaries, dosage guides, and new research updates — no spam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:bg-white/20"
            />
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-[#F7ECDE] font-bold whitespace-nowrap"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-gray-800 mt-4">
            Join 10,000+ readers • Unsubscribe anytime
          </p>
        </div>
      </section>

      {/* Empty State */}
      {postsToShow.length === 0 && !mainFeaturedPost && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Your Supplement Blog
            </h2>
            <p className="text-muted-foreground mb-6">
              Your blog is ready! Add your first post to get started.
            </p>
            <Link href="/admin/blog/new">
              <Button size="lg" className="bg-primary hover:bg-primary">
                Create Your First Article
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
