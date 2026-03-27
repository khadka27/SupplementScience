import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export const dynamic = "force-dynamic";
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

  const whoThisIsFor = [
    "People researching supplements before considering a purchase",
    "Readers skeptical of marketing claims and \u201cmiracle\u201d language",
    "Individuals managing health conditions who want evidence, not promises",
    "Caregivers, journalists, and educators seeking reliable research summaries",
    "Anyone who wants to understand ingredients, safety, and limitations",
  ];

  const whoThisIsNotFor = [
    "Those seeking quick fixes, guaranteed outcomes, or cures",
    "People looking for personalized medical advice or diagnoses",
    "Anyone expecting product endorsements or promotional reviews",
  ];

  const missionPoints = [
    "Explains why people take supplements and where they fit alongside healthy lifestyle practices",
    "Analyzes ingredients using neutral, research-backed language",
    "Highlights both potential benefits and known limitations",
    "Upholds strict safety standards and transparently discloses risks and side effects",
  ];

  const evaluationSteps = [
    {
      title: "What the Product Is",
      desc: "Manufacturer information, product form, intended audience, and category, without hype or claims.",
    },
    {
      title: "Why It Exists",
      desc: "Context around the general problem the product aims to address and why people seek supplements in that category.",
    },
    {
      title: "Ingredient Analysis",
      desc: "Examination of each ingredient, its typical use, what research suggests, and known limitations, with links to our Ingredients and Safety Measures guides.",
    },
    {
      title: "What Research Says",
      desc: "Summaries of clinical trials, systematic reviews, and meta-analyses where available, including mixed or inconclusive findings.",
    },
    {
      title: "Safety & Limitations",
      desc: "Potential side effects, interactions, dosage concerns, and who should be cautious or avoid use.",
    },
    {
      title: "Suitability",
      desc: "Conditional guidance on who might research a product further, never recommendations.",
    },
    {
      title: "Final Assessment",
      desc: "A neutral synthesis of what is known, what remains uncertain, and why professional guidance matters.",
    },
  ];

  const recommendedGuides = [
    {
      title: "How to Choose Supplements",
      desc: "A practical, evidence-based decision framework before you evaluate any product.",
      icon: BookOpen,
      href: "/guides",
    },
    {
      title: "Safety Measures",
      desc: "General principles for supplement safety, risk awareness, and red flags.",
      icon: Shield,
      href: "/safety-measures",
    },
    {
      title: "Ingredients Guide",
      desc: "How common supplement ingredients are evaluated and where limitations matter.",
      icon: Beaker,
      href: "/ingredients",
    },
    {
      title: "Health Category Overviews",
      desc: "Topic-specific foundations to help you read product analysis with context.",
      icon: FileText,
      href: "/category",
    },
  ];

  const healthTopics = [
    "Joint Pain",
    "Weight Loss",
    "Men\u2019s Health",
    "Women\u2019s Health",
    "Gut Health",
    "Mental Health",
    "Sleep Cycle",
    "Skin Care",
  ];

  const trustSignals = [
    "Content is produced by our Research Editorial Team.",
    "Review input may include professionals with backgrounds in nutrition science, pharmacology, public health, and clinical research.",
    "Articles are reviewed and updated periodically, typically every 6-12 months, as new evidence emerges.",
    "Sources are cited transparently, prioritizing peer-reviewed research and authoritative health organizations.",
    "When evidence is limited or conflicting, we clearly state those limitations.",
  ];

  const nextSteps = [
    {
      title: "Browse Ingredients",
      desc: "See how individual ingredients are evaluated before you read any product-specific analysis.",
      href: "/ingredients",
    },
    {
      title: "Explore a Health Category",
      desc: "Start with a health topic overview to build context before comparing products or claims.",
      href: "/category",
    },
    {
      title: "Learn How We Evaluate Supplements",
      desc: "Review the editorial framework, fact-checking standards, and independence principles behind our content.",
      href: "/editorial-policy",
    },
  ];

  const categoryIcons: Record<string, any> = {
    "Muscle & Strength": Dumbbell,
    "Sleep & Stress": Moon,
    Immunity: Shield,
    "Gut Health": Heart,
    "Brain Health": Brain,
    "Skin & Hair": Sparkles,
    "Weight Loss": TrendingUp,
    Vitamins: Leaf,
    "Joint Pain": HeartPulse,
    "Men's Health": Dumbbell,
    "Men\u2019s Health": Dumbbell,
    "Women's Health": Heart,
    "Women\u2019s Health": Heart,
    "Mental Health": Brain,
    "Sleep Cycle": Moon,
    "Skin Care": Sparkles,
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300"
      suppressHydrationWarning={true}
    >
      {/* Hero Section */}
      <section className="relative bg-[#F9F8F6] dark:bg-[#0D0C09] pt-[104px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#2A221A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_80%,rgba(217,207,199,0.25),transparent_50%)] dark:bg-[radial-gradient(circle_at_15%_80%,rgba(59,48,40,0.4),transparent_50%)]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-[#1D150E]/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#D9CFC7] dark:border-[#4A3A2A] mb-8 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                Evidence-Based Resource
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-black dark:text-white leading-[1.1] tracking-tight drop-shadow-sm">
              An Evidence-Based Resource for{" "}
              <span className="text-primary relative whitespace-nowrap">
                <span className="relative z-10 text-primary">
                  Understanding Supplements
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -rotate-1 z-0 rounded-full"></span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-zinc-300 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Welcome to our evidence-based health resource. We are a
              research-driven health information platform dedicated to helping
              readers understand supplements, nutrition, and safety through{" "}
              <strong className="text-black dark:text-white">
                evidence, context, and transparency
              </strong>
              , so you can make informed decisions about your health.
            </p>

            <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-4xl mx-auto leading-relaxed">
              Unlike many sites that lead with product recommendations, we start
              with science, safety, and sound lifestyle guidance. Diet,
              exercise, sleep, and medical care are the cornerstones of
              well-being. Supplements, where discussed, are considered optional,
              supportive tools, never primary or curative solutions.
            </p>

            <div className="bg-amber-50/90 dark:bg-[#1A1200]/80 backdrop-blur-md border border-amber-200/80 dark:border-amber-800/60 p-5 rounded-2xl max-w-3xl mx-auto mb-10 text-left flex gap-4 items-start shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 dark:bg-amber-500" />
              <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-amber-900 dark:text-amber-200 leading-snug">
                <strong className="font-bold">Plain-language note:</strong> The
                information on this site is for educational purposes only and
                does not replace professional medical advice.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row justify-center gap-4">
              <Link href="/ingredients">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-lg h-14 px-8 rounded-full font-bold"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Browse Ingredients
                </Button>
              </Link>
              <Link href="/category">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-[#D9CFC7] dark:border-[#634F36] bg-white dark:bg-[#211A13] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#3B3028] hover:-translate-y-0.5 transition-all text-lg h-14 px-8 rounded-full shadow-sm font-bold"
                >
                  Explore Health Categories
                </Button>
              </Link>
              <Link href="/editorial-policy">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-[#D9CFC7] dark:border-[#634F36] bg-transparent text-gray-900 dark:text-white hover:bg-white/70 dark:hover:bg-[#211A13] hover:-translate-y-0.5 transition-all text-lg h-14 px-8 rounded-full shadow-sm font-bold"
                >
                  Learn How We Evaluate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 px-4 bg-white dark:bg-[#0D0C09] relative border-t border-[#D9CFC7] dark:border-[#2A221A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Who This Resource Is For
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              This site is designed for readers who value clarity over hype and
              want careful explanations grounded in research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* For */}
            <Card className="bg-linear-to-br from-[#F0FDF7] to-[#DCFCE7] dark:from-[#071a0e] dark:to-[#0a2214] border border-green-200 dark:border-green-900/70 shadow-xl shadow-green-900/5 dark:shadow-green-950/30 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-shadow h-full">
              <CardContent className="p-8 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/60 flex items-center justify-center shadow-inner border border-green-200 dark:border-green-700/70">
                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-950 dark:text-green-100 tracking-tight">
                    Who This Is For
                  </h3>
                </div>
                <ul className="space-y-6 grow">
                  {whoThisIsFor.map((item, i) => (
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
                    you&rsquo;re in the right place.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Not For */}
            <Card className="bg-linear-to-br from-[#FFF5F5] to-[#FFE8E8] dark:from-[#1a0707] dark:to-[#220a0a] border border-red-200 dark:border-red-900/70 shadow-xl shadow-red-900/5 dark:shadow-red-950/30 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-shadow h-full">
              <CardContent className="p-8 md:p-12 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/60 flex items-center justify-center shadow-inner border border-red-200 dark:border-red-700/70">
                    <XCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-red-950 dark:text-red-100 tracking-tight">
                    Who This Is Not For
                  </h3>
                </div>
                <ul className="space-y-6 grow">
                  {whoThisIsNotFor.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-red-900/90 dark:text-red-200 leading-relaxed text-lg"
                    >
                      <div className="mt-1 bg-red-200/60 dark:bg-red-800/60 rounded-full p-1 border border-red-300 dark:border-red-700 shrink-0">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-300" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-red-200/60 dark:border-red-800/50">
                  <p className="font-bold text-red-950 dark:text-red-100 text-xl leading-snug">
                    This site is not intended for quick fixes, guarantees, or
                    promotional recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Evaluation */}
      <section className="py-28 px-4 bg-[#F4F2EF] dark:bg-[#110E09] text-slate-900 dark:text-white relative overflow-hidden border-t border-[#D9CFC7] dark:border-[#2A221A]">
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
                Our mission is to build a trustworthy library of health and
                supplement content that explains context clearly, analyzes
                ingredients neutrally, and helps readers understand both
                potential benefits and real limitations.
              </p>

              <div className="space-y-8">
                <div className="bg-white/70 dark:bg-[#18120C]/80 border border-[#D9CFC7] dark:border-[#3B2E22] rounded-[2rem] p-6 md:p-8 shadow-sm">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                    Our mission includes:
                  </h3>
                  <ul className="space-y-4">
                    {missionPoints.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-4 text-slate-700 dark:text-zinc-300 leading-relaxed text-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] flex items-center justify-center shrink-0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 group-hover:border-primary/30 dark:group-hover:border-primary/50 transition-colors shadow-sm dark:shadow-inner">
                    <Scale className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-zinc-100">
                      Neutral, Research-Backed Language
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                      Every piece is created by our Research Editorial Team and
                      reviewed through a defined editorial and fact-checking
                      process. We rely on peer-reviewed journals, authoritative
                      health organizations, and public research databases
                      including the NIH and WHO.
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
                      When research is mixed, limited, or inconclusive, we say
                      so directly. We do not overstate effectiveness or
                      certainty, and we disclose side effects, risks, and
                      important limitations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#211A13] border border-[#D9CFC7] dark:border-[#3B3028] flex items-center justify-center shrink-0 group-hover:bg-primary/5 dark:group-hover:bg-primary/10 group-hover:border-primary/30 dark:group-hover:border-primary/50 transition-colors shadow-sm dark:shadow-inner">
                    <HeartPulse className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-black dark:text-zinc-100">
                      The Foundation: Lifestyle Comes First
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                      Consistent evidence shows that balanced nutrition, regular
                      physical activity, adequate sleep, and professional
                      healthcare have the greatest impact on long-term health.
                      Supplements do not replace these fundamentals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#18120C]/90 backdrop-blur-xl border border-[#D9CFC7] dark:border-[#3B2E22] rounded-[2.5rem] p-8 md:p-12 shadow-xl dark:shadow-2xl relative">
              <h3 className="text-3xl font-bold mb-10 flex items-center gap-4 text-black dark:text-white">
                <ListChecks className="text-primary w-8 h-8" />
                How We Evaluate Supplements
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-primary/50 before:via-[#D9CFC7] dark:before:via-zinc-700 before:to-transparent">
                {evaluationSteps.map((step, i) => (
                  <div
                    key={i}
                    className="relative flex items-start gap-6 group hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-[#18120C] bg-white dark:bg-[#2C2218] text-slate-800 dark:text-zinc-100 font-bold z-10 shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all shadow-md dark:shadow-lg text-lg">
                      {i + 1}
                    </div>
                    <div className="bg-white/90 dark:bg-[#0D0C09]/80 hover:bg-white dark:hover:bg-[#2C2218]/90 border border-[#D9CFC7]/70 dark:border-[#3B2E22] p-6 rounded-2xl transition-colors w-full shadow-sm">
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
      <section className="py-24 px-4 bg-[#F0EDE8] dark:bg-[#0A0907] relative border-t border-[#D9CFC7] dark:border-[#2A221A]">
        <div className="absolute inset-0 bg-white/30 dark:bg-[#0D0C09]/40" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white tracking-tight">
                New Here? Start With These Guides
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                These pages provide essential context before reading any product
                analysis so you can navigate the site without overwhelm.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedGuides.map((guide, i) => (
                <Link key={i} href={guide.href}>
                  <Card className="group h-full bg-white dark:bg-[#17120D] border border-[#D9CFC7]/80 dark:border-[#3B2E22] hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-4xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-[#F4F2EF] dark:bg-[#251D14] border border-[#D9CFC7]/70 dark:border-[#4A3A2A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
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
                  Our research is organized into clear health topics including
                  Joint Pain, Weight Loss, Men&rsquo;s Health, Women&rsquo;s
                  Health, Gut Health, Mental Health, Sleep Cycle, and Skin Care.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {healthTopics.map((topic) => (
                  <div
                    key={topic}
                    className="px-5 py-3 rounded-full bg-white dark:bg-[#17120D] border border-[#D9CFC7]/80 dark:border-[#3B2E22] text-sm md:text-base font-semibold text-gray-800 dark:text-zinc-200 shadow-sm"
                  >
                    {topic}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name] || Leaf;
                  return (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Card className="group hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#17120D] rounded-4xl border border-[#D9CFC7]/70 dark:border-[#3B2E22] h-full overflow-hidden">
                        <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/0 group-hover:bg-primary transition-colors" />
                          <div className="w-20 h-20 mb-6 rounded-full bg-[#F4F2EF] dark:bg-[#251D14] flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/15 transition-colors border border-[#D9CFC7] dark:border-[#4A3A2A] shadow-sm relative group-hover:scale-105">
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
      <section className="py-24 px-4 bg-white dark:bg-[#0D0C09] border-t border-[#D9CFC7] dark:border-[#2A221A]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white tracking-tight">
              Latest Research & Guides
            </h2>
            <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Browse recent articles, ingredient explainers, and health topic
              research summaries grounded in evidence rather than promotion.
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
                    <div className="relative h-72 md:h-96 overflow-hidden bg-[#F9F8F6] dark:bg-[#211A13]">
                      <Image
                        src={mainFeaturedPost.featuredImageUrl}
                        alt={mainFeaturedPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-10 md:p-16 flex flex-col justify-center bg-linear-to-br from-white to-[#F9F8F6] dark:from-[#0F0E0A] dark:to-[#211A13]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" /> Research Spotlight
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
      <section className="py-24 px-4 bg-linear-to-b from-[#F9F8F6] to-[#EFE9E3] dark:from-[#0F0E0A] dark:to-[#211A13]">
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
                supplements, we do not accept sponsorships that influence
                content, and affiliate links, when present, never affect our
                evaluations.
              </p>
              <ul className="space-y-6">
                {trustSignals.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-gray-800 dark:text-zinc-200 text-lg leading-relaxed bg-white/60 dark:bg-[#1A1208]/80 p-3 rounded-2xl border border-white/70 dark:border-[#3B2E22]/80 shadow-sm"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5 drop-shadow-sm" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#17120D] p-10 md:p-12 rounded-[3rem] shadow-2xl border border-[#D9CFC7]/60 dark:border-[#3B2E22] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 text-center">
                <div className="mx-auto w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-8 shadow-inner border border-primary/20">
                  <ArrowRight className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 text-black dark:text-white tracking-tight">
                  Where to Go Next
                </h3>
                <p className="text-lg text-gray-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-sm mx-auto">
                  Our goal is to empower you with knowledge, not persuade you to
                  buy. Continue exploring the site through ingredients, category
                  overviews, and our editorial standards.
                </p>
                <div className="space-y-4 w-full relative z-20 text-left">
                  {nextSteps.map((step) => (
                    <Link
                      key={step.title}
                      href={step.href}
                      className="block rounded-[1.75rem] border border-[#D9CFC7]/80 dark:border-[#3B2E22] bg-[#F9F8F6] dark:bg-[#211A13] p-5 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-black dark:text-white mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm md:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-center mt-6 text-gray-500 dark:text-zinc-500 font-medium leading-relaxed">
                  Thank you for visiting. We invite you to explore, learn, and
                  approach health decisions with clarity and evidence.
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
