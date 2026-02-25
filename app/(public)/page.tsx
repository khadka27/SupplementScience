import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPostHref } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  Brain,
  Dumbbell,
  Moon,
  Shield,
  Leaf,
  Mail,
  Scale,
  FileText,
  AlertTriangle,
  Info,
  Beaker,
  Search,
  ListChecks,
  HeartPulse,
  Sparkles,
  TrendingUp,
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
    take: 8,
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
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(217,207,199,0.3),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_80%,rgba(217,207,199,0.05),transparent_50%)]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#D9CFC7] dark:border-[#3B3028] mb-8 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                Evidence-Based Resource
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-black dark:text-white leading-[1.1] tracking-tight drop-shadow-sm">
              Science-Backed Supplement Guides for{" "}
              <span className="text-primary relative whitespace-nowrap">
                <span className="relative z-10 text-primary">Real Results</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -rotate-1 z-0 rounded-full"></span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-zinc-300 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              We are a research-driven health information platform dedicated to
              helping you understand supplements, nutrition, and safety through{" "}
              <strong className="text-black dark:text-white">
                evidence, context, and transparency
              </strong>
              .
            </p>

            <div className="bg-amber-50/90 dark:bg-amber-950/30 backdrop-blur-md border border-amber-200/80 dark:border-amber-900/50 p-5 rounded-2xl max-w-3xl mx-auto mb-10 text-left flex gap-4 items-start shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 dark:bg-amber-600" />
              <Info className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-amber-900 dark:text-amber-200 leading-snug">
                <strong className="font-bold">Plain-language note:</strong> The
                information on this site is for educational purposes only and
                does not replace professional medical advice. Diet, exercise,
                sleep, and medical care are the cornerstones of well-being.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/category">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-lg h-14 px-8 rounded-full font-bold"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Explore Health Categories
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-[#D9CFC7] dark:border-[#634F36] bg-white dark:bg-[#211A13] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#3B3028] hover:-translate-y-0.5 transition-all text-lg h-14 px-8 rounded-full shadow-sm font-bold"
                >
                  Our Editorial Process
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 px-4 bg-white dark:bg-[#0F0E0A] relative border-t border-gray-100 dark:border-[#211A13]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Is This Resource For You?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              We value clarity over hype. To set clear expectations, here is a
              transparent look at who will benefit most from our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* For */}
            <Card className="bg-gradient-to-br from-[#F4FDF8] to-[#E9F9F0] dark:from-green-950/20 dark:to-green-900/10 border border-green-200 dark:border-green-900/50 shadow-xl shadow-green-900/5 dark:shadow-none rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-shadow h-full">
              <CardContent className="p-8 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center shadow-inner border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-950 dark:text-green-100 tracking-tight">
                    Who This Is For
                  </h3>
                </div>
                <ul className="space-y-6 flex-grow">
                  {[
                    "People researching supplements before considering a purchase",
                    "Readers skeptical of marketing claims and “miracle” language",
                    "Individuals managing health conditions who want evidence, not promises",
                    "Caregivers, journalists, and educators seeking reliable research summaries",
                    "Anyone who wants to understand ingredients, safety, and limitations",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-green-900/90 dark:text-green-200/90 leading-relaxed text-lg"
                    >
                      <div className="mt-1 bg-green-200/50 dark:bg-green-900/50 rounded-full p-1 border border-green-300 dark:border-green-800">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-green-200/50 dark:border-green-900/50">
                  <p className="font-bold text-green-950 dark:text-green-100 text-xl leading-snug">
                    If you prefer careful explanations grounded in research,
                    you're in the right place.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Not For */}
            <Card className="bg-gradient-to-br from-[#FFF5F5] to-[#FFEDED] dark:from-red-950/20 dark:to-red-900/10 border border-red-200 dark:border-red-900/50 shadow-xl shadow-red-900/5 dark:shadow-none rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-shadow h-full">
              <CardContent className="p-8 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center shadow-inner border border-red-200 dark:border-red-800">
                    <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-red-950 dark:text-red-100 tracking-tight">
                    Who This Is Not For
                  </h3>
                </div>
                <ul className="space-y-6 flex-grow">
                  {[
                    "Those seeking quick fixes, guaranteed outcomes, or cures",
                    "People looking for personalized medical advice or diagnoses",
                    "Anyone expecting product endorsements or promotional reviews",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-red-900/90 dark:text-red-200/90 leading-relaxed text-lg"
                    >
                      <div className="mt-1 bg-red-200/50 dark:bg-red-900/50 rounded-full p-1 border border-red-300 dark:border-red-800">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-red-200/50 dark:border-red-900/50">
                  <p className="font-bold text-red-950 dark:text-red-100 text-xl leading-snug">
                    We empower with knowledge, not persuade you to buy hype.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Evaluation */}
      <section className="py-28 px-4 bg-[#F9F8F6] dark:bg-[#0F0E0A] text-slate-900 dark:text-white relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 dark:bg-[#3B3028] rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30 bg-white/50 dark:bg-primary/10 mb-8 backdrop-blur-sm shadow-sm dark:shadow-none">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Editorial Independence
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight tracking-tight text-black dark:text-white">
                Our Mission & Editorial Approach
              </h2>
              <p className="text-xl text-slate-700 dark:text-zinc-300 mb-10 leading-relaxed font-medium">
                We build a trustworthy library of health content. Every piece is
                created by our Research Editorial Team and relies on credible
                sources such as peer-reviewed journals, the NIH, and the WHO.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] flex items-center justify-center shrink-0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 group-hover:border-primary/30 dark:group-hover:border-primary/50 transition-colors shadow-sm dark:shadow-inner">
                    <Scale className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-zinc-100">
                      Neutral, Research-Backed Language
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                      We analyze ingredients without hype. When research is
                      mixed, limited, or inconclusive, we state that clearly. We
                      do not overstate effectiveness.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] flex items-center justify-center shrink-0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 group-hover:border-primary/30 dark:group-hover:border-primary/50 transition-colors shadow-sm dark:shadow-inner">
                    <AlertTriangle className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-zinc-100">
                      Strict Safety Standards
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                      We highlight both potential benefits and known
                      limitations. We uphold strict safety standards and
                      transparently disclose risks and side effects.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] flex items-center justify-center shrink-0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 group-hover:border-primary/30 dark:group-hover:border-primary/50 transition-colors shadow-sm dark:shadow-inner">
                    <HeartPulse className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-zinc-100">
                      Lifestyle Comes First
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                      Supplements should only complement healthy habits, never
                      substitute. Diet, regular physical activity, and adequate
                      sleep have the greatest impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-[#211A13]/80 backdrop-blur-xl border border-[#D9CFC7] dark:border-[#634F36]/50 rounded-[2.5rem] p-8 md:p-12 shadow-xl dark:shadow-2xl relative">
              <h3 className="text-3xl font-bold mb-10 flex items-center gap-4 text-black dark:text-white">
                <ListChecks className="text-primary w-8 h-8" />
                How We Evaluate
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-[#D9CFC7] dark:before:via-zinc-700 before:to-transparent">
                {[
                  {
                    title: "What & Why",
                    desc: "Manufacturer info, intended audience, and why people seek it out.",
                  },
                  {
                    title: "Ingredient Analysis",
                    desc: "Examination of each active component and its research backing.",
                  },
                  {
                    title: "Research Summary",
                    desc: "Synthesis of clinical trials and systematic reviews.",
                  },
                  {
                    title: "Safety & Interactions",
                    desc: "Side effects, dosage warnings, and who should avoid it.",
                  },
                  {
                    title: "Final Assessment",
                    desc: "A neutral, educational case study synthesis—never a sales pitch.",
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="relative flex items-start gap-6 group hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-[#211A13] bg-slate-50 dark:bg-[#3B3028] text-slate-700 dark:text-zinc-300 font-bold z-10 shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all shadow-md dark:shadow-lg">
                      {i + 1}
                    </div>
                    <div className="bg-white/80 dark:bg-[#0F0E0A]/60 hover:bg-white dark:hover:bg-[#3B3028]/80 border border-[#D9CFC7]/60 dark:border-[#3B3028]/60 p-6 rounded-2xl transition-colors w-full shadow-sm">
                      <h4 className="font-bold text-xl mb-2 text-black dark:text-zinc-100">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started & Categories */}
      <section className="py-24 px-4 bg-[#F9F8F6] dark:bg-[#211A13] relative">
        <div className="absolute inset-0 bg-white/40 dark:bg-[#0F0E0A]/20" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white tracking-tight">
                New Here? Start With These Guides
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Essential context providing practical frameworks and safety
                principles to help navigate our platform without being
                overwhelmed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "How to Choose",
                  desc: "A practical, evidence-based decision framework",
                  icon: BookOpen,
                  href: "/category",
                },
                {
                  title: "Safety Measures",
                  desc: "General principles for risk awareness",
                  icon: Shield,
                  href: "/category",
                },
                {
                  title: "Ingredients Guide",
                  desc: "How common supplement ingredients are evaluated",
                  icon: Beaker,
                  href: "/category",
                },
                {
                  title: "Health Overviews",
                  desc: "Topic-specific foundational research knowledge",
                  icon: FileText,
                  href: "/category",
                },
              ].map((guide, i) => (
                <Link key={i} href={guide.href}>
                  <Card className="group h-full bg-white dark:bg-[#0F0E0A] border-[#D9CFC7]/80 dark:border-[#3B3028] hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] dark:from-[#211A13] dark:to-[#3B3028] border border-[#D9CFC7]/50 dark:border-[#634F36] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
                        <guide.icon className="w-7 h-7 text-primary drop-shadow-sm" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {guide.desc}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white tracking-tight">
                  Health Categories We Cover
                </h2>
                <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                  Each category includes an evidence-based overview, ingredient
                  explanations, and guidance for informed decision-making.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name] || Leaf;
                  return (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="group hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#0F0E0A] rounded-[2rem] border-[#D9CFC7]/60 dark:border-[#3B3028] h-full overflow-hidden">
                        <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-colors" />
                          <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 dark:bg-[#211A13] flex items-center justify-center group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors border border-gray-100 dark:border-[#3B3028] shadow-sm relative group-hover:scale-105">
                            <Icon className="w-10 h-10 text-primary drop-shadow-sm" />
                          </div>
                          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors text-black dark:text-zinc-100">
                            {category.name}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Latest Guides & Research */}
      <section className="py-24 px-4 bg-white dark:bg-[#0F0E0A]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white tracking-tight">
              Latest Research & Guides
            </h2>
            <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Deep dives into ingredients, health topics, and the latest
              evidence-led science.
            </p>
          </div>

          {mainFeaturedPost && (
            <Link
              href={getPostHref(mainFeaturedPost)}
              className="block mb-20 group text-black dark:text-white"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#D9CFC7] dark:border-[#3B3028] bg-white dark:bg-[#0F0E0A] group-hover:shadow-2xl transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {mainFeaturedPost.featuredImageUrl && (
                    <div className="relative h-72 md:h-full overflow-hidden bg-[#F9F8F6] dark:bg-[#211A13]">
                      <Image
                        src={mainFeaturedPost.featuredImageUrl}
                        alt={mainFeaturedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-[#F9F8F6] dark:from-[#0F0E0A] dark:to-[#211A13]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" /> Featured Case Study
                      </div>
                      {mainFeaturedPost.category && (
                        <div className="bg-primary/10 text-primary dark:text-primary dark:bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 dark:border-primary/30">
                          {mainFeaturedPost.category.name}
                        </div>
                      )}
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white group-hover:text-primary transition-colors leading-[1.1] tracking-tight">
                      {mainFeaturedPost.title}
                    </h3>

                    {mainFeaturedPost.excerpt && (
                      <p className="text-xl text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium line-clamp-3">
                        {mainFeaturedPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-zinc-400 font-medium">
                      <div className="flex items-center gap-2 bg-white dark:bg-[#211A13] px-3 py-1.5 rounded-full border border-gray-100 dark:border-[#3B3028] shadow-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        {mainFeaturedPost.readTimeMinutes} min read
                      </div>
                      {mainFeaturedPost.publishedAt && (
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {new Date(
                            mainFeaturedPost.publishedAt,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {postsToShow.length > 0 && (
            <>
              <BlogList posts={postsToShow} />
              <div className="text-center mt-16">
                <Link href="/category">
                  <Button
                    size="lg"
                    className="bg-white dark:bg-[#0F0E0A] text-primary border-2 border-[#D9CFC7] dark:border-[#3B3028] hover:bg-[#F9F8F6] dark:hover:bg-[#211A13] hover:border-primary/50 dark:hover:border-primary/50 text-lg h-14 px-10 rounded-full font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    View All Articles
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#F9F8F6] to-[#EFE9E3] dark:from-[#0F0E0A] dark:to-[#211A13]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 mb-6">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-widest">
                  Transparency
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-black dark:text-white tracking-tight leading-tight">
                Strong Trust Signals You Should Know
              </h2>
              <p className="text-xl text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed font-medium">
                We are committed to editorial independence. We do not sell
                supplements, and we do not accept sponsorships that influence
                content.
              </p>
              <ul className="space-y-6">
                {[
                  "Content produced by our built Research Editorial Team.",
                  "Review input from nutritionists, pharmacologists, and researchers.",
                  "Articles updated periodically (every 6-12 months) as evidence evolves.",
                  "Sources cited transparently, prioritizing peer-reviewed research.",
                  "Clear disclosure of limitations and mixed evidence.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-gray-800 dark:text-zinc-200 text-lg leading-relaxed bg-white/40 dark:bg-[#3B3028]/40 p-3 rounded-2xl border border-white/50 dark:border-[#634F36]/50 shadow-sm"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5 drop-shadow-sm" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#0F0E0A] p-10 md:p-12 rounded-[3rem] shadow-2xl border border-[#D9CFC7]/60 dark:border-[#3B3028] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-8 shadow-inner border border-primary/20">
                  <Mail className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 text-black dark:text-white tracking-tight">
                  Stay Informed, Not Sold
                </h3>
                <p className="text-lg text-gray-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-sm mx-auto">
                  Our goal is to empower you with knowledge, not persuade you to
                  buy hype. Join our newsletter to get evidence-based summaries.
                </p>
                <div className="space-y-4 w-full relative z-20">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="h-16 bg-gray-50/80 dark:bg-[#211A13] border-gray-200 dark:border-[#3B3028] rounded-2xl px-6 w-full focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-transparent text-lg shadow-inner placeholder:text-gray-400 dark:text-white"
                  />
                  <Button className="w-full h-16 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 hover:-translate-y-0.5 text-white dark:text-black font-bold rounded-2xl text-xl shadow-xl transition-all">
                    Subscribe for Updates
                  </Button>
                </div>
                <p className="text-sm text-center mt-6 text-gray-400 dark:text-zinc-500 font-medium tracking-wide">
                  You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {postsToShow.length === 0 && !mainFeaturedPost && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Your Supplement Blog
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Your blog is ready! Add your first post to get started.
            </p>
            <Link href="/admin/blog/new">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 rounded-full"
              >
                Create Your First Article
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
