import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Search,
  Users,
  RefreshCw,
  Shield,
  Award,
  Mail,
} from "lucide-react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.supplementdecoded.com";

export const metadata: Metadata = {
  title: "Editorial Policy | SupplementDecoded",
  description:
    "Learn about our editorial standards and content creation process. Discover how we ensure accuracy, integrity, and transparency in every article.",
  alternates: {
    canonical: `${baseUrl}/editorial-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#F9F8F6] via-[#EFE9E3] to-[#D9CFC7]  py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-[#D9CFC7]  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary dark:text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Editorial Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our editorial policy outlines the standards and principles that guide
            our content creation process.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Commitment Card */}
        <Card className="mb-12 border-2 bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] ">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#D9CFC7]  p-3 rounded-lg">
                <Award className="w-6 h-6 text-primary dark:text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Our Commitment to Quality
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to providing accurate, evidence-based, and
                  trustworthy health information. Our content is created with the
                  highest standards of integrity and transparency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Principles Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="font-bold mb-2">Evidence-Based</h3>
              <p className="text-xs text-muted-foreground">
                Backed by scientific research
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-[#D9CFC7]  w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary dark:text-primary" />
              </div>
              <h3 className="font-bold mb-2">Fact-Checked</h3>
              <p className="text-xs text-muted-foreground">
                Verified by experts
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="font-bold mb-2">Updated</h3>
              <p className="text-xs text-muted-foreground">
                Regularly reviewed
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8">
              <div className="bg-amber-100 dark:bg-amber-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
              <h3 className="font-bold mb-2">Transparent</h3>
              <p className="text-xs text-muted-foreground">
                Clear disclosures
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6">
                Content Creation Process
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Search className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <h3 className="text-lg font-bold mt-1">
                      Research and Fact-Checking
                    </h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground ml-12">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        All articles are thoroughly researched using
                        peer-reviewed scientific studies
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        We prioritize recent, high-quality research from
                        reputable sources
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Claims are supported by evidence and properly cited
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Information is fact-checked before publication
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-[#D9CFC7]  p-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mt-1">Editorial Review</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground ml-12">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Content undergoes multiple rounds of editorial review
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Medical and scientific information is reviewed by
                        qualified professionals
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Articles are checked for accuracy, clarity, and
                        readability
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Sources are verified for credibility and relevance
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Source Standards</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                We prioritize the following types of sources:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Peer-reviewed scientific journals and studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Government health agencies and regulatory bodies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Academic and medical institutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Professional medical organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Qualified healthcare professionals and researchers
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Content Updates</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Health and nutrition science evolves constantly. We are committed
                to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Regularly reviewing and updating existing content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Incorporating new research findings as they emerge
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Correcting errors promptly when identified</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Clearly marking last updated dates on all articles</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6">
                Transparency and Disclosures
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <h3 className="text-lg font-bold mt-1">
                      Author Credentials
                    </h3>
                  </div>
                  <p className="text-muted-foreground ml-12">
                    All authors and reviewers are identified with their relevant
                    credentials and expertise.
                  </p>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                    </div>
                    <h3 className="text-lg font-bold mt-1">
                      Conflicts of Interest
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-3 ml-12">
                    We disclose any potential conflicts of interest, including:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-12">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Affiliate relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Sponsored content (clearly labeled)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Financial relationships with supplement companies
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Any other relationships that could influence content
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#D9CFC7]  p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Editorial Independence
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our editorial team maintains complete independence in content
                creation. Commercial relationships do not influence our editorial
                decisions or the integrity of our content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">Advertising Standards</h2>
              <p className="text-muted-foreground mb-4">
                If we display advertising:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Ads are clearly distinguished from editorial content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Advertisers do not influence editorial content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    We do not endorse specific products unless clearly stated
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sponsored content is clearly labeled as such</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-red-700 dark:text-red-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Corrections Policy</h2>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                If we discover an error in our content:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>We correct it promptly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Significant corrections are noted in the article</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>We are transparent about changes made</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>The last updated date is revised</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Card */}
        <Card className="mt-12 border-2 bg-gradient-to-br from-[#F9F8F6] to-[#EFE9E3] ">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-[#D9CFC7]  p-4 rounded-full">
                <Mail className="w-8 h-8 text-primary dark:text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Contact Our Editorial Team
                </h3>
                <p className="text-muted-foreground">
                  If you have questions about our editorial policy, notice an
                  error, or have feedback about our content, please reach out.
                </p>
              </div>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Contact Us
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
