import prisma from "@/lib/prisma";
import { Metadata } from "next";
import {
  Beaker,
  ShieldAlert,
  CheckCircle2,
  Microscope,
  Sparkles,
  Scale,
  Dna,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  Brain,
  Zap,
  Heart,
  Shield,
} from "lucide-react";
import { IngredientsDirectory } from "@/components/ingredients/IngredientsDirectory";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const baseUrl =
  (((process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/supplementdecoded\.com/i,
      "https://www.supplementdecoded.com"
    )) ||
    "https://www.supplementdecoded.com") as string);

export const metadata: Metadata = {
  title: "Clinical Supplement Ingredients Library | Evidence-Based Monographs",
  description:
    "Explore independent, peer-reviewed monographs of supplement ingredients. Analyzed for human clinical trial efficacy, standardized bioactive extracts, therapeutic dose ranges, and contraindications.",
  alternates: {
    canonical: `${baseUrl}/ingredients`,
  },
  openGraph: {
    title: "Clinical Supplement Ingredients Library | SupplementDecoded",
    description:
      "Explore independent, peer-reviewed monographs of supplement ingredients analyzed for human RCT efficacy, standardized forms, and safety.",
    url: `${baseUrl}/ingredients`,
    type: "website",
  },
};

export default async function IngredientsPage() {
  // Query all published ingredient posts from the database
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      postType: "ingredient",
    },
    include: {
      author: {
        select: {
          name: true,
          slug: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  // Serialize posts for client component
  const serializedIngredients = (posts || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cardImageUrl: post.cardImageUrl,
    featuredImageUrl: post.featuredImageUrl,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        }
      : null,
  }));

  // Schema for CollectionPage and Breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ingredients",
        item: `${baseUrl}/ingredients`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Clinical Supplement Ingredients Directory",
    description:
      "Evidence-based scientific dossiers and monographs for dietary supplement ingredients.",
    url: `${baseUrl}/ingredients`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: serializedIngredients.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/ingredients/${item.slug}`,
        name: item.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#070A0E] text-slate-900 dark:text-stone-100 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 overflow-hidden border-b border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0A0E13]">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 border border-emerald-200/80 dark:border-emerald-800 shadow-xs">
            <Beaker className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>CLINICAL INGREDIENT MONOGRAPHS • PEER-REVIEWED</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Supplement Ingredients & Evidence Library
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-stone-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Independent scientific dossiers breaking down dietary compounds.
            Every monograph evaluates human double-blind trials, standardized
            extract forms, therapeutic dosing thresholds, and safety profiles.
          </p>

          {/* Key Trust & Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 pb-2">
            <div className="bg-[#FAFAF8] dark:bg-[#070A0E] rounded-2xl p-4 border border-stone-200/90 dark:border-stone-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {serializedIngredients.length}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-stone-400 mt-1">
                Published Monographs
              </div>
            </div>

            <div className="bg-[#FAFAF8] dark:bg-[#070A0E] rounded-2xl p-4 border border-stone-200/90 dark:border-stone-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                1,200+
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-stone-400 mt-1">
                Human RCTs Synthesized
              </div>
            </div>

            <div className="bg-[#FAFAF8] dark:bg-[#070A0E] rounded-2xl p-4 border border-stone-200/90 dark:border-stone-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                100%
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-stone-400 mt-1">
                Unsponsored & Unbiased
              </div>
            </div>

            <div className="bg-[#FAFAF8] dark:bg-[#070A0E] rounded-2xl p-4 border border-stone-200/90 dark:border-stone-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Grade A-B
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-stone-400 mt-1">
                Evidence Thresholds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Directory Section (Prominent Top Section) */}
      <section className="py-12 sm:py-16 px-4 bg-[#FAFAF8] dark:bg-[#070A0E]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <Microscope className="w-4 h-4" />
                Live Database Explorer
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Search & Explore Clinical Monographs
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-stone-400 max-w-md">
              Filter by health goal, sort alphabetically, or search directly for
              specific bioactives, botanical names, and clinical mechanisms.
            </p>
          </div>

          {/* Interactive Client Component */}
          <IngredientsDirectory ingredients={serializedIngredients} />
        </div>
      </section>

      {/* Clinical Evaluation Framework (Modern Bento Grid) */}
      <section className="py-16 sm:py-24 px-4 bg-white dark:bg-[#0A0E13] border-t border-b border-stone-200/90 dark:border-stone-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 mb-4 border border-stone-200/80 dark:border-stone-700/80">
              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Rigorous Scientific Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              How Supplement Ingredients Are Evaluated
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 leading-relaxed">
              We apply an uncompromising pharmaceutical evaluation standard to
              all dietary supplements, dissecting what the published literature
              actually proves versus marketing extrapolations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Bento Card 1 */}
            <div className="bg-[#FAFAF8] dark:bg-[#0D1217] rounded-3xl p-7 sm:p-8 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                1. Human RCTs Over Animal & In Vitro Models
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-stone-300 leading-relaxed">
                Many supplement marketing claims rely on cell cultures (in vitro)
                or rodent trials that fail when tested in human physiology. We
                strictly weight double-blind, randomized, placebo-controlled
                human clinical trials (RCTs) and systematic Cochrane reviews.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-[#FAFAF8] dark:bg-[#0D1217] rounded-3xl p-7 sm:p-8 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-6">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                2. Standardized Bioactive Forms & Bioavailability
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-stone-300 leading-relaxed">
                Molecular form dictates therapeutic efficacy. We examine whether
                a brand uses chelated forms (e.g. Magnesium Bisglycinate vs
                insoluble Oxide), trademarked extracts (e.g. KSM-66® vs raw
                powder), or enhanced lipid delivery systems (e.g. Curcumin
                Phytosome).
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-[#FAFAF8] dark:bg-[#0D1217] rounded-3xl p-7 sm:p-8 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                3. Therapeutic Clinical Dose Windows
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-stone-300 leading-relaxed">
                Supplement manufacturers frequently engage in "fairy dusting" —
                including an ingredient at 10% of the active dose just to claim
                it on the label. We define the exact milligram threshold where
                statistically significant clinical effects occur.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-[#FAFAF8] dark:bg-[#0D1217] rounded-3xl p-7 sm:p-8 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                4. Pharmacokinetics & Drug Interaction Warnings
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-stone-300 leading-relaxed">
                Even natural botanicals can inhibit or induce hepatic Cytochrome
                P450 enzymes (e.g., CYP3A4, CYP2D6), causing dangerous
                interactions with prescription medications. We outline clear
                contraindications, upper safe limits, and tolerability data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bioactive Classifications Overview */}
      <section className="py-16 sm:py-20 px-4 bg-[#FAFAF8] dark:bg-[#070A0E]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Major Bioactive Ingredient Classifications
            </h2>
            <p className="text-slate-600 dark:text-stone-400 text-sm sm:text-base">
              Supplement ingredients interact with the human body across distinct
              cellular pathways, ranging from enzymatic cofactors to neurotransmitter
              receptor modulators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#0D1217] rounded-2xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Adaptogens & Botanicals
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed mb-3">
                Plant-derived polyphenols, withanolides, and alkaloids studied
                for hypothalamic-pituitary-adrenal (HPA) axis balance and cellular
                resilience.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                Ashwagandha, Rhodiola, Curcumin
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D1217] rounded-2xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Chelated Minerals
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed mb-3">
                Essential inorganic cofactors bound to organic amino acid ligands
                for optimized intestinal absorption and minimal gastrointestinal
                distress.
              </p>
              <div className="text-[11px] font-mono text-blue-700 dark:text-blue-400 font-semibold">
                Magnesium Bisglycinate, Zinc Picolinate
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D1217] rounded-2xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Amino Acids & Peptides
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed mb-3">
                Targeted amino molecules that modulate central nervous system
                receptors, cellular bioenergetics, and phosphocreatine resynthesis.
              </p>
              <div className="text-[11px] font-mono text-purple-700 dark:text-purple-400 font-semibold">
                L-Theanine, Creatine Monohydrate
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D1217] rounded-2xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Lipids & Co-factors
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed mb-3">
                Long-chain polyunsaturated fatty acids and mitochondrial quinones
                integral to membrane fluidity and cellular ATP generation.
              </p>
              <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-semibold">
                Omega-3 EPA/DHA, CoQ10 Ubiquinol
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Medical Disclaimer */}
      <section className="py-14 px-4 bg-white dark:bg-[#0A0E13] border-t border-stone-200/90 dark:border-stone-800">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2">
                Editorial Independence & Scientific Transparency
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 leading-relaxed mb-3">
                SupplementDecoded does not accept financial compensation, product
                sponsorships, or affiliate kickbacks from supplement brands in
                exchange for favorable monograph ratings. All conclusions reflect
                purely peer-reviewed published clinical evidence.
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
                <strong>Medical Notice:</strong> The information provided in our
                ingredient monographs is for educational and scientific research
                purposes only and does not constitute medical advice or treatment
                recommendations. Always consult a qualified healthcare professional
                before beginning any new supplement regimen, especially if taking
                prescription medication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
