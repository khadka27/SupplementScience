import prisma from "@/lib/prisma";
import BlogList from "@/components/blog/BlogList";
import { Metadata } from "next";
import { Beaker, ShieldAlert, BookOpen, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export const metadata: Metadata = {
  title: "Supplement Ingredients | SupplementDecoded",
  description:
    "Browse our evidence-based library of supplement ingredients, including potential benefits, safety considerations, mechanisms of action, and research quality.",
};

export default async function IngredientsPage() {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: {
          post: {
            postType: "ingredient",
            status: "PUBLISHED",
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

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
          name: true,
          slug: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 50,
  });

  const formattedPosts = (posts || []).map((p: (typeof posts)[number]) => ({
    ...p,
    tags: p.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0E0A] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-[#F9F8F6] via-[#EFE9E3] to-[#F9F8F6] dark:from-[#0F0E0A] dark:via-[#211A13] dark:to-[#0F0E0A] pt-[140px] pb-20 px-4 overflow-hidden border-b border-[#D9CFC7] dark:border-[#211A13]">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-size-[20px_20px]" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="bg-white/80 dark:bg-[#211A13]/80 backdrop-blur-md w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#D9CFC7] dark:border-[#3B3028] shadow-sm shadow-[#D9CFC7]/50 dark:shadow-none">
            <Beaker className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-black dark:text-white">
            Supplement Ingredients
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Dietary supplements contain a wide variety of ingredients, ranging
            from vitamins and minerals to plant extracts, amino acids, and other
            bioactive compounds. Each ingredient may interact with the body in
            different ways, and the scientific evidence supporting their use can
            vary widely.
          </p>
          <p className="text-lg text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            The goal of this ingredient database is to provide clear,
            evidence-based information about individual supplement ingredients,
            including their potential benefits, safety considerations,
            mechanisms of action, and the strength of available research.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-white dark:bg-[#0F0E0A]">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 rounded-2xl p-8">
            <p className="text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
              Rather than promoting or discouraging the use of supplements,
              SupplementDecoded focuses on interpreting scientific evidence so
              readers can better understand how different ingredients are
              studied and evaluated.
            </p>
          </div>
        </div>
      </section>

      {/* How Ingredients Are Evaluated */}
      <section className="py-24 px-4 bg-[#F9F8F6] dark:bg-[#211A13] border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
            How Supplement Ingredients Are Evaluated
          </h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed">
            Each ingredient page on SupplementDecoded examines available
            research using a structured evaluation framework. This approach
            helps ensure that information is presented consistently and
            transparently across the site.
          </p>

          <div className="bg-white dark:bg-[#0F0E0A] rounded-2xl p-8 space-y-6 border border-[#D9CFC7] dark:border-[#3B3028]">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Evidence and Research
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Scientific studies are reviewed to determine what the research
                suggests about potential effects. Evidence may include
                randomized controlled trials, observational studies, systematic
                reviews, and mechanistic research.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Proposed Benefits
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Many supplement ingredients are studied for specific health
                outcomes such as sleep quality, stress response, metabolic
                health, or cognitive function. Evidence supporting these
                outcomes can vary in strength and consistency.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Biological Mechanisms
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Some ingredients influence physiological processes such as
                neurotransmitter activity, inflammatory pathways, hormone
                regulation, or cellular metabolism. Understanding these
                mechanisms can help explain how an ingredient may affect the
                body.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Safety and Risks
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Safety considerations are a key part of evaluating supplements.
                Ingredient pages review potential side effects, toxicity risks,
                contraindications, and interactions with medications or other
                supplements.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Dosage and Study Ranges
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Research studies often use different dosage ranges. Ingredient
                pages summarize the doses that have been studied in clinical
                trials, without recommending specific dosing protocols.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Evidence Limitations
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                Scientific research is rarely definitive. Ingredient analyses
                discuss uncertainties, conflicting results, and limitations
                within the available evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 bg-white dark:bg-[#0F0E0A] border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black dark:text-white">
            Categories of Supplement Ingredients
          </h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed">
            Supplement ingredients are commonly grouped based on their
            biological classification or chemical structure. The following
            categories represent some of the most widely used ingredient types
            in dietary supplements.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Vitamins
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Vitamins are essential micronutrients required for numerous
                physiological functions, including energy metabolism, immune
                system activity, and cellular maintenance. Because the body
                cannot synthesize most vitamins in sufficient amounts, they must
                be obtained through diet or supplementation.
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold mb-3">
                Examples include:
              </p>
              <ul className="text-gray-700 dark:text-zinc-300 space-y-1">
                <li>• Vitamin D</li>
                <li>• Vitamin B12</li>
                <li>• Vitamin C</li>
                <li>• Vitamin A</li>
              </ul>
            </div>

            <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Minerals
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Minerals are inorganic nutrients that support a variety of
                biological processes, including nerve signaling, muscle
                contraction, bone health, and enzymatic reactions.
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold mb-3">
                Common mineral supplements include:
              </p>
              <ul className="text-gray-700 dark:text-zinc-300 space-y-1">
                <li>• Magnesium</li>
                <li>• Zinc</li>
                <li>• Iron</li>
                <li>• Calcium</li>
              </ul>
            </div>

            <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Adaptogens and Botanical Extracts
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Many dietary supplements contain plant-derived compounds or
                herbal extracts. Some of these ingredients are studied for their
                potential effects on stress response, fatigue, and overall
                physiological resilience.
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold mb-3">
                Examples include:
              </p>
              <ul className="text-gray-700 dark:text-zinc-300 space-y-1">
                <li>• Ashwagandha</li>
                <li>• Rhodiola</li>
                <li>• Panax ginseng</li>
                <li>• Holy basil</li>
              </ul>
            </div>

            <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Amino Acids and Related Compounds
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Amino acids are the building blocks of proteins, but certain
                amino acids and related molecules are also used as supplements
                due to their potential neurological, metabolic, or physiological
                effects.
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold mb-3">
                Examples include:
              </p>
              <ul className="text-gray-700 dark:text-zinc-300 space-y-1">
                <li>• L-theanine</li>
                <li>• Taurine</li>
                <li>• L-tyrosine</li>
                <li>• Glycine</li>
              </ul>
            </div>

            <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028] md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Fatty Acids and Lipids
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Some supplements contain fatty acids or lipid compounds that
                play roles in cellular structure, inflammation regulation, and
                metabolic processes.
              </p>
              <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold mb-3">
                Examples include:
              </p>
              <ul className="text-gray-700 dark:text-zinc-300 space-y-1">
                <li>• Omega-3 fatty acids</li>
                <li>• DHA</li>
                <li>• EPA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Ingredient Pages */}
      <section className="py-24 px-4 bg-[#F9F8F6] dark:bg-[#211A13] border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
            How to Use Ingredient Pages
          </h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed">
            Each ingredient page on SupplementDecoded is designed to provide a
            structured overview of the available scientific evidence.
          </p>

          <div className="bg-white dark:bg-[#0F0E0A] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
            <p className="text-gray-700 dark:text-zinc-300 font-semibold mb-6">
              Typical sections include:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>Overview of the ingredient</strong>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>Biological mechanisms</strong>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>Potential health effects studied in research</strong>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>Safety considerations and side effects</strong>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>
                    Interactions with medications or other supplements
                  </strong>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  <strong>Research limitations and areas of uncertainty</strong>
                </span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-zinc-300 mt-8 leading-relaxed">
              These pages are intended to help readers understand how supplement
              ingredients are studied and interpreted in scientific literature,
              rather than providing medical advice or product recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Understanding Evidence */}
      <section className="py-24 px-4 bg-white dark:bg-[#0F0E0A] border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
            Understanding Evidence in Supplement Research
          </h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed">
            Research on dietary supplements varies widely in quality and
            consistency. Some ingredients have been studied extensively in
            randomized controlled trials, while others have limited or
            preliminary evidence.
          </p>

          <div className="bg-[#F9F8F6] dark:bg-[#211A13] rounded-2xl p-8 border border-[#D9CFC7] dark:border-[#3B3028]">
            <p className="text-gray-700 dark:text-zinc-300 font-semibold mb-6">
              Factors that can influence research outcomes include:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  Study design
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  Participant population
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  Dosage used in trials
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  Duration of the study
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">•</span>
                <span className="text-gray-700 dark:text-zinc-300">
                  Funding sources or conflicts of interest
                </span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
              Interpreting supplement research often requires evaluating the
              total body of evidence rather than relying on a single study.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Considerations */}
      <section className="py-24 px-4 bg-red-50 dark:bg-red-950/20 border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
            Safety Considerations
          </h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 mb-10 leading-relaxed">
            Although many supplement ingredients are widely available, they can
            still carry potential risks. Safety concerns may include:
          </p>

          <div className="bg-white dark:bg-[#0F0E0A] rounded-2xl p-8 border border-red-200 dark:border-red-900/50 space-y-4">
            <div className="flex gap-4">
              <span className="text-red-600 dark:text-red-400 font-bold">
                •
              </span>
              <span className="text-gray-700 dark:text-zinc-300">
                Side effects at higher doses
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-red-600 dark:text-red-400 font-bold">
                •
              </span>
              <span className="text-gray-700 dark:text-zinc-300">
                Interactions with medications
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-red-600 dark:text-red-400 font-bold">
                •
              </span>
              <span className="text-gray-700 dark:text-zinc-300">
                Contraindications for certain health conditions
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-red-600 dark:text-red-400 font-bold">
                •
              </span>
              <span className="text-gray-700 dark:text-zinc-300">
                Contamination or quality issues in manufacturing
              </span>
            </div>
          </div>

          <div className="mt-10 bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/50">
            <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
              Individuals considering supplements should be aware that
              scientific evidence continues to evolve, and safety profiles may
              change as more research becomes available.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Ingredients Section */}
      <section className="py-24 px-4 bg-white dark:bg-[#0F0E0A] border-t border-[#D9CFC7] dark:border-[#3B3028]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black dark:text-white text-center">
            Explore Individual Ingredient Profiles
          </h2>

          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-zinc-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-[#D9CFC7] dark:bg-[#3B3028]"></span>
                  All Ingredients
                </h3>
                <div className="flex flex-col gap-2 max-h-[800px] overflow-y-auto">
                  {tags.length === 0 ? (
                    <p className="text-sm text-gray-500 italic px-2 py-4">
                      No ingredients found.
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <a
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="px-4 py-3 rounded-lg hover:bg-[#EFE9E3] dark:hover:bg-[#211A13] transition-colors text-sm font-medium text-black dark:text-zinc-100 flex items-center justify-between border border-transparent hover:border-[#D9CFC7] dark:hover:border-[#3B3028]"
                      >
                        {tag.name}
                        {tag.postCount > 0 && (
                          <span className="text-[10px] text-gray-500 font-normal">
                            {tag.postCount}
                          </span>
                        )}
                      </a>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8 border-b border-[#D9CFC7] dark:border-[#3B3028] pb-6">
                <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                  Latest ingredient analyses
                </h3>
                <span className="text-sm text-gray-500 dark:text-zinc-400 italic">
                  Evidence-verified content
                </span>
              </div>
              <BlogList posts={formattedPosts as any} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
