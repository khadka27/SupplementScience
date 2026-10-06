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
import {
  ClinicalHeroSearch,
  DosageEvaluator,
  MultiFormComparisonMatrix,
} from "@/components/redesign";

import { Metadata } from "next";

const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.NEXT_PUBLIC_BASE_URL.replace(
    /^https?:\/\/supplementdecoded\.com/i,
    "https://www.supplementdecoded.com",
  )) ||
  "https://www.supplementdecoded.com") as string;

export const metadata: Metadata = {
  title: "SupplementDecoded | Independent Supplement Research & Scam Analysis",
  description:
    "We analyze supplements others just sell. No affiliate links, no sponsor influence — just transparent ingredient research, safety evaluations, and scam exposure based on public evidence.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "SupplementDecoded | Independent Supplement Research & Scam Analysis",
    description:
      "No affiliate links. No sponsored content. Transparent ingredient research, safety reviews, and scam exposure for anyone who refuses to be misled.",
    url: baseUrl,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 43200;

async function getFeaturedPosts(): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error("Database connection notice (getFeaturedPosts):", error);
    return [];
  }
}

async function getRecentPosts(): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error("Database connection notice (getRecentPosts):", error);
    return [];
  }
}

async function getCategories(): Promise<any[]> {
  try {
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
  } catch (error) {
    console.error("Database connection notice (getCategories):", error);
    return [];
  }
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
      className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-stone-100 transition-colors duration-300"
      suppressHydrationWarning={true}
    >
      {/* Redesigned Clinical Editorial Hero & Search Engine */}
      <ClinicalHeroSearch />

      {/* ══ Who This Is For ════════════════════════════════════════════ */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 bg-white dark:bg-[#07090B] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3 sm:mb-5">
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Audience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-5 text-[#0A0F14] dark:text-white tracking-tight">
              Who This Resource Is For
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2">
              This site is designed for readers who value clarity over hype and
              want careful explanations grounded in research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* For — Clinical Green Accent */}
            <div className="relative bg-white dark:bg-[#0D1217] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-1.5 w-full bg-emerald-600 dark:bg-emerald-500" />
              <div className="p-5 sm:p-8 md:p-10 flex flex-col h-full">
                <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                      Optimal Match
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                      Who This Is For
                    </h3>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 grow">
                  {whoThisIsFor.map((item, i) => (
                    <li key={i} className="flex gap-2.5 sm:gap-3 text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100/80 dark:bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    If you prefer careful explanations grounded in research, you&rsquo;re in the right place.
                  </p>
                </div>
              </div>
            </div>

            {/* Not For — Clear Boundary Accent */}
            <div className="relative bg-white dark:bg-[#0D1217] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-1.5 w-full bg-rose-600 dark:bg-rose-500" />
              <div className="p-5 sm:p-8 md:p-10 flex flex-col h-full">
                <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-700 dark:text-rose-400 shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-700 dark:text-rose-400 tracking-wider">
                      Not Recommended
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                      Who This Is Not For
                    </h3>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 grow">
                  {whoThisIsNotFor.map((item, i) => (
                    <li key={i} className="flex gap-2.5 sm:gap-3 text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-rose-100/80 dark:bg-rose-950 flex items-center justify-center shrink-0 text-rose-700 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                    This site is not intended for quick fixes, guarantees, or promotional recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Clinical Evaluation Tools Suite */}
      <DosageEvaluator />
      <MultiFormComparisonMatrix />

      {/* ══ Mission & Evaluation ════════════════════════════════════ */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 overflow-hidden bg-stone-50/80 dark:bg-[#080C0E] border-t border-b border-stone-200/80 dark:border-stone-800">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#0E3B2F 1px, transparent 1px), linear-gradient(90deg, #0E3B2F 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0E3B2F]/20 dark:border-emerald-800/40 bg-[#0E3B2F]/6 dark:bg-emerald-950/40 mb-4 sm:mb-8">
                <Shield className="w-3.5 h-3.5 text-[#0E3B2F] dark:text-emerald-400" />
                <span className="text-[11px] font-black text-[#0E3B2F] dark:text-emerald-300 uppercase tracking-widest">
                  Editorial Independence
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-8 leading-tight tracking-tight text-black dark:text-white">
                Our Mission &amp; Editorial Approach
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-slate-700 dark:text-zinc-300 mb-6 sm:mb-10 leading-relaxed font-normal sm:font-medium">
                Our mission is to build a trustworthy library of health and
                supplement content that explains context clearly, analyzes
                ingredients neutrally, and helps readers understand both
                potential benefits and real limitations.
              </p>

              <div className="space-y-5 sm:space-y-6">
                <div className="bg-white/80 dark:bg-[#0D1510]/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-[#0A1A13] dark:text-white mb-4 sm:mb-5 flex items-center gap-2.5">
                    <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#0E3B2F] to-emerald-500 inline-block" />
                    Our mission includes:
                  </h3>
                  <ul className="space-y-3 sm:space-y-3.5">
                    {missionPoints.map((item, index) => (
                      <li key={index} className="flex gap-2.5 sm:gap-3 text-slate-700 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                        <div className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-[#0E3B2F] dark:text-emerald-400" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {[
                  { icon: Scale, title: "Neutral, Research-Backed Language", body: "Every piece is created by our Research Editorial Team and reviewed through a defined editorial and fact-checking process. We rely on peer-reviewed journals, authoritative health organizations, and public research databases including the NIH and WHO." },
                  { icon: AlertTriangle, title: "Strict Safety Standards", body: "When research is mixed, limited, or inconclusive, we say so directly. We do not overstate effectiveness or certainty, and we disclose side effects, risks, and important limitations." },
                  { icon: HeartPulse, title: "The Foundation: Lifestyle Comes First", body: "Consistent evidence shows that balanced nutrition, regular physical activity, adequate sleep, and professional healthcare have the greatest impact on long-term health. Supplements do not replace these fundamentals." },
                ].map((feat, i) => (
                  <div key={i} className="flex gap-3.5 sm:gap-4 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-[#0D1510] border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shrink-0 group-hover:bg-[#0E3B2F] group-hover:border-transparent transition-all duration-300 shadow-2xs mt-0.5">
                      <feat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E3B2F] dark:text-emerald-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold mb-1 text-[#0A1A13] dark:text-zinc-100">{feat.title}</h4>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-xs sm:text-sm">{feat.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="bg-white dark:bg-[#0D1217] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-8 md:p-10 shadow-lg shadow-stone-900/5 relative overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-7 flex items-center gap-2.5 sm:gap-3 text-[#0A1A13] dark:text-white relative z-10">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#0E3B2F] to-emerald-600 flex items-center justify-center shadow-md">
                    <ListChecks className="text-white w-4 h-4" />
                  </div>
                  How We Evaluate Supplements
                </h3>
                <div className="space-y-3 sm:space-y-3.5 relative">
                  <div className="absolute left-[15px] sm:left-[17px] top-4 bottom-4 w-px bg-gradient-to-b from-[#0E3B2F]/30 via-emerald-300/20 dark:via-emerald-700/20 to-transparent" />
                  {evaluationSteps.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-3 sm:gap-4 group">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-[#0A1410] bg-slate-100 dark:bg-[#172218] text-slate-700 dark:text-emerald-300 font-black z-10 shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#0E3B2F] group-hover:to-emerald-600 group-hover:text-white group-hover:border-[#0E3B2F]/20 transition-all duration-300 shadow-2xs text-xs">
                        {i + 1}
                      </div>
                      <div className="bg-slate-50/80 dark:bg-[#0F1A12]/60 hover:bg-white dark:hover:bg-[#172218]/80 border border-slate-100 dark:border-emerald-900/25 hover:border-emerald-200 dark:hover:border-emerald-800/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all w-full group-hover:shadow-2xs">
                        <h4 className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 text-[#0A1A13] dark:text-zinc-100">{step.title}</h4>
                        <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Guides & Categories ═════════════════════════════════════ */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 bg-[#F8FAFB] dark:bg-[#06080A] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-slate-700/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,59,47,0.04)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(14,59,47,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="mb-12 sm:mb-20 md:mb-24">
            <div className="text-center mb-8 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 mb-3 sm:mb-5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-300">Start Here</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-5 text-[#0A0F14] dark:text-white tracking-tight">
                New Here? Start With These Guides
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed px-2">
                These pages provide essential context before reading any product
                analysis so you can navigate the site without overwhelm.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {recommendedGuides.map((guide, i) => (
                <Link key={i} href={guide.href} className="group">
                  <div className="h-full bg-white dark:bg-[#0C1117] border border-slate-200 dark:border-slate-800 hover:border-[#0E3B2F]/60 dark:hover:border-emerald-700/60 hover:shadow-xl hover:shadow-emerald-900/8 dark:hover:shadow-emerald-950/25 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-7 flex flex-col relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0E3B2F] to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-gradient-to-br group-hover:from-[#0E3B2F] group-hover:to-emerald-600 group-hover:border-transparent transition-all duration-300 shadow-2xs">
                      <guide.icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-[#0A0F14] dark:text-zinc-100 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed flex-1">
                      {guide.desc}
                    </p>
                    <div className="flex items-center gap-1 mt-4 sm:mt-5 text-xs font-bold text-[#0E3B2F] dark:text-emerald-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:-translate-x-1 sm:group-hover:translate-x-0">
                      Read guide <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <div className="text-center mb-8 sm:mb-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/50 mb-3 sm:mb-5">
                  <Leaf className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-300">Research Areas</span>
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-5 text-[#0A0F14] dark:text-white tracking-tight">
                  Health Categories We Cover
                </h2>
                <p className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed px-2">
                  Our research is organized into clear health topics including
                  Joint Pain, Weight Loss, Men&rsquo;s Health, Women&rsquo;s
                  Health, Gut Health, Mental Health, Sleep Cycle, and Skin Care.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-12 px-1">
                {healthTopics.map((topic) => (
                  <div
                    key={topic}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white dark:bg-[#0C1117] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 shadow-2xs hover:border-[#0E3B2F]/50 dark:hover:border-emerald-700/50 hover:text-[#0E3B2F] dark:hover:text-emerald-400 transition-all cursor-default whitespace-nowrap"
                  >
                    {topic}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.name] || Leaf;
                  return (
                    <Link key={category.id} href={`/category/${category.slug}`} className="group">
                      <div className="relative h-full bg-white dark:bg-[#0C1117] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#0E3B2F]/50 dark:hover:border-emerald-700/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0E3B2F] to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#0E3B2F] group-hover:to-emerald-600 transition-all duration-300 border border-slate-200 dark:border-slate-700 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-emerald-900/20">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="relative z-10 font-bold text-xs sm:text-sm mb-0.5 text-[#0A0F14] dark:text-zinc-100 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Latest Guides & Research */}
      <section className="py-12 sm:py-20 md:py-24 px-4 bg-white dark:bg-[#070A0D] border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-6 text-slate-900 dark:text-white tracking-tight">
              Latest Research & Guides
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed px-2">
              Browse recent articles, ingredient explainers, and health topic
              research summaries grounded in evidence rather than promotion.
            </p>
          </div>

          {mainFeaturedPost && (
            <Link
              href={getPostHref(mainFeaturedPost)}
              className="block mb-10 sm:mb-16 group text-slate-900 dark:text-white"
            >
              <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1117] group-hover:shadow-2xl group-hover:shadow-slate-900/12 dark:group-hover:shadow-black/40 group-hover:border-[#0E3B2F]/30 dark:group-hover:border-emerald-800/50 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {(mainFeaturedPost.cardImageUrl ||
                    mainFeaturedPost.featuredImageUrl) && (
                    <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={
                          mainFeaturedPost.cardImageUrl ||
                          mainFeaturedPost.featuredImageUrl ||
                          ""
                        }
                        alt={
                          mainFeaturedPost.featuredImageAlt ||
                          mainFeaturedPost.title
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        unoptimized={
                          (
                            mainFeaturedPost.cardImageUrl ||
                            mainFeaturedPost.featuredImageUrl ||
                            ""
                          ).startsWith("http") ||
                          (
                            mainFeaturedPost.cardImageUrl ||
                            mainFeaturedPost.featuredImageUrl ||
                            ""
                          ).startsWith("/images/")
                        }
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 sm:p-8 md:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50/80 dark:from-[#0C1117] dark:to-[#0F1720]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50 shadow-2xs whitespace-nowrap shrink-0">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" /> Research Spotlight
                      </div>
                      {mainFeaturedPost.category && (
                        <div className="bg-[#0E3B2F]/10 text-[#0E3B2F] dark:text-emerald-300 dark:bg-emerald-950/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#0E3B2F]/20 dark:border-emerald-800/50 whitespace-nowrap shrink-0">
                          {mainFeaturedPost.category.name}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 sm:mb-5 text-[#0A0F14] dark:text-white group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors leading-snug sm:leading-[1.15] tracking-tight">
                      {mainFeaturedPost.title}
                    </h3>

                    {mainFeaturedPost.excerpt && (
                      <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-zinc-400 mb-5 sm:mb-8 leading-relaxed font-normal sm:font-medium line-clamp-3">
                        {mainFeaturedPost.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-[#0E3B2F] dark:text-emerald-400 shrink-0" />
                        {mainFeaturedPost.readTimeMinutes} min read
                      </div>
                      {mainFeaturedPost.publishedAt && (
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
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
              <div className="text-center mt-14">
                <Link href="/category">
                  <Button
                    size="lg"
                    className="bg-[#0E3B2F] hover:bg-[#134E4A] text-white border-0 text-base h-12 px-10 rounded-2xl font-bold shadow-lg hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all"
                  >
                    View All Articles
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══ Trust & Transparency ════════════════════════════════════ */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 overflow-hidden bg-stone-50/70 dark:bg-[#080B0E] border-t border-stone-200/80 dark:border-stone-800">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 mb-4 sm:mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E3B2F] dark:text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-[#0E3B2F] dark:text-emerald-300 uppercase tracking-widest">
                  Transparency Protocol
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 sm:mb-6 text-stone-900 dark:text-white tracking-tight leading-[1.15]">
                Strong Trust Signals{" "}
                <span className="italic font-normal text-[#0E3B2F] dark:text-emerald-400">
                  You Should Know
                </span>
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mb-6 sm:mb-8 leading-relaxed">
                We are committed to complete editorial independence. We accept
                zero affiliate partnerships, publish no sponsored content, and
                receive no compensation from supplement manufacturers or
                retailers. Our evaluations are free from any commercial
                influence.
              </p>
              <ul className="space-y-2.5 sm:space-y-3">
                {trustSignals.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 sm:gap-3 text-stone-700 dark:text-stone-300 bg-white dark:bg-[#0D1217] p-3.5 sm:p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#0D1217] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-8 md:p-10 shadow-lg shadow-stone-900/5 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-[#0E3B2F] dark:bg-emerald-600 flex items-center justify-center rounded-xl mb-4 sm:mb-6 shadow-md shadow-[#0E3B2F]/20 text-white">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 text-[#0A1A13] dark:text-white tracking-tight">
                  Where to Go Next
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-zinc-400 mb-6 sm:mb-8 leading-relaxed max-w-sm mx-auto">
                  Our goal is to empower you with knowledge, not persuade you to
                  buy. Continue exploring the site through ingredients, category
                  overviews, and our editorial standards.
                </p>
                <div className="space-y-2.5 sm:space-y-3 w-full text-left">
                  {nextSteps.map((step) => (
                    <Link
                      key={step.title}
                      href={step.href}
                      className="flex items-start justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#111A14]/60 hover:border-[#0E3B2F]/50 dark:hover:border-emerald-700/60 hover:bg-white dark:hover:bg-[#172818]/70 hover:-translate-y-0.5 hover:shadow-md transition-all group"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0A1A13] dark:text-zinc-100 mb-0.5 group-hover:text-[#0E3B2F] dark:group-hover:text-emerald-400 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0E3B2F] dark:text-emerald-400 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs text-center mt-5 sm:mt-7 text-slate-400 dark:text-zinc-500 leading-relaxed">
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
